import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { LinkText } from '../components/ui/link'

describe('LinkText', () => {
    it('renders a styled router link with the requested destination', () => {
        render(
            <MemoryRouter>
                <LinkText to="/dashboard">Dashboard</LinkText>
            </MemoryRouter>,
        )

        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
            'href',
            '/dashboard',
        )
        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute(
            'data-tag',
            'link-text',
        )
        expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveClass('underline')
    })
})
