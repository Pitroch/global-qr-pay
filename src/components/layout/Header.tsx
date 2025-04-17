
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container px-4 mx-auto flex items-center justify-between h-16">
        {!isHome ? (
          <Link to="/" className="flex items-center text-primary">
            <ArrowLeft className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold text-primary">Global QR Pay</span>
          </Link>
        )}
        
        <div className="flex items-center space-x-2">
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleMenu} className="md:hidden">
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-md md:hidden">
          <nav className="container mx-auto px-4 py-3">
            <ul className="space-y-3">
              <li>
                <Link to="/" className="block py-2 hover:text-primary" onClick={toggleMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/scan" className="block py-2 hover:text-primary" onClick={toggleMenu}>
                  Scan QR
                </Link>
              </li>
              <li>
                <Link to="/history" className="block py-2 hover:text-primary" onClick={toggleMenu}>
                  Transaction History
                </Link>
              </li>
              <li>
                <Link to="/profile" className="block py-2 hover:text-primary" onClick={toggleMenu}>
                  Profile
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};
