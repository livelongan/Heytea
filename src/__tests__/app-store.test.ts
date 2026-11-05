import { beforeEach, describe, expect, it } from 'vitest'

import { useAppStore } from '../store/app-store'

describe('app store', () => {
    beforeEach(() => {
        useAppStore.setState({
            user: null,
            token: null,
            scenarios: [
                {
                    id: 'scenario-1',
                    title: 'Foundations Lab',
                    difficulty: 'Starter',
                    progress: 68,
                    lessons: [
                        {
                            id: 'lesson-1',
                            title: 'React fundamentals',
                            duration: 18,
                            completed: true,
                        },
                        { id: 'lesson-2', title: 'State flows', duration: 22, completed: false },
                    ],
                },
            ],
            currentScenarioId: 'scenario-1',
            examProgress: 54,
        })
    })

    it('logs in and loads the dashboard state', async () => {
        await useAppStore.getState().login('student@example.com', '123456')

        expect(useAppStore.getState().user?.email).toBe('student@example.com')
        expect(useAppStore.getState().scenarios[0].title).toBe('Foundations Lab')
    })

    it('selects a scenario and marks a lesson complete', () => {
        useAppStore.getState().selectScenario('scenario-2')
        useAppStore.getState().markLessonComplete('lesson-2')

        expect(useAppStore.getState().currentScenarioId).toBe('scenario-2')
        const changedScenario = useAppStore
            .getState()
            .scenarios.find((scenario) => scenario.id === 'scenario-1')

        expect(changedScenario?.lessons[1].completed).toBe(true)
    })

    it('stores the login token and clears authentication on logout', async () => {
        await useAppStore.getState().login('student@example.com', '123456')
        expect(useAppStore.getState().token).toBe('demo-token')
        localStorage.setItem('learning-lab-exam-draft', '{"attemptId":"unfinished"}')
        useAppStore.getState().logout()

        expect(useAppStore.getState().user).toBeNull()
        expect(useAppStore.getState().token).toBeNull()
        expect(localStorage.getItem('learning-lab-store')).toBeNull()
        expect(localStorage.getItem('learning-lab-exam-draft')).toBeNull()
    })
})
