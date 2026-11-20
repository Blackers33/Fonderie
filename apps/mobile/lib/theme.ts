// à garder synchronisé avec global.css
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

export const THEME = {
  light: {
    background: 'hsl(36 26.3% 96.3%)',
    foreground: 'hsl(22.5 16.7% 9.4%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(22.5 16.7% 9.4%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(22.5 16.7% 9.4%)',
    primary: 'hsl(12.7 79.3% 50.8%)',
    primaryForeground: 'hsl(17.1 15.6% 8.8%)',
    secondary: 'hsl(30 23.8% 91.8%)',
    secondaryForeground: 'hsl(22.5 16.7% 9.4%)',
    muted: 'hsl(30 23.8% 91.8%)',
    mutedForeground: 'hsl(26.3 8.1% 38.8%)',
    accent: 'hsl(16.9 84.2% 92.5%)',
    accentForeground: 'hsl(13.5 81.2% 33.3%)',
    destructive: 'hsl(338.8 73.9% 45.1%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(30 20% 86.3%)',
    input: 'hsl(30 20% 86.3%)',
    ring: 'hsl(12.7 79.3% 50.8%)',
    radius: '2rem',
  },
  dark: {
    background: 'hsl(17.1 15.6% 8.8%)',
    foreground: 'hsl(30 23.5% 93.3%)',
    card: 'hsl(24 15.2% 12.9%)',
    cardForeground: 'hsl(30 23.5% 93.3%)',
    popover: 'hsl(17.1 15.6% 8.8%)',
    popoverForeground: 'hsl(30 23.5% 93.3%)',
    primary: 'hsl(12.7 79.3% 50.8%)',
    primaryForeground: 'hsl(17.1 15.6% 8.8%)',
    secondary: 'hsl(21.8 13.6% 15.9%)',
    secondaryForeground: 'hsl(30 23.5% 93.3%)',
    muted: 'hsl(21.8 13.6% 15.9%)',
    mutedForeground: 'hsl(28.2 8.5% 60.6%)',
    accent: 'hsl(15 41.9% 16.9%)',
    accentForeground: 'hsl(15.8 85% 79%)',
    destructive: 'hsl(340.5 78% 59%)',
    destructiveForeground: 'hsl(17.1 15.6% 8.8%)',
    border: 'hsl(23.1 12.6% 20.2%)',
    input: 'hsl(23.1 12.6% 20.2%)',
    ring: 'hsl(12.7 79.3% 50.8%)',
    radius: '2rem',
  },
}

// Couleurs du glow du bouton primaire, identiques dans les deux thèmes
export const PRIMARY_GLOW = {
  ring: 'hsl(7, 98%, 49%)',
  inner: 'hsla(35, 100%, 58%, 0.4)',
  outer: 'hsla(38.1 100% 50% / 0.3)',
}

export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
}
