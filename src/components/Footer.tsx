import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Github } from 'lucide-react';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">  
        <p className="text-gray-300 text-sm">
            &copy; {year} TestHub. Mady by Batutov Egor to course paper.
          </p>
          <p className="text-gray-300 text-sm flex items-center mt-4 md:mt-0">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in 2025
          </p>
      </div>
    </footer>
  );
};

export default Footer;