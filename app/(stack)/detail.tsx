import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image } from "expo-image";
import { useEffect, useCallback, memo, useState } from "react";
import { BlurView } from "expo-blur";
import { useTheme } from "@/app/context/ThemeContext";
import { usePreferences } from "@/app/context/PreferencesContext";
import { useStatistics } from "@/app/context/StatisticsContext";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from "react-native-reanimated";

const StatsCard = memo(
  ({
    views,
    id,
    theme,
    width,
  }: {
    views: number;
    id: string;
    theme: any;
    width: number;
  }) => (
    <BlurView
      intensity={95}
      tint={theme.isDark ? "dark" : "light"}
      style={[styles.statsCard, { width: width - 40 }]}
    >
      <Text style={[styles.statsText, { color: theme.textColor }]}>
        Item #{id}
      </Text>
      <Text style={[styles.statsText, { color: theme.textColor }]}>
        Views: {views}
      </Text>
    </BlurView>
  )
);

const AnimatedImage = memo(
  ({ width, animatedStyle }: { width: number; animatedStyle: any }) => (
    <Animated.View style={[styles.svgContainer, animatedStyle]}>
      <Image
        source={require("@/assets/images/sample.svg")}
        style={{
          width: width * 0.98,
          height: width * 1.3,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25,
          shadowRadius: 10,
        }}
        cachePolicy="memory-disk"
        contentFit="contain"
        transition={300}
      />
    </Animated.View>
  )
);

const ActionButton = memo(
  ({
    onPress,
    theme,
    preferences,
    label,
  }: {
    onPress: () => void;
    theme: any;
    preferences: any;
    label: string;
  }) => (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: theme.primaryColor,
          padding: preferences.spacing,
          marginVertical: 10,
        },
      ]}
    >
      <Text style={[styles.buttonText, { fontSize: preferences.fontSize }]}>
        {label}
      </Text>
    </Pressable>
  )
);

const BackButton = memo(
  ({
    onPress,
    theme,
    preferences,
    width,
  }: {
    onPress: () => void;
    theme: any;
    preferences: any;
    width: number;
  }) => (
    <BlurView
      intensity={95}
      tint={theme.isDark ? "dark" : "light"}
      style={[styles.bottomCard, { width: width - 40 }]}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.button,
          {
            backgroundColor: theme.primaryColor,
            padding: preferences.spacing,
          },
        ]}
      >
        <Text style={[styles.buttonText, { fontSize: preferences.fontSize }]}>
          Go Back
        </Text>
      </Pressable>
    </BlurView>
  )
);

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { preferences } = usePreferences();
  const { statistics, incrementStat } = useStatistics();
  const [isFlipped, setIsFlipped] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    incrementStat("views");
  }, [incrementStat]);

  const handleFlip = useCallback(() => {
    incrementStat("interactions");
    setIsFlipped((prev) => !prev);

    // Animate the flip with standard rotation
    rotate.value = withSpring(isFlipped ? 0 : 180, {
      damping: 12,
      stiffness: 90,
    });
  }, [isFlipped, rotate, incrementStat]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.backgroundColor }]}
    >
      <StatsCard
        views={statistics.views}
        id={id as string}
        theme={theme}
        width={width}
      />

      <AnimatedImage width={width} animatedStyle={animatedStyle} />

      <View style={styles.buttonsContainer}>
        <ActionButton
          onPress={handleFlip}
          theme={theme}
          preferences={preferences}
          label={`Flip the stock ${isFlipped ? "back" : ""}`}
        />
      </View>

      <BackButton
        onPress={handleBack}
        theme={theme}
        preferences={preferences}
        width={width}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  svgContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonsContainer: {
    width: "80%",
    alignItems: "center",
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
