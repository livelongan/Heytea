import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FlexColumn, FlexRow } from '../components/ui/wrapper'

describe('flex layout components', () => {
    it('renders column and row containers with overridable classes', () => {
        render(
            <>
                <FlexColumn className="gap-2" data-testid="column">
                    Column content
                </FlexColumn>
                <FlexRow className="items-center" data-testid="row">
                    Row content
                </FlexRow>
            </>,
        )

        expect(screen.getByTestId('column')).toHaveClass('flex', 'flex-col', 'gap-2')
        expect(screen.getByTestId('column')).toHaveAttribute('data-tag', 'layout-flex-column')
        expect(screen.getByTestId('row')).toHaveClass('flex', 'flex-row', 'items-center')
        expect(screen.getByTestId('row')).toHaveAttribute('data-tag', 'layout-flex-row')
    })
})
