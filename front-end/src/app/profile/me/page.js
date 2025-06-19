'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import Image from 'next/image'
import defaultAvatar from '@/assets/default-image.jpg' // change selon ton arborescence

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('token')

      if (!token) {
        setError('Utilisateur non connecté.')
        setLoading(false)
        return
      }

      let userId
      try {
        const decoded = jwtDecode(token)
        userId = decoded.userId
        if (!userId) throw new Error()
      } catch {
        setError("Token JWT invalide.")
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`http://localhost:4001/api/users/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Erreur lors du chargement du profil')
        }

        const data = await res.json()
        setUser(data.user)
        setPosts(data.posts)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  if (loading) return <p className="text-center">Chargement...</p>
  if (error) return <p className="text-red-500 text-center">{error}</p>
  if (!user) return <p className="text-center">Utilisateur non trouvé</p>

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded shadow">
      {/* Header profil */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={user.avatarUrl || defaultAvatar}
            alt={`Avatar de ${user.username}`}
            width={80}
            height={80}
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{user.username}</h2>
          <p className="text-gray-600 max-w-md">
            {user.bio || 'Pas de description'}
          </p>
          <div className="flex space-x-6 mt-2 text-sm text-gray-700">
            <div>{user.followingCount ?? 0} Following</div>
            <div>{user.followersCount ?? 0} Followers</div>
          </div>
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {Array.isArray(posts) && posts.length === 0 && <p>Aucun post à afficher</p>}
        {Array.isArray(posts) &&
          posts.map((post) => (
            <div key={post._id} className="p-4 border border-gray-200 rounded">
              <p className="whitespace-pre-line">{post.content}</p>
              <div className="flex space-x-4 mt-3 text-sm text-gray-600">
                <div>❤️ {post.likesCount ?? 0}</div>
                <div>💬 {post.commentsCount ?? 0}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
