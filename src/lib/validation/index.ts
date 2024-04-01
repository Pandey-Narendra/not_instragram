import * as z from "zod";

// Validation for sign up
export const SignupValidation = z.object({
    name: z.string().min(2, {message : 'name must be of alteast 2 characters.'}),
	username: z.string().min(2, {message : 'username must be of alteast 2 characters.'}),
    email: z.string().email(),
    password: z.string().min(8, {message : 'password must be of alteast 8 characters.'}),
})

// Validation for sign in
export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, {message : 'password must be of alteast 8 characters.'}),
})

// Validation for Posts
export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom<File[]>(),
    location:z.string().min(2).max(100),
    tags: z.string(),
})