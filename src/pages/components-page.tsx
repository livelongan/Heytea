import {
    ArrowLeft,
    BookOpen,
    Braces,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleCheck,
    CircleX,
    ClipboardList,
    Component,
    Eye,
    EyeOff,
    GraduationCap,
    History,
    ListChecks,
    LogOut,
    Menu,
    Moon,
    Palette,
    ShieldCheck,
    Sun,
    UserRound,
    X,
    type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import ThemeToggle from '../components/theme-toggle'
import {
    ButtonFlat,
    ButtonOutlined,
    ButtonPrimary,
    ButtonSecondary,
} from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import {
    TextNormal,
    TextSmall,
    TitleLevel1,
    TitleLevel2,
    TitleLevel3,
} from '../components/ui/typography'
import { FlexRow } from '../components/ui/wrapper'

const iconEntries: Array<{ name: string; Icon: LucideIcon }> = [
    { name: 'BookOpen', Icon: BookOpen },
    { name: 'ClipboardList', Icon: ClipboardList },
    { name: 'History', Icon: History },
    { name: 'ChevronLeft', Icon: ChevronLeft },
    { name: 'ChevronRight', Icon: ChevronRight },
    { name: 'ChevronDown', Icon: ChevronDown },
    { name: 'Menu', Icon: Menu },
    { name: 'X', Icon: X },
    { name: 'LogOut', Icon: LogOut },
    { name: 'UserRound', Icon: UserRound },
    { name: 'Moon', Icon: Moon },
    { name: 'Sun', Icon: Sun },
    { name: 'ShieldCheck', Icon: ShieldCheck },
    { name: 'Eye', Icon: Eye },
    { name: 'EyeOff', Icon: EyeOff },
    { name: 'CheckCircle2', Icon: CheckCircle2 },
    { name: 'GraduationCap', Icon: GraduationCap },
    { name: 'CircleCheck', Icon: CircleCheck },
    { name: 'CircleX', Icon: CircleX },
    { name: 'ListChecks', Icon: ListChecks },
    { name: 'ArrowLeft', Icon: ArrowLeft },
    { name: 'Braces', Icon: Braces },
    { name: 'Component', Icon: Component },
    { name: 'Palette', Icon: Palette },
]

const iconCode = `import {
  ${iconEntries.map(({ name }) => name).join(',\n  ')},
} from 'lucide-react'

const icons = [
${iconEntries.map(({ name }) => `  { name: '${name}', Icon: ${name} },`).join('\n')}
]

{icons.map(({ name, Icon }) => (
  <div key={name}>
    <Icon aria-hidden="true" />
    <span>{name}</span>
  </div>
))}`

const palettes = [
    {
        title: '中性色',
        colors: [
            ['slate-50', 'var(--app-slate-50)'],
            ['slate-100', 'var(--app-slate-100)'],
            ['slate-200', 'var(--app-slate-200)'],
            ['slate-300', 'var(--app-slate-300)'],
            ['slate-400', 'var(--app-slate-400)'],
            ['slate-500', 'var(--app-slate-500)'],
            ['slate-600', 'var(--app-slate-600)'],
            ['slate-700', 'var(--app-slate-700)'],
            ['slate-800', 'var(--app-slate-800)'],
            ['slate-900', 'var(--app-slate-900)'],
            ['slate-950', 'var(--app-slate-950)'],
        ],
    },
    {
        title: '品牌主色',
        colors: [
            ['sky-50', 'var(--app-accent-50)'],
            ['sky-100', 'var(--app-accent-100)'],
            ['sky-200', 'var(--app-accent-200)'],
            ['sky-300', 'var(--app-accent-300)'],
            ['sky-400', 'var(--app-accent-400)'],
            ['sky-500', 'var(--app-accent-500)'],
            ['sky-600', 'var(--app-accent-600)'],
            ['sky-700', 'var(--app-accent-700)'],
            ['sky-800', 'var(--app-accent-800)'],
            ['sky-900', 'var(--app-accent-900)'],
        ],
    },
    {
        title: '状态色',
        colors: [
            ['red-50', 'var(--app-danger-50)'],
            ['red-100', 'var(--app-danger-100)'],
            ['red-200', 'var(--app-danger-200)'],
            ['red-300', 'var(--app-danger-300)'],
            ['red-500', 'var(--app-danger-500)'],
            ['red-700', 'var(--app-danger-700)'],
            ['amber-50', 'var(--app-warning-50)'],
            ['amber-300', 'var(--app-warning-300)'],
            ['amber-500', 'var(--app-warning-500)'],
            ['amber-900', 'var(--app-warning-900)'],
        ],
    },
]

const buttonCode = `import {
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutlined,
  ButtonFlat,
} from '../components/ui'

<ButtonPrimary>主按钮</ButtonPrimary>
<ButtonSecondary>次要按钮</ButtonSecondary>
<ButtonOutlined>描边按钮</ButtonOutlined>
<ButtonFlat>幽灵按钮</ButtonFlat>

<ButtonPrimary size="sm">小号按钮</ButtonPrimary>
<ButtonPrimary size="lg">大号按钮</ButtonPrimary>
<ButtonPrimary disabled>禁用状态</ButtonPrimary>`

const inputCode = `import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

<div className="space-y-2">
  <Label htmlFor="demo-email">邮箱地址</Label>
  <Input id="demo-email" type="email" placeholder="name@example.com" />
</div>

<div className="space-y-2">
  <Label htmlFor="demo-disabled">禁用状态</Label>
  <Input id="demo-disabled" disabled value="不可编辑" readOnly />
</div>`

const cardCode = `import { ButtonPrimary } from '../components/ui'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>学习进度</CardTitle>
    <CardDescription>本周完成情况</CardDescription>
  </CardHeader>
  <CardContent>
    <p>已完成 8 / 10 个学习任务</p>
    <ButtonPrimary className="mt-4">继续学习</ButtonPrimary>
  </CardContent>
</Card>`

const typographyCode = `import {
  TextNormal,
  TextSmall,
  TitleLevel1,
  TitleLevel2,
  TitleLevel3,
} from '../components/ui'

<TitleLevel1>页面标题</TitleLevel1>
<TitleLevel2>区块标题</TitleLevel2>
<TitleLevel3>子区块标题</TitleLevel3>
<TextNormal>主要正文内容</TextNormal>
<TextSmall>辅助说明文字</TextSmall>`

function CodeDisclosure({ code }: { code: string }) {
    return (
        <details className="group border-t border-slate-200">
            <summary className="cursor-pointer list-none px-5 py-3 text-sm font-medium text-slate-600 marker:hidden hover:text-slate-950 [&::-webkit-details-marker]:hidden">
                <FlexRow className="items-center gap-2">
                    <Braces className="h-4 w-4" aria-hidden="true" />
                    <span>查看示例代码</span>
                    <span className="ml-auto text-xs text-slate-400 group-open:hidden">
                        展开
                    </span>
                    <span className="ml-auto hidden text-xs text-slate-400 group-open:inline">
                        收起
                    </span>
                </FlexRow>
            </summary>
            <pre className="overflow-x-auto border-t border-slate-200 bg-slate-950 p-5 text-xs leading-6 text-slate-100">
                <code>{code}</code>
            </pre>
        </details>
    )
}

function SectionHeading({
    number,
    headingId,
    title,
    description,
}: {
    number: string
    headingId: string
    title: string
    description: string
}) {
    return (
        <FlexRow className="mb-5 items-start gap-3">
            <span className="mt-1 font-mono text-xs font-semibold text-sky-700">{number}</span>
            <div>
                <TitleLevel2 id={headingId} className="text-xl">
                    {title}
                </TitleLevel2>
                <TextSmall className="mt-1">{description}</TextSmall>
            </div>
        </FlexRow>
    )
}

export default function ComponentsPage() {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <FlexRow className="mx-auto max-w-6xl items-center justify-between gap-0 px-5 py-4 sm:px-8">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-950"
                    >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        返回登录
                    </Link>
                    <ThemeToggle />
                </FlexRow>
            </header>

            <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:px-8 sm:pt-16">
                <div className="mb-12 max-w-3xl">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800">
                        <Component className="h-3.5 w-3.5" aria-hidden="true" />
                        UI KIT · PUBLIC COMPONENTS
                    </div>
                    <TitleLevel1 className="text-4xl tracking-tight sm:text-5xl">
                        组件展示
                    </TitleLevel1>
                    <TextNormal className="mt-4 max-w-2xl leading-7 text-slate-600">
                        项目公共 UI 组件与主题色一览。展开每个组件底部的示例代码，即可查看对应的 JSX
                        用法。颜色预览会跟随浅色 / 深色主题切换。
                    </TextNormal>
                    <FlexRow className="mt-6 flex-wrap gap-2">
                        {['Button', 'Input', 'Label', 'Card'].map((name) => (
                            <span
                                key={name}
                                className="rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-xs text-slate-600"
                            >
                                {name}
                            </span>
                        ))}
                    </FlexRow>
                </div>

                <section className="mb-14" aria-labelledby="button-heading">
                    <SectionHeading
                        number="01"
                        headingId="button-heading"
                        title="Button"
                        description="按钮变体、尺寸、禁用状态与焦点交互。"
                    />
                    <Card>
                        <CardContent className="p-5 sm:p-7">
                            <FlexRow className="flex-wrap gap-3">
                                <ButtonPrimary>主按钮</ButtonPrimary>
                                <ButtonSecondary>次要按钮</ButtonSecondary>
                                <ButtonOutlined>描边按钮</ButtonOutlined>
                                <ButtonFlat>幽灵按钮</ButtonFlat>
                                <span className="mx-1 hidden h-8 border-l border-slate-200 sm:block" />
                                <ButtonPrimary size="sm">小号</ButtonPrimary>
                                <ButtonPrimary size="lg">大号</ButtonPrimary>
                                <ButtonPrimary disabled>禁用</ButtonPrimary>
                            </FlexRow>
                        </CardContent>
                        <CodeDisclosure code={buttonCode} />
                    </Card>
                </section>

                <section className="mb-14" aria-labelledby="input-heading">
                    <SectionHeading
                        number="02"
                        headingId="input-heading"
                        title="Input & Label"
                        description="表单标签、输入框、占位文本、聚焦与禁用状态。"
                    />
                    <Card>
                        <CardContent className="grid gap-6 p-5 sm:grid-cols-2 sm:p-7">
                            <div className="space-y-2">
                                <Label htmlFor="demo-email">邮箱地址</Label>
                                <Input
                                    id="demo-email"
                                    type="email"
                                    placeholder="name@example.com"
                                />
                                <p className="text-xs text-slate-500">
                                    正常状态 · 点击输入框查看焦点样式
                                </p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="demo-disabled">禁用状态</Label>
                                <Input
                                    id="demo-disabled"
                                    disabled
                                    value="不可编辑的内容"
                                    readOnly
                                />
                                <p className="text-xs text-slate-500">禁用字段不可编辑</p>
                            </div>
                        </CardContent>
                        <CodeDisclosure code={inputCode} />
                    </Card>
                </section>

                <section className="mb-14" aria-labelledby="card-heading">
                    <SectionHeading
                        number="03"
                        headingId="card-heading"
                        title="Card"
                        description="由 Card、CardHeader、CardTitle、CardDescription 和 CardContent 组合。"
                    />
                    <Card>
                        <CardHeader>
                            <CardTitle>学习进度</CardTitle>
                            <CardDescription>本周完成情况</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FlexRow className="flex-wrap items-center justify-between gap-4 rounded-md bg-sky-50 p-4">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        已完成 8 / 10 个学习任务
                                    </p>
                                    <p className="mt-1 text-xs text-slate-600">
                                        继续保持，完成本周目标
                                    </p>
                                </div>
                                <ButtonPrimary>继续学习</ButtonPrimary>
                            </FlexRow>
                        </CardContent>
                        <CodeDisclosure code={cardCode} />
                    </Card>
                </section>

                <section className="mb-14" aria-labelledby="icon-heading">
                    <SectionHeading
                        number="04"
                        headingId="icon-heading"
                        title="Icon"
                        description="当前项目里实际使用的 Lucide 图标清单，统一展示组件名、图标样式和使用代码。"
                    />
                    <Card>
                        <CardContent className="p-5 sm:p-7">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {iconEntries.map(({ name, Icon }) => (
                                    <FlexRow
                                        key={name}
                                        className="items-center gap-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                                    >
                                        <FlexRow className="h-9 w-9 items-center justify-center gap-0 rounded-md bg-white text-slate-700 shadow-sm">
                                            <Icon className="h-4 w-4" aria-hidden="true" />
                                        </FlexRow>
                                        <span className="font-mono text-xs text-slate-700">
                                            {name}
                                        </span>
                                    </FlexRow>
                                ))}
                            </div>
                        </CardContent>
                        <CodeDisclosure code={iconCode} />
                    </Card>
                </section>

                <section aria-labelledby="color-heading">
                    <SectionHeading
                        number="05"
                        headingId="color-heading"
                        title="主题颜色"
                        description="色板直接读取项目 CSS 主题变量，切换主题时同步更新。"
                    />
                    <div className="grid gap-4 lg:grid-cols-3">
                        {palettes.map((palette) => (
                            <Card key={palette.title} className="overflow-hidden">
                                <CardHeader className="p-5">
                                    <CardTitle className="text-base">{palette.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3 px-5 pb-5 pt-0">
                                    {palette.colors.map(([name, color]) => (
                                        <FlexRow key={name} className="items-center gap-3">
                                            <span
                                                aria-label={`${name} color swatch`}
                                                className="h-8 w-10 shrink-0 rounded-md border border-slate-200"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="min-w-0 flex-1 font-mono text-xs text-slate-700">
                                                {name}
                                            </span>
                                            <code className="text-[10px] text-slate-400">
                                                {color}
                                            </code>
                                        </FlexRow>
                                    ))}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <section className="mt-14" aria-labelledby="typography-heading">
                    <SectionHeading
                        number="06"
                        headingId="typography-heading"
                        title="Typography"
                        description="统一页面标题层级、正文与辅助说明文字。"
                    />
                    <Card>
                        <CardContent className="space-y-5 p-5 sm:p-7">
                            <TitleLevel1>一级标题 · TitleLevel1</TitleLevel1>
                            <TitleLevel2>二级标题 · TitleLevel2</TitleLevel2>
                            <TitleLevel3>三级标题 · TitleLevel3</TitleLevel3>
                            <TextNormal>常规正文使用主题主文字色，适合主要内容说明。</TextNormal>
                            <TextSmall>小号辅助文字使用较浅的次级文字色。</TextSmall>
                        </CardContent>
                        <CodeDisclosure code={typographyCode} />
                    </Card>
                </section>

                <footer className="mt-14 border-t border-slate-200 pt-5 text-xs text-slate-500">
                    <FlexRow className="items-center gap-2">
                        <Palette className="h-4 w-4" aria-hidden="true" />
                        <span>
                            颜色由项目 CSS 变量驱动 · 所有示例均使用 src/components/ui 公共组件
                        </span>
                    </FlexRow>
                </footer>
            </div>
        </main>
    )
}
