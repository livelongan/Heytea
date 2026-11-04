import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

import App from '../App'
import ErrorBoundary from '../components/error-boundary'
import { useAppStore } from '../store/app-store'

function CurrentPath() {
    const location = useLocation()
    return <output data-testid="current-path">{location.pathname}</output>
}

describe('app requirements', () => {
    beforeEach(() => {
        useAppStore.setState({ user: null, token: null })
        localStorage.clear()
    })

    it('allows a user to sign in and view the learning dashboard', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        )

        expect(screen.getByLabelText(/email/i)).toHaveValue('student@example.com')
        expect(screen.getByLabelText('Password')).toHaveValue('secret123')
        expect(screen.getByTestId('login-email')).toBeInTheDocument()
        expect(screen.getByTestId('login-password')).toBeInTheDocument()
        expect(screen.getByTestId('login-password-visibility')).toBeInTheDocument()
        expect(screen.queryByText(/demo account:/i)).not.toBeInTheDocument()
        expect(
            screen.queryByRole('button', { name: /fill demo credentials/i }),
        ).not.toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(
            await screen.findByRole('heading', { name: /learning dashboard/i }),
        ).toBeInTheDocument()
        expect(screen.getAllByText(/student@example.com/i)).toHaveLength(2)
        expect(screen.getByTestId('navigation-desktop-dashboard')).toBeInTheDocument()
        expect(screen.getByTestId('logout-desktop')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="dashboard.page"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="account.header"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="account.sidebar"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="app.navigation.dashboard"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="dashboard.exam-card"]')).toBeInTheDocument()
    })

    it('opens the mobile navigation as a bottom drawer and closes after navigation', async () => {
        const user = userEvent.setup()
        useAppStore.setState({
            user: {
                id: 'student-1',
                name: 'Student',
                email: 'student@example.com',
                role: 'student',
            },
            token: 'test-token',
        })

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>,
        )

        const sidebarToggle = screen.getByTestId('desktop-sidebar-toggle')
        expect(sidebarToggle.querySelector('svg')).toHaveClass('lucide-chevron-left')
        await user.click(sidebarToggle)
        expect(sidebarToggle.querySelector('svg')).toHaveClass('lucide-chevron-right')

        await user.click(screen.getByTestId('mobile-menu-toggle'))

        const drawer = screen.getByRole('dialog', { name: 'Mobile navigation' })
        expect(drawer).toHaveClass('min-h-[360px]', 'translate-y-0')
        await user.click(screen.getByTestId('navigation-mobile-exam'))
        expect(
            document.querySelector('[data-ui="app.mobile-navigation-drawer"]'),
        ).toHaveAttribute('aria-hidden', 'true')
        expect(drawer).toHaveClass('translate-y-full')
    })

    it('exposes stable data-ui markers for the login controls', () => {
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>,
        )

        expect(document.querySelector('[data-ui="login.form"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="login.email-input"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="login.password-input"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="login.password-visibility"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="theme.toggle"]')).toBeInTheDocument()
    })

    it('shows a clear error for invalid credentials', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        )

        await user.clear(screen.getByLabelText(/email/i))
        await user.type(screen.getByLabelText(/email/i), 'student@example.com')
        await user.clear(screen.getByLabelText('Password'))
        await user.type(screen.getByLabelText('Password'), 'wrong-password')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
        expect(document.querySelector('[data-ui="login.request-error"]')).toBeInTheDocument()
    })

    it('rejects credentials for an account that is not in the mock data', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        )

        await user.clear(screen.getByLabelText(/email/i))
        await user.type(screen.getByLabelText(/email/i), 'unknown@example.com')
        await user.clear(screen.getByLabelText('Password'))
        await user.type(screen.getByLabelText('Password'), 'secret123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument()
    })

    it('can log out and sign in again with the mock account', async () => {
        const user = userEvent.setup()
        useAppStore.setState({
            user: {
                id: 'u-demo',
                name: 'Ada Student',
                email: 'student@example.com',
                role: 'Learner',
            },
            token: 'demo-token',
        })
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <App />
            </MemoryRouter>,
        )

        await user.click(screen.getAllByRole('button', { name: /log out/i })[0])
        await screen.findByLabelText(/email/i)
        expect(screen.getByLabelText(/email/i)).toHaveValue('student@example.com')
        expect(screen.getByLabelText('Password')).toHaveValue('secret123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(
            await screen.findByRole('heading', { name: /learning dashboard/i }),
        ).toBeInTheDocument()
    })

    it('validates required fields before making a login request', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>,
        )

        await user.clear(screen.getByLabelText(/email/i))
        await user.clear(screen.getByLabelText('Password'))
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(screen.getByText(/email is required/i)).toBeInTheDocument()
        expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })

    it('toggles password visibility from the eye button', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>,
        )

        const passwordInput = screen.getByLabelText('Password')
        expect(passwordInput).toHaveAttribute('type', 'password')

        await user.click(screen.getByRole('button', { name: /show password/i }))
        expect(passwordInput).toHaveAttribute('type', 'text')
        expect(screen.getByRole('button', { name: /hide password/i })).toHaveAttribute(
            'aria-pressed',
            'true',
        )

        await user.click(screen.getByRole('button', { name: /hide password/i }))
        expect(passwordInput).toHaveAttribute('type', 'password')
    })

    it('returns to the originally requested protected page after login', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/exam/history']}>
                <App />
            </MemoryRouter>,
        )

        await user.clear(screen.getByLabelText(/email/i))
        await user.type(screen.getByLabelText(/email/i), 'student@example.com')
        await user.clear(screen.getByLabelText('Password'))
        await user.type(screen.getByLabelText('Password'), 'secret123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))

        expect(await screen.findByRole('heading', { name: /my exams/i })).toBeInTheDocument()
    })

    it('shows a 404 page for an unknown route', () => {
        useAppStore.setState({
            user: {
                id: 'u-demo',
                name: 'Ada Student',
                email: 'student@example.com',
                role: 'Learner',
            },
        })
        render(
            <MemoryRouter initialEntries={['/missing-page']}>
                <App />
            </MemoryRouter>,
        )

        expect(
            screen.getByRole('heading', { name: /this page does not exist/i }),
        ).toBeInTheDocument()
        expect(document.querySelector('[data-ui="not-found.page"]')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /return to dashboard/i })).toHaveAttribute(
            'href',
            '/dashboard',
        )
    })

    it('opens a scenario detail route from the dashboard', async () => {
        const user = userEvent.setup()
        render(
            <MemoryRouter initialEntries={['/login']}>
                <App />
            </MemoryRouter>,
        )

        await user.clear(screen.getByLabelText(/email/i))
        await user.type(screen.getByLabelText(/email/i), 'student@example.com')
        await user.clear(screen.getByLabelText('Password'))
        await user.type(screen.getByLabelText('Password'), 'secret123')
        await user.click(screen.getByRole('button', { name: /sign in/i }))
        await screen.findByRole('heading', { name: /learning dashboard/i })
        await user.click(screen.getByRole('link', { name: /foundations lab/i }))

        expect(await screen.findByRole('heading', { name: /foundations lab/i })).toBeInTheDocument()
        expect(document.querySelector('[data-ui="scenario.page"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="scenario.lesson.lesson-1"]')).toBeInTheDocument()
    })

    it('supports quiz answers, submit confirmation, scoring, and exam history', async () => {
        const user = userEvent.setup()
        useAppStore.setState({
            user: {
                id: 'u-demo',
                name: 'Ada Student',
                email: 'student@example.com',
                role: 'Learner',
            },
            token: 'demo-token',
        })
        render(
            <MemoryRouter initialEntries={['/exam/new']}>
                <CurrentPath />
                <ErrorBoundary>
                    <App />
                </ErrorBoundary>
            </MemoryRouter>,
        )

        await user.click(await screen.findByRole('button', { name: /begin exam/i }))
        expect(
            await screen.findByRole('heading', { name: /online assessment/i }),
        ).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.question-card"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.question-navigator"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.primary-action"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.countdown"]')).toBeInTheDocument()
        expect(screen.getByTestId('exam-question-points')).toHaveTextContent('Score: 3 points')
        const mobileCountdown = document.querySelector('[data-ui="exam.countdown.mobile"]')
        const questionCard = document.querySelector('[data-ui="exam.question-card"]')
        expect(mobileCountdown).toHaveClass('md:hidden')
        expect(mobileCountdown!.compareDocumentPosition(questionCard!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(screen.getByText('Question 1 / 20')).toBeInTheDocument()
        const questionNumber = document.querySelector('[data-ui="exam.question-number"]')
        const questionPrompt = document.querySelector('[data-ui="exam.question-prompt"]')
        expect(questionNumber!.compareDocumentPosition(questionPrompt!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
        expect(document.querySelector('[data-ui="exam.question-type"]')?.parentElement).toBe(
            screen.getByTestId('exam-mark-review').parentElement,
        )
        expect(questionCard).not.toContainElement(screen.getByTestId('exam-question-points'))
        expect(document.querySelector('[data-ui="exam.question-points"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.question-number.1"]')).toBeInTheDocument()
        expect(screen.getByTestId('exam-question-1')).toBeInTheDocument()
        expect(screen.getByTestId('exam-mark-review')).toBeInTheDocument()
        expect(screen.getByTestId('exam-primary-action')).toHaveTextContent(/next question/i)
        expect(
            document.querySelector('[data-ui="exam.answer-input.react-001.a"]'),
        ).toBeInTheDocument()
        const nextQuestionButton = screen.getByRole('button', { name: /next question/i })
        const secondQuestionButton = screen.getByRole('button', {
            name: /question 2, unanswered/i,
        })
        const thirdQuestionButton = screen.getByRole('button', {
            name: /question 3, unanswered/i,
        })
        expect(nextQuestionButton).toBeDisabled()
        expect(secondQuestionButton).toBeDisabled()
        expect(thirdQuestionButton).toBeDisabled()

        await user.click(screen.getByLabelText(/usestate/i))
        expect(nextQuestionButton).toBeEnabled()
        expect(secondQuestionButton).toBeEnabled()
        expect(thirdQuestionButton).toBeDisabled()
        await user.click(nextQuestionButton)
        expect(screen.getByText(/question 2 \/ 20/i)).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /previous question/i }))
        expect(screen.getByLabelText(/usestate/i)).toBeChecked()
        await user.click(nextQuestionButton)

        await user.click(screen.getByLabelText(/props are passed from a parent/i))
        await user.click(screen.getByLabelText(/props as read-only/i))
        await user.click(screen.getByLabelText(/callback functions/i))

        const draft = JSON.parse(localStorage.getItem('learning-lab-exam-draft') ?? '{}')
        expect(draft.answers['react-001']).toBe('a')
        expect(draft.answers['react-002']).toEqual(['a', 'b', 'd'])
        expect(screen.queryByRole('button', { name: /submit exam/i })).not.toBeInTheDocument()

        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText('False'))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/make every component render only once/i))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/rendered markup automatically/i))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/browser url by default/i))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText('False'))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/inside loops when there are many items/i))
        await user.click(nextQuestionButton)
        await user.click(screen.getByTestId('exam-answer-react-009-a'))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/only once before the first render/i))
        await user.click(nextQuestionButton)
        await user.click(screen.getByLabelText(/added to every component/i))
        await user.click(nextQuestionButton)
        expect(screen.getByText(/question 12 \/ 20/i)).toBeInTheDocument()
        await user.click(screen.getByTestId('exam-answer-react-012-a'))
        await user.click(nextQuestionButton)
        for (let questionNumber = 13; questionNumber <= 20; questionNumber += 1) {
            const optionId = questionNumber === 15 || questionNumber === 19 ? 'true' : 'a'
            await user.click(
                screen.getByTestId(
                    `exam-answer-react-${String(questionNumber).padStart(3, '0')}-${optionId}`,
                ),
            )
            if (questionNumber < 20) await user.click(nextQuestionButton)
        }
        expect(screen.getByText(/question 20 \/ 20/i)).toBeInTheDocument()
        expect(screen.queryByRole('button', { name: /next question/i })).not.toBeInTheDocument()
        expect(screen.getAllByRole('button', { name: /submit exam/i })).toHaveLength(1)
        expect(screen.getByTestId('exam-primary-action')).toHaveTextContent(/submit exam/i)

        await user.click(screen.getByRole('button', { name: /submit exam/i }))
        expect(screen.getByRole('dialog')).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /keep answering/i }))
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

        await user.click(screen.getByRole('button', { name: /submit exam/i }))
        await user.click(screen.getByRole('button', { name: /confirm submission/i }))
        await waitFor(() => {
            expect(localStorage.getItem('learning-lab-exam-history')).not.toBeNull()
            expect(screen.getByTestId('current-path').textContent).toMatch(/^\/exam\/result\//)
        })
        expect(await screen.findByRole('heading', { name: /your exam is complete/i })).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam-result.page"]')).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam-result.summary"]')).toBeInTheDocument()
        expect(screen.getByTestId('exam-result-score')).toHaveTextContent('44')
        expect(document.querySelector('[data-ui="exam-result.answer-counts"]')).toHaveTextContent(
            'Answered 20 · Correct 9',
        )
        expect(screen.getByTestId('exam-result-restart')).toHaveAttribute('href', '/exam/new')
        await user.click(screen.getByText('Review answers'))
        expect(document.querySelector('[data-ui="exam-result.question-review"]')).toHaveAttribute(
            'open',
        )
        const resultStatuses = Array.from(
            document.querySelectorAll('[data-ui="exam-result.answer-status"]'),
        )
        expect(
            resultStatuses.some(
                (status) => status.textContent?.includes('Correct') && status.querySelector('.lucide-circle-check'),
            ),
        ).toBe(true)
        expect(
            resultStatuses.some(
                (status) => status.textContent?.includes('Incorrect') && status.querySelector('.lucide-circle-x'),
            ),
        ).toBe(true)
        expect(localStorage.getItem('learning-lab-exam-draft')).toBeNull()

        await user.click(screen.getAllByRole('link', { name: /my exams/i })[0])
        expect(await screen.findByRole('heading', { name: /my exams/i })).toBeInTheDocument()
        expect(await screen.findByText(/9\/20 correct/i)).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam-history.page"]')).toBeInTheDocument()
        expect(
            document.querySelector(
                '[data-ui^="exam-history.result."][data-testid^="exam-history-result-"]',
            ),
        ).toBeInTheDocument()
    }, 15_000)

    it('renders only automatically gradable question types and saves selected answers', async () => {
        const user = userEvent.setup()
        const startedAt = Date.now()
        useAppStore.setState({
            user: {
                id: 'u-demo',
                name: 'Ada Student',
                email: 'student@example.com',
                role: 'Learner',
            },
            token: 'demo-token',
        })
        localStorage.setItem(
            'learning-lab-exam-draft',
            JSON.stringify({
                schemaVersion: 1,
                attemptId: 'attempt-objective-test',
                examId: 'react-foundations-2026-v2',
                startedAt,
                deadlineAt: startedAt + 60 * 60 * 1000,
                currentIndex: 8,
                answers: {},
                markedQuestionIds: [],
            }),
        )
        render(
            <MemoryRouter initialEntries={['/exam/attempt']}>
                <App />
            </MemoryRouter>,
        )

        expect(await screen.findByText(/question 9 \/ 20/i)).toBeInTheDocument()
        expect(document.querySelector('[data-ui="exam.question-type"]')).toHaveTextContent(
            'Single choice',
        )
        expect(screen.getByTestId('exam-answer-react-009-a')).toBeInTheDocument()
        const nextQuestionButton = screen.getByRole('button', { name: /next question/i })
        expect(nextQuestionButton).toBeDisabled()

        await user.click(screen.getByTestId('exam-answer-react-009-a'))

        expect(nextQuestionButton).toBeEnabled()
        expect(
            JSON.parse(localStorage.getItem('learning-lab-exam-draft') ?? '{}').answers[
                'react-009'
            ],
        ).toBe('a')
        await user.click(nextQuestionButton)
        expect(screen.getByText(/question 10 \/ 20/i)).toBeInTheDocument()
        await user.click(screen.getByRole('button', { name: /previous question/i }))
        expect(screen.getByTestId('exam-answer-react-009-a')).toBeChecked()
    })

    it('shows the completion summary after time expires and preserves answered questions', async () => {
        const user = userEvent.setup()
        const startedAt = Date.now() - 60 * 60 * 1000
        useAppStore.setState({
            user: {
                id: 'u-demo',
                name: 'Ada Student',
                email: 'student@example.com',
                role: 'Learner',
            },
            token: 'demo-token',
        })
        localStorage.setItem(
            'learning-lab-exam-draft',
            JSON.stringify({
                schemaVersion: 1,
                attemptId: 'attempt-expired-test',
                examId: 'react-foundations-2026-v2',
                startedAt,
                deadlineAt: Date.now() - 1_000,
                currentIndex: 0,
                answers: { 'react-001': 'a' },
                markedQuestionIds: [],
            }),
        )

        render(
            <MemoryRouter initialEntries={['/exam/attempt']}>
                <App />
            </MemoryRouter>,
        )

        expect(
            await screen.findByRole('heading', { name: /time's up, your exam is complete/i }),
        ).toBeInTheDocument()
        expect(screen.getByTestId('exam-result-score')).toHaveTextContent('3')
        expect(document.querySelector('[data-ui="exam-result.answer-counts"]')).toHaveTextContent(
            'Answered 1 · Correct 1',
        )
        await user.click(screen.getByText('Review answers'))
        expect(screen.getAllByText('useState').length).toBeGreaterThan(0)
    })
})
