import { BookOpen, CheckCircle2, GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAppStore } from '../store/app-store'

export default function DashboardPage() {
    const scenarios = useAppStore((state) => state.scenarios)
    const currentScenarioId = useAppStore((state) => state.currentScenarioId)
    const examProgress = useAppStore((state) => state.examProgress)
    const selectScenario = useAppStore((state) => state.selectScenario)
    const markLessonComplete = useAppStore((state) => state.markLessonComplete)
    const currentScenario =
        scenarios.find((scenario) => scenario.id === currentScenarioId) ?? scenarios[0]

    if (!currentScenario) return <p role="status">No learning scenarios are available.</p>

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
                    <h1 className="mt-1 text-3xl font-semibold">Learning Dashboard</h1>
                </div>
                <Link to="/exam">
                    <Button data-ui="dashboard.continue-exam" data-testid="dashboard-continue-exam">
                        Continue React exam
                    </Button>
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
                        <CardDescription>
                            20 questions · 100 points · 60 minutes · single choice, multiple choice, and true/false
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm leading-6 text-slate-600">
                            Practice Hooks, props, state updates, list keys, and controlled inputs.
                            Your active attempt is saved as a draft.
                        </p>
                        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                            <Link
                                data-ui="dashboard.start-exam-link"
                                data-testid="dashboard-start-exam"
                                to="/exam/new"
                            >
                                <Button
                                    className="w-full"
                                    style={{ width: 'fit-content', minWidth: '260px' }}
                                >
                                    Start a new exam
                                </Button>
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
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-sm text-slate-500">{lesson.duration} minutes</p>
                            </div>
                            <Button
                                data-ui={`dashboard.lesson-action.${lesson.id}`}
                                data-testid={`dashboard-lesson-action-${lesson.id}`}
                                variant={lesson.completed ? 'secondary' : 'default'}
                                size="sm"
                                onClick={() => markLessonComplete(lesson.id)}
                            >
                                {lesson.completed ? 'Completed' : 'Mark done'}
                            </Button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
