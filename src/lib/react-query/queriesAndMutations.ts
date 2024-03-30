import { INewUser } from "@/types";

import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery,
} from "@tanstack/react-query";

import { 
    createUserAccount, 
    signInAccount
} from "../appwrite/api";

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
  
// export const useSignOutAccount = () => {
//     return useMutation({
//         mutationFn: signOutAccount,
//     });
// };