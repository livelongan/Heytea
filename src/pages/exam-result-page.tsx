import { ChevronDown, CircleCheck, CircleX, ListChecks } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { fetchExamResult } from '../api/api'
import { FlexColumn, FlexRow } from '../components/ui/wrapper'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import type { ExamAnswer, ExamResult } from '../types'
import { Accordion } from '../components/ui/accordion'
import { ButtonPrimary } from '../components/ui/button'
import { LinkText } from '../components/ui/link'
import { TitleLevel1, TextNormal, TextSmall, TextBase } from '../components/ui/typography'

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
                <TitleLevel1 className="text-2xl">Result unavailable</TitleLevel1>
                <TextNormal>{error}</TextNormal>
                <LinkText data-testid="exam-result-error-history" to="/exam/history">
                    <ButtonPrimary>View exam history</ButtonPrimary>
                </LinkText>
            </section>
        )
    if (!result)
        return (
            <TextNormal data-ui="exam-result.loading" role="status">
                Loading exam result…
            </TextNormal>
        )

    const answeredCount = result.questions.filter((item) => item.answer !== null).length

    return (
        <div data-ui="exam-result.page" className="mx-auto max-w-5xl space-y-10">
            <section
                data-ui="exam-result.summary"
                className="mx-auto max-w-2xl px-4 py-10"
                aria-label="Exam completion summary"
            >
                <FlexColumn className="min-h-[65vh] items-center justify-center gap-0 text-center">
                    <span className="mb-8 grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <CircleCheck className="h-10 w-10" aria-hidden="true" />
                    </span>
                    <TitleLevel1
                        data-ui="exam-result.heading"
                        className="text-3xl font-bold tracking-tight"
                    >
                        {result.submittedAutomatically
                            ? "Time's up, your exam is complete"
                            : 'Your exam is complete'}
                    </TitleLevel1>
                    <FlexRow
                        data-ui="exam-result.metric.score"
                        className="mt-10 items-baseline justify-center gap-2 text-emerald-700"
                    >
                        <span data-testid="exam-result-score" className="text-7xl font-semibold">
                            {result.score}
                        </span>
                        <span className="text-lg">points</span>
                    </FlexRow>
                    <TextSmall data-ui="exam-result.answer-counts" className="mt-8">
                        Answered {answeredCount} <span className="px-1">·</span> Correct{' '}
                        {result.correctCount}
                        <span className="text-slate-500 mx-5">
                            Duration: {formatDuration(result.durationSeconds)}
                        </span>
                    </TextSmall>
                    <LinkText
                        data-ui="exam-result.history-link"
                        data-testid="exam-result-history"
                        to="/exam/history"
                        className="mt-8"
                    >
                        Exam history
                    </LinkText>
                    <Link
                        data-ui="exam-result.restart"
                        data-testid="exam-result-restart"
                        to="/exam/new"
                        className="mt-6"
                    >
                        <ButtonPrimary className="min-w-32 bg-sky-800 hover:bg-sky-700">
                            Restart
                        </ButtonPrimary>
                    </Link>
                </FlexColumn>
            </section>

            <Accordion
                data-ui="exam-result.question-review"
                icon={<ListChecks className="h-5 w-5" aria-hidden="true" />}
                title="Review answers"
                subtitle={
                    <>
                        View correct answers and explanations
                        <span className="ml-2 hidden sm:inline">
                            · {result.totalQuestions} questions
                        </span>
                    </>
                }
                className="border-0"
            >
                <div className="space-y-4 pt-4">
                    {result.questions.map((item, index) => (
                        <Card
                            key={item.question.id}
                            data-ui={`exam-result.question.${item.question.id}`}
                            data-testid={`exam-result-question-${item.question.id}`}
                            className={item.isCorrect ? 'border-emerald-300' : 'border-red-300'}
                        >
                            <CardHeader className="space-y-5">
                                <FlexRow className="items-center justify-between gap-3">
                                    <CardDescription>
                                        Question {index + 1} · {item.question.type}
                                    </CardDescription>
                                    <span
                                        data-ui="exam-result.answer-status"
                                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold ${item.isCorrect ? 'bg-emerald-100 text-emerald-900' : 'bg-red-100 text-red-900'}`}
                                    >
                                        {item.isCorrect ? (
                                            <CircleCheck className="h-4 w-4" aria-hidden="true" />
                                        ) : (
                                            <CircleX className="h-4 w-4" aria-hidden="true" />
                                        )}
                                        {item.isCorrect ? 'Correct' : 'Incorrect'}
                                    </span>
                                </FlexRow>
                                <div>
                                    <CardTitle className="text-xl leading-7">
                                        {item.question.stem}
                                    </CardTitle>
                                    {item.question.description && (
                                        <TextSmall className="mt-2 text-sm leading-6 text-slate-600">
                                            {item.question.description}
                                        </TextSmall>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="border-t border-slate-200 pt-4">
                                    <TextNormal className="text-lg">
                                        <TextBase className="font-semibold">Your answer:</TextBase>{' '}
                                        {answerLabel(item.answer, item.question.options)}
                                    </TextNormal>
                                    <TextNormal className="mt-3 text-lg">
                                        <TextBase className="font-semibold">
                                            Correct answer:
                                        </TextBase>{' '}
                                        {answerLabel(item.correctAnswer, item.question.options)}
                                    </TextNormal>
                                </div>
                                <details className="group">
                                    <summary className="cursor-pointer list-none py-1 font-semibold text-slate-800 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 [&::-webkit-details-marker]:hidden">
                                        <FlexRow className="items-center justify-end gap-2">
                                            <span>Explanation</span>
                                            <ChevronDown
                                                className="h-5 w-5 transition-transform duration-200 group-open:rotate-180"
                                                aria-hidden="true"
                                            />
                                        </FlexRow>
                                    </summary>
                                    <TextNormal className="border-t border-slate-200 pt-3">
                                        {item.explanation}
                                    </TextNormal>
                                </details>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </Accordion>
        </div>
    )
}
