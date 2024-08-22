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

router.get("/verify-email", async (req:Request, res:Response) => {

    const {email,token}= req.query;

        if(email && token) {
            const user = await prisma.user.findUnique({where: {
                email:email as string
            }})
    
            if(user){
                if(token === user.email_verify_token) {
                   const updatedUSer =  await prisma.user.update({
                        data:{
                            email_verify_token:null,
                            email_verifyat:new Date().toISOString(),
    
                        },
                        where: {
                            email:email as string
                        }
                    })
                    if(updatedUSer){
                    return res.redirect(`${process.env.CLIENT_APP_URL}/login`)
                    }
                }
               
    
            }
            return res.redirect("/verify-error")
        }

        return res.redirect("/verify-error")
        
    
        
       
    
    
})

router.get("/verify-error", (req:Request, res:Response) => {
    return res.render("auth/emailVerifyError")
})



export default router