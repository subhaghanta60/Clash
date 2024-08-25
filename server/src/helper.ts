import { ZodError } from "zod";
import path from 'path'
import {fileURLToPath} from 'url'

import ejs from 'ejs'
import moment from "moment";
import { supportMines } from "./config/fileSystem.js";
import { UploadedFile } from "express-fileupload";
import {v4 as uuid} from "uuid"
import fs from "fs"

export const formateError = (error:ZodError):any => {
    let errors:any = {}

    error.errors?.map((issue) => {
        errors[issue.path?.[0]] = issue.message
    })

    return errors
}

export const renderEmailEjs =  async (filename:string,payload:any):Promise<string> => {
    const _dirname = path.dirname(fileURLToPath(import.meta.url))

    const html:string = await ejs.renderFile(_dirname + `/views/emails/${filename}.ejs`, payload);

    return html;

}

export const checkDateHourDiff = (date:Date | string):number => {
    const now = moment()
    const tokenSentAt = moment(date)
    const difference = moment.duration(now.diff(tokenSentAt))
    return difference.asHours()
}

export const imageValidator = (size:number, mine:string):string|null => {
    if(byestToMB(size) >2){
        return "Image size must be less than 2 Mb"
    } else if(!supportMines.includes(mine)){
        return "Image must be trpe of jpg,png,jpeg"
    }

    return null

}


export const byestToMB = (bytes:number):number => {
    return bytes/(1024*1024)
}

export const uploadFile = async (image:UploadedFile) => {
    const imgExt = image?.name.split(".")
    const imageName = uuid()+"." + imgExt[1]
    const uploadPath = process.cwd() + "/public/images/"+imageName

    image.mv(uploadPath, (err)=> {
        if(err) throw err
    })

    return imageName
}

export const removeFile = (imageName:string) => {
    const path=process.cwd() + "/public/images/" + imageName

    if(fs.existsSync(path)){
        fs.unlinkSync(path)
    }

}