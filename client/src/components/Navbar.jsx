import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import chitchat from "../assets/chitchat.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-sm bg-white/90" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex justify-between items-center">
          {/* Logo - Smaller on mobile */}
          <div className="flex items-center">
            <img
              src={chitchat}
              alt="Chitchat Logo"
              className="h-10 w-auto md:h-12"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              HOME
            </a>

            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base"
            >
              ABOUT US
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            <button className="px-3 py-1.5 lg:px-4 lg:py-2 text-gray-700 hover:text-blue-600 transition-colors font-medium text-sm lg:text-base">
              Sign in
            </button>
            <button className="px-3 py-1.5 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm lg:text-base">
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-1.5 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - No blur background */}
        {isOpen && (
          <div className="md:hidden bg-white mt-2 pb-3">
            <nav className="flex flex-col space-y-2">
              <a
                href="#"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </a>
              <a
                href="#"
                className="px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                ABOUT US
              </a>
            </nav>
            <div className="mt-3 pt-3 border-t border-gray-200 flex flex-col space-y-2">
              <button
                className="w-full px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors text-left text-sm"
                onClick={() => setIsOpen(false)}
              >
                Sign in
              </button>
              <button
                className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
