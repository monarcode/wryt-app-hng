import { router } from 'expo-router';
import React, { ReactNode, useCallback, useRef, useState } from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import SlideTwo from '../assets/images/slide-2.svg';

import NextIcon from '~/assets/icons/next-icon.svg';
import SlideThree from '~/assets/images/sldie-3.svg';
import SlideOne from '~/assets/images/slide-1.svg';
import { Text, View } from '~/components/shared';
import useOnboardingStore from '~/store/onboarding-store';
import { theme } from '~/theme';

const { width, height } = Dimensions.get('window');

interface SlideItem {
  id: string;
  title: string;
  desc: string;
  image: ReactNode;
}

interface DotProps {
  index: number;
  scrollX: SharedValue<number>;
}

const slides: SlideItem[] = [
  {
    id: '1',
    title: 'Easy to use',
    desc: 'Lorem ipsum dolor sit amet consectetur. Mauris ut morbi adipiscing semper pretium sollicitudin.',
    image: <SlideOne />,
  },
  {
    id: '2',
    title: 'Take it with you',
    desc: 'Lorem ipsum dolor sit amet consectetur. Mauris ut morbi adipiscing semper pretium sollicitudin.',
    image: <SlideTwo />,
  },
  {
    id: '3',
    title: 'Multiplayer',
    desc: 'Coming soon',
    image: <SlideThree />,
  },
];

const Slide = React.memo<{ item: SlideItem }>(({ item }) => {
  const { bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.slide, { paddingBottom: bottom + 130 }]}>
      <View style={styles.body}>
        <View style={styles.image}>{item.image}</View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>
      </View>
    </View>
  );
});

const Dot: React.FC<DotProps> = ({ index, scrollX }) => {
  const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

  const animatedStyles = useAnimatedStyle(() => {
    const width = interpolate(scrollX.value, inputRange, [7, 16, 7], Extrapolation.CLAMP);

    const backgroundColor = interpolateColor(scrollX.value, inputRange, [
      '#E0DEE0',
      theme.colors.primary,
      '#E0DEE0',
    ]);

    const opacity = interpolate(scrollX.value, inputRange, [1, 1, 1], Extrapolation.CLAMP);

    return {
      width,
      backgroundColor,
      opacity,
    };
  });

  return <Animated.View style={[styles.dot, animatedStyles]} />;
};

const Pagination: React.FC<{ data: SlideItem[]; scrollX: SharedValue<number> }> = ({
  data,
  scrollX,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => (
        <Dot key={index} index={index} scrollX={scrollX} />
      ))}
    </View>
  );
};

const OnboardingSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);
  const { bottom } = useSafeAreaInsets();
  const onbaordingStore = useOnboardingStore((state) => state);

  const handleGetStarted = useCallback(() => {
    onbaordingStore.setOnboardingCompleted(true);
    router.replace('/');
  }, [onbaordingStore]);

  const handleScroll = useCallback(
    (event: any) => {
      scrollX.value = event.nativeEvent.contentOffset.x;
    },
    [scrollX]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  }, [currentIndex, handleGetStarted]);

  const handleSkip = useCallback(() => {
    onbaordingStore.setOnboardingCompleted(true);
    router.replace('/');
  }, [onbaordingStore]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => <Slide item={item} />}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {/* footer */}
      <View style={[styles.actions, { bottom }]}>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skip}>Skip</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Pagination data={slides} scrollX={scrollX} />

          <Pressable onPress={handleNext} style={styles.next}>
            <NextIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default OnboardingSlider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  slide: {
    width,
    height,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fontFamily.semiBold,
    color: theme.colors.dark,
  },
  body: {
    rowGap: 8,
    width,
    flex: 1,
    paddingHorizontal: 24,
  },
  desc: {
    fontSize: 15,
    fontFamily: theme.fontFamily.medium,
  },
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    flex: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 7,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  actions: {
    position: 'absolute',
    flexDirection: 'row',
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  next: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
  },
  skip: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fontFamily.medium,
  },
});
