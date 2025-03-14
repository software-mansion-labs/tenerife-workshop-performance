import {
  StyleSheet,
  View,
  Text,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Svg,
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  G,
  Line,
  Text as SvgText,
} from "react-native-svg";
import { useEffect, useCallback, memo, useState, useRef } from "react";
import { BlurView } from "expo-blur";
import { useTheme } from "@/app/context/ThemeContext";
import { usePreferences } from "@/app/context/PreferencesContext";
import { useStatistics } from "@/app/context/StatisticsContext";
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedProps,
  interpolate,
  SharedValue,
} from "react-native-reanimated";

// Create an animated path component
const AnimatedPath = Animated.createAnimatedComponent(Path);

// StatsCard component
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

const AnimatedSvg = memo(
  ({
    width,
    animatedStyle,
    dashArray,
    progress,
  }: {
    width: number;
    animatedStyle: any;
    dashArray: SharedValue<number>;
    progress: SharedValue<number>;
  }) => {
    // Create animated props for the Path
    const animatedProps = useAnimatedProps(() => {
      return {
        strokeDasharray: `${dashArray.value}`,
        strokeWidth: 3 + (dashArray.value - 10) / 10, // Scale stroke width slightly with dash value
      };
    });

    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: interpolate(progress.value, [0, 1], [12.5, 0]),
          },
          { scale: interpolate(progress.value, [0, 1], [1, 0.7]) },
        ],
        transformOrigin: "top left",
      };
    });

    return (
      <Animated.View
        style={[styles.svgContainer, animatedStyle, containerStyle]}
      >
        <Svg
          viewBox="0 0 1200 800"
          width={width * 0.98}
          height={width * 1.3}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }}
        >
          <Defs>
            <LinearGradient
              id="volumeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor="rgba(0,150,136,0.8)"
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor="rgba(0,150,136,0.2)"
                stopOpacity="1"
              />
            </LinearGradient>
            <LinearGradient
              id="positiveGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor="rgba(76,175,80,0.6)"
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor="rgba(76,175,80,0.1)"
                stopOpacity="1"
              />
            </LinearGradient>
            <LinearGradient
              id="negativeGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <Stop
                offset="0%"
                stopColor="rgba(244,67,54,0.6)"
                stopOpacity="1"
              />
              <Stop
                offset="100%"
                stopColor="rgba(244,67,54,0.1)"
                stopOpacity="1"
              />
            </LinearGradient>
          </Defs>

          <Rect width={1200} height={800} fill="#f5f5f5" />
          <Rect
            x={80}
            y={50}
            width={1040}
            height={650}
            fill="white"
            rx={8}
            ry={8}
          />

          {/* Animated path with Reanimated animatedProps */}
          <AnimatedPath
            d="M 100 110 L 1100 110"
            stroke="#673ab7"
            fill="none"
            animatedProps={animatedProps}
          />

          <G stroke="#e0e0e0" strokeWidth={1}>
            {/* Horizontal grid lines */}
            <Line x1={100} y1={150} x2={1100} y2={150} />
            <Line x1={100} y1={250} x2={1100} y2={250} />
            <Line x1={100} y1={350} x2={1100} y2={350} />
            <Line x1={100} y1={450} x2={1100} y2={450} />
            <Line x1={100} y1={550} x2={1100} y2={550} />

            {/* Vertical grid lines */}
            <Line x1={200} y1={100} x2={200} y2={650} />
            <Line x1={300} y1={100} x2={300} y2={650} />
            <Line x1={400} y1={100} x2={400} y2={650} />
            <Line x1={500} y1={100} x2={500} y2={650} />
            <Line x1={600} y1={100} x2={600} y2={650} />
            <Line x1={700} y1={100} x2={700} y2={650} />
            <Line x1={800} y1={100} x2={800} y2={650} />
            <Line x1={900} y1={100} x2={900} y2={650} />
            <Line x1={1000} y1={100} x2={1000} y2={650} />
          </G>

          {/* Volume Bars */}
          <G opacity={0.8}>
            <Rect
              x={130}
              y={600}
              width={20}
              height={50}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={160}
              y={580}
              width={20}
              height={70}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={190}
              y={610}
              width={20}
              height={40}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={220}
              y={590}
              width={20}
              height={60}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={250}
              y={570}
              width={20}
              height={80}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={280}
              y={600}
              width={20}
              height={50}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={310}
              y={620}
              width={20}
              height={30}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={340}
              y={605}
              width={20}
              height={45}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={370}
              y={590}
              width={20}
              height={60}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={400}
              y={580}
              width={20}
              height={70}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={430}
              y={595}
              width={20}
              height={55}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={460}
              y={615}
              width={20}
              height={35}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={490}
              y={605}
              width={20}
              height={45}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={520}
              y={585}
              width={20}
              height={65}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={550}
              y={575}
              width={20}
              height={75}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={580}
              y={560}
              width={20}
              height={90}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={610}
              y={550}
              width={20}
              height={100}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={640}
              y={570}
              width={20}
              height={80}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={670}
              y={590}
              width={20}
              height={60}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={700}
              y={610}
              width={20}
              height={40}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={730}
              y={620}
              width={20}
              height={30}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={760}
              y={615}
              width={20}
              height={35}
              fill="url(#negativeGradient)"
            />
            <Rect
              x={790}
              y={605}
              width={20}
              height={45}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={820}
              y={595}
              width={20}
              height={55}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={850}
              y={575}
              width={20}
              height={75}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={880}
              y={565}
              width={20}
              height={85}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={910}
              y={580}
              width={20}
              height={70}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={940}
              y={600}
              width={20}
              height={50}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={970}
              y={610}
              width={20}
              height={40}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={1000}
              y={590}
              width={20}
              height={60}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={1030}
              y={570}
              width={20}
              height={80}
              fill="url(#volumeGradient)"
            />
            <Rect
              x={1060}
              y={590}
              width={20}
              height={60}
              fill="url(#volumeGradient)"
            />
          </G>

          {/* Main chart line */}
          <Path
            d="M 120 400 
             L 150 380 
             L 180 390 
             L 210 370 
             L 240 350 
             L 270 360 
             L 300 370 
             L 330 350 
             L 360 340 
             L 390 320 
             L 420 330 
             L 450 350 
             L 480 340 
             L 510 310 
             L 540 290 
             L 570 270 
             L 600 250 
             L 630 230 
             L 660 250 
             L 690 270 
             L 720 290 
             L 750 300 
             L 780 280 
             L 810 270 
             L 840 240 
             L 870 220 
             L 900 210 
             L 930 230 
             L 960 250 
             L 990 240 
             L 1020 220 
             L 1050 200 
             L 1080 210"
            stroke="#3f51b5"
            strokeWidth={3}
            fill="none"
            opacity={0.8}
          />

          {/* Chart area fill */}
          <Path
            d="M 120 400 
             L 150 380 
             L 180 390 
             L 210 370 
             L 240 350 
             L 270 360 
             L 300 370 
             L 330 350 
             L 360 340 
             L 390 320 
             L 420 330 
             L 450 350 
             L 480 340 
             L 510 310 
             L 540 290 
             L 570 270 
             L 600 250 
             L 630 230 
             L 660 250 
             L 690 270 
             L 720 290 
             L 750 300 
             L 780 280 
             L 810 270 
             L 840 240 
             L 870 220 
             L 900 210 
             L 930 230 
             L 960 250 
             L 990 240 
             L 1020 220 
             L 1050 200 
             L 1080 210
             L 1080 650
             L 120 650
             Z"
            fill="rgba(63,81,181,0.1)"
            opacity={0.8}
          />

          {/* 20-day Moving Average */}
          <Path
            d="M 120 420 
             L 150 410 
             L 180 400 
             L 210 390 
             L 240 380 
             L 270 370 
             L 300 370 
             L 330 360 
             L 360 350 
             L 390 340 
             L 420 330 
             L 450 320 
             L 480 310 
             L 510 300 
             L 540 290 
             L 570 280 
             L 600 270 
             L 630 260 
             L 660 260 
             L 690 260 
             L 720 270 
             L 750 280 
             L 780 280 
             L 810 270 
             L 840 260 
             L 870 240 
             L 900 230 
             L 930 230 
             L 960 240 
             L 990 240 
             L 1020 230 
             L 1050 220 
             L 1080 220"
            stroke="#ff9800"
            strokeWidth={3}
            strokeDasharray="5,3"
            fill="none"
            opacity={0.8}
          />

          {/* 50-day Moving Average */}
          <Path
            d="M 120 440 
             L 150 430 
             L 180 420 
             L 210 410 
             L 240 405 
             L 270 400 
             L 300 395 
             L 330 390 
             L 360 385 
             L 390 380 
             L 420 375 
             L 450 370 
             L 480 365 
             L 510 360 
             L 540 350 
             L 570 340 
             L 600 330 
             L 630 320 
             L 660 315 
             L 690 310 
             L 720 305 
             L 750 300 
             L 780 300 
             L 810 295 
             L 840 290 
             L 870 285 
             L 900 280 
             L 930 275 
             L 960 270 
             L 990 265 
             L 1020 260 
             L 1050 255 
             L 1080 250"
            stroke="#9c27b0"
            strokeWidth={3}
            strokeDasharray="10,4"
            fill="none"
            opacity={0.8}
          />

          {/* Candlesticks - green for up days, red for down days */}
          <G opacity={0.8}>
            {/* Green candles */}
            <Line
              x1={140}
              y1={380}
              x2={140}
              y2={400}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={135} y={380} width={10} height={20} fill="#4caf50" />

            <Line
              x1={200}
              y1={370}
              x2={200}
              y2={395}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={195} y={370} width={10} height={25} fill="#4caf50" />

            <Line
              x1={260}
              y1={350}
              x2={260}
              y2={375}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={255} y={350} width={10} height={25} fill="#4caf50" />

            <Line
              x1={320}
              y1={340}
              x2={320}
              y2={355}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={315} y={340} width={10} height={15} fill="#4caf50" />

            <Line
              x1={380}
              y1={320}
              x2={380}
              y2={345}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={375} y={320} width={10} height={25} fill="#4caf50" />

            <Line
              x1={500}
              y1={290}
              x2={500}
              y2={315}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={495} y={290} width={10} height={25} fill="#4caf50" />

            <Line
              x1={560}
              y1={270}
              x2={560}
              y2={295}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={555} y={270} width={10} height={25} fill="#4caf50" />

            <Line
              x1={620}
              y1={230}
              x2={620}
              y2={255}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={615} y={230} width={10} height={25} fill="#4caf50" />

            <Line
              x1={740}
              y1={290}
              x2={740}
              y2={310}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={735} y={290} width={10} height={20} fill="#4caf50" />

            <Line
              x1={800}
              y1={270}
              x2={800}
              y2={285}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={795} y={270} width={10} height={15} fill="#4caf50" />

            <Line
              x1={860}
              y1={220}
              x2={860}
              y2={245}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={855} y={220} width={10} height={25} fill="#4caf50" />

            <Line
              x1={980}
              y1={240}
              x2={980}
              y2={255}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={975} y={240} width={10} height={15} fill="#4caf50" />

            <Line
              x1={1040}
              y1={200}
              x2={1040}
              y2={225}
              stroke="#4caf50"
              strokeWidth={1}
            />
            <Rect x={1035} y={200} width={10} height={25} fill="#4caf50" />

            {/* Red candles */}
            <Line
              x1={170}
              y1={370}
              x2={170}
              y2={395}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={165} y={370} width={10} height={25} fill="#f44336" />

            <Line
              x1={230}
              y1={350}
              x2={230}
              y2={375}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={225} y={350} width={10} height={25} fill="#f44336" />

            <Line
              x1={290}
              y1={360}
              x2={290}
              y2={375}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={285} y={360} width={10} height={15} fill="#f44336" />

            <Line
              x1={350}
              y1={340}
              x2={350}
              y2={355}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={345} y={340} width={10} height={15} fill="#f44336" />

            <Line
              x1={410}
              y1={320}
              x2={410}
              y2={335}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={405} y={320} width={10} height={15} fill="#f44336" />

            <Line
              x1={470}
              y1={340}
              x2={470}
              y2={355}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={465} y={340} width={10} height={15} fill="#f44336" />

            <Line
              x1={530}
              y1={290}
              x2={530}
              y2={315}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={525} y={290} width={10} height={25} fill="#f44336" />

            <Line
              x1={590}
              y1={250}
              x2={590}
              y2={275}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={585} y={250} width={10} height={25} fill="#f44336" />

            <Line
              x1={650}
              y1={240}
              x2={650}
              y2={255}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={645} y={240} width={10} height={15} fill="#f44336" />

            <Line
              x1={710}
              y1={270}
              x2={710}
              y2={295}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={705} y={270} width={10} height={25} fill="#f44336" />

            <Line
              x1={770}
              y1={280}
              x2={770}
              y2={305}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={765} y={280} width={10} height={25} fill="#f44336" />

            <Line
              x1={830}
              y1={240}
              x2={830}
              y2={275}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={825} y={240} width={10} height={35} fill="#f44336" />

            <Line
              x1={890}
              y1={210}
              x2={890}
              y2={235}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={885} y={210} width={10} height={25} fill="#f44336" />

            <Line
              x1={950}
              y1={230}
              x2={950}
              y2={255}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={945} y={230} width={10} height={25} fill="#f44336" />

            <Line
              x1={1010}
              y1={220}
              x2={1010}
              y2={245}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={1005} y={220} width={10} height={25} fill="#f44336" />

            <Line
              x1={1070}
              y1={200}
              x2={1070}
              y2={215}
              stroke="#f44336"
              strokeWidth={1}
            />
            <Rect x={1065} y={200} width={10} height={15} fill="#f44336" />
          </G>

          {/* RSI Indicator */}
          <G transform="translate(0, 650)">
            <Rect
              x={100}
              y={0}
              width={1000}
              height={100}
              fill="white"
              stroke="#e0e0e0"
            />
            <SvgText
              x={110}
              y={20}
              fill="#212121"
              fontFamily="Arial"
              fontSize={12}
            >
              RSI
            </SvgText>
            <Line
              x1={100}
              y1={50}
              x2={1100}
              y2={50}
              stroke="#e0e0e0"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <Line
              x1={100}
              y1={30}
              x2={1100}
              y2={30}
              stroke="#e0e0e0"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <Line
              x1={100}
              y1={70}
              x2={1100}
              y2={70}
              stroke="#e0e0e0"
              strokeWidth={1}
              strokeDasharray="2,2"
            />
            <Path
              d="M 120 50 
               L 150 55 
               L 180 60 
               L 210 65 
               L 240 70 
               L 270 75 
               L 300 70 
               L 330 65 
               L 360 60 
               L 390 55 
               L 420 50 
               L 450 45 
               L 480 40 
               L 510 35 
               L 540 30 
               L 570 25 
               L 600 30 
               L 630 35 
               L 660 40 
               L 690 45 
               L 720 50 
               L 750 55 
               L 780 60 
               L 810 65 
               L 840 70 
               L 870 65 
               L 900 60 
               L 930 55 
               L 960 50 
               L 990 45 
               L 1020 40 
               L 1050 35 
               L 1080 40"
              stroke="#9c27b0"
              strokeWidth={3}
              fill="none"
              opacity={0.8}
            />
          </G>

          {/* Chart Labels and Values */}
          <G>
            {/* Y-axis price labels */}
            <SvgText
              x={70}
              y={150}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              3,500
            </SvgText>
            <SvgText
              x={70}
              y={250}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              3,000
            </SvgText>
            <SvgText
              x={70}
              y={350}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              2,500
            </SvgText>
            <SvgText
              x={70}
              y={450}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              2,000
            </SvgText>
            <SvgText
              x={70}
              y={550}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              1,500
            </SvgText>

            {/* X-axis date labels */}
            <SvgText
              x={200}
              y={670}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="middle"
            >
              Mar
            </SvgText>
            <SvgText
              x={400}
              y={670}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="middle"
            >
              Apr
            </SvgText>
            <SvgText
              x={600}
              y={670}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="middle"
            >
              May
            </SvgText>
            <SvgText
              x={800}
              y={670}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="middle"
            >
              Jun
            </SvgText>
            <SvgText
              x={1000}
              y={670}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="middle"
            >
              Jul
            </SvgText>

            {/* RSI labels */}
            <SvgText
              x={70}
              y={680}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              30
            </SvgText>
            <SvgText
              x={70}
              y={700}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              50
            </SvgText>
            <SvgText
              x={70}
              y={720}
              fill="#616161"
              fontFamily="Arial"
              fontSize={12}
              textAnchor="end"
            >
              70
            </SvgText>
          </G>

          {/* Chart Title and Legends */}
          <SvgText
            x={120}
            y={80}
            fill="#212121"
            fontFamily="Arial"
            fontSize={20}
            fontWeight="bold"
          >
            NASDAQ Composite
          </SvgText>

          <G transform="translate(700, 80)">
            <Line
              x1={0}
              y1={0}
              x2={20}
              y2={0}
              stroke="#3f51b5"
              strokeWidth={3}
            />
            <SvgText
              x={30}
              y={5}
              fill="#616161"
              fontFamily="Arial"
              fontSize={14}
            >
              Price
            </SvgText>

            <Line
              x1={100}
              y1={0}
              x2={120}
              y2={0}
              stroke="#ff9800"
              strokeWidth={2}
              strokeDasharray="5,3"
            />
            <SvgText
              x={130}
              y={5}
              fill="#616161"
              fontFamily="Arial"
              fontSize={14}
            >
              20-MA
            </SvgText>

            <Line
              x1={200}
              y1={0}
              x2={220}
              y2={0}
              stroke="#9c27b0"
              strokeWidth={2}
              strokeDasharray="10,4"
            />
            <SvgText
              x={230}
              y={5}
              fill="#616161"
              fontFamily="Arial"
              fontSize={14}
            >
              50-MA
            </SvgText>

            <Rect x={300} y={-7} width={10} height={14} fill="#4caf50" />
            <SvgText
              x={320}
              y={5}
              fill="#616161"
              fontFamily="Arial"
              fontSize={14}
            >
              Up
            </SvgText>

            <Rect x={370} y={-7} width={10} height={14} fill="#f44336" />
            <SvgText
              x={390}
              y={5}
              fill="#616161"
              fontFamily="Arial"
              fontSize={14}
            >
              Down
            </SvgText>
          </G>

          {/* Current Price Indicator */}
          <G transform="translate(1080, 210)">
            <Rect
              x={0}
              y={-25}
              width={60}
              height={26}
              fill="#3f51b5"
              rx={13}
              ry={13}
            />
            <SvgText
              x={30}
              y={-7}
              fill="white"
              fontFamily="Arial"
              fontSize={14}
              fontWeight="bold"
              textAnchor="middle"
            >
              3,257
            </SvgText>
            <Line
              x1={0}
              y1={0}
              x2={-20}
              y2={0}
              stroke="#3f51b5"
              strokeWidth={2}
            />
          </G>
        </Svg>
      </Animated.View>
    );
  }
);

// ActionButton component
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

// BackButton component
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
  const [isAnimating, setIsAnimating] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const dashArray = useSharedValue(10);
  const progress = useSharedValue(0);

  useEffect(() => {
    incrementStat("views");

    // Start the progress animation to demonstrate the crash
    progress.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [incrementStat, progress]);

  // Effect to handle the animation with Reanimated
  useEffect(() => {
    if (isAnimating) {
      // Animate dashArray between 10 and 30
      dashArray.value = withRepeat(
        withTiming(30, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        -1, // Infinite repetitions
        true // Reverse on each iteration
      );
    } else {
      // Reset animation to initial value
      dashArray.value = withTiming(10, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      });
    }
  }, [isAnimating, dashArray]);

  const handleFlip = useCallback(() => {
    incrementStat("interactions");
    setIsFlipped((prev) => !prev);

    // Animate the flip with standard rotation
    rotate.value = withSpring(isFlipped ? 0 : 180, {
      damping: 12,
      stiffness: 90,
    });
  }, [isFlipped, rotate, incrementStat]);

  const toggleStrokeAnimation = useCallback(() => {
    incrementStat("interactions");
    setIsAnimating((prev) => !prev);
  }, [incrementStat]);

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
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
      ]}
    >
      <StatsCard
        views={statistics.views}
        id={id as string}
        theme={theme}
        width={width}
      />

      <AnimatedSvg
        width={width}
        animatedStyle={animatedStyle}
        dashArray={dashArray}
        progress={progress}
      />

      <View style={styles.buttonsContainer}>
        <ActionButton
          onPress={handleFlip}
          theme={theme}
          preferences={preferences}
          label={`Flip the stock ${isFlipped ? "back" : ""}`}
        />
        <ActionButton
          onPress={toggleStrokeAnimation}
          theme={theme}
          preferences={preferences}
          label={`${isAnimating ? "Stop" : "Start"} dash animation`}
        />
      </View>

      <BackButton
        onPress={handleBack}
        theme={theme}
        preferences={preferences}
        width={width}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "space-between",
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
