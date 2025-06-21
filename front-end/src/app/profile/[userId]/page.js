'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Post from '@/components/post'
import defaultAvatar from '@/assets/default-image.jpg'

export default function UserProfilePage({ params }) {
    const { userId } = params
    const router = useRouter()
    const [user, setUser]       = useState(null)
    const [posts, setPosts]     = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState('')

    useEffect(() => {
        async function fetchProfile() {
            setLoading(true)
            setError('')

            try {
                // 1) Vérifier connexion
                const token = localStorage.getItem('token')
                if (!token) throw new Error('Utilisateur non connecté')

                // 2) Récupérer profil + stats
                const resUser = await fetch(`http://localhost:4001/api/users/${userId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                })
                const uData = await resUser.json()
                if (!resUser.ok) throw new Error(uData.message || 'Erreur chargement profil')

                // 3) Récupérer posts
                const resPosts = await fetch(`http://localhost:4002/api/posts/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                const pData = await resPosts.json()
                if (!resPosts.ok) throw new Error(pData.message || 'Erreur chargement posts')

                // 4) Mettre à jour le state
                setUser(uData.user)
                if (uData.stats) setUser(prev => ({ ...prev, stats: uData.stats }))
                setPosts(pData)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [userId])

    if (loading) return <div className="p-4 text-center">Chargement…</div>
    if (error)   return <div className="p-4 text-center text-red-500">{error}</div>

    return (
        <div className="min-h-screen p-4 space-y-4 font-sans bg-white">            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {/* Home icon */}
                    <button
                        onClick={() => router.push('/home')}
                        className="w-6 h-6 text-gray-600 hover:text-gray-800"
                        aria-label="Home"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor"
                             className="w-full h-full">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2
                       0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3a2 2
                       0 0 1-2-2V9z"/>
                        </svg>
                    </button>
                    {/* Back */}
                    <button
                        onClick={() => router.back()}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        ← Retour
                    </button>
                </div>
            </div>

            {/* Profil utilisateur */}
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border">
                    {user.avatarUrl
                        ? <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover"/>
                        : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">?</div>
                    }
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-black">{user.username}</h2>
                    <p className="text-gray-800">@{user.username}</p>
                    {user.bio && <p className="mt-2 text-gray-700">{user.bio}</p>}
                </div>
            </div>

            {/* Stats */}
            {user.stats && (
                <div className="flex space-x-6 text-sm text-gray-600">
                    <span><strong>{user.stats.followingCount}</strong> Following</span>
                    <span><strong>{user.stats.followersCount}</strong> Followers</span>
                </div>
            )}

            {/* Liste des posts */}
            <div className="space-y-4">
                {posts.length === 0 && (
                    <p className="text-center text-gray-800">Aucun post publié.</p>
                )}
                {posts.map(post => (
                    <Post
                        key={post._id}
                        username={post.authorUsername}
                        content={post.content}
                        image={post.authorAvatarUrl || defaultAvatar.src}
                        like={post.likesCount}
                        comment={post.commentsCount ?? 0}
                        share={0}
                    />
                ))}
            </div>
        </div>
    )
}
