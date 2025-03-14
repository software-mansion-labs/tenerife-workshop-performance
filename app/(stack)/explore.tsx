import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  Animated,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { BlurView } from "expo-blur";

import { SvgXml } from "react-native-svg";
import { svgXmlData } from "@/assets/svgs/sample";
import { useGlobalState } from "@/app/context/GlobalState";

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);
  const animations = useRef(
    Array.from({ length: 200 }, () => new Animated.Value(1))
  ).current;

  const { state, setState, incrementStat, updatePreferences } =
    useGlobalState();

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          views: prev.statistics.views + 1,
        },
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handlePress = (index: number) => {
    incrementStat("clicks");
    incrementStat("interactions");

    updatePreferences({
      fontSize: Math.random() > 0.5 ? 16 : 18,
      spacing: Math.random() > 0.5 ? 8 : 10,
    });

    if (pressedIndex !== null) {
      Animated.spring(animations[pressedIndex], {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }

    setPressedIndex(index);
    Animated.spring(animations[index], {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      router.push(`/detail?id=${index}`);
    }, 300);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          paddingTop: 15,
          paddingBottom: 20,
          backgroundColor: state.theme.backgroundColor,
        },
      ]}
      contentContainerStyle={{ paddingBottom: 30 }}
    >
      <BlurView
        intensity={95}
        tint={state.theme.isDark ? "dark" : "light"}
        style={styles.statsContainer}
      >
        <Text style={[styles.statsText, { color: state.theme.textColor }]}>
          Views: {state.statistics.views}
        </Text>
        <Text style={[styles.statsText, { color: state.theme.textColor }]}>
          Interactions: {state.statistics.interactions}
        </Text>
      </BlurView>

      <Text
        style={[
          styles.buttonText,
          {
            textAlign: "center",
            color: state.theme.primaryColor,
            textTransform: "uppercase",
            letterSpacing: 1.2,
            marginBottom: 15,
            fontSize: state.userPreferences.fontSize,
          },
        ]}
      >
        Stock Chart with SVG Dashboard
      </Text>
      {Array.from({ length: 200 }, (_, index) => (
        <View
          key={index}
          style={{
            backgroundColor: index % 2 === 0 ? "#f8f8f8" : "#ffffff",
            borderRadius: state.userPreferences.borderRadius,
            marginHorizontal: state.userPreferences.spacing,
            paddingVertical: 8,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Pressable
            onPress={() => handlePress(index)}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Animated.View
              style={[
                styles.svgContainer,
                {
                  transform: [
                    { scale: animations[index] },
                    {
                      translateY: animations[index].interpolate({
                        inputRange: [0.8, 1],
                        outputRange: [5, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <SvgXml
                xml={svgXmlData}
                width={width * 0.5}
                height={width * 0.5}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              />
            </Animated.View>
          </Pressable>
          <View
            style={[
              styles.separator,
              {
                backgroundColor: index % 2 === 0 ? "#e0e0e0" : "#d0d0d0",
                height: 0.8,
                marginHorizontal: state.userPreferences.spacing * 2,
              },
            ]}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontWeight: "bold",
  },
  separator: {
    marginHorizontal: 20,
  },
  statsContainer: {
    margin: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    overflow: "hidden",
  },
  statsText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
