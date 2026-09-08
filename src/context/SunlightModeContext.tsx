import React, { createContext, useContext, useState, useEffect } from "react";

interface SunlightModeContextType {
  isSunlightMode: boolean;
  toggleSunlightMode: () => void;
  setSunlightMode: (enabled: boolean) => void;
}

const SunlightModeContext = createContext<SunlightModeContextType>({
  isSunlightMode: false,
  toggleSunlightMode: () => {},
  setSunlightMode: () => {},
});

export const SunlightModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSunlightMode, setIsSunlightModeState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("mineramaroc_sunlight_mode");
      return saved === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mineramaroc_sunlight_mode", isSunlightMode ? "true" : "false");
      if (isSunlightMode) {
        document.documentElement.classList.add("sunlight-mode");
      } else {
        document.documentElement.classList.remove("sunlight-mode");
      }
    } catch (e) {
      console.error("Failed to persist sunlight mode", e);
    }
  }, [isSunlightMode]);

  const toggleSunlightMode = () => {
    setIsSunlightModeState((prev) => !prev);
  };

  const setSunlightMode = (enabled: boolean) => {
    setIsSunlightModeState(enabled);
  };

  return (
    <SunlightModeContext.Provider value={{ isSunlightMode, toggleSunlightMode, setSunlightMode }}>
      {children}
    </SunlightModeContext.Provider>
  );
};

export const useSunlightMode = () => useContext(SunlightModeContext);
