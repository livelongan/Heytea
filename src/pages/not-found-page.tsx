import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'

export default function NotFoundPage() {
    return (
        <section
            data-ui="not-found.page"
            className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 text-center"
        >
            <p className="text-sm font-semibold uppercase text-sky-700">404 · Page not found</p>
            <h1 className="text-3xl font-semibold">This page does not exist</h1>
            <p className="text-slate-600">The address may be outdated or incorrect.</p>
            <Link data-ui="not-found.home-link" data-testid="not-found-home" to="/dashboard">
                <Button>Return to dashboard</Button>
            </Link>
        </section>
    )
}
