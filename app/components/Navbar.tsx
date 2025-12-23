import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-950 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              <img src="/logo.svg" alt="Photomonix Logo" className="h-8 w-8" />
              Photomonix
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            <a
              href="https://www.neatnode.tech/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white hover:underline px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            >
              About
            </a>
            <a
              href="https://www.neatnode.tech/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white hover:underline px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
            >
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="hidden md:block text-gray-300 hover:text-white hover:underline px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:block bg-white/10 hover:bg-white/20 text-white hover:underline px-5 py-2.5 rounded-lg text-sm font-medium transition-all border border-white/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block text-gray-300 hover:text-white hover:underline px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white hover:underline px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
                >
                  Get Started
                </Link>
              </>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900/50 backdrop-blur-xl">
            <a
              href="https://www.neatnode.tech/about"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white hover:underline hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
            >
              About
            </a>
            <a
              href="https://www.neatnode.tech/contact"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white hover:underline hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
            >
              Contact
            </a>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-white hover:underline hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-gray-300 hover:text-white hover:underline hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-white hover:underline hover:bg-white/5 block px-3 py-2 rounded-lg text-base font-medium transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
