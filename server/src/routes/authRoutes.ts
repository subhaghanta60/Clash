import {Router,Request,Response} from 'express'
import { loginSchema, registerSchema } from '../validation/authValidation.js';
import { ZodError } from 'zod';
import { checkDateHourDiff, formateError, renderEmailEjs } from '../helper.js';
import prisma from '../config/database.js';
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import { emailQueue, emailQueueName } from '../jobs/Email.Job.js';
import jwt from "jsonwebtoken"
import authmiddleware from '../middleware/AuthMiddleware.js';
import { authLimiter } from '../config/rateLimit.js';
import { forgerPasswordSchema, resetPasswordSchema } from '../validation/passwordValidation.js';

const router = Router();

//Login Routes
router.post("/login",authLimiter, async (req:Request, res:Response) => {
    const body  = req.body;
    try {
        const payload =loginSchema.parse(body)

        let user = await prisma.user.findUnique({
            where: {
                email:payload.email
            }
        })

        if(!user || user === null) {
           return res.status(422).json({message: "User not found Please Check Your Mail"})
        }
        const match = await bcrypt.compare(payload.password, user.password);

        if(!match){
            return res.status(422).json({message: "Incorrect Passoword Please Check"})
        }
        
        //JWT Paload

        let JWTPayload ={
            id:user.id,
            name:user.name,
            email:user.email
        }

        const token = jwt.sign(JWTPayload, process.env.SECRET_KEY! , {expiresIn:"365d"})
        

        return res.json({
            message:"Logged in Successfully",
            data: {
                ...JWTPayload,
                token:`Bearer ${token}`,
            }
        })
        
       
        
        
        
    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
    }
})

//Check Login Route

router.post("/check/login",authLimiter, async (req:Request, res:Response) => {
    const body  = req.body;
    try {
        const payload =loginSchema.parse(body)

        let user = await prisma.user.findUnique({
            where: {
                email:payload.email
            }
        })

        if(!user || user === null) {
           return res.status(422).json({message: "User not found Please Check Your Mail"})
        }
        const match = await bcrypt.compare(payload.password, user.password);

        if(!match){
            return res.status(422).json({message: "Incorrect Passoword Please Check"})
        }
        
        //JWT Paload

        let JWTPayload ={
            id:user.id,
            name:user.name,
            email:user.email
        }

        const token = jwt.sign(JWTPayload, process.env.SECRET_KEY! , {expiresIn:"365d"})

        const resPayload = {
            id: user.id,
            email: user.email,
            name: user.name,
            token: `Bearer ${token}`,
          };
      
        return res.json({
            message:"Logged in Successfully",
            data: {
                id: user.id,
                email: user.email,
                name: user.name,
                token: `Bearer ${token}`,
            }
        })
        
       
        
        
        
    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
    }
})



//Register Route

router.post("/register",authLimiter, async (req:Request, res:Response) => {

    const body  = req.body;
    
    try {
       
        
        const payload =  registerSchema.parse(body)
        let user = await prisma.user.findUnique({
            where: {
                email:payload.email
            }
        })
        
        if(user){
            return res.status(422).json({errors: {
                email:"email already taken.Please Use Anothe One."
            }})
        }

        //Encrypt the Password
        const salt = await bcrypt.genSalt(10);
        payload.password = await bcrypt.hash(payload.password, salt)

        const token = await bcrypt.hash(uuid(), salt)
        const url =`${process.env.APP_URL}/verify-email?email=${payload.email}&token=${token}`
       


        const emailBody =  await renderEmailEjs("email-verify",{name:payload.name,url:url})
        
       
        //sent emiail

        await emailQueue.add(emailQueueName,{to:payload.email,subject:"Clash Email Verification", body:emailBody})
       
        const newUser =await prisma.user.create(
        {
           data: {
            name:payload.name,
            email:payload.email,
            password: payload.password,
            email_verify_token: token,
            token_sent_at:new Date().toISOString()
           }
        })
        //return res.json(newUser)
        return res.json({message: "Please Check Your Email"})


    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
        
    }
})

//Forget Password

router.post("/forget-password", authLimiter, async (req:Request,res:Response) => {
    
        
    
    try {
        const body  = req.body;
        const payload = forgerPasswordSchema.parse(body)

        //Check the user

        let user = await prisma.user.findUnique({where:{email:payload.email}})
        if(!user || user === null) {
            return res.status(422).json({message: "User not found Please Check Your Mail", errors: {
                email:"No User Found With This email"
            }})
         }

         const salt = await bcrypt.genSalt(10);
         const token = await bcrypt.hash(uuid(), salt); 

         await prisma.user.update({
            data: {
                password_reset_token: token,
                token_sent_at: new Date().toISOString()
            },
            where: {
                email:payload.email
            }
         })

         const url = `${process.env.CLIENT_APP_URL}/reset-password?email=${payload.email}&token=${token}`
         const html = await renderEmailEjs("forget-password",{url:url})
         await emailQueue.add(emailQueueName, {
            to:payload.email,
            subject:"Reset Your Password",
            body:html
         })
         return res.json({message:"Password Link  Sent Sucessgully! Please Check Your Mail"});

        
    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
            console.error(errors);
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
    }

})

router.post("/reset-password",authLimiter, async(req:Request,res:Response) => {
    try {
    const body = req.body
    const payload= resetPasswordSchema.parse(body)

    let user = await prisma.user.findUnique({where:{email:payload.email}})
    if(!user || user === null) {
        return res.status(422).json({message: "User not found Please Check Your Mail", errors: {
            email:"Link is Not Correct make sure you copied correct Link"
        }})
     }

     // check token

     if(user.password_reset_token !== payload.token ) {
        return res.status(422).json({message: "User not found Please Check Your Mail", errors: {
            email:"Link is Not Correct make sure you copied correct Link"
        }})
     }

     //check 2 hours time frame

     const hoursDiff = checkDateHourDiff(user.token_sent_at!)

     if(hoursDiff>2){
        return res.status(422).json({message: "Invalid Data", errors: {
            email:"Password Reset TOken Got Exoired.Please Sent new Token"
        }})
     }

     //* update Password

     const salt = await bcrypt.genSalt(10);
     const newPass = await bcrypt.hash(payload.password, salt)
     await prisma.user.update({
        data:{
            password:newPass,
            password_reset_token:null,
            token_sent_at:null
        },
        where: {
            email:payload.email
        }
     })

     return res.json({message:"Password Rest Sucessfully .Please Try login"})


   
        
     } catch (error) {
         if(error instanceof ZodError){
             const errors =formateError(error)
             return res.status(422).json({message: "Invalid Data", errors})
 
         }
 
         return res.status(500).json({message:"Something Went Wrong.Please Try again"})
     }

}) 

//Get User

router.get("/user", authmiddleware , async (req:Request, res:Response) => {
    const user =req.user

    return res.json({
        data:user
    })
})



export default router