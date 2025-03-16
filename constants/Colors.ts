// Base colors (unchanged)
const primary={
  blue: "hsl(204, 45.50%, 91.40%)",
  main: "hsl(229, 79.60%, 9.60%)", // Dark Gray
  black: "hsl(0, 0.00%, 0.00%)",
  white: "hsl(0, 0%, 97%)", // Off White
  dark: "hsl(220, 40%, 20%)", // Dark Gray
  light: "hsl(225, 5.70%, 86.30%)", // Off White
};



// Theme object
const theme={
  light: {
    background: primary.white,
    accentBackground: primary.blue,
    button: primary.blue,
    buttonText: primary.black,
    tint: primary.blue,
    border: primary.blue,
    cardBackground: primary.light,
    shadow: "hsla(0, 0%, 0%, 0.05)"
  },
  dark: {
    background: primary.black,
    accentBackground: primary.dark,
    button: primary.dark,
    buttonText: primary.white,
    tint: primary.blue,
    border: primary.blue,
    cardBackground: primary.main,
    shadow: "hsla(0, 0%, 0%, 0.6)" // **Stronger depth for better contrast and pop**
  },
  blue: {
    background: "hsl(220, 82.90%, 83.90%)", // Soft Ice Blue for a soothing feel
    accentBackground: "hsl(228, 90.40%, 32.50%)", // Vivid Electric Azure for contrast
    button: "hsl(228, 92.10%, 55.10%)", // Deep Royal Blue for authority
    buttonText: "hsl(0, 0%, 100%)", // Pure White for readability
    tint: "hsl(200, 100%, 85%)", // Arctic Blue for a fresh look
    border: "hsl(210, 80%, 70%)", // Crisp Ice Edge for structure
    cardBackground: "hsl(220, 83.00%, 70.00%)", // Pale Ice Mist for subtle layering
    shadow: "hsla(220, 80%, 10%, 0.15)" // Deeper Glacial Shadow for depth
  }
  ,

  green: {
    background: "hsl(120, 35%, 85%)", // Muted Sage Green for a soft, natural feel
    accentBackground: "hsl(110, 60%, 25%)", // Warm Olive Green for earthy richness
    button: "hsl(110, 100.00%, 5.70%)", // Deep Forest Green for an organic, grounded feel
    buttonText: "hsl(0, 0%, 100%)", // Pure White for readability
    tint: "hsl(110, 100.00%, 75.90%)", // Soft Moss Green for a warm, nature-inspired touch
    border: "hsl(110, 40%, 50%)", // Earthy Bark Brown-Green for structure
    cardBackground: "hsl(101, 89.30%, 14.70%)", // Soft Lichen Green for subtle contrast
    shadow: "hsla(101, 82.90%, 16.10%, 0.20)" // Rich Soil Shadow for depth
  },

  purple: {
    background: "hsl(260, 60%, 85%)", // Soft Lavender Mist for a welcoming tone
    accentBackground: "hsl(299, 100.00%, 12.20%)", // Deep Burgundy with warm undertones for richness
    button: "hsl(291, 70.10%, 24.90%)", // Deep Velvet Plum for strength
    buttonText: "hsl(0, 0%, 100%)", // Pure White for readability
    tint: "hsl(285, 75%, 80%)", // Gentle Orchid Glow for balance
    border: "hsl(275, 50%, 70%)", // Subtle Grape-Toned Edge
    cardBackground: "hsl(280, 38.60%, 32.50%)", // Soft Heather Mist for subtle layering
    shadow: "hsla(260, 50%, 10%, 0.15)" // Deeper Midnight Shadow for richness
  }


};

export default theme;
