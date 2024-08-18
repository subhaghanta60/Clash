import express, {Application, Request,Response} from "express"
import "dotenv/config"
const app:Application = express()
import path from 'path'
import {fileURLToPath} from 'url'
const _dirname = path.dirname(fileURLToPath(import.meta.url))


const PORT = process.env.PORT || 7000;

app.use(express.json())
app.use(express.urlencoded({extended:false}))

//Set View Engine

app.set('view engine', 'ejs')
app.set("views",path.resolve(_dirname,'./views'))


app.get("/", (req:Request,res:Response)=> {
    return res.render("Welcome")
})

app.listen(PORT, ()=> console.log(`Server is Running on PORT ${PORT}`));