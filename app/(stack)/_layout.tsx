import { Stack } from "expo-router";
import React from "react";

export default function StackLayout() {
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
            backgroundColor: "#fff",
            borderBottomWidth: 2,
            borderBottomColor: "#FF5733",
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
          },
          headerTitleStyle: {
            color: "#000",
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
