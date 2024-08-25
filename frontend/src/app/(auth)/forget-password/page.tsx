import ForgetPassword from '@/components/auth/ForgetPassword'
import Link from 'next/link'
import React from 'react'

export default function forgetPassword() {
  return (
    <div className='flex justify-center items-center h-screen'>

    <div className='w-[550px] bg-white rounded-xl py-5 px-10 shadow-md'>
    <h1 className='text-4xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center'>
            Clash
        </h1>
        <h1 className='text-3xl font-bold mt-2' >Forget Password</h1>
        <p>Donn't Worry it happens.Justenter your email below and we will send you the Password Reset Link</p>
        <ForgetPassword />
        
    </div>
</div>
  )
}
