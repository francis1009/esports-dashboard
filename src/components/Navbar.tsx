"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Trophy, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-gray-800/10 animate-fade-in">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[#6366f1]" />
          <Link to="/">EsportsInsight</Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex gap-8">
          <Link
            to="/dashboard"
            className="hover:text-[#6366f1] transition-colors duration-200"
          >
            Dashboard
          </Link>
          <Link
            to="/analytics"
            className="hover:text-[#6366f1] transition-colors duration-200"
          >
            Analytics
          </Link>
          <Link
            to="/about"
            className="hover:text-[#6366f1] transition-colors duration-200"
          >
            About
          </Link>
          <Link
            to="https://github.com/francis1009/esports-dashboard"
            className="hover:text-[#6366f1] transition-colors duration-200"
          >
            <Github className="h-5 w-5" />
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#131825] border-t border-gray-800/20 py-4 px-4">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/dashboard"
              className="hover:text-[#6366f1] transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className="hover:text-[#6366f1] transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              to="/about"
              className="hover:text-[#6366f1] transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="https://github.com/francis1009/esports-dashboard"
              className="hover:text-[#6366f1] transition-colors duration-200"
            >
              <Github className="h-5 w-5" />
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
