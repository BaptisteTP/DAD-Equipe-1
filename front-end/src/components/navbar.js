import React from 'react';

export default function Navbar() {
  return (
    <aside className="flex flex-col justify-between w-64 h-screen p-6 bg-white border-r border-gray-200">
      <div>
        <div className="flex flex-col mb-10">
          <div className="w-16 h-16 rounded-full border-2 border-black flex items-center justify-center ">
            <UserIcon className="w-8 h-8 text-black" />
          </div>
          <span className="mt-2 font-semibold ml-3">User</span>
        </div>

        <nav className="space-y-6 pl-2">
          <NavItem icon={<UserIcon className="w-5 h-5 text-gray-600" />} label="Profile" />
          <NavItem icon={<HomeIcon className="w-5 h-5 text-gray-600" />} label="Home" />
          <NavItem icon={<LikeIncon className="w-5 h-5 text-gray-600" />} label="Like" />
          <NavItem icon={<SearchIcon className="w-5 h-5 text-gray-600" />} label="Search" />
          <NavItem icon={<NotifyIcon className="w-5 h-5 text-gray-600" />} label="Notif" />
        </nav>
      </div>

      <div className="text-sm text-gray-800 pl-2 cursor-pointer hover:underline">
        Help Center
      </div>
    </aside>
  );
}

function NavItem({ icon, label }) {
  return (
    <div className="flex items-center space-x-3 text-gray-700 cursor-pointer hover:text-black">
      {icon}
      <span>{label}</span>
    </div>
  );
}

function LikeIncon(props) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
        </svg>

    )
}

function UserIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function SearchIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function HomeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}

function NotifyIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
    </svg>
  );
}
