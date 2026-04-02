
import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, fullWidth = false }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen overflow-hidden ">
      <Navbar />
      <main className={`flex-grow ${fullWidth ? '' : 'pt-4 pb-12'}`} >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
