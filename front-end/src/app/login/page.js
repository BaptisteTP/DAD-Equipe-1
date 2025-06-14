'use client'

import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />

        <div className="w-full flex items-center flex-col space-y-4">
            <div className="flex flex-col space-y-2">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email :</label>
                <input
                type="email"
                name="email"
                required
                autoFocus
                autoComplete="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-[320px] h-[40px]"
                placeholder="adresse@gmail.com"/>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Password :</label>
                <input
                type="Password"
                name="Password"
                required
                autoFocus
                autoComplete="username"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                        focus:ring-blue-500 focus:border-blue-500 block p-2.5 w-[320px] h-[40px]"
                placeholder="Password@1234"/>
            </div>
            <button
                onClick={() => router.push('/login')}
                className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
            >
                Sing-in
            </button>
            
        </div>
      </div>
    </div>
  )
}
