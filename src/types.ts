export type UserProfile = {
    id: string
    name: string
    email: string
    role: string
}

export type Lesson = {
    id: string
    title: string
    duration: number
    completed: boolean
}

export type Scenario = {
    id: string
    title: string
    difficulty: 'Starter' | 'Intermediate' | 'Advanced'
    progress: number
    lessons: Lesson[]
}

export type ExamResult = {
    attemptId: string
    examId: string
    submittedAt: number
    durationSeconds: number
    submittedAutomatically: boolean
    score: number
    passed: boolean
    correctCount: number
    totalQuestions: number
    questions: ExamQuestionResult[]
}

export type ExamChoice = {
    id: string
    text: string
}

export type ExamQuestion = {
    id: string
    type: 'single' | 'multiple' | 'judgment'
    stem: string
    description?: string
    options: ExamChoice[]
    points: number
}

export type ExamAnswer = string | string[]

export type ExamQuestionResult = {
    question: ExamQuestion
    answer: ExamAnswer | null
    correctAnswer: ExamAnswer
    isCorrect: boolean
    explanation: string
}

export type ExamDraft = {
    schemaVersion: 1
    attemptId: string
    examId: string
    startedAt: number
    deadlineAt: number
    currentIndex: number
    answers: Record<string, ExamAnswer>
    markedQuestionIds: string[]
}
