import * as React from 'react'
import { Link, type LinkProps } from 'react-router-dom'

import { cn } from '../../utils/utils'

export const LinkText = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, ...props }, ref) => (
        <Link
            ref={ref}
            className={cn(
                'text-orange-600 underline underline-offset-4 transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600',
                className,
            )}
            data-tag="link-text"
            {...props}
        />
    ),
)
LinkText.displayName = 'LinkText'
