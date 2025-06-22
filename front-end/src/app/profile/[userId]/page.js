'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Post from '@/components/post'
import defaultAvatar from '@/assets/default-image.jpg'
import { jwtDecode } from 'jwt-decode'

export default function OtherProfilePage() {
    const router = useRouter()
    const { userId } = useParams()
    const [ready, setReady] = useState(false);
    const [user, setUser] = useState(null)
    const [posts, setPosts] = useState([])
    const [likedPosts, setLikedPosts] = useState([])
    const [likedIds, setLikedIds] = useState([])
    const [isFollowing, setIsFollowing] = useState(false)
    const [selectedTab, setSelectedTab] = useState('posts')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) return

        let decoded
        try {
            decoded = jwtDecode(token)
        } catch {
            return
        }

        const currentUserId =
            decoded.userId ||
            decoded.id ||
            decoded._id ||
            decoded.sub ||
            (decoded.user && decoded.user._id)

        if (currentUserId === userId) {
            router.replace('/profile/me')
        }
    }, [router, userId])
    useEffect(() => {
        async function fetchProfile() {
            setLoading(true)
            setError('')
            try {
                const token = localStorage.getItem('token')
                if (!token) throw new Error('Vous devez être connecté.')
                const decoded = jwtDecode(token)
                const currentUserId =
                    decoded.userId ||
                    decoded.id ||
                    decoded._id ||
                    decoded.sub ||
                    (decoded.user && decoded.user._id)
                if (!currentUserId) throw new Error('ID utilisateur introuvable.')

                const [uRes, pRes, lRes, fRes] = await Promise.all([
                    fetch(`http://localhost:4001/api/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:4002/api/posts/user/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:4002/api/posts/user/${userId}/liked`, {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    fetch(`http://localhost:4001/api/follows/${currentUserId}/following`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ])

                if (!uRes.ok) throw new Error(`Profil : ${uRes.status}`)
                if (!pRes.ok) throw new Error(`Posts : ${pRes.status}`)
                if (!lRes.ok) throw new Error(`Liked : ${lRes.status}`)
                if (!fRes.ok) throw new Error(`Follow : ${fRes.status}`)

                const [uData, pData, lData, fData] = await Promise.all([
                    uRes.json(),
                    pRes.json(),
                    lRes.json(),
                    fRes.json()
                ])

                setUser({ ...uData.user, stats: uData.stats })
                setPosts(Array.isArray(pData) ? pData : [])
                setLikedPosts(Array.isArray(lData) ? lData : [])
                setLikedIds(Array.isArray(lData) ? lData.map(p => p._id) : [])
                setIsFollowing(Array.isArray(fData) && fData.some(u => u._id === userId))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [userId])

    const handleToggleFollow = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) throw new Error('Non connecté.')
            const method = isFollowing ? 'DELETE' : 'POST'
            const res = await fetch(
                `http://localhost:4001/api/follows/${userId}/follow`,
                {
                    method,
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            const body = await res.json()
            if (!res.ok) throw new Error(body.message || `Erreur ${res.status}`)
            setIsFollowing(f => !f)
            setUser(u => ({
                ...u,
                stats: {
                    ...u.stats,
                    followersCount:
                        u.stats.followersCount + (isFollowing ? -1 : 1)
                }
            }))
        } catch (err) {
            alert(err.message)
        }
    }

    // handlers pour naviguer vers les sous-pages
    const handleShowFollowing = () => {
        router.push(`/profile/${userId}/following`)
    }
    const handleShowFollowers = () => {
        router.push(`/profile/${userId}/followers`)
    }

    if (loading) return <div className="p-4 text-center">Chargement…</div>
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>

    const displayList = selectedTab === 'posts' ? posts : likedPosts

    return (
        <div className="min-h-screen p-4 bg-white font-sans">
            {/* ← Retour + Follow/Unfollow */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={() => router.push('/home')}
                    className="text-gray-800 hover:text-gray-900"
                >
                    ← Retour
                </button>
                <button
                    onClick={handleToggleFollow}
                    className={`px-4 py-1 rounded-full text-sm font-medium ${
                        isFollowing
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    {isFollowing ? 'Se désabonner' : 'Suivre'}
                </button>
            </div>

            {/* Avatar + bio */}
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
                    {user.bio && <p className="text-gray-700">{user.bio}</p>}
                </div>
            </div>

            {/* Stats + navigation vers following / followers */}
            {user.stats && (
                <div className="flex space-x-6 text-sm text-gray-600 mb-6">
          <span
              onClick={handleShowFollowing}
              className="cursor-pointer hover:underline"
          >
            <strong>{user.stats.followingCount}</strong> Abonnements
          </span>
                    <span
                        onClick={handleShowFollowers}
                        className="cursor-pointer hover:underline"
                    >
            <strong>{user.stats.followersCount}</strong> Abonnés
          </span>
                </div>
            )}

            {/* Onglets Posts / Liked */}
            <div className="border-b mb-4 flex space-x-6">
                <button
                    onClick={() => setSelectedTab('posts')}
                    className={`pb-2 ${
                        selectedTab === 'posts'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500'
                    }`}
                >
                    Posts
                </button>
                <button
                    onClick={() => setSelectedTab('liked')}
                    className={`pb-2 ${
                        selectedTab === 'liked'
                            ? 'border-b-2 border-black text-black'
                            : 'text-gray-500'
                    }`}
                >
                    Liked
                </button>
            </div>

            {/* Liste des posts */}
            {displayList.length === 0 ? (
                <p className="text-center text-gray-800">
                    {selectedTab === 'posts'
                        ? "Cet utilisateur n'a pas publié de post."
                        : "Il n'a pas liké de post."}
                </p>
            ) : (
                displayList.map(post => {
                    const isLiked = likedIds.includes(post._id)
                    return (
                        <Post
                            key={post._id}
                            authorId={post.authorId || userId}
                            username={post.authorUsername}
                            image={post.authorAvatarUrl || defaultAvatar.src}
                            content={post.content}
                            like={post.likesCount}
                            comment={post.commentsCount ?? 0}
                            share={0}
                            liked={isLiked}
                            onToggleLike={() => {
                                // tu peux réutiliser ton handleToggleLike si besoin
                            }}
                        />
                    )
                })
            )}
        </div>
    )
}
