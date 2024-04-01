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
    getRecentPosts, 
    signInAccount,
    signOutAccount
} from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";

// ============================================================
// AUTH QUERIES
// ============================================================

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
  
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

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

export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}


export const useUpdatePost = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}