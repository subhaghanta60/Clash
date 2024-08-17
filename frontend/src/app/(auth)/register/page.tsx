import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React from 'react'

export default function page() {
  return (
    <div className='flex justify-center items-center h-screen'>

        <div className='w-[550px] bg-white rounded-xl py-5 px-10 shadow-md'>
        <h1 className='text-4xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text text-center'>
                Clash
            </h1>
            <h1 className='text-3xl font-bold mt-2' >Register</h1>
            <p>Welcome To Clash</p>
            <form>
            <div className='mt-4'>
                    <Label htmlFor='name'>Name</Label>
                    <Input id="name" type="text" name="name" placeholder='Enter Your Name..'/>
                </div>
                <div className='mt-4'>
                    <Label htmlFor='email'>Email</Label>
                    <Input id="email" type="email" name="email" placeholder='Enter Your Email..'/>
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
                    
                </div>
                <div className='mt-4'>
                    <Button className='w-full'>Submit</Button>
                </div>
            </form>
            <p
             className='text-center mt-2'
            >
                 Already have an account ? <strong><Link href="/login">Login</Link></strong>
            </p>
        </div>
    </div>
  )
}
