import { ZodError } from "zod";
import path from 'path'
import {fileURLToPath} from 'url'

import ejs from 'ejs'
import moment from "moment";

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
