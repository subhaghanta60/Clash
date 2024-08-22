import {z} from "zod"



export const registerSchema =z.object({
    name:z
    .string({
        message:"Name is Required."
    })
    .min(
        3,
        {message:"Name must be 3 characters long."}
    ),
    email:z
    .string({
        message:"Email Is Required."
    })
    .email({
        message:"Please  type Correct Email."
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