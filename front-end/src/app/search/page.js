'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { jwtDecode } from 'jwt-decode'  // Import nommé obligatoire avec la version ESM
import defaultAvatar from '@/assets/default-image.jpg'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

export default function SearchPage() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isNavbarOpen, setIsNavbarOpen] = useState(false)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [followingIds, setFollowingIds] = useState([])

  useEffect(() => {
    const fetchUsersAndFollowing = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setError("Vous devez être connecté pour accéder à cette page.")
        setLoading(false)
        return
      }

      try {
        const decoded = jwtDecode(token)
        console.log('Token décodé:', decoded)

        // Affiche toutes les clés dans le token pour debug
        console.log('Clés dans le token:', Object.keys(decoded))

        // Essaye plusieurs clés possibles pour récupérer l'ID utilisateur
        const userId =
          decoded._id ||
          decoded.id ||
          decoded.sub ||
          decoded.userId ||
          (decoded.user && decoded.user._id)

        if (!userId) {
          throw new Error("Token invalide : identifiant utilisateur manquant")
        }

        setCurrentUserId(userId)

        // Récupérer les utilisateurs
        const resUsers = await fetch('http://localhost:4001/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!resUsers.ok) throw new Error("Erreur lors du chargement des utilisateurs.")
        const usersData = await resUsers.json()
        setUsers(usersData.users)
        setFilteredUsers(usersData.users)

        // Récupérer la liste des utilisateurs suivis
        const resFollowing = await fetch(`http://localhost:4001/api/follows/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (resFollowing.ok) {
          const following = await resFollowing.json()
          const followingIds = following.map(user => user._id)
          setFollowingIds(followingIds)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsersAndFollowing()
  }, [])

  useEffect(() => {
    const search = searchTerm.toLowerCase()
    const filtered = users.filter(
      user =>
        user.username.toLowerCase().includes(search) ||
        (user.bio && user.bio.toLowerCase().includes(search))
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleFollowToggle = async (userId) => {
    const token = localStorage.getItem('token')
    if (!token) return

    const isFollowing = followingIds.includes(userId)

    try {
        const method = isFollowing ? 'DELETE' : 'POST'
        const res = await fetch(`http://localhost:4001/api/follows/${userId}/follow`, {
        method,
        headers: { Authorization: `Bearer ${token}` }
        })

        if (!res.ok) {
        // Lit le body une seule fois sous forme de texte brut
        const text = await res.text()

        // Essaie de parser ce texte en JSON
        let errorMsg = ''
        try {
            const data = JSON.parse(text)
            errorMsg = data.message || JSON.stringify(data)
        } catch {
            errorMsg = text
        }

        throw new Error(errorMsg || 'Erreur lors du suivi.')
        }

        setFollowingIds(prev =>
        isFollowing ? prev.filter(id => id !== userId) : [...prev, userId]
        )
    } catch (err) {
        alert(err.message)
    }
    }



  if (loading) return <p className="text-center mt-6">Chargement...</p>
  if (error) return <p className="text-red-500 text-center mt-6">{error}</p>

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <div className="block lg:hidden">
        <Header onProfileClick={() => setIsNavbarOpen(!isNavbarOpen)} />
      </div>

      <div className="flex flex-1">
        {isNavbarOpen && (
          <div className="fixed z-40 inset-y-0 left-0 w-64 bg-base-100 shadow-lg border-r border-gray-200 lg:hidden">
            <Navbar />
          </div>
        )}

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-6"
          />

          <div className="grid gap-4">
            {filteredUsers.length === 0 && (
              <p className="text-gray-600">Aucun utilisateur trouvé.</p>
            )}

            {filteredUsers.map(user => (
              <div
                key={user._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded shadow-sm hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-300 mr-4">
                    <Image
                      src={user.avatarUrl || defaultAvatar}
                      alt={`Avatar de ${user.username}`}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{user.username}</p>
                    <p className="text-sm text-gray-600">
                      {user.bio || 'Pas de bio'}
                    </p>
                  </div>
                </div>

                {user._id !== currentUserId && (
                  <button
                    onClick={() => handleFollowToggle(user._id)}
                    className={`px-4 py-2 rounded text-sm font-medium ${
                      followingIds.includes(user._id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {followingIds.includes(user._id) ? 'Se désabonner' : 'Suivre'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>

      <div className="block lg:hidden">
        <Footer />
      </div>
    </div>
  )
}
