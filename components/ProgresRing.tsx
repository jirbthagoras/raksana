import { Colors, Fonts } from '@/constants';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface ProgressRingProps {
  completed: number;
  total: number;
  size: number;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ completed, total, size }) => {
  const radius = (size - 12) / 2; // 12 = stroke width * 2 (6 each side)
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min(completed / total, 1) : 0;
  const strokeDasharray = `${circumference * percentage} ${circumference}`;

  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      {/* Gray background arc (full circle) */}
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Green progress arc */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#4CAF50"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      {/* Center label */}
      <View style={styles.ringCenter}>
        <Text style={styles.ringText}>
          {completed}/{total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressRing: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  ringCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringText: {
    fontFamily: Fonts.text.bold,
    fontSize: 11,
    color: Colors.onSurface,
    textAlign: 'center',
  },
});

export default ProgressRing;