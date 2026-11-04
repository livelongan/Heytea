const THEME_STORAGE_KEY = 'learning-lab-theme'

export function readSavedTheme(): 'light' | 'dark' {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light'
    } catch {
        return 'light'
    }
}

export function initializeTheme() {
    if (typeof document !== 'undefined') {
        document.documentElement.dataset.theme = readSavedTheme()
    }
}

export function saveTheme(theme: 'light' | 'dark') {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
        // The selected theme remains active for the current page if storage is unavailable.
    }
}
