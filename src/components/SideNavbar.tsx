// src/components/SideNavbar.tsx
import React, { useState, useContext } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ActiveSectionContext } from "../context/ActiveSectionContext";

interface NavItem {
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: "Introduction", id: "introduction" },
  { label: "Sponsorship", id: "sponsorship" },
  { label: "Prize Disparities", id: "prize-disparities" },
  { label: "Viewership", id: "viewership" },
];

const SideNavbar: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const { activeSection } = useContext(ActiveSectionContext);

  const toggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  return (
    <nav
      className={`sticky top-0 h-screen bg-slate-800 text-white transition-all duration-300 ease-in-out relative overflow-hidden ${
        collapsed ? "w-64" : "w-16"
      }`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={toggleCollapse}
        className={`absolute top-4 bg-slate-700 text-white p-1 rounded-full z-10 transition-all duration-300 ease-in-out ${
          collapsed ? "right-2" : "left-1/2 -translate-x-1/2"
        }`}
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>

      {/* Navigation Items */}
      <ul className="flex flex-col space-y-4 p-4 mt-16">
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`flex items-center transition-colors duration-300 ${
                activeSection === item.id
                  ? "text-indigo-300"
                  : "text-white hover:text-indigo-300"
              }`}
            >
              {/* When expanded (collapsed=true), show text with a fade transition */}
              {collapsed && (
                <span className="ml-2 transition-opacity duration-300 text-nowrap">
                  {item.label}
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SideNavbar;
