import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name[0].toUpperCase();
  };

  const [avatarError, setAvatarError] = useState(false);
  const handleAvatarError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    setAvatarError(true);
  };

  return (
    <nav className="py-3 sticky top-0 z-50">
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

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#about"
              className="text-slate-200 hover:text-white hover:underline px-3 py-2 text-sm font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </a>
            <Link
              to="/"
              className="relative inline-flex items-center justify-center h-16 w-16 rounded-full ring-4 ring-sky-500/70 ring-offset-4 ring-offset-slate-900 bg-slate-950 shadow-md hover:shadow-lg transition-shadow"
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
            <a
              href="#contact"
              className="text-slate-200 hover:text-white hover:underline px-3 py-2 text-sm font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </a>
          </div>

          <div className="hidden md:flex items-center gap-5">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-transparent border-0 p-0"
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                >
                  {user?.avatarUrl && !avatarError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={handleAvatarError}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700/70"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 font-semibold text-sm border border-slate-700/70">
                      {getUserInitials()}
                    </div>
                  )}
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-slate-800 rounded-lg shadow-xl border border-slate-700 py-2 z-50">
                    <div className="px-4 py-3 border-b border-slate-700 flex flex-col items-center">
                      {user?.avatarUrl && !avatarError ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={handleAvatarError}
                          className="w-16 h-16 rounded-full object-cover border border-slate-700/70 mb-3"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 font-bold text-2xl border border-slate-700/70 mb-3">
                          {getUserInitials()}
                        </div>
                      )}
                      <p className="text-white font-semibold text-sm truncate w-full text-center">
                        {user?.name}
                      </p>
                      <p className="text-slate-400 text-xs truncate w-full text-center mt-1">
                        {user?.email}
                      </p>
                      <div className="mt-2 px-3 py-1.5 bg-slate-700/50 rounded-md">
                        <p className="text-slate-300 text-xs text-center">
                          Tokens Used:{" "}
                          <span className="font-semibold text-emerald-400">
                            {user?.tokensUsed || 0}
                          </span>
                        </p>
                        <p className="text-slate-300 text-xs text-center mt-0.5">
                          Remaining:{" "}
                          <span className="font-semibold text-sky-400">
                            {user?.tokensRemaining || 0}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-700 transition-colors text-left"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
            <a
              href="#about"
              className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              About
            </a>
            <a
              href="#contact"
              className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Contact
            </a>
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-slate-800 rounded-lg mb-2 flex flex-col items-center">
                  {user?.avatarUrl && !avatarError ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={handleAvatarError}
                      className="w-16 h-16 rounded-full object-cover border border-slate-700/70 mb-3"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-100 font-bold text-2xl border border-slate-700/70 mb-3">
                      {getUserInitials()}
                    </div>
                  )}
                  <p className="text-white font-semibold text-sm truncate w-full text-center">
                    {user?.name}
                  </p>
                  <p className="text-slate-400 text-xs truncate w-full text-center mt-1">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  className="text-slate-200 hover:text-white block px-3 py-2 rounded-lg text-base font-medium transition-colors hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
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
