import { MotiView } from 'moti';
import React, { useState } from 'react';
import { TouchableOpacity, TouchableOpacityProps } from 'react-native';

interface MotiButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scaleValue?: number;
  duration?: number;
}

export default function MotiButton({ 
  children, 
  onPress, 
  scaleValue = 0.95, 
  duration = 100,
  ...props 
}: MotiButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <MotiView
      animate={{ scale: isPressed ? scaleValue : 1 }}
      transition={{
        type: 'timing',
        duration: duration,
      }}
    >
      <TouchableOpacity 
        onPress={onPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </MotiView>
  );
}
