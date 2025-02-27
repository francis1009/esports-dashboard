import React from "react";
import { Link } from "react-router-dom";

interface NavbarProps {
  className?: string;
}

const HoverNavbar: React.FC<NavbarProps> = ({ className = "" }) => {
  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <nav className={`bg-slate-800 text-gray-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-700 hover:text-indigo-300 transition duration-150 ease-in-out"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HoverNavbar;
