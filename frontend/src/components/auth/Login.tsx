'use client'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

import { SubmitBtn } from '../common/SubmitBtn'
import {useFormState} from 'react-dom';
import { loginAction } from '@/actions/authActions'
import {signIn} from 'next-auth/react'

function Login() {
     const initialState = {
    message: "",
    status: 0,
    errors: {},
    data: {},
  };
  const [state, formAction] = useFormState(loginAction, initialState);

  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
      signIn("credentials", {
        email: state.data?.email,
        password: state.data?.password,
        redirect: true,
        callbackUrl: "/dashboard",
      });
    }
  }, [state]);

  return (
    <form action={formAction}>
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
        <div
            className='text-right font-bold'
        >
            <Link 
                href="/forget-password"
            >
                Forget Password?
            </Link>
        </div>
    </div>
    <div className='mt-4'>
        <SubmitBtn />
    </div>
</form>
  )
}

export default Login