import logo from '../assets/breezy.png';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-lg font-semibold">Breezy</span>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Breezy. Tous droits réservés.</p>
      </div>
    </footer>
  );
}