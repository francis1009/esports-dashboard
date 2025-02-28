// src/routes/dashboard/Dashboard.tsx
import React from "react";
import ActiveSectionProvider from "../../context/ActiveSectionProvider";
import SideNavbar from "../../components/SideNavbar";
import Introduction from "../../components/Introduction";
import Sponsorship from "../../components/Sponsorship";
import PrizeDisparities from "../../components/PrizeDisparities";
import Viewership from "../../components/Viewership";

const Dashboard: React.FC = () => {
  return (
    <ActiveSectionProvider>
      <div className="flex">
        <SideNavbar />
        <div className="flex-1 bg-slate-900 text-gray-100">
          <Introduction />
          <Sponsorship />
          <PrizeDisparities />
          <Viewership />
        </div>
      </div>
    </ActiveSectionProvider>
  );
};

export default Dashboard;
