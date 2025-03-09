// src/routes/layout/Layout.component.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen text-white font-sans bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Main Content Outlet */}
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
