import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SvgXml } from "react-native-svg";
import { svgXmlData } from "@/assets/svgs/sample";
import { useGlobalState } from "@/app/context/GlobalState";
import { useEffect, useRef } from "react";
import { BlurView } from "expo-blur";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { state, setState, incrementStat } = useGlobalState();

  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);
  const translateY = useSharedValue(50);
  const opacity = useSharedValue(0);

  useEffect(() => {
    incrementStat("views");
    const interval = setInterval(() => {
      setState((prev) => ({
        ...prev,
        statistics: {
          ...prev.statistics,
          interactions: prev.statistics.interactions + 1,
        },
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 10 });
    rotation.value = withRepeat(
      withSequence(
        withTiming(360, { duration: 2000 }),
        withTiming(0, { duration: 0 })
      ),
      -1
    );
    translateY.value = withSpring(0, { damping: 15 });
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: state.theme.backgroundColor },
      ]}
    >
      <BlurView
        intensity={95}
        tint={state.theme.isDark ? "dark" : "light"}
        style={[styles.statsCard, { width: width - 40 }]}
      >
        <Text style={[styles.statsText, { color: state.theme.textColor }]}>
          Item #{id}
        </Text>
        <Text style={[styles.statsText, { color: state.theme.textColor }]}>
          Views: {state.statistics.views}
        </Text>
      </BlurView>

      <Animated.View style={[styles.svgContainer, animatedStyle]}>
        <SvgXml
          xml={svgXmlData}
          width={width * 0.8}
          height={width * 0.8}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
        />
      </Animated.View>

      <BlurView
        intensity={95}
        tint={state.theme.isDark ? "dark" : "light"}
        style={[styles.bottomCard, { width: width - 40 }]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[
            styles.button,
            {
              backgroundColor: state.theme.primaryColor,
              padding: state.userPreferences.spacing,
            },
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              { fontSize: state.userPreferences.fontSize },
            ]}
          >
            Go Back
          </Text>
        </Pressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  svgContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  statsCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    overflow: "hidden",
  },
  bottomCard: {
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    overflow: "hidden",
  },
  statsText: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 5,
  },
  button: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
