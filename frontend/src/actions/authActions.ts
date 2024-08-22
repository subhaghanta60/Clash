"use server"

import { REGISTER_URL } from "@/lib/apiEndpoint"
import axios, { AxiosError } from "axios"

export async function registerAction(prevState:any,formData:FormData) {
    console.log(formData)
    
    try {
       const {data} = await axios.post(REGISTER_URL, {
        name:formData.get("name"),
        email:formData.get("email"),
        password:formData.get("password"),
        confirm_password:formData.get("confirm_password"),
       })
        return {
            status:200,
            message:data?.message ??  "Account Created Sucessfully ! Please Check Your Email And verify Your email"
        }
        
    } catch (error) {
        if(error instanceof AxiosError){
            if(error.response?.status === 422){
                return {
                    status:422,
                    message:error.response?.data?.message,
                    errors:error.response?.data?.errors
                }
            }
        }
        return {
            status:500,
            message:"Something Went Wrong.Please Try Again",
            errors:{},
        }
    }

}