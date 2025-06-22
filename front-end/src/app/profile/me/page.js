'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Post from '@/components/post'
import defaultAvatar from '@/assets/default-image.jpg'

export default function MyProfilePage() {
  const router = useRouter()

  // États
  const [user, setUser]           = useState(null)
  const [posts, setPosts]         = useState([])
  const [likedPosts, setLikedPosts] = useState([])
  const [likedIds, setLikedIds]   = useState([])
  const [selectedTab, setSelectedTab] = useState('posts') // 'posts' ou 'liked'
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [showFollowers, setShowFollowers] = useState(false)
  const [showFollowing, setShowFollowing] = useState(false)

  // Décodage simple du JWT
  function parseJwt(token) {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return {}
    }
  }

  // 1) Au montage, on charge : profil, posts, likedPosts
  useEffect(() => {
    async function fetchAll() {
      setLoading(true)
      setError('')
      try {
        const token = localStorage.getItem('token')
        if (!token) throw new Error('Utilisateur non connecté')

        const { userId } = parseJwt(token)
        if (!userId) throw new Error('Token invalide')

        // requêtes parallèles
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
        setLikedPosts(lData)
        setLikedIds(lData.map(post => post._id))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // → ICI : ajoutez ces deux fonctions
  const handleShowFollowing = () => {
    router.push('/profile/me/following')
  }

  const handleShowFollowers = () => {
    router.push('/profile/me/followers')
  }

// 2) Toggle like/unlike
  const handleToggleLike = async (postId, isCurrentlyLiked) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Utilisateur non connecté')

      // 2.a) Appel POST ou DELETE
      const res = await fetch(
          `http://localhost:4002/api/posts/${postId}/like`,
          {
            method: isCurrentlyLiked ? 'DELETE' : 'POST',
            headers: { Authorization: `Bearer ${token}` },
          }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      // 2.b) Met à jour la liste des IDs likés
      setLikedIds(ids =>
          isCurrentlyLiked
              ? ids.filter(id => id !== postId)
              : [...ids, postId]
      )

      // 2.c) Met à jour le compteur dans posts
      setPosts(list =>
          list.map(p =>
              p._id === postId
                  ? { ...p, likesCount: p.likesCount + (isCurrentlyLiked ? -1 : 1) }
                  : p
          )
      )

      // 2.d) Met à jour likedPosts : on supprime ou on ajoute le post avec le nouveau compteur
      setLikedPosts(list => {
        if (isCurrentlyLiked) {
          // Si on enlève le like → on filtre
          return list.filter(p => p._id !== postId)
        } else {
          // Si on ajoute le like → on reconstruit un nouvel objet avec le compteur incrémenté
          const orig = posts.find(p => p._id === postId)
          if (!orig) return list
          const updated = { ...orig, likesCount: orig.likesCount + 1 }
          return [updated, ...list]
        }
      })
    } catch (err) {
      alert(err.message)
    }
  }
  if (loading) return <div className="p-4 text-center">Chargement…</div>
  if (error)   return <div className="p-4 text-center text-red-500">{error}</div>

  // Choix de la liste à afficher selon l’onglet
  const displayList = selectedTab === 'posts' ? posts : likedPosts

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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                   viewBox="0 0 24 24" stroke="currentColor"
                   className="w-full h-full">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2
                       0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3a2 2
                       0 0 1-2-2V9z"/>
              </svg>
            </button>
            <button onClick={() => router.back()} className="text-gray-800 hover:text-gray-900">
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
        {user.stats && (
            <div className="flex space-x-6 text-sm text-gray-600 mb-4">
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


        {/* Affichage des listes */}
        {showFollowing && (
            <ul className="space-y-2 mb-6">
              {following.map(u => (
                  <li key={u._id} className="flex items-center space-x-2">
                    <img
                        src={u.avatarUrl || defaultAvatar.src}
                        alt={u.username}
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{u.username}</span>
                  </li>
              ))}
            </ul>
        )}
        {showFollowers && (
            <ul className="space-y-2 mb-6">
              {followers.map(u => (
                  <li key={u._id} className="flex items-center space-x-2">
                    <img
                        src={u.avatarUrl || defaultAvatar.src}
                        alt={u.username}
                        className="w-8 h-8 rounded-full"
                    />
                    <span>{u.username}</span>
                  </li>
              ))}
            </ul>
        )}

        {/* Onglets */}
        <div className="border-b mb-4 flex space-x-6">
          <button
              onClick={() => setSelectedTab('posts')}
              className={`pb-2 ${
                  selectedTab === 'posts'
                      ? 'border-b-2 border-black text-black'
                      : 'text-gray-500'
              }`}
          >
            Mes posts
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

        {/* Contenu de l’onglet */}
        <div className="space-y-4">
          {displayList.length === 0 ? (
              <p className="text-center text-gray-800">
                {selectedTab === 'posts'
                    ? 'Aucun post publié.'
                    : 'Aucun post liké.'}
              </p>
          ) : (
              displayList.map(post => {
                const isLiked = likedIds.includes(post._id)
                return (
                    <Post
                        authorId={post.authorId}                   // ← on passe l’id
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
