import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { fetchExamHistory } from '../api/api'
import { TextNormal } from '../components/ui/typography'
import { readExamDraft } from '../utils/exam-session'

export default function ExamEntryPage() {
    const navigate = useNavigate()
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true
        const openExam = async () => {
            const draft = readExamDraft()
            if (draft) {
                navigate('/exam/attempt', { replace: true })
                return
            }
            try {
                const history = await fetchExamHistory()
                if (!active) return
                if (history[0]) navigate(`/exam/result/${history[0].attemptId}`, { replace: true })
                else navigate('/exam/new', { replace: true })
            } catch (caughtError) {
                if (active)
                    setError(
                        caughtError instanceof Error
                            ? caughtError.message
                            : 'Unable to open the exam.',
                    )
            }
        }
        void openExam()
        return () => {
            active = false
        }
    }, [navigate])

    if (error)
        return (
                <TextNormal data-ui="exam.entry-error" role="alert">
                {error}
                </TextNormal>
        )
    return (
            <TextNormal data-ui="exam.entry-loading" role="status">
            Opening your exam…
            </TextNormal>
    )
}
