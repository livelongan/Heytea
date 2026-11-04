import type { UserProfile } from '../types'

export type MockAccount = {
    email: string
    password: string
    token: string
    user: UserProfile
}

export const mockAccounts: MockAccount[] = [
    {
        email: 'student@example.com',
        password: 'secret123',
        token: 'demo-token',
        user: {
            id: 'u-demo',
            name: 'Ada Student',
            email: 'student@example.com',
            role: 'Learner',
        },
    },
]

export const defaultUser = mockAccounts[0].user
