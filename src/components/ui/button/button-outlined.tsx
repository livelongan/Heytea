import * as React from 'react'

import { Button, type ButtonProps } from './button-base'

export type ButtonOutlinedProps = Omit<ButtonProps, 'variant'>

export const ButtonOutlined = React.forwardRef<HTMLButtonElement, ButtonOutlinedProps>(
    (props, ref) => <Button ref={ref} variant="outline" {...props} />,
)
ButtonOutlined.displayName = 'ButtonOutlined'
