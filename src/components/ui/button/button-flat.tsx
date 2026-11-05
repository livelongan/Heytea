import * as React from 'react'

import { Button, type ButtonProps } from './button-base'

export type ButtonFlatProps = Omit<ButtonProps, 'variant'>

export const ButtonFlat = React.forwardRef<HTMLButtonElement, ButtonFlatProps>((props, ref) => (
    <Button ref={ref} variant="ghost" {...props} />
))
ButtonFlat.displayName = 'ButtonFlat'
