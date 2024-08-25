import ForgetPassword from '@/components/auth/ForgetPassword'
import ResetPassword from '@/components/auth/ResetPassword'
import Link from 'next/link'
import React from 'react'

export default function resetPassword() {
  return (
    <div className='flex justify-center items-center h-screen'>

    <div className='w-[550px] bg-white rounded-xl py-5 px-10 shadow-md'>
    <h1 className='text-4xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center'>
            Clash
        </h1>
        <h1 className='text-3xl font-bold mt-2' >Reset  Password</h1>
        
        <ResetPassword />
        
    </div>
</div>
  )
}
