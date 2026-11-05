import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../utils/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            variant: {
                default: 'bg-slate-900 text-white hover:bg-slate-800',
                secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200',
                outline: 'border border-slate-200 bg-white hover:bg-slate-50',
                ghost: 'hover:bg-slate-100',
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref as never}
                data-tag="button"
                {...props}
            />
        )
    },
)
Button.displayName = 'Button'

export type ButtonFlatProps = Omit<ButtonProps, 'variant'>

export const ButtonFlat = React.forwardRef<HTMLButtonElement, ButtonFlatProps>((props, ref) => (
    <Button ref={ref} variant="ghost" data-tag="button-flat" {...props} />
))
ButtonFlat.displayName = 'ButtonFlat'

export type ButtonOutlinedProps = Omit<ButtonProps, 'variant'>

export const ButtonOutlined = React.forwardRef<HTMLButtonElement, ButtonOutlinedProps>(
    (props, ref) => <Button ref={ref} variant="outline" data-tag="button-outlined" {...props} />,
)
ButtonOutlined.displayName = 'ButtonOutlined'

export type ButtonPrimaryProps = Omit<ButtonProps, 'variant'>

export const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
    (props, ref) => <Button ref={ref} variant="default" data-tag="button-primary" {...props} />,
)
ButtonPrimary.displayName = 'ButtonPrimary'

export type ButtonSecondaryProps = Omit<ButtonProps, 'variant'>

export const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonSecondaryProps>(
    (props, ref) => (
        <Button ref={ref} variant="secondary" data-tag="button-secondary" {...props} />
    ),
)
ButtonSecondary.displayName = 'ButtonSecondary'
