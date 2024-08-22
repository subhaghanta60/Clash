import {Router,Request,Response} from 'express'
import { registerSchema } from '../validation/authValidation.js';
import { ZodError } from 'zod';
import { formateError, renderEmailEjs } from '../helper.js';
import prisma from '../config/database.js';
import bcrypt from "bcrypt";
import {v4 as uuid} from "uuid";
import { emailQueue, emailQueueName } from '../jobs/Email.Job.js';

const router = Router();

//Register Route

router.post("/register", async (req:Request, res:Response) => {

    
    
    try {
        const body  = req.body;
        
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



export default router