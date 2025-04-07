import { DollarSign, Trophy, Eye } from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const navItems = [
    { id: "revenue", label: "Revenue Analysis", icon: DollarSign },
    { id: "viewership", label: "Viewership Trends", icon: Eye },
    { id: "prizePool", label: "Prize Pool Distribution", icon: Trophy },
  ];

  return (
    <>
      {/* Sidebar */}
      <aside
        className="border-r border-gray-800/20 fixed inset-y-0 left-0 z-50 w-64 transition-transform duration-300 transform-translate-x-full
                   md:relative md:translate-x-0 max-md:hidden"
      >
        <div className="p-4">
          <div className="mb-6">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-2">
              Analytics
            </h3>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-md ${
                    activeSection === item.id
                      ? "bg-[#6366f1]/10 text-[#6366f1] font-medium"
                      : "text-gray-400 hover:bg-[#1c2133] hover:text-white"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
