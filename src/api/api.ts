import type { ExamAnswer, ExamQuestion, ExamResult, Scenario, UserProfile } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export async function loginUser(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Login failed.' }))
        throw new Error(payload.message ?? 'Login failed.')
    }

    return (await response.json()) as {
        token: string
        user: UserProfile
    }
}

export async function fetchDashboardData() {
    const response = await fetch(`${API_BASE_URL}/dashboard`)

    if (!response.ok) {
        throw new Error('Unable to load dashboard data.')
    }

    return (await response.json()) as {
        scenarios: Scenario[]
        user: UserProfile
    }
}

export async function fetchExamQuestions() {
    const response = await fetch(`${API_BASE_URL}/exam/questions`)

    if (!response.ok) {
        throw new Error('Unable to load exam questions.')
    }

    return (await response.json()) as { examId: string; questions: ExamQuestion[] }
}

export async function submitExamAttempt(payload: {
    attemptId: string
    examId: string
    answers: Record<string, ExamAnswer>
    startedAt: number
    submittedAt: number
    automatic: boolean
}) {
    const response = await fetch(`${API_BASE_URL}/exam/submit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Exam submission failed.' }))
        throw new Error(payload.message ?? 'Exam submission failed.')
    }

    return (await response.json()) as ExamResult
}

export async function fetchExamHistory() {
    const response = await fetch(`${API_BASE_URL}/exam/history`)

    if (!response.ok) {
        throw new Error('Unable to load exam history.')
    }

    return (await response.json()) as ExamResult[]
}

export async function fetchExamResult(attemptId: string) {
    const response = await fetch(`${API_BASE_URL}/exam/history/${attemptId}`)

    if (!response.ok) {
        throw new Error('Exam result not found.')
    }

    return (await response.json()) as ExamResult
}
