// screens/Onboarding.tsx
import LottieView from 'lottie-react-native';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/Colors';
import { Slide, slides } from '../constants/OnboardingData';
import { Typography } from '../constants/Typography';

<LottieView
  source={require('../assets/Untitled file.json')}
  autoPlay
  loop
  style={{ width: 150, height: 150 }}
/>

const { width, height } = Dimensions.get('window');

interface OnboardingProps {
  onFinish: () => void;
}

export default function Onboarding({ onFinish }: OnboardingProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const flatListRef = useRef<FlatList<Slide>>(null);

  const onScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(index);
  };

  const goNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      onFinish();
    }
  };

  const renderSlide = ({ item }: { item: Slide }) => (
  <View style={styles.slide}>
    <Text style={[Typography.h1, styles.titleExtra]}>{item.title}</Text>
    <Text style={[Typography.body, styles.subtitleExtra]}>{item.subtitle}</Text>
    <View style={styles.dotsContainer}>{renderDots()}</View>
  </View>
);

  const renderDots = () => {
    return slides.map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          { backgroundColor: i === currentIndex ? Colors.gradientStart : Colors.input },
        ]}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      />

      <View style={styles.footer}>
        <TouchableOpacity onPress={goNext} style={styles.nextButtonWrapper}>
          <View style={styles.nextButtonGradient}>
            <Text style={Typography.button}>{currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  slide: {
    width: width,
    height: height * 0.75,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingBottom: 80,
  },
  titleExtra: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitleExtra: {
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  nextButtonWrapper: {
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
  },
  nextButtonGradient: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});