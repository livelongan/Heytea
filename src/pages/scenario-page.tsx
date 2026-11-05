import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ButtonPrimary, ButtonSecondary, } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TextSmall, TitleLevel1, TitleLevel3 } from '../components/ui/typography'
import { useAppStore } from '../store/app-store'
import { FlexRow } from '../components/ui/wrapper'

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
            <FlexRow
                data-ui="scenario.heading"
                className="flex-wrap items-end justify-between gap-4"
            >
                <div>
                    <p className="text-sm font-semibold uppercase text-sky-700">Scenario detail</p>
                    <TitleLevel1 className="mt-1">{scenario.title}</TitleLevel1>
                </div>
                <Link data-ui="scenario.back-link" data-testid="scenario-back" to="/dashboard">
                    <ButtonSecondary>Back to dashboard</ButtonSecondary>
                </Link>
            </FlexRow>
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
                        <FlexRow
                            key={lesson.id}
                            data-ui={`scenario.lesson.${lesson.id}`}
                            className="items-center justify-between gap-4 rounded-md border border-slate-200 px-4 py-3"
                        >
                            <div>
                                <TitleLevel3 className="text-base">{lesson.title}</TitleLevel3>
                                <TextSmall>{lesson.duration} minutes</TextSmall>
                            </div>
                            {lesson.completed ? (
                                <ButtonSecondary
                                    data-ui={`scenario.lesson-action.${lesson.id}`}
                                    data-testid={`scenario-lesson-action-${lesson.id}`}
                                    onClick={() => markLessonComplete(lesson.id)}
                                >
                                    Completed
                                </ButtonSecondary>
                            ) : (
                                <ButtonPrimary
                                    data-ui={`scenario.lesson-action.${lesson.id}`}
                                    data-testid={`scenario-lesson-action-${lesson.id}`}
                                    onClick={() => markLessonComplete(lesson.id)}
                                >
                                    Mark done
                                </ButtonPrimary>
                            )}
                        </FlexRow>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}
