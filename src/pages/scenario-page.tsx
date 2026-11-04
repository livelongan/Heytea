import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAppStore } from '../store/app-store'

export default function ScenarioPage() {
    const { scenarioId } = useParams()
    const scenarios = useAppStore((state) => state.scenarios)
    const currentScenarioId = useAppStore((state) => state.currentScenarioId)
    const selectScenario = useAppStore((state) => state.selectScenario)
    const markLessonComplete = useAppStore((state) => state.markLessonComplete)
    const scenario = scenarios.find((item) => item.id === scenarioId)

    useEffect(() => {
        if (scenario && scenario.id !== currentScenarioId) selectScenario(scenario.id)
    }, [currentScenarioId, scenario, selectScenario])

    if (!scenario) return <Navigate to="/dashboard" replace />

    return (
        <div data-ui="scenario.page" className="mx-auto max-w-5xl space-y-6">
            <div
                data-ui="scenario.heading"
                className="flex flex-wrap items-end justify-between gap-4"
            >
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Scenario detail</p>
                    <h1 className="mt-1 text-3xl font-semibold">{scenario.title}</h1>
                </div>
                <Link data-ui="scenario.back-link" data-testid="scenario-back" to="/dashboard">
                    <Button variant="secondary">Back to dashboard</Button>
                </Link>
            </div>
            <Card data-ui="scenario.lesson-list">
                <CardHeader>
                    <CardTitle>{scenario.difficulty} path</CardTitle>
                    <CardDescription>
                        Progress {scenario.progress}% ·{' '}
                        {scenario.lessons.filter((lesson) => lesson.completed).length}/
                        {scenario.lessons.length} lessons completed
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {scenario.lessons.map((lesson) => (
                        <div
                            key={lesson.id}
                            data-ui={`scenario.lesson.${lesson.id}`}
                            className="flex items-center justify-between gap-4 rounded-md border border-slate-200 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium">{lesson.title}</p>
                                <p className="text-sm text-slate-500">{lesson.duration} minutes</p>
                            </div>
                            <Button
                                data-ui={`scenario.lesson-action.${lesson.id}`}
                                data-testid={`scenario-lesson-action-${lesson.id}`}
                                variant={lesson.completed ? 'secondary' : 'default'}
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
