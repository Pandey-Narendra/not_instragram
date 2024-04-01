import { INewPost, INewUser } from "@/types";

import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { 
    createPost,
    createUserAccount, 
    deleteSavedPost, 
    getCurrentUser, 
    getPostById, 
    getRecentPosts, 
    likePost, 
    savePost, 
    signInAccount,
    signOutAccount
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

// ============================================================
// AUTH QUERIES
// ============================================================

// ============================== Create User Account ==============================
export const useCreateUserAccount = () => {
    // console.log('useCreateUserAccount queries and mutation')
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    });
    // console.log('useCreateUserAccount queries and mutation', mutate)
    // return mutate;
};


export const useSignInAccount = () => {
    // console.log('useSignInAccount queries and mutation')
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
        signInAccount(user),
    });
};
  
// ============================== Sign Out==============================
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

// ============================== Create Post ==============================
export const useCreatePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

// ============================== Get Recent Posts ==============================
export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

// ============================== Update Post ==============================
export const useUpdatePost = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

// ============================== Like Post ==============================
export const useLikePost = () => {

    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: ({
            postId,
            likesArray,
        }: {
            postId: string;
            likesArray: string[];
        }) => likePost(postId, likesArray),

        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};


// ============================== Save Post ==============================
export const useSavePost = () => {

    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, postId }: { userId: string; postId: string }) => savePost(userId, postId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};

// ============================== Delete Saved Post ==============================
export const useDeleteSavedPost = () => {

    const queryClient = useQueryClient();
    return useMutation({

        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER],
            });
        },
    });
};
  

// ============================== Get Current User ==============================
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}  

// ============================== Get Post By Id ==============================
export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    });
}
