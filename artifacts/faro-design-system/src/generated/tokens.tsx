/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#FAF8F3",
      "foreground": "#243E3B",
      "border": "#DFE4DA",
      "card": "#FFFDF8",
      "cardForeground": "#243E3B",
      "popover": "#FFFDF8",
      "popoverForeground": "#243E3B",
      "primary": "#CE5135",
      "primaryForeground": "#FFFAF2",
      "secondary": "#E6F0E6",
      "secondaryForeground": "#216458",
      "muted": "#F4EFDF",
      "mutedForeground": "#677771",
      "accent": "#FFE9DC",
      "accentForeground": "#99422B",
      "destructive": "#A93632",
      "destructiveForeground": "#FFFFFF",
      "input": "#DFE4DA",
      "ring": "#216458",
      "chart1": "#CE5135",
      "chart2": "#216458",
      "chart3": "#F3C760",
      "chart4": "#99422B",
      "chart5": "#677771",
      "sidebar": "#F4EFDF",
      "sidebarForeground": "#243E3B",
      "sidebarBorder": "#DFE4DA",
      "sidebarPrimary": "#CE5135",
      "sidebarPrimaryForeground": "#FFFAF2",
      "sidebarAccent": "#FFE9DC",
      "sidebarAccentForeground": "#99422B",
      "sidebarRing": "#216458"
    },
    "dark": {
      "background": "#182C29",
      "foreground": "#FAF8F3",
      "border": "#48615A",
      "card": "#243E3B",
      "cardForeground": "#FAF8F3",
      "popover": "#243E3B",
      "popoverForeground": "#FAF8F3",
      "primary": "#FFAB8D",
      "primaryForeground": "#382016",
      "secondary": "#304F44",
      "secondaryForeground": "#DBEDDE",
      "muted": "#30443E",
      "mutedForeground": "#BECEC6",
      "accent": "#55352B",
      "accentForeground": "#FFD3BD",
      "destructive": "#FFB4AB",
      "destructiveForeground": "#381311",
      "input": "#759287",
      "ring": "#A0D0BC",
      "chart1": "#CE5135",
      "chart2": "#216458",
      "chart3": "#F3C760",
      "chart4": "#99422B",
      "chart5": "#677771",
      "sidebar": "#1E332F",
      "sidebarForeground": "#FAF8F3",
      "sidebarBorder": "#48615A",
      "sidebarPrimary": "#FFAB8D",
      "sidebarPrimaryForeground": "#382016",
      "sidebarAccent": "#55352B",
      "sidebarAccentForeground": "#FFD3BD",
      "sidebarRing": "#A0D0BC"
    }
  },
  "fontFamily": {
    "sans": [
      "Nunito Sans",
      "sans-serif"
    ],
    "serif": [
      "Nunito",
      "sans-serif"
    ],
    "mono": [
      "Menlo",
      "monospace"
    ]
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
