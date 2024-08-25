"use server"

import { CHECK_CREDENTIALS_URL, LOGIN_URL, REGISTER_URL ,FORGET_PASSWORD_URL, RESEND_PASSWORD_URL} from "@/lib/apiEndpoint"
import axios, { AxiosError } from "axios"


export async function registerAction(prevState:any,formData:FormData) {
   
    
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


export async function loginAction(prevState:any,formData:FormData) {
   
    
    try {
      await axios.post(CHECK_CREDENTIALS_URL, {
        email:formData.get("email"),
        password:formData.get("password"),
       })
      
        return {
            status:200,
            message: "LoggedIn Successfully",
            errors: {},
            data: {
                email: formData.get("email"),
                password: formData.get("password"),
            },
        }
        
    } catch (error) {
        if(error instanceof AxiosError){
            if(error.response?.status === 422){
                return {
                    status:422,
                    message:error.response?.data?.message,
                    errors:error.response?.data?.errors,
                    
                }
            }
        }
        return {
            status:500,
            message:"Something Went Wrong.Please Try Again",
            errors:{},
            data:{}
        }
    }

}

export async function forgetPasswordAction(prevState:any,formData:FormData) {
   
    
    try {
        console.log(FORGET_PASSWORD_URL);

      const {data} = await axios.post(FORGET_PASSWORD_URL, {
        email:formData.get("email"),
       })
      
        return {
            status:200,
            message: data?.message ?? "We have emailed You the passowrd Reset Link",
            errors: {},
            
        }
        
    } catch (error) {
        if(error instanceof AxiosError){
            if(error.response?.status === 422){
                return {
                    status:422,
                    message:error.response?.data?.message,
                    errors:error.response?.data?.errors,
                    
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


export async function resetAction(prevState:any,formData:FormData) {
   
    
    try {
       const {data} = await axios.post(RESEND_PASSWORD_URL, {
        
        email:formData.get("email"),
        password:formData.get("password"),
        confirm_password:formData.get("confirm_password"),
        token:formData.get("token")
       })
        return {
            status:200,
            message:data?.message ??  "Password Rest Sucessfully Please Login"
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


