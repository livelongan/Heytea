import type { ExamDraft } from '../types'

export const EXAM_DRAFT_KEY = 'learning-lab-exam-draft'
export const LAST_EXAM_KEY = 'learning-lab-last-exam'
export const EXAM_DURATION_MS = 60 * 60 * 1000

export function readExamDraft(): ExamDraft | null {
    try {
        const draft = JSON.parse(localStorage.getItem(EXAM_DRAFT_KEY) ?? 'null') as ExamDraft | null
        if (
            draft?.schemaVersion === 1 &&
            typeof draft.attemptId === 'string' &&
            typeof draft.examId === 'string' &&
            typeof draft.startedAt === 'number' &&
            typeof draft.deadlineAt === 'number' &&
            typeof draft.currentIndex === 'number' &&
            typeof draft.answers === 'object' &&
            draft.answers !== null &&
            !Array.isArray(draft.answers) &&
            Array.isArray(draft.markedQuestionIds)
        )
            return draft
    } catch {
        localStorage.removeItem(EXAM_DRAFT_KEY)
    }
    return null
}

export function createExamDraft(examId: string): ExamDraft {
    const startedAt = Date.now()
    const attemptId =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
            ? crypto.randomUUID()
            : `attempt-${startedAt}-${Math.random().toString(36).slice(2)}`

    return {
        schemaVersion: 1,
        attemptId,
        examId,
        startedAt,
        deadlineAt: startedAt + EXAM_DURATION_MS,
        currentIndex: 0,
        answers: {},
        markedQuestionIds: [],
    }
}

export function saveExamDraft(draft: ExamDraft) {
    localStorage.setItem(EXAM_DRAFT_KEY, JSON.stringify(draft))
}
