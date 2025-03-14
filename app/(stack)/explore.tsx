import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState, useCallback, memo, useMemo } from "react";
import { BlurView } from "expo-blur";
import { Image } from "expo-image";
import { useTheme } from "@/app/context/ThemeContext";
import { usePreferences } from "@/app/context/PreferencesContext";
import { useStatistics } from "@/app/context/StatisticsContext";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withSequence,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const StatsDisplay = memo(
  ({
    views,
    interactions,
    theme,
  }: {
    views: number;
    interactions: number;
    theme: any;
  }) => (
    <BlurView
      intensity={95}
      tint={theme.isDark ? "dark" : "light"}
      style={styles.statsContainer}
    >
      <Text style={[styles.statsText, { color: theme.textColor }]}>
        Views: {views}
      </Text>
      <Text style={[styles.statsText, { color: theme.textColor }]}>
        Interactions: {interactions}
      </Text>
    </BlurView>
  )
);

const ChartItem = memo(
  ({
    index,
    width,
    theme,
    preferences,
    onPress,
  }: {
    index: number;
    width: number;
    theme: any;
    preferences: any;
    onPress: (index: number) => void;
  }) => {
    // Scale animation value
    const scale = useSharedValue(1);
    const translateY = useSharedValue(0);
    // Track if the item is expanded
    const [isExpanded, setIsExpanded] = useState(false);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
      zIndex: scale.value > 1 ? 10 : 1,
    }));

    // Handle tap for navigation
    const handlePress = () => {
      // If expanded, shrink back instead of navigating
      if (isExpanded) {
        scale.value = withSpring(1, { damping: 10 });
        setIsExpanded(false);
        return;
      }

      // Regular tap animation and navigation
      scale.value = withSequence(
        withSpring(0.9, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
      translateY.value = withSequence(
        withSpring(5, { damping: 10 }),
        withSpring(0, { damping: 10 })
      );
      onPress(index);
    };

    // Handle long press for 2x scaling
    const handleLongPress = () => {
      incrementStat("interactions");

      // Toggle expanded state
      if (!isExpanded) {
        scale.value = withSpring(2, { damping: 15 });
        setIsExpanded(true);
      } else {
        scale.value = withSpring(1, { damping: 10 });
        setIsExpanded(false);
      }
    };

    // Helper to increment stat from animated callbacks
    const { incrementStat: incrementStatContext } = useStatistics();
    const incrementStat = (stat: "views" | "clicks" | "interactions") => {
      incrementStatContext(stat);
    };

    return (
      <View
        style={{
          backgroundColor: index % 2 === 0 ? "#f8f8f8" : "#ffffff",
          borderRadius: preferences.borderRadius,
          marginHorizontal: preferences.spacing,
          marginVertical: 16,
          paddingVertical: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        <AnimatedPressable
          onPress={handlePress}
          onLongPress={handleLongPress}
          delayLongPress={300}
          style={animatedStyle}
        >
          <View style={styles.svgContainer}>
            <Image
              source={require("@/assets/images/sample.svg")}
              style={{
                width: width * 0.95,
                height: width * 0.95,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 6,
              }}
              cachePolicy="memory-disk"
              contentFit="contain"
              transition={200}
            />
            {isExpanded && (
              <Text style={styles.expandedText}>Tap to reset</Text>
            )}
          </View>
        </AnimatedPressable>
      </View>
    );
  }
);

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();
  const { preferences } = usePreferences();
  const { statistics, incrementStat } = useStatistics();
  const [pressedIndex, setPressedIndex] = useState<number | null>(null);

  // Generate a fixed number of items (100 for stress testing)
  const chartData = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => ({
        id: `chart-${index}`,
        index,
      })),
    []
  );

  // Calculate item height for getItemLayout
  const itemHeight = useMemo(() => width * 0.95 + 32 + 20, [width]); // SVG height + vertical padding + margin

  // Optimize with getItemLayout to avoid measuring items
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index + 100, // 100 is approximate header height
      index,
    }),
    [itemHeight]
  );

  const keyExtractor = useCallback((item: { id: string }) => item.id, []);

  const handlePress = useCallback(
    (index: number) => {
      incrementStat("clicks");
      incrementStat("interactions");

      setPressedIndex(index);

      setTimeout(() => {
        router.push(`/detail?id=${index}`);
      }, 300);
    },
    [incrementStat, router]
  );

  const renderItem = useCallback(
    ({ item }: { item: { index: number; id: string } }) => (
      <ChartItem
        key={item.id}
        index={item.index}
        width={width}
        theme={theme}
        preferences={preferences}
        onPress={handlePress}
      />
    ),
    [width, theme, preferences, handlePress]
  );

  const ListHeaderComponent = useCallback(
    () => (
      <>
        <StatsDisplay
          views={statistics.views}
          interactions={statistics.interactions}
          theme={theme}
        />

        <Text
          style={[
            styles.buttonText,
            {
              textAlign: "center",
              color: theme.primaryColor,
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 15,
              fontSize: preferences.fontSize + 4,
            },
          ]}
        >
          Stock Chart with SVG Dashboard
        </Text>
        <Text
          style={[
            styles.instructionsText,
            {
              textAlign: "center",
              color: theme.textColor,
              marginBottom: 15,
            },
          ]}
        >
          Long press to expand chart (2x) • Tap to view details
        </Text>
      </>
    ),
    [statistics.views, statistics.interactions, theme, preferences.fontSize]
  );

  return (
    <FlatList
      data={chartData}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      ListHeaderComponent={ListHeaderComponent}
      initialNumToRender={3}
      maxToRenderPerBatch={2}
      windowSize={5}
      removeClippedSubviews={true}
      contentContainerStyle={{ paddingBottom: 30 }}
      style={[
        styles.container,
        {
          paddingTop: 15,
          paddingBottom: 20,
          backgroundColor: theme.backgroundColor,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svgContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    fontWeight: "bold",
  },
  instructionsText: {
    fontSize: 14,
    opacity: 0.8,
  },
  expandedText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
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
