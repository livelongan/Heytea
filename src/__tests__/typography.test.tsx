import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import {
    TextNormal,
    TextSmall,
    TitleLevel1,
    TitleLevel2,
    TitleLevel3,
} from '../components/ui'

describe('typography components', () => {
    it('renders headings with the intended hierarchy and weights', () => {
        render(
            <>
                <TitleLevel1>Page title</TitleLevel1>
                <TitleLevel2>Section title</TitleLevel2>
                <TitleLevel3>Subsection title</TitleLevel3>
            </>,
        )

        expect(screen.getByRole('heading', { level: 1 })).toHaveClass('text-3xl', 'font-semibold')
        expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-2xl', 'font-medium')
        expect(screen.getByRole('heading', { level: 3 })).toHaveClass('text-xl', 'font-medium')
    })

    it('renders small muted and normal primary text with overridable classes', () => {
        render(
            <>
                <TextSmall data-testid="small-text">Helper text</TextSmall>
                <TextNormal className="text-center" data-testid="normal-text">
                    Body text
                </TextNormal>
            </>,
        )

        expect(screen.getByTestId('small-text')).toHaveClass('text-sm', 'text-slate-500')
        expect(screen.getByTestId('normal-text')).toHaveClass(
            'text-base',
            'text-slate-900',
            'text-center',
        )
    })
})
