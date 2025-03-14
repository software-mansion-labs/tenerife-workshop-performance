# React Native Performance Anti-Patterns Demo

This application demonstrates various performance anti-patterns and bad practices in React Native development. It serves as an educational tool to understand what NOT to do in production applications.

## Application Structure

### Screens

1. **Explore Screen** (`app/(stack)/explore.tsx`)

   - Main screen with a scrollable list of 200 SVG elements
   - Each SVG is interactive and navigates to a detail view
   - Features a stats display with view counter
   - Uses global state for styling and interactions

2. **Detail Screen** (`app/(stack)/detail.tsx`)
   - Shows a single SVG with animations
   - Displays interaction statistics
   - Features blur effects and responsive layout
   - Uses global state extensively

### Components

1. **SVG Component** (`assets/svgs/sample.ts`)

   - Complex SVG with multiple elements
   - Demonstrates SVG rendering issues
   - Uses masks, gradients, and paths

2. **Global State** (`app/context/GlobalState.tsx`)
   - Centralized state management
   - Handles theme, animations, preferences, and statistics

## Performance Issues

### 1. Global State Management

#### Issues:

- **Large State Object**: Combines unrelated concerns (theme, animations, preferences, statistics)

```typescript
interface GlobalState {
  theme: {
    /* ... */
  };
  animations: {
    /* ... */
  };
  userPreferences: {
    /* ... */
  };
  statistics: {
    /* ... */
  };
}
```

- **Frequent Updates**: State updates every few seconds
- **Unnecessary Re-renders**: All components re-render when any part of state changes

#### Impact:

- Causes entire component tree to re-render
- Increases memory usage
- Reduces app responsiveness

### 2. Animation Anti-Patterns

#### Issues:

- **Multiple Animated Values**: Using separate values for single animation

```typescript
const scale = useSharedValue(0);
const rotation = useSharedValue(0);
const translateY = useSharedValue(50);
const opacity = useSharedValue(0);
```

- **Complex Animation Chains**: Unnecessarily complex animation sequences
- **Continuous Animations**: Always-running animations in the background

#### Impact:

- Higher JavaScript bridge traffic
- Increased CPU usage
- Battery drain

### 3. SVG Rendering Issues

#### Issues:

- **Odd-numbered Stroke Dash Arrays**: Using odd number of values

```svg
stroke-dasharray="15,5,35"
```

- **Non-integer Coordinates**: Using decimal points in paths
- **Complex Masks and Gradients**: Heavy use of expensive SVG features

#### Impact:

- Inconsistent rendering across devices
- Increased render time
- Higher memory usage

### 4. Layout and Styling Issues

#### Issues:

- **Inline Styles**: Heavy use of dynamic styles

```jsx
style={[
  styles.container,
  { backgroundColor: state.theme.backgroundColor }
]}
```

- **Complex Shadow Effects**: Multiple shadow properties with blur effects
- **Dynamic Layout Calculations**: Frequent recalculations based on state

#### Impact:

- Layout thrashing
- Increased render time
- Poor scroll performance

### 5. List Rendering Issues

#### Issues:

- **ScrollView for Long Lists**: Using ScrollView instead of FlatList for 200 items
- **No Virtualization**: All items rendered at once
- **Complex Item Rendering**: Heavy components in each list item

#### Impact:

- High memory usage
- Poor initial load time
- Scrolling performance issues

### 6. Effect Management

#### Issues:

- **Multiple Effects**: Separate effects for related functionality

```typescript
useEffect(() => {
  incrementStat("views");
  const interval = setInterval(() => {
    setState((prev) => ({
      /* ... */
    }));
  }, 3000);
}, []);
```

- **Unnecessary Intervals**: Frequent state updates via intervals
- **Missing Dependencies**: Incomplete dependency arrays

#### Impact:

- Memory leaks
- Unnecessary re-renders
- Potential race conditions

### 7. Event Handling

#### Issues:

- **Multiple State Updates**: Multiple updates in single event handler

```typescript
const handlePress = (index: number) => {
  incrementStat("clicks");
  incrementStat("interactions");
  updatePreferences({
    /* ... */
  });
};
```

- **Immediate State Updates**: No debouncing or throttling
- **Complex Event Chains**: Multiple state changes and animations

#### Impact:

- UI jank
- Excessive re-renders
- Poor touch response

## Future Optimizations

The app is designed to be optimized with:

1. React Freeze for preventing unnecessary re-renders
2. State management optimization
3. Animation performance improvements
4. List virtualization
5. Event handling optimization
6. SVG optimization

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the app:

```bash
npm start
```

## Note

This app intentionally includes bad practices for educational purposes. Do not use these patterns in production applications.
