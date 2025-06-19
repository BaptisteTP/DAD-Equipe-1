'use client'

import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import defaultAvatar from '@/assets/default-image.jpg'

export default function ProfileSetup() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [profileImage, setProfileImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full flex flex-col items-center space-y-10">
        <Image src={logo} alt="Logo Breezy" width={140} height={140} />

        <div className="w-full flex items-center flex-col space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <div
              className="w-24 h-24 rounded-full overflow-hidden cursor-pointer border-2 border-gray-300 hover:opacity-80 transition"
              onClick={triggerFileSelect}
            >
              <img
                src={profileImage || defaultAvatar.src}
                alt="Photo de profil"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <span className="text-sm text-gray-500">Cliquez pour changer la photo</span>
          </div>

          {/* Bio */}
          <div className="flex flex-col space-y-2 w-[320px]">
            <label className="text-sm font-medium text-gray-900">Bio :</label>
            <textarea
              rows={4}
              placeholder="Parlez un peu de vous..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 resize-none"
            />
          </div>

          {/* Bouton */}
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}
