import * as React from 'react'

import { cn } from '../../utils/utils'
import { TextSmall, TitleLevel3 } from './typography'

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm',
                className,
            )}
            data-tag={'card'}
            {...props}
        />
    ),
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5 px-5 py-6', className)}
            data-tag={'card-header'}
            {...props}
        />
    ),
)
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <TitleLevel3
            ref={ref}
            className={cn('leading-none tracking-tight', className)}
            data-tag={'card-title'}
            {...props}
        />
    ),
)
CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ ...props }, ref) => (
        <TextSmall
            ref={ref}
            data-tag={'card-description'}
            {...props}
        />
    ),
)
CardDescription.displayName = 'CardDescription'

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('p-5 pt-0 md:py-6', className)}
            data-tag={'card-content'}
            {...props}
        />
    ),
)
CardContent.displayName = 'CardContent' 