import { Moon, Sun } from 'lucide-react'

import { Button } from './ui/button'
import { useTheme } from './theme-context'

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()
    const nextTheme = theme === 'light' ? 'dark' : 'light'

    return (
        <Button
            data-ui="theme.toggle"
            data-testid="theme-toggle"
            type="button"
            variant="secondary"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={toggleTheme}
            aria-label={`Switch to ${nextTheme} mode`}
            title={`Switch to ${nextTheme} mode`}
        >
            {theme === 'light' ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
            )}
        </Button>
    )
}
