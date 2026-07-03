// screens/Onboarding.tsx
import LottieView from 'lottie-react-native';
import "../assets/slide2.json";

import React, { useEffect, useRef, useState } from 'react';
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

  const renderDots = () =>
    slides.map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          { backgroundColor: i === currentIndex ? Colors.gradientStart : Colors.input },
        ]}
      />
    ));


const lottieRef = useRef<LottieView>(null);
const hasPlayedRef = useRef(false);

const lottieRef2 = useRef<LottieView>(null);
const hasPlayedRef2 = useRef(false);

useEffect(() => {
  if (currentIndex === 1 && !hasPlayedRef.current) {
    lottieRef.current?.play();
    hasPlayedRef.current = true;
  }
  if (currentIndex === 2 && !hasPlayedRef2.current) {
    lottieRef2.current?.play();
    hasPlayedRef2.current = true;
  }
}, [currentIndex]);

  const renderSlide = ({ item }: { item: Slide }) => (
  <View style={styles.slide}>
    {item.id === '2' && (
  <LottieView
    ref={lottieRef}
    source={require('../assets/slide2.json')}
    loop={false}
    style={styles.lottie}
  />
)}
{item.id === '3' && (
  <LottieView
    ref={lottieRef2}
    source={require('../assets/3rd_slide.json')}
    loop={false}
    style={styles.lottie}
  />
)}
    <Text style={[Typography.h2, styles.titleExtra]}>{item.title}</Text>
    <Text style={[Typography.body, styles.subtitleExtra]}>{item.subtitle}</Text>
    <View style={styles.dotsContainer}>{renderDots()}</View>
  </View>
);

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
        <TouchableOpacity onPress={goNext} style={styles.nextButtonWrapper} activeOpacity={0.85}>
  <View style={[styles.nextButtonGradient, { backgroundColor: Colors.buttonPrimary }]}>
    <Text style={Typography.button}>
      {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
    </Text>
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
    paddingBottom: 100,
  },
  lottie: {
  width: 150,
  height: 150,
  marginTop: 20,
  marginBottom: 5,
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
    bottom: 100, //Button position from bottom
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 25,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  nextButtonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    width: '88%',
  },
  nextButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});