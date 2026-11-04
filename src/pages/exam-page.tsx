import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchExamQuestions, submitExamAttempt } from '../api/api'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import type { ExamAnswer, ExamDraft, ExamQuestion } from '../types'
import {
    EXAM_DRAFT_KEY,
    EXAM_DURATION_MS,
    LAST_EXAM_KEY,
    readExamDraft,
    saveExamDraft,
} from '../utils/exam-session'

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

    if (isLoading) return <p role="status">Loading React assessment…</p>
    if (error && !draft) {
        return (
            <section className="mx-auto max-w-xl space-y-4" role="alert">
                <h1 className="text-2xl font-semibold">Exam unavailable</h1>
                <p>{error}</p>
                <Button data-testid="exam-load-retry" onClick={() => window.location.reload()}>
                    Retry
                </Button>
            </section>
        )
    }
    if (!draft || !currentQuestion) return <p role="status">Preparing your exam…</p>

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
            <div
                data-ui="exam.heading"
                className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4 md:col-span-2"
            >
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        React foundations · Online exam
                    </p>
                    <h1 className="mt-1 text-xl font-semibold">Online assessment</h1>
                </div>
            </div>

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
                            <p className="text-xs text-slate-500">Exam in progress</p>
                        </CardHeader>
                    </Card>
                </div>

                <Card data-ui="exam.question-card">
                    <CardHeader className="space-y-0 p-6 pb-3">
                        <div
                            data-ui="exam.question-number"
                            className="mb-2 flex items-center justify-between"
                        >
                            <p className="font-semibold">Total score: 100 points</p>
                            <p
                                className="shrink-0 text-right text-sm text-slate-500"
                                aria-label={`Question ${draft.currentIndex + 1} of ${questions.length}`}
                            >
                                Question {draft.currentIndex + 1} / {questions.length}
                            </p>
                        </div>
                        <CardTitle data-ui="exam.question-prompt" className="text-lg leading-7">
                            {currentQuestion.stem}
                        </CardTitle>
                        {currentQuestion.description && (
                            <p
                                data-ui="exam.question-description"
                                className="mt-2 max-w-3xl text-sm leading-6 text-slate-600"
                            >
                                {currentQuestion.description}
                            </p>
                        )}
                        <div className="mt-3 flex items-center justify-between gap-3">
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
                            <Button
                                data-ui="exam.question.mark-review"
                                data-testid="exam-mark-review"
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1 text-sm font-normal"
                                onClick={() => toggleMarked(currentQuestion.id)}
                                aria-pressed={isMarked}
                            >
                                {isMarked ? 'Marked for review' : 'Mark for review'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const selected = selectedIds.includes(option.id)
                            return (
                                <label
                                    key={option.id}
                                    className={`flex cursor-pointer items-start gap-3 rounded-md border px-4 py-3 transition-colors ${selected ? 'border-sky-700 bg-sky-50' : 'border-slate-200 hover:border-slate-400'}`}
                                >
                                    <input
                                        data-ui={`exam.answer-input.${currentQuestion.id}.${option.id}`}
                                        data-testid={`exam-answer-${currentQuestion.id}-${option.id}`}
                                        type={
                                            currentQuestion.type === 'multiple' ? 'checkbox' : 'radio'
                                        }
                                        name={`answer-${currentQuestion.id}`}
                                        value={option.id}
                                        checked={selected}
                                        onChange={() => toggleOption(currentQuestion, option.id)}
                                        className="mt-1 accent-sky-800"
                                    />
                                    <span
                                        data-option-label={`${String.fromCharCode(65 + index)}.`}
                                        className="leading-6 before:mr-2 before:font-medium before:text-slate-500 before:content-[attr(data-option-label)]"
                                    >
                                        {option.text}
                                    </span>
                                </label>
                            )
                        })}
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-between gap-3 px-0 md:px-5">
                    <p
                        data-ui="exam.question-points"
                        data-testid="exam-question-points"
                        className="font-semibold"
                    >
                        Score: {currentQuestion.points} points
                    </p>
                    <div className="flex flex-wrap justify-end gap-3">
                        <Button
                            data-ui="exam.navigation.previous"
                            data-testid="exam-previous"
                            variant="secondary"
                            disabled={draft.currentIndex === 0}
                            onClick={() => updateDraft({ currentIndex: draft.currentIndex - 1 })}
                        >
                            Previous question
                        </Button>
                        {draft.currentIndex === questions.length - 1 ? (
                            <Button
                                data-ui="exam.primary-action"
                                data-testid="exam-primary-action"
                                disabled={isSubmitting}
                                onClick={() => setShowConfirmation(true)}
                            >
                                {isSubmitting ? 'Submitting…' : 'Submit exam'}
                            </Button>
                        ) : (
                            <Button
                                data-ui="exam.primary-action"
                                data-testid="exam-primary-action"
                                disabled={!hasAnsweredCurrentQuestion}
                                onClick={() =>
                                    updateDraft({ currentIndex: draft.currentIndex + 1 })
                                }
                            >
                                Next question
                            </Button>
                        )}
                    </div>
                </div>
                {!hasAnsweredCurrentQuestion && draft.currentIndex < questions.length - 1 && (
                    <p role="status" className="text-right text-sm text-slate-600">
                        Answer this question to continue.
                    </p>
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
                        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                                <i className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                                Unanswered
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                Answered
                            </span>
                            <span className="flex items-center gap-1">
                                <i className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                                Marked
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* <Card data-ui="exam.information">
                    <CardHeader className="pb-3">
                        <CardTitle>Exam information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Duration</span>
                            <span>{Math.round(EXAM_DURATION_MS / 60_000)} minutes</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Total score</span>
                            <span>{totalPoints} points</span>
                        </div>
                        <div className="flex justify-between gap-3">
                            <span className="text-slate-500">Questions</span>
                            <span>{questions.length}</span>
                        </div>
                    </CardContent>
                </Card> */}
            </aside>

            {showConfirmation && (
                <div
                    className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4"
                    role="presentation"
                >
                    <section
                        data-ui="exam.submit-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="submit-title"
                        className="w-full max-w-md space-y-4 rounded-md bg-white p-6 shadow-xl"
                    >
                        <h2 id="submit-title" className="text-xl font-semibold">
                            Submit this exam?
                        </h2>
                        <p className="text-sm text-slate-600">
                            You have answered {answeredCount} of {questions.length} questions. You
                            cannot return to the answer page after submitting.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button
                                data-ui="exam.submit-dialog.cancel"
                                data-testid="exam-submit-cancel"
                                variant="secondary"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Keep answering
                            </Button>
                            <Button
                                data-ui="exam.submit-dialog.confirm"
                                data-testid="exam-submit-confirm"
                                disabled={isSubmitting}
                                onClick={() => {
                                    setShowConfirmation(false)
                                    void submitAttempt(false)
                                }}
                            >
                                Confirm submission
                            </Button>
                        </div>
                    </section>
                </div>
            )}
        </div>
    )
}
