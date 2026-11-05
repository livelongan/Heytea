import * as React from 'react'

import { Button, type ButtonProps } from './button-base'

export type ButtonSecondaryProps = Omit<ButtonProps, 'variant'>

export const ButtonSecondary = React.forwardRef<HTMLButtonElement, ButtonSecondaryProps>(
    (props, ref) => <Button ref={ref} variant="secondary" {...props} />,
)
ButtonSecondary.displayName = 'ButtonSecondary'
