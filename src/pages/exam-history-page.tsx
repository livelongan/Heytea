import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { fetchExamHistory } from '../api/api'
import { ButtonPrimary,   } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TextSmall, TitleLevel1, TitleLevel3 } from '../components/ui/typography'
import type { ExamResult } from '../types'
import { FlexRow } from '../components/ui/wrapper'

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
            <FlexRow
                data-ui="exam-history.heading"
                className="flex-wrap items-end justify-between gap-4"
            >
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">
                        React foundations
                    </p>
                    <TitleLevel1 className="mt-1">My exams</TitleLevel1>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <Link
                        data-ui="exam-history.new-exam-link"
                        data-testid="exam-history-new-exam"
                        to="/exam/new"
                        style={{ width: 'fit-content', minWidth: '260px' }}
                    >
                        <ButtonPrimary>Start a new exam</ButtonPrimary>
                    </Link>
                </div>
            </FlexRow>
            {error && (
                <TextSmall data-ui="exam-history.error" role="alert" className="text-red-700">
                    {error}
                </TextSmall>
            )}
            {isLoading ? (
                <TextSmall data-ui="exam-history.loading" role="status">
                    Loading exam history…
                </TextSmall>
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
                            <ButtonPrimary>Start your first exam</ButtonPrimary>
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
                                <CardContent className="py-5">
                                    <FlexRow className="flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <TitleLevel3 className="text-base">
                                                React foundations assessment
                                            </TitleLevel3>
                                            <TextSmall className="mt-1">
                                                {new Date(item.submittedAt).toLocaleString()} ·{' '}
                                                {item.correctCount}/{item.totalQuestions} correct ·{' '}
                                                {item.passed ? 'Passed' : 'Review needed'}
                                            </TextSmall>
                                        </div>
                                        <span className="text-2xl font-bold">
                                            {item.score}/100 points
                                        </span>
                                    </FlexRow>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}
