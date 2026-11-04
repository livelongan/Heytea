import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { fetchDashboardData, loginUser } from '../api/api'
import type { Scenario, UserProfile } from '../types'

const defaultScenarios: Scenario[] = [
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

type AppState = {
    user: UserProfile | null
    token: string | null
    scenarios: Scenario[]
    currentScenarioId: string
    examProgress: number
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    selectScenario: (id: string) => void
    markLessonComplete: (lessonId: string) => void
    loadDashboard: () => Promise<void>
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            scenarios: defaultScenarios,
            currentScenarioId: 'scenario-1',
            examProgress: 54,
            login: async (email, password) => {
                const { user, token } = await loginUser(email, password)
                const dashboard = await fetchDashboardData()

                set({
                    user: { ...user, email },
                    token,
                    scenarios: dashboard.scenarios,
                    currentScenarioId: dashboard.scenarios[0]?.id ?? 'scenario-1',
                })
            },
            logout: () => {
                set({ user: null, token: null })
                if (typeof localStorage !== 'undefined') {
                    localStorage.removeItem('learning-lab-store')
                    localStorage.removeItem('learning-lab-exam-draft')
                    localStorage.removeItem('learning-lab-last-exam')
                }
            },
            selectScenario: (id) => set({ currentScenarioId: id }),
            markLessonComplete: (lessonId) => {
                const scenarios = get().scenarios.map((scenario) => ({
                    ...scenario,
                    lessons: scenario.lessons.map((lesson) =>
                        lesson.id === lessonId ? { ...lesson, completed: true } : lesson,
                    ),
                    progress: Math.min(
                        100,
                        Math.round(
                            (scenario.lessons.filter(
                                (lesson) => lesson.id === lessonId || lesson.completed,
                            ).length /
                                scenario.lessons.length) *
                                100,
                        ),
                    ),
                }))

                set({ scenarios })
            },
            loadDashboard: async () => {
                const dashboard = await fetchDashboardData()
                set({
                    scenarios: dashboard.scenarios,
                    currentScenarioId: dashboard.scenarios[0]?.id ?? 'scenario-1',
                })
            },
        }),
        {
            name: 'learning-lab-store',
        },
    ),
)
