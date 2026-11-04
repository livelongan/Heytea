import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchExamHistory } from '../api/api'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import type { ExamResult } from '../types'

export default function ExamHistoryPage() {
    const [history, setHistory] = useState<ExamResult[]>([])
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let active = true
        fetchExamHistory()
            .then((items) => {
                if (active) setHistory(items)
            })
            .catch((caughtError: unknown) => {
                if (active)
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'Unable to load exam history.',
                    )
            })
            .finally(() => {
                if (active) setIsLoading(false)
            })
        return () => {
            active = false
        }
    }, [])

    return (
        <div data-ui="exam-history.page" className="mx-auto max-w-5xl space-y-6">
            <div
                data-ui="exam-history.heading"
                className="flex flex-wrap items-end justify-between gap-4"
            >
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">
                        React foundations
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold">My exams</h1>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link
                        data-ui="exam-history.new-exam-link"
                        data-testid="exam-history-new-exam"
                        to="/exam/new"
                        style={{ width: 'fit-content', minWidth: '260px' }}
                    >
                        <Button>Start a new exam</Button>
                    </Link>
                </div>
            </div>
            {error && (
                <p data-ui="exam-history.error" role="alert" className="text-red-700">
                    {error}
                </p>
            )}
            {isLoading ? (
                <p data-ui="exam-history.loading" role="status">
                    Loading exam history…
                </p>
            ) : history.length === 0 ? (
                <Card data-ui="exam-history.empty-state">
                    <CardHeader>
                        <CardTitle>No completed exams</CardTitle>
                        <CardDescription>
                            Your submitted assessments will appear here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link
                            data-ui="exam-history.empty-start-link"
                            data-testid="exam-history-empty-start"
                            to="/exam/new"
                        >
                            <Button>Start your first exam</Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {history.map((item) => (
                        <Link
                            key={item.attemptId}
                            data-ui={`exam-history.result.${item.attemptId}`}
                            data-testid={`exam-history-result-${item.attemptId}`}
                            to={`/exam/result/${item.attemptId}`}
                            className="block rounded-md focus-visible:outline-2 focus-visible:outline-sky-700"
                        >
                            <Card
                                data-ui={`exam-history.result-card.${item.attemptId}`}
                                data-testid={`exam-history-result-card-${item.attemptId}`}
                                className="transition-colors hover:border-sky-500"
                            >
                                <CardContent className="flex flex-wrap items-center justify-between gap-4 py-5">
                                    <div>
                                        <p className="font-semibold">
                                            React foundations assessment
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {new Date(item.submittedAt).toLocaleString()} ·{' '}
                                            {item.correctCount}/{item.totalQuestions} correct ·{' '}
                                            {item.passed ? 'Passed' : 'Review needed'}
                                        </p>
                                    </div>
                                    <span className="text-2xl font-bold">
                                        {item.score}/100 points
                                    </span>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
