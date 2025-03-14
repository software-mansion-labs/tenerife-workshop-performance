import { Stack } from "expo-router";
import { ThemeProvider } from "./context/ThemeContext";
import { PreferencesProvider } from "./context/PreferencesContext";
import { StatisticsProvider } from "./context/StatisticsContext";

export default function Layout() {
  return (
    <ThemeProvider>
      <PreferencesProvider>
        <StatisticsProvider>
          <Stack>
            <Stack.Screen
              name="(stack)"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </StatisticsProvider>
      </PreferencesProvider>
    </ThemeProvider>
  );
}
