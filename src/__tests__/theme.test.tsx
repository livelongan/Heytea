import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import { ThemeProvider } from '../components/theme-provider'
import ThemeToggle from '../components/theme-toggle'

describe('global theme', () => {
    beforeEach(() => {
        localStorage.clear()
        document.documentElement.dataset.theme = 'light'
    })

    it('switches between light and dark modes and persists the selection', async () => {
        const user = userEvent.setup()

        render(
            <ThemeProvider>
                <ThemeToggle />
            </ThemeProvider>,
        )

        await user.click(screen.getByRole('button', { name: /switch to dark mode/i }))

        await waitFor(() => {
            expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
            expect(localStorage.getItem('learning-lab-theme')).toBe('dark')
        })
        expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /switch to light mode/i }))

        await waitFor(() => {
            expect(document.documentElement).toHaveAttribute('data-theme', 'light')
            expect(localStorage.getItem('learning-lab-theme')).toBe('light')
        })
    })
})
