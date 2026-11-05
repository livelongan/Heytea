import * as React from 'react'

import { cn } from '../../utils/utils'

export const TitleLevel1 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h1'>>(
    ({ className, ...props }, ref) => (
        <h1
            ref={ref}
            className={cn('text-3xl font-semibold text-slate-900', className)}
            data-tag={'title-level-1'}
            {...props}
        />
    ),
)
TitleLevel1.displayName = 'TitleLevel1'

export const TitleLevel2 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h2'>>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn('text-2xl font-medium text-slate-900', className)}
            data-tag={'title-level-2'}
            {...props}
        />
    ),
)
TitleLevel2.displayName = 'TitleLevel2'

export const TitleLevel3 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h3'>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-xl font-medium text-slate-900', className)}
            data-tag={'title-level-3'}
            {...props}
        />
    ),
)
TitleLevel3.displayName = 'TitleLevel3'

export const TextSmall = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <small
            ref={ref}
            className={cn('text-sm text-slate-500', className)}
            data-tag={'text-small'}
            {...props}
        />
    ),
)
TextSmall.displayName = 'TextSmall'

export const TextNormal = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref} className={cn('text-base text-slate-900', className)}
            data-tag={'text-normal'}
            {...props}
        />
    ),
)
TextNormal.displayName = 'TextNormal'


export const TextSlate = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-slate-500', className)}
            data-tag={'text-slate'}
            {...props}
        />
    ),
)
TextSlate.displayName = 'TextSlate'

export const TextAccent = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-accent-500', className)}
            data-tag={'text-accent'}
            {...props}
        />
    ),
)
TextAccent.displayName = 'TextAccent'

export const TextError = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-red-500', className)}
            data-tag={'text-error'}
            {...props}
        />
    ),
)
TextError.displayName = 'TextError'



export const TextBase = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <span
            ref={ref}
            className={cn('text-base', className)}
            data-tag={'text-base'}
            {...props}
        />
    ),
)
TextBase.displayName = 'TextBase'

