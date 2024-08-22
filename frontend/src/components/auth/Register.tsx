'use client'
import React, { useEffect } from 'react'
import { registerAction } from '@/actions/authActions'
import { SubmitBtn } from '@/components/common/SubmitBtn'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {useFormState} from 'react-dom';
import { toast } from 'sonner'

function Register() {
    const initialState = {
        status:0,
        message:"",
        errors:""
    }
    const [state,formAction] = useFormState(registerAction,initialState)

    useEffect(()=> {
        if(state.status ===500){
            toast.error(state.message)
        }else if(state.status ===200){
            toast.success(state.message)
        }

    },[state])
  return (
    <form action={formAction}>
    <div className='mt-4'>
            <Label htmlFor='name'>Name</Label>
            <Input id="name" type="text" name="name" placeholder='Enter Your Name..'/>
            <span className='text-red-500'>{state.errors?.name}</span>
            
        </div>
        <div className='mt-4'>
            <Label htmlFor='email'>Email</Label>
            <Input id="email" type="email" name="email" placeholder='Enter Your Email..'/>
            <span className='text-red-500'>{state.errors?.email}</span>
        </div>
        <div className='mt-4'>
            <Label
                 htmlFor='password'
            >
                Password
            </Label>
            <Input
                 id="password" 
                 type="password"
                 name="password"
                  placeholder='Enter Your Password..'
            />
             <span className='text-red-500'>{state.errors?.password}</span>
        </div>
        <div className='mt-4'>
            <Label
                 htmlFor='cpassword'
            >
                Confirm Password
            </Label>
            <Input
                 id="cpassword" 
                 type="password"
                 name="confirm_password"
                  placeholder='Enter Your Confirm  Password..'
            />
             <span className='text-red-500'>{state.errors?.confirm_password}</span>
            
        </div>
        <div className='mt-4'>
           <SubmitBtn />
        </div>
    </form>
  )
}

export default Register