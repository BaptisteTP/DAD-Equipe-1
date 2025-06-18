import logo from '@/assets/breezy.svg';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50">
      <nav className="flex justify-around items-center py-3 text-gray-700">
        <button className="flex flex-col items-center hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-6 h-6 mb-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12
              M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875
              c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125
              1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            />
          </svg>
        </button>

        <button className="flex flex-col items-center hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-6 h-6 mb-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0
              5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>

        <button className="flex flex-col items-center hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
            className="w-6 h-6 mb-1"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 0 0
              5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6
              6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312
              6.022c1.733.64 3.56 1.085 5.455 1.31m5.714
              0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3
              0 1 1-5.714 0"
            />
          </svg>
        </button>
      </nav>
    </footer>
  );
}
