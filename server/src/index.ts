import express, {Application, Request,Response} from "express"
import "dotenv/config"
const app:Application = express()
import path from 'path'
import {fileURLToPath} from 'url'
const _dirname = path.dirname(fileURLToPath(import.meta.url))
import ejs from 'ejs'
import { sendEmail } from "./config/mail.js"


const PORT = process.env.PORT || 7000;

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Set View Engine

app.set('view engine', 'ejs')
app.set("views",path.resolve(_dirname,'./views'))


app.get("/", async (req:Request,res:Response)=> {
    const html = await ejs.renderFile(_dirname + `/views/emails/Welcome.ejs`, {name:"Subha Ghanta"})
   try {
    await sendEmail("subhaghanta325@gmail.com","Testing SMTP", html) 
    return res.json({msg: "Email Send Successfully!"})
    
   } catch (error) {
    console.error(error);
    
   }
  
})

app.listen(PORT, ()=> console.log(`Server is Running on PORT ${PORT}`));