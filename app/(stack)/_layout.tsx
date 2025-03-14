import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Animated } from "react-native";

export default function StackLayout() {
  // Unnecessary state that will cause re-renders
  const [isDarkMode, setIsDarkMode] = useState(false);
  const animation = new Animated.Value(0);

  // Unnecessary effect that runs on every render
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "My Awesome App",
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: "Explore",
        }}
      />
      <Stack.Screen
        name="detail"
        options={{
          title: "Detail View",
          // Unnecessary complex header styling that could cause performance issues
          headerStyle: {
            backgroundColor: isDarkMode ? "#000" : "#fff",
            borderBottomWidth: 2,
            borderBottomColor: "#FF5733",
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          headerTitleStyle: {
            color: isDarkMode ? "#fff" : "#000",
            fontWeight: "bold",
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: 1,
          },
        }}
      />
    </Stack>
  );
}
