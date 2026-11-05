# 界面选择器指南

## 用途

应用提供两种互补的属性，用于定位界面代码和测试交互行为：

- `data-ui`：供开发者定位实现的标记。可在浏览器开发者工具中检查页面区域，再到 `src/` 中搜索完全相同的值。
- `data-testid`：稳定的自动化测试选择器，适用于操作控件、重复记录和状态相关控件。当可访问角色／名称不唯一，或测试需要不受界面文案影响地定位控件时使用。

这两种属性都不控制样式或应用行为。若存在稳定选择器，请勿依赖 Tailwind 类名、生成的 DOM 结构或数组位置来选择元素。

## 选择器规则

1. 优先使用可访问查询：角色和可访问名称、标签或可见文本。
2. 操作控件、动态记录以及标签会随状态变化的控件使用 `data-testid`。
3. 文案或样式变化时，保持测试 ID 稳定；只有控件用途发生变化时才重命名。
4. 测试 ID 使用小写 kebab-case，并体现页面、意图和对象，例如 `exam-primary-action`。
5. 重复控件应包含稳定标识；若实体 ID 可用，不要使用当前数组序号，例如 `dashboard-lesson-action-lesson-3`。
6. 响应式布局中的同类控件应有不同 ID，例如 `navigation-desktop-dashboard` 和 `navigation-mobile-dashboard`。
7. `data-ui` 使用 `page.region.control` 格式。重复的 `data-ui` 值可包含稳定记录 ID 或序号，例如 `exam.question-number.3`。
8. 新增、移动或重命名重要操作时，应添加或更新对应的选择器断言。

## 当前操作选择器

### 登录与主题

| 测试 ID | 元素 |
| --- | --- |
| `login-email` | 邮箱输入框 |
| `login-password` | 密码输入框 |
| `login-password-visibility` | 显示／隐藏密码操作 |
| `login-submit` | 登录操作 |
| `theme-toggle` | 白天／夜间模式切换 |

### 应用导航与学习首页

| 测试 ID | 元素 |
| --- | --- |
| `navigation-desktop-dashboard` | 桌面端学习首页导航 |
| `navigation-desktop-exam` | 桌面端考试导航 |
| `navigation-desktop-exam-history` | 桌面端考试记录导航 |
| `navigation-mobile-dashboard` | 移动端学习首页导航 |
| `navigation-mobile-exam` | 移动端考试导航 |
| `navigation-mobile-exam-history` | 移动端考试记录导航 |
| `logout-desktop` | 桌面端退出登录操作 |
| `logout-mobile` | 移动端退出登录操作 |
| `dashboard-continue-exam` | 继续当前考试 |
| `dashboard-start-exam` | 开始新考试 |
| `dashboard-exam-history` | 打开考试记录 |
| `dashboard-scenario-<scenarioId>` | 打开学习计划 |
| `dashboard-lesson-action-<lessonId>` | 完成一门课程 |

### 学习计划与考试

| 测试 ID | 元素 |
| --- | --- |
| `scenario-back` | 从学习计划返回学习首页 |
| `scenario-lesson-action-<lessonId>` | 完成学习计划中的课程 |
| `exam-begin` | 开始计时答题 |
| `exam-load-retry` | 重试加载不可用的考试 |
| `exam-mark-review` | 切换当前题目的复查标记 |
| `exam-previous` | 返回上一题 |
| `exam-primary-action` | 前往下一题，或在最后一题交卷 |
| `exam-question-<number>` | 跳转到指定题目 |
| `exam-answer-<questionId>-<optionId>` | 选择客观题答案 |
| `exam-response-<questionId>` | 输入主观题答案 |
| `exam-submit-cancel` | 取消交卷确认 |
| `exam-submit-confirm` | 确认交卷 |

### 考试记录与成绩

| 测试 ID | 元素 |
| --- | --- |
| `exam-history-new-exam` | 从考试记录开始新考试 |
| `exam-history-empty-start` | 在没有考试记录时开始第一次考试 |
| `exam-history-result-<attemptId>` | 打开已完成的考试成绩 |
| `exam-result-history` | 返回考试记录 |
| `exam-result-dashboard` | 返回学习首页 |
| `exam-result-error-history` | 成绩加载失败后打开考试记录 |
| `exam-result-question-<questionId>` | 查看单题成绩 |
| `not-found-home` | 从 404 页面返回学习首页 |
| `error-boundary-retry` | 渲染失败后重试 |
| `error-boundary-dashboard` | 渲染失败后返回学习首页 |

通用 UI 组件也提供 `ui.button`、`ui.card`、`ui.input` 和 `ui.label` 等 `data-ui` 值。页面可用更具体的业务标记覆盖它们。定位标题、摘要或状态消息等非操作区域时，请检查源码中的 `data-ui` 属性。

## 示例

Testing Library：

```tsx
await user.click(screen.getByTestId('exam-primary-action'))
expect(screen.getByTestId('exam-question-2')).toBeDisabled()
```

Playwright：

```ts
await page.getByTestId('login-password-visibility').click()
await page.getByTestId('exam-answer-react-001-a').check()
await page.getByTestId('exam-primary-action').click()
```

验证用户可见结果时，优先使用角色和名称断言，例如：

```ts
await expect(page.getByRole('heading', { name: /考试成绩/ })).toBeVisible()
```
