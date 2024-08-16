import express, {Application, Request,Response} from "express"
import "dotenv/config"
const app:Application = express()

const PORT = process.env.PORT || 7000;

app.get("/", (req:Request,res:Response)=> {
    res.send("Hey IT's Working...")
})

app.listen(PORT, ()=> console.log(`Server is Running on PORT ${PORT}`));