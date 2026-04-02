
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <header className={`fixed w-full top-0 z-[50] transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}>
      <div className="container-tight flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/lovable-uploads/logo-name.png"
              alt="Homentor Logo"
              className="h-12"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">

          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-homentor-blue transition-colors font-medium">
              <Link to='/mentors'>Find Tutors</Link>
              <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-lg bg-white shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
              <Link to="/mentors" className="block px-4 py-2 text-gray-700 hover:bg-homentor-lightBlue transition-colors">
                Browse All
              </Link>
              <Link to="/mentors?subject=mathematics" className="block px-4 py-2 text-gray-700 hover:bg-homentor-lightBlue transition-colors">
                Mathematics
              </Link>
              <Link to="/mentors?subject=physics" className="block px-4 py-2 text-gray-700 hover:bg-homentor-lightBlue transition-colors">
                Physics
              </Link>
              <Link to="/mentors?subject=english" className="block px-4 py-2 text-gray-700 hover:bg-homentor-lightBlue transition-colors">
                English
              </Link>
              <Link to="/mentors?mode=online" className="block px-4 py-2 text-gray-700 hover:bg-homentor-lightBlue transition-colors">
                Online Tutoring
              </Link>
            </div>
          </div>

          <Link
            to="/about-us"
            className={`text-gray-700 hover:text-homentor-blue transition-colors font-medium ${location.pathname === '/about' ? 'text-homentor-blue' : ''
              }`}
          >
            About Us
          </Link>
          <Link
            to="/contact-us"
            className={`text-gray-700 hover:text-homentor-blue transition-colors font-medium ${location.pathname === '/about' ? 'text-homentor-blue' : ''
              }`}
          >
            Contact Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {
            localStorage.getItem("usernumber") ?
              <Link
                to="/dashboard/student"
                className="block px-4 py-2 text-homentor-blue hover:bg-homentor-lightBlue rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Parent Dashboard
              </Link>
              :
              localStorage.getItem("mentor") ?
            <Link
              to="/dashboard/mentor"
              className="block px-4 py-2 text-homentor-blue hover:bg-homentor-lightBlue rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Mentor Dashboard
            </Link> :
              <Link to="/login" className="text-homentor-blue hover:text-homentor-darkBlue font-medium transition-colors">
                Log in
              </Link>
          }


          <Link to="/signup">
            <Button className="bg-homentor-blue hover:bg-homentor-darkBlue text-white shadow-soft hover:shadow-hover">
              Join as Mentor
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700 hover:text-homentor-blue transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 shadow-lg animate-scale-up">
          <div className="container-tight space-y-3">
            <Link
              to="/"
              className={`block px-4 py-2 rounded-lg ${location.pathname === '/' ? 'bg-homentor-lightBlue text-homentor-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/mentors"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Find Tutors
            </Link>

            <Link
              to="/about-us"
              className={`block px-4 py-2 rounded-lg ${location.pathname === '/about' ? 'bg-homentor-lightBlue text-homentor-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/contact-us"
              className={`block px-4 py-2 rounded-lg ${location.pathname === '/about' ? 'bg-homentor-lightBlue text-homentor-blue' : 'text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
            </Link>
            <div className="border-t border-gray-100 pt-4 flex flex-col space-y-2 mt-4">
              {
                localStorage.getItem("usernumber") ?
                  <Link
                    to="/dashboard/student"
                    className="block px-4 py-2 text-homentor-blue hover:bg-homentor-lightBlue rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Parent Dashboard
                  </Link> :
                  localStorage.getItem("mentor") ?
                <Link
                  to="/dashboard/mentor"
                  className="block px-4 py-2 text-homentor-blue hover:bg-homentor-lightBlue rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Mentor Dashboard
                </Link> :
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-homentor-blue hover:bg-homentor-lightBlue rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>}
              <Link
                to="/signup"
                className="block px-4 py-2 bg-homentor-blue text-white hover:bg-homentor-darkBlue rounded-lg text-center shadow-soft"
                onClick={() => setIsMenuOpen(false)}
              >
                Join as Mentor
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
