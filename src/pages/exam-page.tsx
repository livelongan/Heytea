import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchExamQuestions, submitExamAttempt } from '../api/api'
import {
    ButtonFlat,
    ButtonPrimary,
    ButtonSecondary,
} from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TextNormal, TextSmall, TitleLevel1, TitleLevel2, TextError, TextSlate }
    from '../components/ui/typography'
import type { ExamAnswer, ExamDraft, ExamQuestion } from '../types'
import {
    EXAM_DRAFT_KEY,
    EXAM_DURATION_MS,
    LAST_EXAM_KEY,
    readExamDraft,
    saveExamDraft,
} from '../utils/exam-session'
import { FlexRow } from '../components/ui/wrapper'

function formatTime(milliseconds: number) {
    const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000))
    const minutes = Math.floor(totalSeconds / 60)
        .toString()
        .padStart(2, '0')
    const seconds = (totalSeconds % 60).toString().padStart(2, '0')
    return `${minutes}:${seconds}`
}

export default function ExamPage() {
    const navigate = useNavigate()
    const [questions, setQuestions] = useState<ExamQuestion[]>([])
    const [draft, setDraft] = useState<ExamDraft | null>(null)
    const [now, setNow] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [error, setError] = useState('')
    const submitLock = useRef(false)
    const autoSubmitTriggered = useRef(false)
    const requestActive = useRef(false)

    useEffect(() => {
        requestActive.current = true

        const initialize = async () => {
            setIsLoading(true)
            try {
                const exam = await fetchExamQuestions()
                if (!requestActive.current) return
                const activeDraft = readExamDraft()
                if (!activeDraft || activeDraft.examId !== exam.examId) {
                    navigate('/exam', { replace: true })
                    return
                }
                setQuestions(exam.questions)
                setDraft(activeDraft)
                setNow(Date.now())
                autoSubmitTriggered.current = false
            } catch (caughtError) {
                if (requestActive.current)
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'Unable to load the exam.',
                    )
            } finally {
                if (requestActive.current) setIsLoading(false)
            }
        }

        void initialize()
        return () => {
            requestActive.current = false
        }
    }, [navigate])

    useEffect(() => {
        if (draft) saveExamDraft(draft)
    }, [draft])

    const submitAttempt = useCallback(
        async (automatic: boolean) => {
            if (!draft || submitLock.current) return
            submitLock.current = true
            setIsSubmitting(true)
            setError('')
            try {
                const result = await submitExamAttempt({
                    attemptId: draft.attemptId,
                    examId: draft.examId,
                    answers: draft.answers,
                    startedAt: draft.startedAt,
                    submittedAt: Date.now(),
                    automatic,
                })
                localStorage.removeItem(EXAM_DRAFT_KEY)
                localStorage.setItem(LAST_EXAM_KEY, result.attemptId)
                setDraft(null)
                navigate(`/exam/result/${result.attemptId}`, { replace: true })
            } catch (caughtError) {
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : 'Submission failed. Please retry.',
                )
            } finally {
                submitLock.current = false
                setIsSubmitting(false)
            }
        },
        [draft, navigate],
    )

    useEffect(() => {
        if (!draft || isLoading) return
        const timer = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(timer)
    }, [draft, isLoading])

    useEffect(() => {
        if (!draft || isLoading || now < draft.deadlineAt || autoSubmitTriggered.current) return
        autoSubmitTriggered.current = true
        void submitAttempt(true)
    }, [draft, isLoading, now, submitAttempt])

    const updateDraft = (changes: Partial<ExamDraft>) => {
        setDraft((current) => (current ? { ...current, ...changes } : current))
    }

    const currentQuestion = questions[draft?.currentIndex ?? 0]
    const remaining = draft ? draft.deadlineAt - now : EXAM_DURATION_MS
    const answeredCount = draft ? Object.keys(draft.answers).length : 0

    const saveAnswer = (questionId: string, answer: ExamAnswer) => {
        if (!draft) return
        const answers = { ...draft.answers }
        if (typeof answer === 'string' && !answer.trim()) delete answers[questionId]
        else answers[questionId] = answer
        updateDraft({ answers })
    }

    const toggleOption = (question: ExamQuestion, optionId: string) => {
        if (!draft) return
        if (question.type !== 'multiple') {
            saveAnswer(question.id, optionId)
            return
        }
        const selected = Array.isArray(draft.answers[question.id])
            ? (draft.answers[question.id] as string[])
            : []
        const answer = selected.includes(optionId)
            ? selected.filter((item) => item !== optionId)
            : [...selected, optionId]
        const answers = { ...draft.answers }
        if (answer.length > 0) answers[question.id] = answer
        else delete answers[question.id]
        updateDraft({ answers })
    }

    const toggleMarked = (questionId: string) => {
        if (!draft) return
        const marked = new Set(draft.markedQuestionIds)
        if (marked.has(questionId)) marked.delete(questionId)
        else marked.add(questionId)
        updateDraft({ markedQuestionIds: [...marked] })
    }

    if (isLoading) return <TextNormal role="status">Loading React assessment…</TextNormal>
    if (error && !draft) {
        return (
            <section className="mx-auto max-w-xl space-y-4" role="alert">
                <TitleLevel1 className="text-2xl">Exam unavailable</TitleLevel1>
                <TextNormal>{error}</TextNormal>
                <ButtonPrimary
                    data-testid="exam-load-retry"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </ButtonPrimary>
            </section>
        )
    }
    if (!draft || !currentQuestion)
        return <TextNormal role="status">Preparing your exam…</TextNormal>

    const answer = draft.answers[currentQuestion.id]
    const selectedIds = Array.isArray(answer) ? answer : answer ? [answer] : []
    const isMarked = draft.markedQuestionIds.includes(currentQuestion.id)
    const hasAnsweredCurrentQuestion = answer !== undefined
    const timerProgress = Math.max(0, Math.min(100, (remaining / EXAM_DURATION_MS) * 100))
    const canMoveToQuestion = (index: number) =>
        index <= draft.currentIndex ||
        (index === draft.currentIndex + 1 && hasAnsweredCurrentQuestion)

    return (
        <div
            data-ui="exam.page"
            className="mx-auto grid max-w-7xl gap-5 md:grid-cols-[minmax(0,1fr)_260px] md:gap-6"
        >
            <FlexRow
                data-ui="exam.heading"
                className="items-center justify-between gap-4 border-b border-slate-200 pb-4 md:col-span-2"
            >
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        React foundations · Online exam
                    </p>
                    <TitleLevel1 className="mt-1 text-xl">Online assessment</TitleLevel1>
                </div>
            </FlexRow>

            <section data-ui="exam.workspace" className="min-w-0 space-y-5">
                {remaining <= 60_000 && remaining > 0 && (
                    <p
                        data-ui="exam.countdown-warning"
                        role="alert"
                        className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        One minute remaining. The exam will be submitted automatically when time
                        expires.
                    </p>
                )}
                {error && (
                    <p
                        data-ui="exam.error"
                        role="alert"
                        className="rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        {error}
                    </p>
                )}

                <div data-ui="exam.countdown.mobile" className="md:hidden">
                    <Card data-ui="exam.countdown" className="text-center">
                        <CardHeader className="items-center pb-3">
                            <CardDescription>Total Duration 60 minutes</CardDescription>
                            <div
                                className={`mt-2 grid h-32 w-32 place-items-center rounded-full p-1 ${remaining <= 60_000 ? 'bg-red-500' : 'bg-sky-800'}`}
                                style={{
                                    background: `conic-gradient(${remaining <= 60_000 ? 'var(--color-red-500)' : 'var(--color-sky-800)'} ${timerProgress}%, var(--color-slate-200) ${timerProgress}%)`,
                                }}
                            >
                                <div className="grid h-full w-full place-items-center rounded-full bg-white">
                                    <p
                                        className="font-mono text-2xl font-semibold"
                                        aria-live="polite"
                                    >
                                        {formatTime(remaining)}
                                    </p>
                                </div>
                            </div>
                            <TextSmall className="text-xs">Exam in progress</TextSmall>
                        </CardHeader>
                    </Card>
                </div>

                <Card data-ui="exam.question-card">
                    <CardHeader className="space-y-0">
                        <FlexRow
                            data-ui="exam.question-number"
                            className="mb-3 items-center justify-between gap-0"
                        >
                            <TextSmall>Total score: 100 points</TextSmall>
                            <p
                                className="shrink-0 text-right text-slate-400 text-sm"
                                aria-label={`Question ${draft.currentIndex + 1} of ${questions.length}`}
                            >
                                <span className="text-slate-700 text-lg">
                                    {draft.currentIndex + 1}
                                </span>{' '}
                                / {questions.length}
                            </p>
                        </FlexRow>
                        <CardTitle data-ui="exam.question-prompt" className="text-lg leading-7">
                            {currentQuestion.stem}
                        </CardTitle>
                        {currentQuestion.description && (
                            <TextSmall
                                data-ui="exam.question-description"
                                className="mt-2 max-w-3xl text-sm leading-6 text-slate-600"
                            >
                                {currentQuestion.description}
                            </TextSmall>
                        )}
                        <FlexRow className="mt-3 items-center justify-between gap-3">
                            <span
                                data-ui="exam.question-type"
                                className="rounded-sm bg-sky-100 px-2 py-1 text-xs font-medium text-sky-900"
                            >
                                {currentQuestion.type === 'multiple'
                                    ? 'Multiple choice'
                                    : currentQuestion.type === 'single'
                                        ? 'Single choice'
                                        : currentQuestion.type === 'judgment'
                                            ? 'True or false'
                                            : 'Written response'}
                            </span>
                            <ButtonFlat
                                data-ui="exam.question.mark-review"
                                data-testid="exam-mark-review"
                                size="sm"
                                className="h-auto px-2 py-1 text-sm font-normal"
                                onClick={() => toggleMarked(currentQuestion.id)}
                                aria-pressed={isMarked}
                            >
                                {isMarked ? 'Marked for review' : 'Mark for review'}
                            </ButtonFlat>
                        </FlexRow>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const selected = selectedIds.includes(option.id)
                            return (
                                <label
                                    key={option.id}
                                    className={`block cursor-pointer rounded-md border px-4 py-3 transition-colors ${selected ? 'border-sky-700 bg-sky-50' : 'border-slate-200 hover:border-slate-400'}`}
                                >
                                    <FlexRow className="items-start gap-3">
                                        <input
                                            data-ui={`exam.answer-input.${currentQuestion.id}.${option.id}`}
                                            data-testid={`exam-answer-${currentQuestion.id}-${option.id}`}
                                            type={
                                                currentQuestion.type === 'multiple'
                                                    ? 'checkbox'
                                                    : 'radio'
                                            }
                                            name={`answer-${currentQuestion.id}`}
                                            value={option.id}
                                            checked={selected}
                                            onChange={() =>
                                                toggleOption(currentQuestion, option.id)
                                            }
                                            className="mt-1 accent-sky-800"
                                        />
                                        <span
                                            data-option-label={`${String.fromCharCode(65 + index)}.`}
                                            className="leading-6 before:mr-2 before:font-medium before:text-slate-500 before:content-[attr(data-option-label)]"
                                        >
                                            {option.text}
                                        </span>
                                    </FlexRow>
                                </label>
                            )
                        })}
                    </CardContent>
                </Card>

                <FlexRow className="flex-wrap items-center justify-between gap-3 px-0 md:px-5">
                    <TextSlate
                        data-ui="exam.question-points"
                        data-testid="exam-question-points"
                        className="font-semibold"
                    >
                        Score: {currentQuestion.points} points
                    </TextSlate>
                    <FlexRow className="flex-wrap justify-end gap-3">
                        <ButtonSecondary
                            data-ui="exam.navigation.previous"
                            data-testid="exam-previous"
                            disabled={draft.currentIndex === 0}
                            onClick={() => updateDraft({ currentIndex: draft.currentIndex - 1 })}
                        >
                            Previous
                        </ButtonSecondary>
                        {draft.currentIndex === questions.length - 1 ? (
                            <ButtonPrimary
                                data-ui="exam.primary-action"
                                data-testid="exam-primary-action"
                                disabled={isSubmitting}
                                onClick={() => setShowConfirmation(true)}
                            >
                                {isSubmitting ? 'Submitting…' : 'Submit exam'}
                            </ButtonPrimary>
                        ) : (
                            <ButtonPrimary
                                data-ui="exam.primary-action"
                                data-testid="exam-primary-action"
                                disabled={!hasAnsweredCurrentQuestion}
                                onClick={() =>
                                    updateDraft({ currentIndex: draft.currentIndex + 1 })
                                }
                            >
                                Next
                            </ButtonPrimary>
                        )}
                    </FlexRow>
                </FlexRow>
                {!hasAnsweredCurrentQuestion && draft.currentIndex < questions.length - 1 && (
                    <TextError role="status" className="text-right">
                        Answer this question to continue.
                    </TextError>
                )}
            </section>

            <aside className="space-y-4 md:sticky md:top-4 md:self-start">
                <Card data-ui="exam.countdown.desktop" className="hidden text-center md:block">
                    <CardHeader className="items-center pb-3">
                        <CardDescription>Total Duration 60 minutes</CardDescription>
                        <div
                            className={`mt-2 grid h-32 w-32 place-items-center rounded-full p-1 ${remaining <= 60_000 ? 'bg-red-500' : 'bg-sky-800'}`}
                            style={{
                                background: `conic-gradient(${remaining <= 60_000 ? 'var(--color-red-500)' : 'var(--color-sky-800)'} ${timerProgress}%, var(--color-slate-200) ${timerProgress}%)`,
                            }}
                        >
                            <div className="grid h-full w-full place-items-center rounded-full bg-white">
                                <p className="font-mono text-2xl font-semibold" aria-live="polite">
                                    {formatTime(remaining)}
                                </p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500">Exam in progress</p>
                    </CardHeader>
                </Card>

                <Card data-ui="exam.question-navigator">
                    <CardHeader>
                        <CardTitle>Question navigator</CardTitle>
                        <CardDescription>
                            {answeredCount}/{questions.length} answered
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-[repeat(auto-fill,2.75rem)] gap-2">
                            {questions.map((question, index) => {
                                const isAnswered = draft.answers[question.id] !== undefined
                                const marked = draft.markedQuestionIds.includes(question.id)
                                const isLocked = !canMoveToQuestion(index)
                                return (
                                    <button
                                        data-ui={`exam.question-number.${index + 1}`}
                                        data-testid={`exam-question-${index + 1}`}
                                        key={question.id}
                                        type="button"
                                        disabled={isLocked}
                                        onClick={() => updateDraft({ currentIndex: index })}
                                        aria-label={`Question ${index + 1}${isAnswered ? ', answered' : ', unanswered'}${marked ? ', marked' : ''}`}
                                        aria-current={
                                            index === draft.currentIndex ? 'step' : undefined
                                        }
                                        className={`relative h-11 w-11 rounded-md border text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40 ${index === draft.currentIndex ? 'border-sky-800 bg-sky-800 text-white' : isAnswered ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-slate-300 bg-white text-slate-700'} ${marked ? 'ring-2 ring-amber-500 ring-offset-1' : ''}`}
                                    >
                                        {index + 1}
                                        {marked && (
                                            <span
                                                className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-amber-500"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                        <FlexRow className="mt-4 flex-wrap gap-3">
                            <TextSmall>
                                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-slate-300 align-middle" />
                                Unanswered
                            </TextSmall>
                            <TextSmall>
                                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 align-middle" />
                                Answered
                            </TextSmall>
                            <TextSmall>
                                <i className="mr-1 inline-block h-2.5 w-2.5 rounded-full bg-amber-500 align-middle" />
                                Marked
                            </TextSmall>
                        </FlexRow>
                    </CardContent>
                </Card>
            </aside>

            {showConfirmation && (
                <FlexRow
                    className="fixed inset-0 z-30 items-center justify-center gap-0 bg-slate-950/40 p-4"
                    role="presentation"
                >
                    <section
                        data-ui="exam.submit-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="submit-title"
                        className="w-full max-w-md space-y-4 rounded-md bg-white p-6 shadow-xl"
                    >
                        <TitleLevel2 id="submit-title" className="text-xl">
                            Submit this exam?
                        </TitleLevel2>
                        <TextSmall className="text-slate-600">
                            You have answered {answeredCount} of {questions.length} questions. You
                            cannot return to the answer page after submitting.
                        </TextSmall>
                        <FlexRow className="mt-5 justify-end gap-3">
                            <ButtonSecondary
                                data-ui="exam.submit-dialog.cancel"
                                data-testid="exam-submit-cancel"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Keep answering
                            </ButtonSecondary>
                            <ButtonPrimary
                                data-ui="exam.submit-dialog.confirm"
                                data-testid="exam-submit-confirm"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setShowConfirmation(false)
                                    void submitAttempt(false)
                                }}
                            >
                                Confirm
                            </ButtonPrimary>
                        </FlexRow>
                    </section>
                </FlexRow>
            )}
        </div>
    )
}
