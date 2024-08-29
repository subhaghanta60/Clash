import {z} from "zod"



export const clashSchema =z.object({
    title:z
    .string({
        message:"Title is Required."
    })
    .min(
        3,
        {message:"Title must be 3 characters long."}
    ),
    description:z
    .string({
        message:"Description is Required."
    })
    .min(
        20,
        {message:"Name must be 20 characters long."}
    )
    .max(
        1000,
        {message:"Description must be less than  1000 characters long."}
    ),
    expire_at:z
    .string({
        message:"Expire At  is Required."
    })
    .min(
        5,
        {message:"Please Pass Correct Date"}
    ),
    image:z
    .string({
        message:"Image is Required."
    }).optional()
})

