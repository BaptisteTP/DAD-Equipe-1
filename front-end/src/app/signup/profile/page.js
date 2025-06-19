'use client'

import Image from 'next/image'
import logo from '@/assets/breezy.png'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import defaultAvatar from '@/assets/default-image.jpg'

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export default function ProfileSetup() {
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [bio, setBio] = useState('')
  const [profileImage, setProfileImage] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result) // base64 string
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Utilisateur non connecté')
      router.push('/signin')
      return
    }

    const payload = parseJwt(token)
    if (!payload || !payload.userId) {
      alert('Token invalide')
      router.push('/signin')
      return
    }

    const userId = payload.userId

    const dataToSend = { bio }
    if (profileImage) {
      dataToSend.avatarUrl = profileImage
    }

    try {
      const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Erreur lors de la mise à jour')
        return
      }

      router.push('/home')
    } catch (err) {
      console.error(err)
      alert("Une erreur est survenue lors de l'enregistrement du profil")
    }
  }

  const triggerFileSelect = () => fileInputRef.current?.click()

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

          <div className="flex flex-col space-y-2 w-[320px]">
            <label className="text-sm font-medium text-gray-900">Bio :</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez un peu de vous..."
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 cursor-pointer w-[320px] h-[40px]"
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  )
}
