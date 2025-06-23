'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Post from '@/components/post'
import Navbar from '@/components/navbar'
import defaultAvatar from '@/assets/default-image.jpg'
import { jwtDecode } from 'jwt-decode'
import { useThemeLang } from '@/context/ThemeLangContext'

export default function MyProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [posts, setPosts] = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [likedIds, setLikedIds] = useState([])
  const [selectedTab, setSelectedTab] = useState('posts')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { themeClasses } = useThemeLang()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Non connecté.')
        const decoded = jwtDecode(token)
        const userId = decoded.userId || decoded.id || decoded._id || decoded.sub || (decoded.user && decoded.user._id)
        if (!userId) throw new Error('Token invalide.')

        const [uRes, pRes, lRes] = await Promise.all([
          fetch(`http://localhost:4001/api/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4002/api/posts/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:4002/api/posts/liked`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ])

        if (!uRes.ok || !pRes.ok || !lRes.ok) throw new Error('Erreur de récupération des données.')

        const [uData, pData, lData] = await Promise.all([
          uRes.json(),
          pRes.json(),
          lRes.json(),
        ])

        setUser({ ...uData.user, stats: uData.stats })
        setPosts(Array.isArray(pData) ? pData : [])
        setLikedPosts(Array.isArray(lData) ? lData : [])
        setLikedIds(Array.isArray(lData) ? lData.map((p) => p._id) : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleShowFollowing = () => router.push('/profile/me/following')
  const handleShowFollowers = () => router.push('/profile/me/followers')

  const handleToggleLike = async (postId, isLiked) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      const method = isLiked ? 'DELETE' : 'POST'
      const res = await fetch(`http://localhost:4002/api/posts/${postId}/like`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) return

      setLikedIds((prev) => isLiked ? prev.filter((id) => id !== postId) : [...prev, postId])
    } catch (err) {
      console.error(err)
    }
  }

  const displayList = selectedTab === 'posts' ? posts : likedPosts

  if (loading) return <div className="p-4 text-center">Chargement…</div>
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>

  return (
    <div className={`min-h-screen flex ${themeClasses}`}>
      {/* Navbar visible uniquement sur desktop */}
      <aside className="hidden lg:block w-64 border-r border-gray-300 dark:border-gray-700">
        <Navbar />
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden border">
            <img
              src={user.avatarUrl || defaultAvatar.src}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            {user.bio && <p className="text-gray-700 dark:text-gray-300">{user.bio}</p>}
          </div>
        </div>

        {user.stats && (
          <div className="flex space-x-6 text-sm mb-6">
            <span onClick={handleShowFollowing} className="cursor-pointer hover:underline">
              <strong>{user.stats.followingCount}</strong> Abonnements
            </span>
            <span onClick={handleShowFollowers} className="cursor-pointer hover:underline">
              <strong>{user.stats.followersCount}</strong> Abonnés
            </span>
          </div>
        )}

        <div className="border-b mb-4 flex space-x-6">
          <button
            onClick={() => setSelectedTab('posts')}
            className={`pb-2 ${
              selectedTab === 'posts'
                ? 'border-b-2 border-black text-black dark:border-white dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Posts
          </button>
          <button
            onClick={() => setSelectedTab('liked')}
            className={`pb-2 ${
              selectedTab === 'liked'
                ? 'border-b-2 border-black text-black dark:border-white dark:text-white'
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Liked
          </button>
        </div>

        {displayList.length === 0 ? (
          <p className="text-center">
            {selectedTab === 'posts'
              ? 'Aucun post publié.'
              : 'Aucun post liké.'}
          </p>
        ) : (
          displayList.map((post) => {
            const isLiked = likedIds.includes(post._id)
            return (
              <Post
                key={post._id}
                authorId={post.authorId}
                username={post.authorUsername}
                image={post.authorAvatarUrl || defaultAvatar.src}
                content={post.content}
                like={post.likesCount}
                comment={post.commentsCount ?? 0}
                share={0}
                liked={isLiked}
                onToggleLike={() => handleToggleLike(post._id, isLiked)}
              />
            )
          })
        )}
      </main>
    </div>
  )
}
