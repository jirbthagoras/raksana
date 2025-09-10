import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { Colors, Fonts } from '../constants';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  style?: any;
  onComplete?: () => void;
}

export default function TypewriterText({ 
  text, 
  speed = 100, 
  style, 
  onComplete 
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <Text style={[styles.text, style]}>
      {displayText}
      {currentIndex < text.length && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.display.bold,
    fontSize: 20,
    color: Colors.tertiary,
    textAlign: 'center',
    lineHeight: 28,
  },
  cursor: {
    opacity: 0.7,
    color: Colors.primary,
  },
});
