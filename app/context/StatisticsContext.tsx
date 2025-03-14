import React, { createContext, useContext, useState, useCallback } from "react";

type Statistics = {
  views: number;
  clicks: number;
  interactions: number;
};

type StatisticsContextType = {
  statistics: Statistics;
  incrementStat: (stat: keyof Statistics) => void;
};

const defaultStatistics: Statistics = {
  views: 0,
  clicks: 0,
  interactions: 0,
};

const StatisticsContext = createContext<StatisticsContextType | undefined>(
  undefined
);

export function StatisticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [statistics, setStatistics] = useState<Statistics>(defaultStatistics);

  const incrementStat = useCallback((stat: keyof Statistics) => {
    setStatistics((prev) => ({
      ...prev,
      [stat]: prev[stat] + 1,
    }));
  }, []);

  return (
    <StatisticsContext.Provider value={{ statistics, incrementStat }}>
      {children}
    </StatisticsContext.Provider>
  );
}

export function useStatistics() {
  const context = useContext(StatisticsContext);
  if (context === undefined) {
    throw new Error("useStatistics must be used within a StatisticsProvider");
  }
  return context;
}
