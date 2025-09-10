/**
 * Color scheme constants for the Raksana app
 */
export const Colors = {
  primary: '#006A64',
  secondary: '#296A48', 
  tertiary: '#426834',
  background: '#FFFFFF',
  text: {
    primary: '#000000',
    secondary: '#666666',
    light: '#999999',
  },
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
