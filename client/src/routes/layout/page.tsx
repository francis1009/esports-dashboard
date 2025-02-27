import React from "react";
import { Link, Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center border-b border-gray-700 text-xl font-bold">
          Esports Dashboard
        </div>
        <nav className="flex-1">
          <ul>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <Link to="/" className="block w-full">
                Home
              </Link>
            </li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer">
              <Link to="/dashboard" className="block w-full">
                Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-4">
          <h1 className="text-xl font-semibold">Dashboard Header</h1>
        </header>

        {/* Content rendered based on the current route */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
