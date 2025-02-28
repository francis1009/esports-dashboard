import React, { useState, ReactNode } from "react";
import { ActiveSectionContext } from "./ActiveSectionContext";

interface ActiveSectionProviderProps {
  children: ReactNode;
}

const ActiveSectionProvider: React.FC<ActiveSectionProviderProps> = ({
  children,
}) => {
  const [activeSection, setActiveSection] = useState<string>("introduction");

  return (
    <ActiveSectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ActiveSectionContext.Provider>
  );
};

export default ActiveSectionProvider;
