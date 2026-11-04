import { ChevronDown, CircleCheck, CircleX, ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { fetchExamResult } from '../api/api'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import type { ExamAnswer, ExamResult } from '../types'

function answerLabel(
    answer: ExamAnswer | null,
    options: ExamResult['questions'][number]['question']['options'],
) {
    if (answer === null) return 'No answer'
    const ids = Array.isArray(answer) ? answer : [answer]
    return ids.map((id) => options.find((option) => option.id === id)?.text ?? id).join(', ')
}

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60)
    const remainder = seconds % 60
    return `${minutes}m ${remainder}s`
}

export default function ExamResultPage() {
    const { attemptId } = useParams()
    const [result, setResult] = useState<ExamResult | null>(null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!attemptId) return
        let active = true
        fetchExamResult(attemptId)
            .then((data) => {
                if (active) setResult(data)
            })
            .catch((caughtError: unknown) => {
                if (active)
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'Unable to load result.',
                    )
            })
        return () => {
            active = false
        }
    }, [attemptId])

    if (error)
        return (
            <section data-ui="exam-result.error" role="alert" className="space-y-4">
                <h1 className="text-2xl font-semibold">Result unavailable</h1>
                <p>{error}</p>
                <Link data-testid="exam-result-error-history" to="/exam/history">
                    <Button>View exam history</Button>
                </Link>
            </section>
        )
    if (!result)
        return (
            <p data-ui="exam-result.loading" role="status">
                Loading exam result…
            </p>
        )

    const answeredCount = result.questions.filter((item) => item.answer !== null).length

    return (
        <div data-ui="exam-result.page" className="mx-auto max-w-5xl space-y-10">
            <section
                data-ui="exam-result.summary"
                className="mx-auto flex min-h-[65vh] max-w-2xl flex-col items-center justify-center px-4 py-10 text-center"
                aria-label="Exam completion summary"
            >
                <span className="mb-8 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                    <CircleCheck className="h-10 w-10" aria-hidden="true" />
                </span>
                <h1 data-ui="exam-result.heading" className="text-3xl font-bold tracking-tight">
                    {result.submittedAutomatically
                        ? "Time's up, your exam is complete"
                        : 'Your exam is complete'}
                </h1>
                {/* <p className="mt-4 max-w-lg text-base leading-7 text-slate-500">
                    {result.submittedAutomatically
                        ? 'Your exam was submitted automatically, and your answers have been saved.'
                        : 'Your exam has been submitted, and your answers have been saved.'}
                </p> */}
                <div
                    data-ui="exam-result.metric.score"
                    className="mt-10 flex items-baseline justify-center gap-2 text-emerald-700"
                >
                    <span data-testid="exam-result-score" className="text-7xl font-semibold">
                        {result.score}
                    </span>
                    <span className="text-lg">points</span>
                </div>
                <p data-ui="exam-result.answer-counts" className="mt-8 text-slate-500">
                    Answered {answeredCount} <span className="px-1">·</span> Correct{' '}
                    {result.correctCount}
                    <span className="text-slate-500 mx-5">
                        Duration: {formatDuration(result.durationSeconds)}
                    </span>
                    <Link
                        data-ui="exam-result.history-link"
                        data-testid="exam-result-history"
                        to="/exam/history"
                        className="text-slate-500 underline underline-offset-4 hover:text-slate-900"
                    >
                        Exam history
                    </Link>
                </p>
                <Link
                    data-ui="exam-result.restart"
                    data-testid="exam-result-restart"
                    to="/exam/new"
                    className="mt-6"
                >
                    <Button className="min-w-32 bg-sky-800 hover:bg-sky-700">Restart</Button>
                </Link>
                {/* <div className="mt-4 flex items-center gap-4 text-sm">
                    <Link
                        data-ui="exam-result.history-link"
                        data-testid="exam-result-history"
                        to="/exam/history"
                        className="text-slate-500 underline underline-offset-4 hover:text-slate-900"
                    >
                        Exam history
                    </Link>
                    <span aria-hidden="true" className="text-slate-300">
                        ·
                    </span>
                    <span className="text-slate-500">
                        Duration: {formatDuration(result.durationSeconds)}
                    </span>
                </div> */}
            </section>

            <details data-ui="exam-result.question-review" className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-5 py-4 shadow-sm transition-colors hover:border-sky-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 [&::-webkit-details-marker]:hidden">
                    <span className="flex min-w-0 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-sky-100 text-sky-800">
                            <ListChecks className="h-5 w-5" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                            <span className="block font-semibold">Review answers</span>
                            <span className="mt-0.5 block text-sm font-normal text-slate-500">
                                View correct answers and explanations
                            </span>
                        </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                        <span className="hidden sm:inline">{result.totalQuestions} questions</span>
                        <ChevronDown
                            className="h-5 w-5 text-sky-800 transition-transform duration-200 group-open:rotate-180"
                            aria-hidden="true"
                        />
                    </span>
                </summary>
                <div className="mt-4 space-y-4">
                    {result.questions.map((item, index) => (
                        <Card
                            key={item.question.id}
                            data-ui={`exam-result.question.${item.question.id}`}
                            data-testid={`exam-result-question-${item.question.id}`}
                            className={item.isCorrect ? 'border-emerald-300' : 'border-red-300'}
                        >
                            <CardHeader>
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <CardDescription>
                                            Question {index + 1} · {item.question.type}
                                        </CardDescription>
                                        <CardTitle className="mt-2 text-lg">
                                            {item.question.stem}
                                        </CardTitle>
                                        {item.question.description && (
                                            <p className="mt-2 text-sm leading-6 text-slate-600">
                                                {item.question.description}
                                            </p>
                                        )}
                                    </div>
                                    <span
                                        data-ui="exam-result.answer-status"
                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-sm px-2 py-1 text-sm font-semibold ${item.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}
                                    >
                                        {item.isCorrect ? (
                                            <CircleCheck className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <CircleX className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <p>
                                    <span className="font-semibold">Your answer:</span>{' '}
                                    {answerLabel(item.answer, item.question.options)}
                                </p>
                                <p>
                                    <span className="font-semibold">Correct answer:</span>{' '}
                                    {answerLabel(item.correctAnswer, item.question.options)}
                                </p>
                                <p className="border-t border-slate-200 pt-3 text-slate-700">
                                    <span className="font-semibold">Explanation:</span>{' '}
                                    {item.explanation}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </details>
        </div>
    )
}
