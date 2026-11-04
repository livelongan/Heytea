import * as React from 'react'

import { cn } from '../../utils/utils'

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
            className={cn('flex flex-col space-y-1.5 p-6', className)}
            {...props}
        />
    ),
)
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-ui="ui.card-title"
            className={cn('text-xl font-semibold leading-none tracking-tight', className)}
            {...props}
        />
    ),
)
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            data-ui="ui.card-description"
            className={cn('text-sm text-slate-500', className)}
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
            className={cn('p-4 pt-0 md:p-6', className)}
            {...props}
        />
    ),
)
CardContent.displayName = 'CardContent'

export { Card, CardContent, CardDescription, CardHeader, CardTitle }
