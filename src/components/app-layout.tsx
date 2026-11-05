import { BookOpen, ClipboardList, History, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'

import { ButtonFlat, ButtonSecondary } from './ui/button'
import { useAppStore } from '../store/app-store'
import ThemeToggle from './theme-toggle'
import { TextAccent, TextBase, TextSmall } from './ui/typography'

const navigation = [
    { to: '/dashboard', label: 'Dashboard', icon: BookOpen, end: true },
    { to: '/exam', label: 'Online exam', icon: ClipboardList, end: true },
    { to: '/exam/history', label: 'My exams', icon: History, end: true },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const user = useAppStore((state) => state.user)
    const logout = useAppStore((state) => state.logout)
    const location = useLocation()
    const navigate = useNavigate()
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isTabletMenuOpen, setIsTabletMenuOpen] = useState(false)

    const handleLogout = () => {
        navigate('/login', { replace: true, state: { skipReturnTo: true } })
        logout()
    }

    const links = (placement: 'desktop' | 'mobile' | 'tablet') =>
        navigation.map(({ to, label, icon: Icon, end }) => {
            const isCurrentRoute =
                to === '/exam'
                    ? location.pathname.startsWith('/exam') &&
                      !location.pathname.startsWith('/exam/history')
                    : location.pathname === to || (!end && location.pathname.startsWith(`${to}/`))

            return (
                <NavLink
                    key={to}
                    data-ui={`app.navigation.${to.slice(1).replaceAll('/', '.')}`}
                    data-testid={`navigation-${placement}-${to.slice(1).replaceAll('/', '-')}`}
                    to={to}
                    end={end}
                    aria-current={isCurrentRoute ? 'page' : undefined}
                    title={placement === 'desktop' && isSidebarCollapsed ? label : undefined}
                    onClick={() => {
                        if (placement === 'mobile') setIsMobileMenuOpen(false)
                        if (placement === 'tablet') setIsTabletMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 rounded-md py-2 text-sm font-medium transition-colors ${
                        placement === 'desktop' && isSidebarCollapsed
                            ? 'justify-center px-2'
                            : 'px-3'
                    } ${
                        isCurrentRoute
                            ? 'bg-sky-100 text-sky-900'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`}
                >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span
                        className={
                            placement === 'desktop' && isSidebarCollapsed ? 'sr-only' : undefined
                        }
                    >
                        {label}
                    </span>
                </NavLink>
            )
        })

    return (
        <div
            data-ui="app.shell"
            className="flex min-h-screen bg-slate-100 text-slate-900 md:h-screen md:overflow-hidden"
        >
            <aside
                data-ui="app.desktop-sidebar"
                className={`hidden shrink-0 border-r border-slate-200 bg-white px-2 py-3 transition-[width] lg:flex lg:flex-col ${isSidebarCollapsed ? 'w-14' : 'w-60'}`}
            >
                <div
                    className={`mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between pl-2'}`}
                >
                    {!isSidebarCollapsed && (
                        <NavLink data-ui="app.brand" to="/dashboard" className="text-lg font-bold">
                            Learning React
                        </NavLink>
                    )}
                    <ButtonFlat
                        data-ui="app.desktop-sidebar-toggle"
                        data-testid="desktop-sidebar-toggle"
                        size="icon"
                        className="shrink-0"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        aria-expanded={!isSidebarCollapsed}
                        aria-controls="app-desktop-navigation"
                        onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
                    >
                        {isSidebarCollapsed ? (
                            <Menu className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <X className="h-4 w-4" aria-hidden="true" />
                        )}
                    </ButtonFlat>
                </div>
                <nav
                    data-ui="app.desktop-navigation"
                    id="app-desktop-navigation"
                    aria-label="Main navigation"
                    className="space-y-2"
                >
                    {links('desktop')}
                </nav>
                <div className="mt-auto border-t border-slate-200 pt-4">
                    <TextSmall
                        data-ui="account.sidebar"
                        className={`min-w-0 items-center gap-2 truncate px-2 pb-3 ${isSidebarCollapsed ? 'hidden' : 'flex'}`}
                    >
                        <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <TextBase className="truncate">{user?.email}</TextBase>
                    </TextSmall>
                    <ButtonSecondary
                        data-ui="account.logout"
                        data-testid="logout-desktop"
                        className={`w-full gap-3 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
                        aria-label={isSidebarCollapsed ? 'Log out' : undefined}
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {!isSidebarCollapsed && 'Log out'}
                    </ButtonSecondary>
                </div>
            </aside>
            <div className="flex min-w-0 flex-1 flex-col md:min-h-0">
                <header
                    data-ui="app.header"
                    className="sticky top-0 z-10 border-b border-slate-200 px-2 bg-white py-3 lg:px-4"
                >
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 md:hidden">
                            <ButtonFlat
                                data-ui="app.mobile-menu-toggle"
                                data-testid="mobile-menu-toggle"
                                type="button"
                                size="icon"
                                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isMobileMenuOpen}
                                aria-controls="app-mobile-navigation"
                                onClick={() => setIsMobileMenuOpen((open) => !open)}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-5 w-5" aria-hidden="true" />
                                )}
                            </ButtonFlat>
                            <TextAccent>Learning React</TextAccent>
                        </div>
                        <div className="hidden items-center gap-2 md:flex lg:hidden">
                            <ButtonFlat
                                data-ui="app.tablet-menu-toggle"
                                data-testid="tablet-menu-toggle"
                                type="button"
                                size="icon"
                                aria-label={isTabletMenuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={isTabletMenuOpen}
                                aria-controls="app-tablet-navigation"
                                onClick={() => setIsTabletMenuOpen((open) => !open)}
                            >
                                {isTabletMenuOpen ? (
                                    <X className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Menu className="h-5 w-5" aria-hidden="true" />
                                )}
                            </ButtonFlat>
                            <TextAccent>Learning React</TextAccent>
                        </div>
                        <TextAccent className="hidden lg:block">
                            Learning React
                        </TextAccent>
                        <div className="flex items-center gap-3">
                            <TextSmall
                                data-ui="account.header"
                                className="hidden max-w-56 items-center gap-2 truncate text-sm sm:flex"
                            >
                                <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <TextBase className="truncate">{user?.email}</TextBase>
                            </TextSmall>
                            <ThemeToggle />
                        </div>
                    </div>
                </header>
                <div
                    data-ui="app.tablet-navigation-drawer"
                    className={`fixed inset-0 z-30 hidden md:block lg:hidden ${isTabletMenuOpen ? '' : 'pointer-events-none'}`}
                    aria-hidden={!isTabletMenuOpen}
                    inert={!isTabletMenuOpen}
                >
                    <button
                        type="button"
                        aria-label="Close menu"
                        tabIndex={isTabletMenuOpen ? 0 : -1}
                        onClick={() => setIsTabletMenuOpen(false)}
                        className={`absolute inset-0 h-full w-full bg-slate-950/40 transition-opacity duration-300 ${isTabletMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Tablet navigation"
                        className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r border-slate-200 bg-white px-3 py-5 transition-transform duration-300 ease-out ${isTabletMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <div className="mb-8 flex items-center justify-between">
                            <span className="text-lg font-bold">Learning React</span>
                            <ButtonFlat
                                type="button"
                                size="icon"
                                aria-label="Close menu"
                                tabIndex={isTabletMenuOpen ? 0 : -1}
                                onClick={() => setIsTabletMenuOpen(false)}
                            >
                                <X className="h-5 w-5" aria-hidden="true" />
                            </ButtonFlat>
                        </div>
                        <nav
                            data-ui="app.tablet-navigation"
                            id="app-tablet-navigation"
                            aria-label="Main navigation"
                            className="flex flex-col gap-2"
                        >
                            {links('tablet')}
                        </nav>
                        <div className="mt-auto border-t border-slate-200 pt-4">
                            <p className="mb-3 flex min-w-0 items-center gap-2 truncate px-2 text-sm text-slate-500">
                                <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <span className="truncate">{user?.email}</span>
                            </p>
                            <ButtonSecondary
                                data-ui="account.logout.tablet"
                                data-testid="logout-tablet"
                                className="w-full justify-start gap-3"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                Log out
                            </ButtonSecondary>
                        </div>
                    </section>
                </div>
                <div
                    data-ui="app.mobile-navigation-drawer"
                    className={`fixed inset-0 z-30 md:hidden ${isMobileMenuOpen ? '' : 'pointer-events-none'}`}
                    aria-hidden={!isMobileMenuOpen}
                    inert={!isMobileMenuOpen}
                >
                    <button
                        type="button"
                        aria-label="Close menu"
                        tabIndex={isMobileMenuOpen ? 0 : -1}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`absolute inset-0 h-full w-full bg-slate-950/40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-label="Mobile navigation"
                        className={`absolute inset-x-0 bottom-0 flex min-h-[360px] max-h-[85dvh] flex-col overflow-y-auto rounded-t-2xl border-t border-slate-200 bg-white px-5 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-3 shadow-2xl transition-transform duration-300 ease-out ${isMobileMenuOpen ? 'translate-y-0' : 'translate-y-full'}`}
                    >
                        <div className="mx-auto h-1 w-10 rounded-full bg-slate-300" />
                        <div className="mt-2 mb-5 flex items-center justify-between">
                            <span className="text-base font-semibold">Learning React</span>
                        </div>
                        <nav
                            data-ui="app.mobile-navigation"
                            id="app-mobile-navigation"
                            aria-label="Main navigation"
                            className="flex flex-1 flex-col gap-2"
                        >
                            {links('mobile')}
                        </nav>
                        <div className="mt-2 border-t border-slate-200 pt-4 flex row px-2">
                            <p className="flex min-w-0 items-center gap-2 truncate text-sm text-slate-500 flex-1">
                                <UserRound className="h-4 w-4 shrink-0" aria-hidden="true" />
                                <span className="truncate">{user?.email}</span>
                            </p>
                            <ButtonSecondary
                                data-ui="account.logout.mobile"
                                data-testid="logout-mobile"
                                // className="w-full justify-start gap-3"
                                onClick={handleLogout}
                            >
                                <LogOut className="h-4 w-4" aria-hidden="true" />
                                {/* Log out */}
                            </ButtonSecondary>
                        </div>
                    </section>
                </div>
                <main
                    data-ui="app.main-content"
                    className="min-h-0 flex-1 overflow-y-auto px-4 py-6 md:px-7 md:py-8"
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
