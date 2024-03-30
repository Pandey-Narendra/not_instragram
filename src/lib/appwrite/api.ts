import { ID, Query } from "appwrite";
import { INewUser } from "@/types";
import { account, appwriteConfig, avatars, databases } from "./config";


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
            accountid: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageURL: avatarUrl,
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
    accountid: string;
    email: string;
    name:string;
    imageURL: URL;
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
            [Query.equal("accountid", currentAccount.$id)]
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
