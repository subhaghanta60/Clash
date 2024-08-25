'use client'
import { Label } from '../ui/label'
import { Input } from '../ui/input'

import React, { useEffect } from 'react'
import { toast } from 'sonner'

import { SubmitBtn } from '../common/SubmitBtn'
import {useFormState} from 'react-dom';
import { forgetPasswordAction } from '@/actions/authActions'


function ForgetPassword() {
     const initialState = {
            message: "",
            status: 0,
            errors: {},
     };
  const [state, formAction] = useFormState(forgetPasswordAction, initialState);

  useEffect(() => {
    if (state.status === 500) {
      toast.error(state.message);
    } else if (state.status === 200) {
      toast.success(state.message);
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
        <SubmitBtn />
    </div>
</form>
  )
}

export default ForgetPassword