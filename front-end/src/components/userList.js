import React from 'react';

// Liste des utilisateurs (à remplacer plus tard par une vraie source)
const users = ['Alice', 'Bob', 'Charlie', 'Diane'];

export default function UserList() {
  return (
    <aside className="hidden lg:flex flex-col w-64 p-4 bg-gray-100 border-l border-gray-300">
      <h2 className="text-lg font-semibold mb-4">Utilisateurs</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li key={user} className="flex items-center space-x-3 text-gray-800">
            <UserIcon className="w-6 h-6 text-gray-600" />
            <span>{user}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// Icône utilisateur
function UserIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
         viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501
               20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12
               21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}
