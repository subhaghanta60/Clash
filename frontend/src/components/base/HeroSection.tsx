import Image from 'next/image'
import React from 'react'

import Link from 'next/link'
import { Button } from '../ui/button'


export default function HeroSection() {
  return (
    <div className='w-full h-screen flex justify-center items-center flex-col'>
        <div>
            <Image
             src="/banners.svg" 
             width={600}
             height={600}
             alt="banner_img"
             />
        </div>
        <div className='text-center mt-4'>
            <h1 className='text-6xl md:text-7xl lg:text-9xl font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text'>
                Clash
            </h1>
            <p className='text-2xl md:text-3xl lg:text:4xl font-bold text-center'>
                Discover The Better Chaoice,Together
            </p>
            <Link href="/login"> 
                <Button className='mt-4 text-lg'> Start Free</Button>
            </Link>
            
        </div>
    </div>
  );
}
