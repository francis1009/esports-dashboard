import { createContext } from "react";

export interface ActiveSectionContextProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const ActiveSectionContext = createContext<ActiveSectionContextProps>({
  activeSection: "",
  setActiveSection: () => {},
});
