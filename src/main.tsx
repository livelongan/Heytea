import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App'
import ErrorBoundary from './components/error-boundary'
import { ThemeProvider } from './components/theme-provider'
import './index.css'
import { startMocking } from './mocks/browser'
import { initializeTheme } from './utils/theme'

async function bootstrap() {
    initializeTheme()
    await startMocking()

    createRoot(document.getElementById('root')!).render(
        <StrictMode>
            <ThemeProvider>
                <BrowserRouter>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </BrowserRouter>
            </ThemeProvider>
        </StrictMode>,
    )
}

void bootstrap()
