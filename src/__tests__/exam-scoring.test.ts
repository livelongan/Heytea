import { describe, expect, it } from 'vitest'

import { MAX_EXAM_SCORE, mockExamQuestions } from '../mocks/exam-data'
import { answersMatch, scoreExamAttempt } from '../mocks/exam-scoring'

const multipleChoice = mockExamQuestions.find((question) => question.type === 'multiple')

describe('exam scoring', () => {
    it('requires an exact option set for multiple-choice credit regardless of order', () => {
        expect(multipleChoice).toBeDefined()
        if (!multipleChoice) return

        expect(answersMatch(['d', 'a', 'b'], multipleChoice.correctAnswer)).toBe(true)
        expect(answersMatch(['a', 'b'], multipleChoice.correctAnswer)).toBe(false)
        expect(answersMatch(['a', 'b', 'c', 'd'], multipleChoice.correctAnswer)).toBe(false)
    })

    it('returns score, pass status, and per-question explanations', () => {
        const result = scoreExamAttempt({
            attemptId: 'attempt-test',
            answers: { 'react-001': 'a', 'react-002': ['a', 'b', 'd'] },
            startedAt: 1_000,
            submittedAt: 61_000,
            automatic: false,
        })

        expect(result.score).toBe(7)
        expect(result.correctCount).toBe(2)
        expect(result.totalQuestions).toBe(20)
        expect(result.questions.reduce((total, question) => total + question.question.points, 0)).toBe(
            MAX_EXAM_SCORE,
        )
        expect(result.passed).toBe(false)
        expect(result.durationSeconds).toBe(60)
        expect(result.questions[1].explanation).toContain('Props flow')
        expect(result.submittedAutomatically).toBe(false)
    })

    it('provides twenty objective questions with varying points totaling one hundred', () => {
        expect(mockExamQuestions).toHaveLength(20)
        expect(new Set(mockExamQuestions.map((question) => question.type))).toEqual(
            new Set(['single', 'multiple', 'judgment']),
        )
        expect(new Set(mockExamQuestions.map((question) => question.points))).toEqual(
            new Set([3, 4, 5, 6, 7]),
        )
        expect(mockExamQuestions.reduce((total, question) => total + question.points, 0)).toBe(
            MAX_EXAM_SCORE,
        )
    })

    it('caps a perfect exam score at one hundred points', () => {
        const answers = Object.fromEntries(
            mockExamQuestions.map((question) => [question.id, question.correctAnswer]),
        )
        const result = scoreExamAttempt({
            attemptId: 'attempt-perfect',
            answers,
            startedAt: 1_000,
            submittedAt: 61_000,
            automatic: false,
        })

        expect(result.score).toBe(100)
        expect(result.passed).toBe(true)
    })
})
