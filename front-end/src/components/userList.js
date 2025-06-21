'use client'

import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

export default function UserList() {
  const [followingUsers, setFollowingUsers] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return

    let userId
    try {
      const decoded = jwtDecode(token)
      userId = decoded.userId
    } catch (err) {
      console.error('Token invalide', err)
      return
    }

    const fetchFollowing = async () => {
      try {
        const res = await fetch(`http://localhost:4001/api/follow/${userId}/following`, {
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
              <UserIcon className="w-6 h-6 text-gray-600" />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

function UserIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501
         20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12
         21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    </svg>
  )
}
