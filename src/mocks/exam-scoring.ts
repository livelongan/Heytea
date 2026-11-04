import type { ExamAnswer, ExamQuestionResult, ExamResult } from '../types'

import { MAX_EXAM_SCORE, mockExamId, mockExamQuestions } from './exam-data'

export function answersMatch(answer: ExamAnswer | undefined, correctAnswer: string | string[]) {
    if (answer === undefined) return false
    const submitted = Array.isArray(answer) ? [...answer].sort() : [answer]
    const expected = Array.isArray(correctAnswer) ? [...correctAnswer].sort() : [correctAnswer]

    return (
        submitted.length === expected.length &&
        submitted.every((item, index) => item === expected[index])
    )
}

export function scoreExamAttempt(input: {
    attemptId: string
    answers: Record<string, ExamAnswer>
    startedAt: number
    submittedAt: number
    automatic: boolean
}): ExamResult {
    const questions: ExamQuestionResult[] = mockExamQuestions.map((question) => {
        const answer = input.answers[question.id] ?? null

        return {
            question: {
                id: question.id,
                type: question.type,
                stem: question.stem,
                description: question.description,
                options: question.options,
                points: question.points,
            },
            answer,
            correctAnswer: question.correctAnswer,
            isCorrect: answersMatch(answer ?? undefined, question.correctAnswer),
            explanation: question.explanation,
        }
    })
    const correctCount = questions.filter((question) => question.isCorrect).length
    const score = Math.min(
        MAX_EXAM_SCORE,
        questions.reduce(
            (total, question) => total + (question.isCorrect ? question.question.points : 0),
            0,
        ),
    )

    return {
        attemptId: input.attemptId,
        examId: mockExamId,
        submittedAt: input.submittedAt,
        durationSeconds: Math.max(0, Math.floor((input.submittedAt - input.startedAt) / 1000)),
        submittedAutomatically: input.automatic,
        score,
        passed: score >= 70,
        correctCount,
        totalQuestions: questions.length,
        questions,
    }
}
