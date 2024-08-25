import {Router,Request,Response} from 'express'
import { loginSchema, registerSchema } from '../validation/authValidation.js';
import { ZodError } from 'zod';
import { formateError, renderEmailEjs } from '../helper.js';
import prisma from '../config/database.js';
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import { emailQueue, emailQueueName } from '../jobs/Email.Job.js';
import jwt from "jsonwebtoken"
import authmiddleware from '../middleware/AuthMiddleware.js';

const router = Router();

//Login Routes
router.post("/login", async (req:Request, res:Response) => {
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

router.post("/check/login", async (req:Request, res:Response) => {
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

router.post("/register", async (req:Request, res:Response) => {

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



//Get User

router.get("/user", authmiddleware , async (req:Request, res:Response) => {
    const user =req.user

    return res.json({
        data:user
    })
})



export default router