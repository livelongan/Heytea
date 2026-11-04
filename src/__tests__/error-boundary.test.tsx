import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ErrorBoundary from '../components/error-boundary'

function BrokenPage(): never {
    throw new Error('internal stack detail')
}

describe('global error boundary', () => {
    afterEach(() => vi.restoreAllMocks())

    it('shows a recoverable fallback without exposing exception details', () => {
        vi.spyOn(console, 'error').mockImplementation(() => undefined)

        render(
            <MemoryRouter>
                <ErrorBoundary>
                    <BrokenPage />
                </ErrorBoundary>
            </MemoryRouter>,
        )

        expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument()
        expect(document.querySelector('[data-ui="error-boundary.fallback"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="error-boundary.retry"]')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
        expect(screen.getByTestId('error-boundary-retry')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute(
            'href',
            '/dashboard',
        )
        expect(screen.queryByText(/internal stack detail/i)).not.toBeInTheDocument()
    })
})
