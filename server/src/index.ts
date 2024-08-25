import express, {Application, Request,Response} from "express"
import "dotenv/config"
const app:Application = express()
import path from 'path'
import {fileURLToPath} from 'url'
const _dirname = path.dirname(fileURLToPath(import.meta.url))
import ejs from 'ejs'
import Routes from "./routes/index.js"


const PORT = process.env.PORT || 7000;

app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.use(appLimiter);

//Set View Engine

app.set('view engine', 'ejs')
app.set("views",path.resolve(_dirname,'./views'))

//ROutes
app.use(Routes)


app.get("/", async (req:Request,res:Response)=> {
    
    const html = await ejs.renderFile(_dirname + `/views/emails/Welcome.ejs`, {name:"Subha Ghanta"})
   try {
    /*
    ****************Normal Sent Email**********
    await sendEmail("subhaghanta325@gmail.com","Testing SMTP", html) 
    return res.json({msg: "Email Send Successfully!"})

    ******************Mail Sent Using Queue**************
    */
    await emailQueue.add(emailQueueName,{to:"subhaghanta60@gmail.com",subject:"Testing Queue Mail",body:html})
    return res.json({msg: "Email Send Successfully!"})


   } catch (error) {
    console.error(error);
    
   }
    
   
  
})

//Queues

import "./jobs/index.js"
import { emailQueue, emailQueueName } from "./jobs/Email.Job.js"
import { appLimiter } from "./config/rateLimit.js"

app.listen(PORT, ()=> console.log(`Server is Running on PORT ${PORT}`));