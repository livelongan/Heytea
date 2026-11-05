import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as api from '../api/api'
import ExamResultPage from '../pages/exam-result-page'
import type { ExamResult } from '../types'

const result: ExamResult = {
    attemptId: 'attempt-1',
    examId: 'react-foundations',
    submittedAt: Date.now(),
    durationSeconds: 120,
    submittedAutomatically: false,
    score: 80,
    passed: true,
    correctCount: 1,
    totalQuestions: 1,
    questions: [
        {
            question: {
                id: 'question-1',
                type: 'single',
                stem: 'Which hook adds local state?',
                options: [
                    { id: 'a', text: 'useState' },
                    { id: 'b', text: 'useRoute' },
                ],
                points: 10,
            },
            answer: 'b',
            correctAnswer: 'a',
            isCorrect: false,
            explanation: 'useState adds local state to function components.',
        },
    ],
}

describe('ExamResultPage', () => {
    afterEach(() => vi.restoreAllMocks())

    it('shows the reference answer layout and toggles each explanation', async () => {
        vi.spyOn(api, 'fetchExamResult').mockResolvedValue(result)

        render(
            <MemoryRouter initialEntries={['/exam/result/attempt-1']}>
                <Routes>
                    <Route path="/exam/result/:attemptId" element={<ExamResultPage />} />
                </Routes>
            </MemoryRouter>,
        )

        await screen.findByRole('heading', { name: /your exam is complete/i })
        fireEvent.click(screen.getByRole('button', { name: /review answers/i }))

        expect(screen.getByText('Question 1 · single')).toBeInTheDocument()
        expect(screen.getByText('Which hook adds local state?')).toBeInTheDocument()
        expect(screen.getByText('Your answer:').parentElement).toHaveTextContent('useRoute')
        expect(screen.getByText('Correct answer:').parentElement).toHaveTextContent('useState')

        const explanationToggle = screen.getByText('Explanation')
        const explanationDisclosure = explanationToggle.closest('details')
        expect(explanationDisclosure).not.toHaveAttribute('open')
        expect(
            screen.queryByText('useState adds local state to function components.'),
        ).not.toBeVisible()

        fireEvent.click(explanationToggle)

        await waitFor(() => {
            expect(explanationDisclosure).toHaveAttribute('open')
            expect(
                screen.getByText('useState adds local state to function components.'),
            ).toBeVisible()
        })
    })
})
