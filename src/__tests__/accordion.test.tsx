import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { Accordion } from '../components/ui/accordion'

describe('Accordion', () => {
    it('toggles content from its default collapsed state', () => {
        render(
            <Accordion title="Review" subtitle="Details" icon={<span>Icon</span>}>
                Accordion content
            </Accordion>,
        )

        const trigger = screen.getByRole('button', { name: /review/i })
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(screen.getByText('Accordion content')).not.toBeVisible()

        fireEvent.click(trigger)

        expect(trigger).toHaveAttribute('aria-expanded', 'true')
        expect(screen.getByText('Accordion content')).toBeVisible()
    })

    it('supports defaultExpanded and controlled expand state', () => {
        const onExpandChange = vi.fn()
        const { rerender } = render(
            <Accordion title="Review" defaultExpanded onExpandChange={onExpandChange}>
                Accordion content
            </Accordion>,
        )

        const trigger = screen.getByRole('button', { name: /review/i })
        expect(trigger).toHaveAttribute('aria-expanded', 'true')

        rerender(
            <Accordion title="Review" expand={false} onExpandChange={onExpandChange}>
                Accordion content
            </Accordion>,
        )
        expect(trigger).toHaveAttribute('aria-expanded', 'false')

        fireEvent.click(trigger)
        expect(onExpandChange).toHaveBeenCalledWith(true)
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })
})
