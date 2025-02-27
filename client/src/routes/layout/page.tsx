// src/routes/layout/Layout.component.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import HoverNavbar from "../../components/HoverNavbar";

const Layout: React.FC = () => {
  const [showNavbar, setShowNavbar] = useState<boolean>(false);

  const handleMouseEnter = () => {
    setShowNavbar(true);
  };

  const handleMouseLeave = () => {
    setShowNavbar(false);
  };

  return (
    <div className="h-screen w-screen relative">
      {/* Hoverable Navbar Container */}
      <div
        className="absolute top-0 left-0 right-0 h-16 z-50"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <HoverNavbar
          className={`transition-transform duration-300 ${
            showNavbar ? "translate-y-0" : "-translate-y-full"
          }`}
        />
      </div>
      {/* Main Content Outlet */}
      <Outlet />
    </div>
  );
};

export default Layout;
