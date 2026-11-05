import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ButtonFlat, ButtonOutlined, ButtonPrimary, ButtonSecondary } from '../components/ui/button'

describe('button data tags', () => {
    it('identifies each button variant', () => {
        render(
            <>
                <ButtonFlat>Flat</ButtonFlat>
                <ButtonOutlined>Outlined</ButtonOutlined>
                <ButtonPrimary>Primary</ButtonPrimary>
                <ButtonSecondary>Secondary</ButtonSecondary>
            </>,
        )

        expect(screen.getByRole('button', { name: 'Flat' })).toHaveAttribute(
            'data-tag',
            'button-flat',
        )
        expect(screen.getByRole('button', { name: 'Outlined' })).toHaveAttribute(
            'data-tag',
            'button-outlined',
        )
        expect(screen.getByRole('button', { name: 'Primary' })).toHaveAttribute(
            'data-tag',
            'button-primary',
        )
        expect(screen.getByRole('button', { name: 'Secondary' })).toHaveAttribute(
            'data-tag',
            'button-secondary',
        )
    })
})
