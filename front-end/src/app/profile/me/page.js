'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Post from '@/components/post'
import defaultAvatar from '@/assets/default-image.jpg'

export default function MyProfilePage() {
  const router = useRouter()

  // États
  const [user, setUser]         = useState(null)
  const [posts, setPosts]       = useState([])
  const [likedIds, setLikedIds] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')

  // Décode le JWT pour avoir userId
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return {}
    }
  }

  // 1) Au montage, fetch profil + ses posts + liked posts
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Utilisateur non connecté')

        const { userId } = parseJwt(token)
        if (!userId) throw new Error('Token invalide')

        // Lancer en parallèle
        const [uRes, pRes, lRes] = await Promise.all([
          fetch(`http://localhost:4001/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`http://localhost:4002/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4002/api/posts/liked`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        const [uData, pData, lData] = await Promise.all([
          uRes.json(),
          pRes.json(),
          lRes.json(),
        ])

        if (!uRes.ok) throw new Error(uData.message)
        if (!pRes.ok) throw new Error(pData.message)
        if (!lRes.ok) throw new Error(lData.message)

        setUser({ ...uData.user, stats: uData.stats })
        setPosts(pData)
        setLikedIds(lData.map(post => post._id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // 2) Toggle like/unlike
  const handleToggleLike = async (postId, isCurrentlyLiked) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Utilisateur non connecté')

      const res = await fetch(
          `http://localhost:4002/api/posts/${postId}/like`,
          {
            method: isCurrentlyLiked ? 'DELETE' : 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // Met à jour la liste des likes
      setLikedIds(ids =>
          isCurrentlyLiked
              ? ids.filter(id => id !== postId)
              : [...ids, postId]
      )
      // Met à jour le compteur dans posts
      setPosts(list =>
          list.map(p =>
              p._id === postId
                  ? { ...p, likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1) }
                  : p
          )
      )
    } catch (err) {
      alert(err.message)
    }
  }

  // Affichage loading / erreur
  if (loading) return <div className="p-4 text-center">Chargement…</div>
  if (error)   return <div className="p-4 text-center text-red-500">{error}</div>

  return (
      <div className="min-h-screen p-4 bg-white font-sans">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/home')}
              className="w-6 h-6 text-gray-800 hover:text-gray-900"
              aria-label="Home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2
                     0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3a2 2
                     0 0 1-2-2V9z"
                />
                        </svg>
                    </button>
            <button onClick={() => router.back()} className="text-gray-800">
              ← Retour
            </button>
          </div>
          <button
              onClick={() => router.push('/profile/me/edit')}
              className="px-4 py-1 border border-gray-800 rounded-full text-sm text-gray-800 hover:bg-gray-200"
          >
            Modifier profil
          </button>
        </div>

        {/* Profil utilisateur */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden border">
            {user.avatarUrl
                ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
                : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>
            }
          </div>
          <div>
            <h2 className="text-xl font-semibold text-black">{user.username}</h2>
            <p className="text-gray-600">@{user.username}</p>
            {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
          </div>
        </div>

        {/* Liste des posts */}
        <div className="space-y-4">
          {posts.length === 0 ? (
              <p className="text-center text-gray-800">Aucun post publié.</p>
          ) : (
              posts.map(post => {
                const isLiked = likedIds.includes(post._id)
                return (
                    <Post
                        key={post._id}
                        username={post.authorUsername}
                        content={post.content}
                        image={post.authorAvatarUrl || defaultAvatar.src}
                        like={post.likesCount}
                        comment={post.commentsCount ?? 0}
                        share={0}
                        liked={isLiked}
                        onToggleLike={() => handleToggleLike(post._id, isLiked)}
                    />
                )
              })
          )}
        </div>
      </div>
  )
}
