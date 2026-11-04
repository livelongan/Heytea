import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export type ThemeContextValue = {
    theme: Theme
    toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
    theme: 'light',
    toggleTheme: () => undefined,
})

export function useTheme() {
    return useContext(ThemeContext)
}
