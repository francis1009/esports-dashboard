import { useEffect } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { Sidebar } from "../../components/Sidebar";
import Overview from "./overview";
import Viewership from "./viewership";

const Dashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useLocalStorage(
    "activeSection",
    "overview"
  );

  useEffect(() => {
    return () => {
      localStorage.removeItem("activeSection");
    };
  }, []);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "revenue":
        return <Overview />;
      case "viewership":
        return <Viewership />;
      case "tournament":
        return <Overview />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      {/* Main content container */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop view */}
        <div className="hidden md:block">{renderActiveComponent()}</div>

        {/* Mobile view */}
        <div className="block md:hidden space-y-8">
          <Overview />
          {/* <Revenue /> */}
          <Viewership />
          {/* <Tournament /> */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
