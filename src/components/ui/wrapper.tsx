import * as React from 'react'

import { cn } from '../../utils/utils'

export const FlexColumn = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-col gap-4', className)}
        data-tag="layout-flex-column"
        {...props}
    />
))
FlexColumn.displayName = 'FlexColumn'

export const FlexRow = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('flex flex-row gap-4', className)}
        data-tag="layout-flex-row"
        {...props}
    />
))
FlexRow.displayName = 'FlexRow'
