import * as z from "zod"

export const loginSchema = (z.object({

    email: z.string().email('enter valid email address'),
    password: z.string().min(8, "enter password more than 8 digits.")


}))


export const signupSchema = (z.object(
    {
        username: z.string().min(3, 'enter your username'),
        email: z.string().email('enter valid email address'),
        password: z.string().min(8, 'enter password more than 8 characters'),

    }
)
)