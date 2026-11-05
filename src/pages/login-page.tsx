import { type FormEvent, useState } from 'react'
import { Eye, EyeOff, GraduationCap, UserRound } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ButtonPrimary } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { TextSmall } from '../components/ui/typography'
import { useAppStore } from '../store/app-store'
import ThemeToggle from '../components/theme-toggle'

type FieldErrors = { email?: string; password?: string }

function validateCredentials(email: string, password: string): FieldErrors {
    const errors: FieldErrors = {}
    const normalizedEmail = email.trim()

    if (!normalizedEmail) errors.email = 'Email is required.'
    else if (normalizedEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
        errors.email = 'Enter a valid email address.'
    }

    if (!password) errors.password = 'Password is required.'
    else if (password.length < 8 || password.length > 128) {
        errors.password = 'Password must be 8 to 128 characters.'
    }

    return errors
}

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const login = useAppStore((state) => state.login)
    const [email, setEmail] = useState('student@example.com')
    const [password, setPassword] = useState('secret123')
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState<FieldErrors>({})
    const [requestError, setRequestError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const validationErrors = validateCredentials(email, password)
        setErrors(validationErrors)
        setRequestError('')
        if (Object.keys(validationErrors).length > 0) return

        setIsSubmitting(true)
        try {
            await login(email.trim(), password)
            const from = (
                location.state as {
                    from?: { pathname?: string; search?: string; hash?: string }
                    skipReturnTo?: boolean
                } | null
            )?.from
            const skipReturnTo = (location.state as { skipReturnTo?: boolean } | null)?.skipReturnTo
            const destination =
                !skipReturnTo && from?.pathname
                    ? `${from.pathname}${from.search ?? ''}${from.hash ?? ''}`
                    : '/dashboard'
            navigate(destination, { replace: true })
        } catch (error) {
            setRequestError(
                error instanceof Error ? error.message : 'Unable to sign in. Please try again.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div
            data-ui="login.page"
            className="flex min-h-screen items-center justify-center bg-slate-100 p-6"
        >
            <div className="fixed right-5 top-5">
                <ThemeToggle />
            </div>
            <Card data-ui="login.card" className="w-full max-w-md border-slate-200 shadow-lg">
                <CardHeader className="space-y-2">
                    <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                        <GraduationCap className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-2xl">Academy portal</CardTitle>
                    <CardDescription>
                        Sign in to continue your learning track and review your exam status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        data-ui="login.form"
                        className="space-y-5"
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input
                                    data-ui="login.email-input"
                                    data-testid="login-email"
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    autoComplete="email"
                                    placeholder="student@example.com"
                                    aria-invalid={Boolean(errors.email)}
                                    aria-describedby={errors.email ? 'email-error' : undefined}
                                    className="pr-10"
                                />
                                <UserRound
                                    data-ui="login.email-icon"
                                    className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                                    aria-hidden="true"
                                />
                            </div>
                            {errors.email && (
                                <TextSmall
                                    data-ui="login.email-error"
                                    id="email-error"
                                    className="text-sm text-red-700"
                                >
                                    {errors.email}
                                </TextSmall>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    data-ui="login.password-input"
                                    data-testid="login-password"
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    autoComplete="current-password"
                                    placeholder="At least 8 characters"
                                    aria-invalid={Boolean(errors.password)}
                                    aria-describedby={
                                        errors.password ? 'password-error' : undefined
                                    }
                                    className="pr-11"
                                />
                                <button
                                    data-ui="login.password-visibility"
                                    data-testid="login-password-visibility"
                                    type="button"
                                    onClick={() => setShowPassword((visible) => !visible)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    aria-pressed={showPassword}
                                    className="absolute right-1 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" aria-hidden="true" />
                                    ) : (
                                        <Eye className="h-4 w-4" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <TextSmall
                                    data-ui="login.password-error"
                                    id="password-error"
                                    className="text-sm text-red-700"
                                >
                                    {errors.password}
                                </TextSmall>
                            )}
                        </div>
                        {requestError && (
                            <TextSmall
                                data-ui="login.request-error"
                                role="alert"
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                            >
                                {requestError}
                            </TextSmall>
                        )}
                        <ButtonPrimary
                            data-ui="login.submit"
                            data-testid="login-submit"
                            className="w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Signing in...' : 'Sign in'}
                        </ButtonPrimary>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
