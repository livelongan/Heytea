import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchExamQuestions } from '../api/api'
import { ButtonPrimary } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { TextNormal, TextSmall } from '../components/ui/typography'
import {
    createExamDraft,
    EXAM_DRAFT_KEY,
    LAST_EXAM_KEY,
    saveExamDraft,
} from '../utils/exam-session'

export default function ExamStartPage() {
    const navigate = useNavigate()
    const [isStarting, setIsStarting] = useState(false)
    const [error, setError] = useState('')

    const startExam = async () => {
        setIsStarting(true)
        setError('')
        try {
            const exam = await fetchExamQuestions()
            localStorage.removeItem(EXAM_DRAFT_KEY)
            localStorage.removeItem(LAST_EXAM_KEY)
            saveExamDraft(createExamDraft(exam.examId))
            navigate('/exam/attempt', { replace: true })
        } catch (caughtError) {
            setError(
                caughtError instanceof Error ? caughtError.message : 'Unable to start the exam.',
            )
            setIsStarting(false)
        }
    }

    return (
        <div data-ui="exam.start-page" className="mx-auto max-w-2xl">
            <Card data-ui="exam.start-card">
                <CardHeader>
                    <CardDescription>React foundations</CardDescription>
                    <CardTitle className="text-2xl">Ready to begin?</CardTitle>
                    <CardDescription>
                        20 questions · 100 points · 60 minutes · single choice, multiple choice, and
                        true/false
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <TextNormal className="text-sm leading-6 text-slate-600">
                        Your answers and review marks are saved on this device while the attempt is
                        in progress. The clock begins when you start.
                    </TextNormal>
                    {error && (
                        <TextSmall
                            data-ui="exam.start-error"
                            role="alert"
                            className="text-red-700"
                        >
                            {error}
                        </TextSmall>
                    )}
                    <ButtonPrimary
                        data-ui="exam.begin"
                        data-testid="exam-begin"
                        disabled={isStarting}
                        onClick={() => void startExam()}
                    >
                        {isStarting ? 'Preparing exam…' : 'Begin exam'}
                    </ButtonPrimary>
                </CardContent>
            </Card>
        </div>
    )
}
