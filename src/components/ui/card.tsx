import * as React from 'react'

import { cn } from '../../utils/utils'
import { TextSmall, TitleLevel3 } from './typography'

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-ui="ui.card"
            className={cn(
                'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm',
                className,
            )}
            {...props}
        />
    ),
)
Card.displayName = 'Card'

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-ui="ui.card-header"
            className={cn('flex flex-col space-y-1.5 px-5 py-6', className)}
            {...props}
        />
    ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <TitleLevel3
            ref={ref}
            data-ui="ui.card-title"
            className={cn('leading-none tracking-tight', className)}
            {...props}
        />
    ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ ...props }, ref) => (
        <TextSmall
            ref={ref}
            data-ui="ui.card-description"
            {...props}
        />
    ),
)
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-ui="ui.card-content"
            className={cn('p-5 pt-0 md:py-6', className)}
            {...props}
        />
    ),
)
CardContent.displayName = 'CardContent'

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
