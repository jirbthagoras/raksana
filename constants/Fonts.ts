/**
 * Font constants for the Raksana app
 * Using Plus Jakarta Display and Plus Jakarta Text fonts
 */
export const Fonts = {
  // Display fonts (for headings and larger text)
  display: {
    light: 'PlusJakartaDisplay-Light',
    regular: 'PlusJakartaDisplay-Regular',
    medium: 'PlusJakartaDisplay-Medium',
    bold: 'PlusJakartaDisplay-Bold',
    lightItalic: 'PlusJakartaDisplay-LightItalic',
    italic: 'PlusJakartaDisplay-Italic',
    mediumItalic: 'PlusJakartaDisplay-MediumItalic',
    boldItalic: 'PlusJakartaDisplay-BoldItalic',
  },
  // Text fonts (for body text and smaller text)
  text: {
    light: 'PlusJakartaText-Light',
    regular: 'PlusJakartaText-Regular',
    bold: 'PlusJakartaText-Bold',
    lightItalic: 'PlusJakartaText-LightItalic',
    italic: 'PlusJakartaText-Italic',
    boldItalic: 'PlusJakartaText-BoldItalic',
  },
  // Monospace font
  mono: {
    regular: 'SpaceMono-Regular',
  },
} as const;

export type FontFamily = typeof Fonts;
