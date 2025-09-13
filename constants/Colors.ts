

/**
 * Raksana App Color Schemes
 * Converted from MaterialTheme Builder
 */

export const Colors = {
  primary: "#006A64",
  onPrimary: "#FFFFFF",
  primaryContainer: "#9DF2EA",
  onPrimaryContainer: "#00504C",

  secondary: "#296A48",
  onSecondary: "#FFFFFF",
  secondaryContainer: "#AEF2C6",
  onSecondaryContainer: "#085232",

  tertiary: "#426834",
  onTertiary: "#FFFFFF",
  tertiaryContainer: "#C2EFAD",
  onTertiaryContainer: "#2B4F1E",

  mainBackground: "rgba(255, 255, 255, 0.95)",

  error: "#BA1A1A",
  onError: "#FFFFFF",
  errorContainer: "#FFDAD6",
  onErrorContainer: "#93000A",

  background: "#F4FBF9",
  onBackground: "#161D1C",

  surface: "#FCFAED",
  onSurface: "#1B1C14",
  surfaceVariant: "#E4E3D2",
  onSurfaceVariant: "#47483B",

  outline: "#78786A",
  outlineVariant: "#C8C7B7",
  scrim: "#000000",

  inverseSurface: "#303128",
  inverseOnSurface: "#F3F1E4",
  inversePrimary: "#81D5CE",

  surfaceDim: "#DCDACE",
  surfaceBright: "#FCFAED",
  surfaceContainerLowest: "#FFFFFF",
  surfaceContainerLow: "#F6F4E7",
  surfaceContainer: "#F0EEE1",
  surfaceContainerHigh: "#EAE9DC",
  surfaceContainerHighest: "#E5E3D6",
} as const;

export type ColorKey = keyof typeof Colors;