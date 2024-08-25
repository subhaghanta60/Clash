import {z} from "zod"


export const forgerPasswordSchema = z.object({

    email:z
    .string({
        message:"Email Is Required."
    })
    .email({
        message:"Please  type Correct Email."
    }),
})

export const resetPasswordSchema =z.object({
    email:z
    .string({
        message:"Email Is Required."
    })
    .email({
        message:"Please  type Correct Email."
    }),
    token:z
    .string({
        message:"Token  Is Missing."
    }),
    
    password:z
    .string({
        message:"Password is Required."
    })
    .min(
        6,
        {message:"password must be 6 characters long."}
    ),
    confirm_password:z
    .string({
        message:"Confirm Password is Required."
    })
    .min(
        6,
        {message:"Confirm Password must be 6 characters long."}
    )
}).refine((data) => data.password == data.confirm_password , 
{
    message:"Confirm Password Not matched.", path:["confirm_password"]
})