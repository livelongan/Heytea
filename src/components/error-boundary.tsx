import { Component, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Button } from './ui/button'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError(): State {
        return { hasError: true }
    }

    render() {
        if (this.state.hasError) {
            return (
                <main
                    data-ui="error-boundary.page"
                    className="flex min-h-screen items-center justify-center bg-slate-100 p-6"
                >
                    <section
                        data-ui="error-boundary.fallback"
                        className="max-w-md space-y-4 rounded-md border border-slate-200 bg-white p-8 text-center"
                    >
                        <h1 className="text-2xl font-semibold">Something went wrong</h1>
                        <p className="text-sm text-slate-600">
                            This page could not be displayed. You can try again or return to the
                            dashboard.
                        </p>
                        <div className="flex justify-center gap-3">
                            <Button
                                data-ui="error-boundary.retry"
                                data-testid="error-boundary-retry"
                                onClick={() => this.setState({ hasError: false })}
                            >
                                Try again
                            </Button>
                            <Link
                                data-ui="error-boundary.dashboard-link"
                                data-testid="error-boundary-dashboard"
                                to="/dashboard"
                            >
                                <Button variant="secondary">Dashboard</Button>
                            </Link>
                        </div>
                    </section>
                </main>
            )
        }

        return this.props.children
    }
}
