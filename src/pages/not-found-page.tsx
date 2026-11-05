import { Link } from 'react-router-dom'
import { ButtonPrimary } from '../components/ui/button'
import { TitleLevel1, TextNormal } from '../components/ui/typography'
import { FlexColumn } from '../components/ui/wrapper'


export default function NotFoundPage() {
    return (
        <section
            data-ui="not-found.page"
        >
            <FlexColumn className="mx-auto min-h-[60vh] max-w-xl items-center justify-center gap-4 text-center">
                <p className="text-sm font-semibold uppercase text-sky-700">
                    404 · Page not found
                </p>
                <TitleLevel1>This page does not exist</TitleLevel1>
                <TextNormal className="text-slate-600">
                    The address may be outdated or incorrect.
                </TextNormal>
                <Link
                    data-ui="not-found.home-link"
                    data-testid="not-found-home"
                    to="/dashboard"
                >
                    <ButtonPrimary>Return to dashboard</ButtonPrimary>
                </Link>
            </FlexColumn>
        </section>
    )
}
