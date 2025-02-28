// src/routes/layout/Layout.component.tsx
import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="h-screen relative">
      {/* Main Content Outlet */}
      <Outlet />
    </div>
  );
};

export default Layout;
