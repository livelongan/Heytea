import * as React from 'react'

import { cn } from '../../../utils/utils'

const TitleLevel1 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h1'>>(
    ({ className, ...props }, ref) => (
        <h1
            ref={ref}
            className={cn('text-3xl font-semibold text-slate-900', className)}
            {...props}
        />
    ),
)
TitleLevel1.displayName = 'TitleLevel1'

const TitleLevel2 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h2'>>(
    ({ className, ...props }, ref) => (
        <h2
            ref={ref}
            className={cn('text-2xl font-medium text-slate-900', className)}
            {...props}
        />
    ),
)
TitleLevel2.displayName = 'TitleLevel2'

const TitleLevel3 = React.forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<'h3'>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-xl font-medium text-slate-900', className)}
            {...props}
        />
    ),
)
TitleLevel3.displayName = 'TitleLevel3'

const TextSmall = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-slate-500', className)}
            {...props}
        />
    ),
)
TextSmall.displayName = 'TextSmall'

const TextNormal = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref} className={cn('text-base text-slate-900', className)}
            {...props}
        />
    ),
)
TextNormal.displayName = 'TextNormal'


const TextSlate = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-slate-500', className)}
            {...props}
        />
    ),
)
TextSlate.displayName = 'TextSlate'

const TextAccent = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-accent-500', className)}
            {...props}
        />
    ),
)
TextAccent.displayName = 'TextAccent'

const TextError = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-base text-red-500', className)}
            {...props}
        />
    ),
)
TextError.displayName = 'TextError'



const TextBase = React.forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<'p'>>(
    ({ className, ...props }, ref) => (
        <span
            ref={ref}
            className={cn('text-base', className)}
            {...props}
        />
    ),
)
TextBase.displayName = 'TextBase'

export { TitleLevel1, TitleLevel2, TitleLevel3, TextNormal, TextSmall, TextError, TextSlate, TextAccent, TextBase }
