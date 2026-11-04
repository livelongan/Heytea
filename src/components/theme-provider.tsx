import { useEffect, useState, type ReactNode } from 'react'

import { ThemeContext, type Theme } from './theme-context'
import { readSavedTheme, saveTheme } from '../utils/theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(readSavedTheme)

    useEffect(() => {
        document.documentElement.dataset.theme = theme
        saveTheme(theme)
    }, [theme])

    const toggleTheme = () => setTheme((current) => (current === 'light' ? 'dark' : 'light'))

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
