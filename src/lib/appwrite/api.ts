import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, storage, databases } from "./config";


// ============================== SIGN UP ==============================
export async function createUserAccount(user: INewUser){
    // console.log('createUserAccount api.ts', user)
    try{

        // account:- apprite - account
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        
        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(user.name);
        // console.log('createUserAccount api.ts avatarUrl newAccount', newAccount,avatarUrl)

        // save user details to database
        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        });

        // console.log('createUserAccount saveUserToDB ', newUser)
    
        return newUser;
    }catch(error){
        console.log(error);
        return;
    }
}


// ============================== SAVE USER TO DB ==============================
export async function saveUserToDB(user:{
    accountId: string;
    email: string;
    name:string;
    imageUrl: URL;
    username?: string;
}) {
    // console.log('function saveUserToDB', user);
    try{
        // database and user details
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        );

        // console.log('createDocument', newUser);
        return newUser;
    }catch(error){
        console.log('createDocument',error);
    }
}


// ============================== SIGN IN ============================== 
export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        // console.log('createEmailPasswordSession', session);
        return session;
    } 
    catch (error) {
        console.log('signInAccount',error);
    }
}


// ============================== GET ACCOUNT ==============================
export async function getAccount() {
    try {
        const currentAccount = await account.get();
        // console.log('account.get', currentAccount);
        return currentAccount;
    } 
    catch (error) {
        console.log(error);
    }
}


// ============================== GET USER ==============================
export async function getCurrentUser() {
    // console.log('function getCurrentUser() ')
    try {
        const currentAccount = await getAccount();
        // console.log('getAccount', currentAccount);

        if (!currentAccount) throw Error;
  

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );
        // console.log('listDocuments',currentUser.documents[0]);

        if (!currentUser) throw Error;

        console.log('error no current user')

        return currentUser.documents[0];

    } 
    catch (error) {
        // console.log('listDocuments error', error);
        return null;
    }
}

export async function signOutAccount() {
    try{
        const session = await account.deleteSession('current');
        return session;
    }catch(error){
        console.log(error)
    }
}


// ============================== CREATE POST
export async function createPost(post:INewPost){
    // Upload Image to media inside storage section 
    try{
        const uploadedFile = await uploadFile(post.file[0]);
        
        if(!uploadedFile) throw Error;

        // Get Url of the Media File
        const fileUrl = getFilePreview(uploadedFile.$id);
        if(!fileUrl){
            await deleteFile(uploadedFile.$id);
            throw Error;
        }

        // Convert tags in an array
        const tags = post.tags?.replace(/ /g,'').split(',') || [];

        // Save Post to database
        // Create post to database
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            });
    
        if (!newPost) {
            await deleteFile(uploadedFile.$id);
            throw Error;
        }
    
        return newPost;


    }catch(error){
        console.log(error)
    }
} 


export function getFilePreview(filedId: string){
    try{
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            filedId,
            2000,
            2000,
            "top",
            100,
        );
        
        return fileUrl;

    }catch(error){
        console.log(error)
    }
}

export async function deleteFile(fileId: string){
    try{
        await storage.deleteFile(appwriteConfig.storageId,fileId);
        return {status: 'ok'}
    }catch(error){
        console.log(error);
    }
}

// ============================== UPLOAD FILE
export async function uploadFile(file:File) {
    try{
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        );

        return uploadedFile;
    }catch(error){
        console.log(error);
    }
}

export async function getRecentPosts() {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    );

    if(!posts) throw Error;

    return posts;
}