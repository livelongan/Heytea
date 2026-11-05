import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '../../utils/utils'

export interface AccordionProps
    extends Omit<React.ComponentPropsWithoutRef<'section'>, 'title' | 'children'> {
    icon?: React.ReactNode
    title: React.ReactNode
    subtitle?: React.ReactNode
    children: React.ReactNode
    expand?: boolean
    defaultExpanded?: boolean
    onExpandChange?: (expanded: boolean) => void
}

export function Accordion({
    icon,
    title,
    subtitle,
    children,
    expand,
    defaultExpanded = false,
    onExpandChange,
    className,
    ...props
}: AccordionProps) {
    const [internalExpanded, setInternalExpanded] = React.useState(defaultExpanded)
    const contentId = React.useId()
    const triggerId = React.useId()
    const isExpanded = expand ?? internalExpanded

    const toggleExpanded = () => {
        const nextExpanded = !isExpanded
        if (expand === undefined) setInternalExpanded(nextExpanded)
        onExpandChange?.(nextExpanded)
    }

    return (
        <section
            className={cn('overflow-hidden rounded-lg border border-slate-200', className)}
            {...props}
        >
            <button
                id={triggerId}
                type="button"
                aria-expanded={isExpanded}
                aria-controls={contentId}
                onClick={toggleExpanded}
                className="flex w-full cursor-pointer items-center justify-between gap-4 bg-white px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-600"
            >
                <span className="flex min-w-0 items-center gap-3">
                    {icon && (
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-sky-100 text-sky-800">
                            <span aria-hidden="true">{icon}</span>
                        </span>
                    )}
                    <span className="min-w-0">
                        <span className="block font-semibold text-slate-900">{title}</span>
                        {subtitle && (
                            <span className="mt-0.5 block text-sm text-slate-500">{subtitle}</span>
                        )}
                    </span>
                </span>
                <ChevronDown
                    className={cn(
                        'h-5 w-5 shrink-0 text-sky-800 transition-transform duration-200',
                        isExpanded && 'rotate-180',
                    )}
                    aria-hidden="true"
                />
            </button>
            <div
                id={contentId}
                aria-labelledby={triggerId}
                hidden={!isExpanded}
                className="pb-4"
            >
                {children}
            </div>
        </section>
    )
}
