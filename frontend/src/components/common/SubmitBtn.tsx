'use client'
import {   useFormStatus } from "react-dom";
import { Button } from "../ui/button";



export function SubmitBtn() {
    const {pending} = useFormStatus();

    return (
        
           <Button disabled={pending} className='w-full'> 
           {pending ? "Processing" : "Submit"}
           </Button>

       
    )
}