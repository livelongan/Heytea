import { delay, http, HttpResponse } from 'msw'

import type { ExamResult } from '../types'
import { defaultUser, mockAccounts } from './auth-data'
import { mockExamId, mockExamQuestions } from './exam-data'
import { scoreExamAttempt } from './exam-scoring'

const EXAM_HISTORY_KEY = 'learning-lab-exam-history'

function readExamHistory(): ExamResult[] {
    try {
        return JSON.parse(localStorage.getItem(EXAM_HISTORY_KEY) ?? '[]') as ExamResult[]
    } catch {
        return []
    }
}

function writeExamHistory(history: ExamResult[]) {
    localStorage.setItem(EXAM_HISTORY_KEY, JSON.stringify(history))
}

const scenarios = [
    {
        id: 'scenario-1',
        title: 'Foundations Lab',
        difficulty: 'Starter',
        progress: 68,
        lessons: [
            { id: 'lesson-1', title: 'React fundamentals', duration: 18, completed: true },
            { id: 'lesson-2', title: 'State flows', duration: 22, completed: true },
            { id: 'lesson-3', title: 'Hooks patterns', duration: 16, completed: false },
        ],
    },
    {
        id: 'scenario-2',
        title: 'Exam Sprint',
        difficulty: 'Intermediate',
        progress: 44,
        lessons: [
            { id: 'lesson-4', title: 'Mocked API design', duration: 25, completed: true },
            { id: 'lesson-5', title: 'Exam analytics', duration: 21, completed: false },
            { id: 'lesson-6', title: 'Focus review', duration: 18, completed: false },
        ],
    },
    {
        id: 'scenario-3',
        title: 'Production Prep',
        difficulty: 'Advanced',
        progress: 31,
        lessons: [
            { id: 'lesson-7', title: 'Resilience patterns', duration: 28, completed: false },
            { id: 'lesson-8', title: 'Deployment checks', duration: 24, completed: false },
            { id: 'lesson-9', title: 'Rollout review', duration: 19, completed: false },
        ],
    },
]

export const handlers = [
    http.post('/api/auth/login', async ({ request }) => {
        const payload = (await request.json()) as { email?: string; password?: string }
        await delay(150)

        const email = payload.email?.trim().toLowerCase()
        if (!email || !payload.password) {
            return HttpResponse.json(
                { message: 'Email and password are required.' },
                { status: 400 },
            )
        }

        const account = mockAccounts.find(
            (mockAccount) =>
                mockAccount.email === email && mockAccount.password === payload.password,
        )
        if (!account) {
            return HttpResponse.json({ message: 'Invalid credentials.' }, { status: 401 })
        }

        return HttpResponse.json({
            token: account.token,
            user: account.user,
        })
    }),

    http.get('/api/dashboard', async () => {
        await delay(200)
        return HttpResponse.json({ scenarios, user: defaultUser })
    }),

    http.get('/api/exam/questions', async () => {
        await delay(120)
        return HttpResponse.json({
            examId: mockExamId,
            questions: mockExamQuestions.map(
                ({ correctAnswer: _answer, explanation: _explanation, ...question }) => question,
            ),
        })
    }),

    http.post('/api/exam/submit', async ({ request }) => {
        const payload = (await request.json()) as {
            attemptId?: string
            examId?: string
            answers?: Record<string, string | string[]>
            startedAt?: number
            submittedAt?: number
            automatic?: boolean
        }
        await delay(250)

        if (
            !payload.attemptId ||
            !payload.examId ||
            !payload.answers ||
            typeof payload.startedAt !== 'number' ||
            typeof payload.submittedAt !== 'number'
        ) {
            return HttpResponse.json(
                { message: 'Exam submission data is incomplete.' },
                { status: 400 },
            )
        }

        const history = readExamHistory()
        const existingResult = history.find((result) => result.attemptId === payload.attemptId)
        if (existingResult) return HttpResponse.json(existingResult)

        const result = scoreExamAttempt({
            attemptId: payload.attemptId,
            answers: payload.answers,
            startedAt: payload.startedAt,
            submittedAt: payload.submittedAt,
            automatic: payload.automatic === true,
        })
        writeExamHistory([result, ...history])
        return HttpResponse.json(result)
    }),

    http.get('/api/exam/history', async () => {
        await delay(80)
        return HttpResponse.json(readExamHistory())
    }),

    http.get('/api/exam/history/:attemptId', async ({ params }) => {
        const result = readExamHistory().find((item) => item.attemptId === params.attemptId)
        if (!result)
            return HttpResponse.json({ message: 'Exam result not found.' }, { status: 404 })
        return HttpResponse.json(result)
    }),
]
