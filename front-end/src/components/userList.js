'use client'

import { useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

export default function UserList() {
  const [followingUsers, setFollowingUsers] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    let userId
    try {
      const decoded = jwtDecode(token)
      userId = decoded._id
    } catch (err) {
      console.error('Token invalide', err)
      return
    }

    const fetchFollowing = async () => {
      try {
        const res = await fetch(`http://localhost:4001/api/follows/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error('Erreur lors de la récupération des abonnements')
        const data = await res.json()
        setFollowingUsers(data)
      } catch (err) {
        console.error('Erreur API:', err)
      }
    }

    fetchFollowing()
  }, [])

  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 bg-gray-100 border-l border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Abonnements</h2>
      {followingUsers.length === 0 ? (
        <p className="text-sm text-gray-500">Aucun abonnement</p>
      ) : (
        <ul className="space-y-3">
          {followingUsers.map((user) => (
            <li key={user._id} className="flex items-center space-x-3 text-gray-800">
              <img
                src={user.avatarUrl || '/default-avatar.png'} // chemin vers une image par défaut à adapter
                alt={`Avatar de ${user.username}`}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
