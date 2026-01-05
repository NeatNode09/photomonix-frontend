import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between bg-slate-900/90 text-slate-100 rounded-full shadow-lg shadow-black/30 border border-slate-800 px-4 sm:px-6 lg:px-8 h-20 backdrop-blur">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-xl md:text-2xl font-bold text-sky-300 hover:text-emerald-300 transition-colors"
            >
              Photomonix
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-15">
            <Link
              to="/about"
              className="text-slate-200 hover:text-white hover:underline px-3 py-2 text-sm font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/"
              className="relative inline-flex items-center justify-center h-16 w-16 rounded-full ring-4 ring-sky-500/70 ring-offset-4 ring-offset-slate-900 bg-slate-950 shadow-md hover:shadow-lg transition-shadow mx-2"
              aria-label="Photomonix home"
            >
              <span
                className="absolute inset-0 rounded-full border border-emerald-400/70"
                aria-hidden="true"
              />
              <img
                src="/logo.svg"
                alt="Photomonix Logo"
                className="h-10 w-10"
              />
            </Link>
            <Link
              to="/contact"
              className="text-slate-200 hover:text-white hover:underline px-3 py-2 text-sm font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-slate-200 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full bg-white/10 text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-white/20 transition-colors border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-emerald-500 text-white px-5 py-2 text-sm font-semibold shadow-sm hover:bg-emerald-400 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Link
              to="/"
              className="relative inline-flex items-center justify-center h-12 w-12 rounded-full ring-2 ring-sky-500/70 ring-offset-2 ring-offset-slate-900 bg-slate-950 shadow-md"
              aria-label="Photomonix home"
            >
              <img src="/logo.svg" alt="Photomonix Logo" className="h-8 w-8" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-full text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-expanded={mobileMenuOpen ? "true" : "false"}
          >
            <span className="sr-only">Toggle main menu</span>
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

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur">
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link
              to="/about"
              className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left text-white bg-white/10 hover:bg-white/20 block px-4 py-2 rounded-full text-sm font-semibold transition-colors border border-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
