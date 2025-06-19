'use client'

import { useState } from 'react'
import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleRegister = async () => {
    const { username, email, password, confirmPassword } = formData

    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }

    try {
      const res = await fetch('http://localhost:4000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, bio: '', avatarUrl: '' }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Erreur lors de l’inscription')
        return
      }

      localStorage.setItem('token', data.token)
      router.push('/singin')
    } catch (error) {
      console.error(error)
      alert('Une erreur est survenue')
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />
        <div className="w-full flex items-center flex-col space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="block text-sm font-medium text-gray-900">Username :</label>
            <input
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Username"
            />
            <label className="block text-sm font-medium text-gray-900">Email :</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="adresse@gmail.com"
            />
            <label className="block text-sm font-medium text-gray-900">Password :</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Password@1234"
            />
            <label className="block text-sm font-medium text-gray-900">Confirm Password :</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 w-[320px] h-[40px]"
              placeholder="Password@1234"
            />
          </div>
          <button
            onClick={handleRegister}
            className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
          >
            Sign-up
          </button>
        </div>
      </div>
    </div>
  )
}
