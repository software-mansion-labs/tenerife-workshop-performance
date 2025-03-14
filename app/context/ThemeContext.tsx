import React, { createContext, useContext, useState, useCallback } from "react";

type Theme = {
  isDark: boolean;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
};

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const defaultTheme: Theme = {
  isDark: false,
  backgroundColor: "#ffffff",
  textColor: "#000000",
  primaryColor: "#007AFF",
};

const darkTheme: Theme = {
  isDark: true,
  backgroundColor: "#000000",
  textColor: "#ffffff",
  primaryColor: "#0A84FF",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev.isDark ? defaultTheme : darkTheme));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
