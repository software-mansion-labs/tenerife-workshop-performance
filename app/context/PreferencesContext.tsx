import React, { createContext, useContext, useState, useCallback } from "react";

type UserPreferences = {
  fontSize: number;
  spacing: number;
  borderRadius: number;
};

type PreferencesContextType = {
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
};

const defaultPreferences: UserPreferences = {
  fontSize: 16,
  spacing: 8,
  borderRadius: 8,
};

const PreferencesContext = createContext<PreferencesContextType | undefined>(
  undefined
);

export function PreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  const updatePreferences = useCallback(
    (newPrefs: Partial<UserPreferences>) => {
      setPreferences((prev) => ({
        ...prev,
        ...newPrefs,
      }));
    },
    []
  );

  return (
    <PreferencesContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
