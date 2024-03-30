import * as z from "zod";

export const SignupValidation = z.object({
    name: z.string().min(2, {message : 'name must be of alteast 2 characters.'}),
	username: z.string().min(2, {message : 'username must be of alteast 2 characters.'}),
    email: z.string().email(),
    password: z.string().min(8, {message : 'password must be of alteast 8 characters.'}),
})