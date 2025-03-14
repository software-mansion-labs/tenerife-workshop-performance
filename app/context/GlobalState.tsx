import React, { createContext, useContext, useState, useEffect } from "react";
import { Animated } from "react-native";

// Bad practice: Large interface with many properties that will cause re-renders
interface GlobalState {
  theme: {
    isDark: boolean;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
  };
  animations: {
    scale: Animated.Value;
    opacity: Animated.Value;
    rotation: Animated.Value;
  };
  userPreferences: {
    fontSize: number;
    fontFamily: string;
    spacing: number;
    borderRadius: number;
    showAnimations: boolean;
  };
  statistics: {
    views: number;
    clicks: number;
    interactions: number;
    lastUpdated: Date;
  };
}

// Bad practice: Default values that will be recreated on every render
const defaultState: GlobalState = {
  theme: {
    isDark: false,
    primaryColor: "#FF5733",
    secondaryColor: "#33FF57",
    textColor: "#000000",
    backgroundColor: "#FFFFFF",
  },
  animations: {
    scale: new Animated.Value(1),
    opacity: new Animated.Value(1),
    rotation: new Animated.Value(0),
  },
  userPreferences: {
    fontSize: 16,
    fontFamily: "System",
    spacing: 8,
    borderRadius: 4,
    showAnimations: true,
  },
  statistics: {
    views: 0,
    clicks: 0,
    interactions: 0,
    lastUpdated: new Date(),
  },
};

// Bad practice: Context without proper type safety
const GlobalStateContext = createContext<{
  state: GlobalState;
  setState: React.Dispatch<React.SetStateAction<GlobalState>>;
  updateTheme: (isDark: boolean) => void;
  updatePreferences: (prefs: Partial<GlobalState["userPreferences"]>) => void;
  incrementStat: (stat: keyof GlobalState["statistics"]) => void;
}>({
  state: defaultState,
  setState: () => {},
  updateTheme: () => {},
  updatePreferences: () => {},
  incrementStat: () => {},
});

// Bad practice: Provider with unnecessary re-renders and complex logic
export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<GlobalState>(defaultState);

  // Bad practice: Effect that runs on every render and updates state
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          lastUpdated: new Date(),
        },
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Bad practice: Complex update functions that cause unnecessary re-renders
  const updateTheme = (isDark: boolean) => {
    setState((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        isDark,
        textColor: isDark ? "#FFFFFF" : "#000000",
        backgroundColor: isDark ? "#000000" : "#FFFFFF",
      },
    }));
  };

  const updatePreferences = (
    prefs: Partial<GlobalState["userPreferences"]>
  ) => {
    setState((prev) => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        ...prefs,
      },
    }));
  };

  const incrementStat = (stat: keyof GlobalState["statistics"]) => {
    setState((prev) => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [stat]: prev.statistics[stat] + 1,
      },
    }));
  };

  // Bad practice: Complex value object that will cause re-renders
  const value = {
    state,
    setState,
    updateTheme,
    updatePreferences,
    incrementStat,
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

// Bad practice: Hook that doesn't memoize its return value
export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
}
