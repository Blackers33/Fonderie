// à garder synchronisé avec global.css
import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native'

export const THEME = {
  light: {
    background: 'hsl(240 23.81% 95.88%)',
    foreground: 'hsl(0 0% 3.9%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 3.9%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 3.9%)',
    primary: 'hsl(35 100% 50%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 96.1%)',
    secondaryForeground: 'hsl(0 0% 9%)',
    muted: 'hsl(0 0% 96.1%)',
    mutedForeground: 'hsl(240 2.26% 56.67%)',
    accent: 'hsl(0 0% 96.1%)',
    accentForeground: 'hsl(0 0% 9%)',
    destructive: 'hsl(0 78% 64%)',
    border: 'hsl(0 0% 89.8%)',
    input: 'hsl(0 0% 89.8%)',
    ring: 'hsl(0 0% 63%)',
    radius: '2rem',
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
  },
  dark: {
    background: 'hsl(205 14.63% 16.08%)',
    foreground: 'hsl(0 0% 98%)',
    card: 'hsl(205 14.63% 20.5%)',
    cardForeground: 'hsl(0 0% 98%)',
    popover: 'hsl(205 14.63% 16.08%)',
    popoverForeground: 'hsl(0 0% 98%)',
    primary: 'hsl(30 100% 50%)',
    primaryForeground: 'hsl(0 0% 9%)',
    secondary: 'hsl(0 0% 14.9%)',
    secondaryForeground: 'hsl(0 0% 98%)',
    muted: 'hsl(0 0% 14.9%)',
    mutedForeground: 'hsl(240 2.26% 56.67%)',
    accent: 'hsl(0 0% 14.9%)',
    accentForeground: 'hsl(0 0% 98%)',
    destructive: 'hsl(0 70.9% 59.4%)',
    border: 'hsl(0 0% 40%)',
    input: 'hsl(205 14.63% 24%)',
    ring: 'hsl(300 0% 45%)',
    radius: '2rem',
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
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
