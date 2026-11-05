import { BookOpen, CheckCircle2, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ButtonPrimary, ButtonSecondary } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TextNormal, TextSmall, TitleLevel1, TitleLevel3 } from '../components/ui/typography'
import { useAppStore } from '../store/app-store'

export default function DashboardPage() {
    const scenarios = useAppStore((state) => state.scenarios)
    const currentScenarioId = useAppStore((state) => state.currentScenarioId)
    const examProgress = useAppStore((state) => state.examProgress)
    const selectScenario = useAppStore((state) => state.selectScenario)
    const markLessonComplete = useAppStore((state) => state.markLessonComplete)
    const currentScenario =
        scenarios.find((scenario) => scenario.id === currentScenarioId) ?? scenarios[0]

    if (!currentScenario)
        return <TextNormal role="status">No learning scenarios are available.</TextNormal>

    const completedLessons = currentScenario.lessons.filter((lesson) => lesson.completed).length
    const overallProgress = Math.round(
        scenarios.reduce((total, scenario) => total + scenario.progress, 0) / scenarios.length,
    )

    return (
        <div data-ui="dashboard.page" className="mx-auto max-w-7xl space-y-7">
            <div
                data-ui="dashboard.heading"
                className="flex flex-wrap items-end justify-between gap-4"
            >
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Learning hub</p>
                    <TitleLevel1 className="mt-1">Learning Dashboard</TitleLevel1>
                </div>
                <Link to="/exam">
                    <ButtonPrimary
                        data-ui="dashboard.continue-exam"
                        data-testid="dashboard-continue-exam"
                    >
                        Continue React exam
                    </ButtonPrimary>
                </Link>
            </div>

            <section
                data-ui="dashboard.overview"
                aria-label="Learning overview"
                className="grid gap-4 md:grid-cols-3"
            >
                <Card data-ui="dashboard.metric.learning-progress">
                    <CardHeader className="space-y-2">
                        <BookOpen className="h-5 w-5 text-sky-700" aria-hidden="true" />
                        <CardTitle>Learning progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{overallProgress}%</p>
                    </CardContent>
                </Card>
                <Card data-ui="dashboard.metric.exam-readiness">
                    <CardHeader className="space-y-2">
                        <GraduationCap className="h-5 w-5 text-orange-600" aria-hidden="true" />
                        <CardTitle>Exam readiness</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{examProgress}%</p>
                    </CardContent>
                </Card>
                <Card data-ui="dashboard.metric.completed-lessons">
                    <CardHeader className="space-y-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                        <CardTitle>Completed lessons</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">
                            {completedLessons}/{currentScenario.lessons.length}
                        </p>
                    </CardContent>
                </Card>
            </section>

            <section
                data-ui="dashboard.learning-content"
                className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]"
            >
                <Card data-ui="dashboard.scenario-list">
                    <CardHeader>
                        <CardTitle>Scenario track</CardTitle>
                        <CardDescription>
                            Choose a learning path to review its lessons.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {scenarios.map((scenario) => (
                            <Link
                                key={scenario.id}
                                data-ui={`dashboard.scenario-card.${scenario.id}`}
                                data-testid={`dashboard-scenario-${scenario.id}`}
                                to={`/scenarios/${scenario.id}`}
                                onClick={() => selectScenario(scenario.id)}
                                className={`flex items-center justify-between gap-4 rounded-md border p-4 transition-colors ${scenario.id === currentScenarioId ? 'border-sky-600 bg-sky-50' : 'border-slate-200 hover:border-slate-400'}`}
                            >
                                <span>
                                    <span className="block font-semibold">{scenario.title}</span>
                                    <span className="text-sm text-slate-500">
                                        {scenario.difficulty}
                                    </span>
                                </span>
                                <span className="text-sm font-semibold">{scenario.progress}%</span>
                            </Link>
                        ))}
                    </CardContent>
                </Card>

                <Card data-ui="dashboard.exam-card">
                    <CardHeader>
                        <CardTitle>React foundations assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <TextNormal>20 questions · 100 points · 60 minutes</TextNormal>
                        <CardDescription>
                            React 是一个库。它允许你将组件放在一起，但不关注路由和数据获取。要使用
                            React 构建整个应用程序，我们建议使用像
                            <Link to="https://nextjs.org" target="_blank" rel="noopener">
                                Next.js
                            </Link>{' '}
                            或
                            <Link to="https://reactrouter.com" target="_blank" rel="noopener">
                                React Router
                            </Link>
                            这样的全栈 React 框架。{' '}
                        </CardDescription>

                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link
                                data-ui="dashboard.start-exam-link"
                                data-testid="dashboard-start-exam"
                                to="/exam/new"
                            >
                                <ButtonPrimary
                                    className="w-full"
                                    style={{ width: 'fit-content', minWidth: '260px' }}
                                >
                                    Start a new exam
                                </ButtonPrimary>
                            </Link>
                        </div>
                        <Link
                            data-ui="dashboard.exam-history-link"
                            data-testid="dashboard-exam-history"
                            to="/exam/history"
                            className="py-2 block text-center text-sm font-medium text-sky-800 underline"
                        >
                            View exam history
                        </Link>
                    </CardContent>
                </Card>
            </section>

            <Card data-ui="dashboard.current-scenario">
                <CardHeader>
                    <CardTitle>{currentScenario.title}</CardTitle>
                    <CardDescription>
                        {completedLessons} of {currentScenario.lessons.length} lessons complete in
                        this track.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {currentScenario.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            data-ui={`dashboard.lesson.${lesson.id}`}
                            className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3"
                        >
                            <div>
                                <TitleLevel3 className="text-base">{lesson.title}</TitleLevel3>
                                <TextSmall>{lesson.duration} minutes</TextSmall>
                            </div>
                            {lesson.completed ? (
                                <ButtonSecondary
                                    data-ui={`dashboard.lesson-action.${lesson.id}`}
                                    data-testid={`dashboard-lesson-action-${lesson.id}`}
                                    size="sm"
                                    onClick={() => markLessonComplete(lesson.id)}
                                >
                                    Completed
                                </ButtonSecondary>
                            ) : (
                                <ButtonPrimary
                                    data-ui={`dashboard.lesson-action.${lesson.id}`}
                                    data-testid={`dashboard-lesson-action-${lesson.id}`}
                                    size="sm"
                                    onClick={() => markLessonComplete(lesson.id)}
                                >
                                    Mark done
                                </ButtonPrimary>
                            )}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
