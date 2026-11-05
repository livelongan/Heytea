import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom'

import AppLayout from '../components/app-layout'
import { useAppStore } from '../store/app-store'
import DashboardPage from './dashboard-page'
import ComponentsPage from './components-page'
import ExamEntryPage from './exam-entry-page'
import ExamHistoryPage from './exam-history-page'
import ExamPage from './exam-page'
import ExamResultPage from './exam-result-page'
import ExamStartPage from './exam-start-page'
import LoginPage from './login-page'
import NotFoundPage from './not-found-page'
import ScenarioPage from './scenario-page'

function RequireAuth() {
    const user = useAppStore((state) => state.user)
    const location = useLocation()

    if (!user) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return (
        <AppLayout>
            <Outlet />
        </AppLayout>
    )
}

export default function App() {
    const user = useAppStore((state) => state.user)

    return (
        <Routes>
            <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
            <Route
                path="/login"
                element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
            />
            <Route path="/components" element={<ComponentsPage />} />
            <Route element={<RequireAuth />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/scenarios/:scenarioId" element={<ScenarioPage />} />
                <Route path="/exam" element={<ExamEntryPage />} />
                <Route path="/exam/new" element={<ExamStartPage />} />
                <Route path="/exam/attempt" element={<ExamPage key="active-attempt" />} />
                <Route path="/exam/history" element={<ExamHistoryPage />} />
                <Route path="/exam/result/:attemptId" element={<ExamResultPage />} />
            </Route>
            <Route
                path="*"
                element={
                    user ? (
                        <AppLayout>
                            <NotFoundPage />
                        </AppLayout>
                    ) : (
                        <NotFoundPage />
                    )
                }
            />
        </Routes>
    )
}
