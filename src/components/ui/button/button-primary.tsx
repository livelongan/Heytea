import * as React from 'react'

import { Button, type ButtonProps } from './button-base'

export type ButtonPrimaryProps = Omit<ButtonProps, 'variant'>

export const ButtonPrimary = React.forwardRef<HTMLButtonElement, ButtonPrimaryProps>(
    (props, ref) => <Button ref={ref} variant="default" {...props} />,
)
ButtonPrimary.displayName = 'ButtonPrimary'
