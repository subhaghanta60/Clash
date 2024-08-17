import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='h-screen flex justify-center items-center flex-col'>

      <Image src="/404Error.svg" width={500} height={500} alt="404Error" />
      
      <Link href="/">
        <Button className='mt-4'>Return Home </Button>
      </Link>
    </div>
  )
}