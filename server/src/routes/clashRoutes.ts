import {Router,Request,Response} from "express"
import { ZodError } from "zod";
import { formateError, imageValidator, removeFile, uploadFile } from "../helper.js";
import { clashSchema } from "../validation/clashValidation.js";
import { UploadedFile } from "express-fileupload";
import prisma from '../config/database.js';

const router = Router();

router.get("/",async (req:Request, res:Response) => {
    try {
        const clash = await prisma.clash.findMany({
            where: {
                user_id: req.user?.id!
            }
        })

        return res.status(200).json({message: "Clashed Fetched Successfully",data:clash})
        
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong"})
    }
} )

router.get("/:id",async (req:Request, res:Response) => {
    try {
        const {id} = req.params
        const clash = await prisma.clash.findUnique({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({message: "Clashed Fetched Successfully",data:clash})
        
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong"})
    }
} )


router.post("/", async (req:Request, res:Response) => {
    try {
        const body = req.body;
        
        const payload = clashSchema.parse(body);
        //Check If Files Exist

        if(req.files?.image) {
            const image = req.files?.image as UploadedFile

            const validMsg = imageValidator(image.size,image.mimetype)

            if(validMsg) {
                return res.status(422).json({errors : {image:validMsg}})
            }

            payload.image = await uploadFile(image)


        }else {
            return res.status(422).json({errors : {image:"Image Field Is Required"}})
        }

        await prisma.clash.create({

            data: {
                title: payload.title,
                description: payload?.description,
                image: payload?.image,
                user_id: req.user?.id!,
                expire_At: new Date(payload.expire_At),
            }
        })
        return res.json({message: "Clash Created Successfully"})

        
    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
           
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
        
    }
})

router.put("/:id", async (req:Request, res:Response) => {
    try {
        const {id} = req.params
        const body = req.body;
        
        const payload = clashSchema.parse(body);
        //Check If Files Exist

        if(req.files?.image) {
            const image = req.files?.image as UploadedFile

            const validMsg = imageValidator(image.size,image.mimetype)

            if(validMsg) {
                return res.status(422).json({errors : {image:validMsg}})
            }
            //Get Old Imgae name

            const clash = await prisma.clash.findUnique({
                select: {
                    image:true
                },
                where:{
                    id:Number(id)
                }
            })
            if(clash) {
            removeFile(clash?.image)
            }
            payload.image = await uploadFile(image)



        }


        await prisma.clash.update({
            where: {
                id:Number(id)
            },

            data:{
                ...payload,
                expire_At: new Date(payload.expire_At)
            } 
        })
        return res.json({message: "Clash Updated  Successfully"})

        
    } catch (error) {
        if(error instanceof ZodError){
            const errors =formateError(error)
           
            return res.status(422).json({message: "Invalid Data", errors})

        }

        return res.status(500).json({message:"Something Went Wrong.Please Try again"})
        
    }
})

router.delete("/:id",async (req:Request, res:Response) => {
    try {
        const {id} = req.params;
        const clash = await prisma.clash.findUnique({
            select: {
                image:true
            },
            where:{
                id:Number(id)
            }
        })
        if(clash) {
        removeFile(clash?.image)
        }
        await prisma.clash.delete({
            where: {
                id: Number(id)
            }
        })

        return res.status(200).json({message: "Clashed Deleted Successfully"})
        
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong"})
    }
} )


export default router;