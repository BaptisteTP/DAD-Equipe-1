'use client';

import React, { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

/**
 * Affiche la liste des utilisateurs suivis (sidebar).
 */
export default function UserList() {
  const [following, setFollowing] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFollowing() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Vous devez être connecté.');
          return;
        }

        // Vérification simple du token
        try {
          jwtDecode(token);
        } catch {
          localStorage.removeItem('token');
          setError('Token invalide, reconnectez-vous.');
          return;
        }

        const { userId } = jwtDecode(token);
        if (!userId) {
          setError('ID utilisateur introuvable dans le token.');
          return;
        }

        const res = await fetch(`http://localhost:4001/api/follows/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`);
        }
        const data = await res.json();
        setFollowing(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchFollowing();
  }, []);

  return (
      <aside className="hidden lg:block w-64 p-4 bg-gray-50 border-l border-gray-200">
        <h2 className="text-lg font-semibold mb-4">Abonnements</h2>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {!error && following.length === 0 && (
            <p className="text-gray-500 text-sm">Aucun abonnement</p>
        )}
        <ul className="space-y-3">
          {following.map(user => (
              <li key={user._id} className="flex items-center space-x-3">
                <img
                    src={user.avatarUrl || '/default-avatar.png'}
                    alt={`Avatar de ${user.username}`}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <span className="font-medium">{user.username}</span>
              </li>
          ))}
        </ul>
      </aside>
  );
}
