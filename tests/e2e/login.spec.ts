import { expect, test } from '@playwright/test'

test('user can sign in and view the learning dashboard', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Email').fill('student@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('secret123')
    await page.getByRole('button', { name: /sign in/i }).click()

    await expect(page.getByRole('heading', { name: /learning dashboard/i })).toBeVisible()
    await expect(page.getByRole('banner').getByText('student@example.com')).toBeVisible()
})

test('user can restore an exam draft, submit, and review the result', async ({ page }) => {
    await page.goto('/')

    await page.getByLabel('Email').fill('student@example.com')
    await page.getByRole('textbox', { name: 'Password' }).fill('secret123')
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.getByRole('link', { name: /start a new exam/i }).click()
    await page.getByRole('button', { name: /begin exam/i }).click()

    await expect(page.getByRole('heading', { name: /online assessment/i })).toBeVisible()
    await expect(page.getByTestId('exam-question-points')).toHaveText('Score: 3 points')
    await page.getByLabel('useState').check()
    await page.getByRole('button', { name: /question 2, unanswered/i }).click()
    await page.getByLabel('Props are passed from a parent component.').check()
    await page.getByLabel('A component should treat its props as read-only.').check()
    await page.getByLabel('Props can contain callback functions.').check()

    await page.reload()
    await expect(page.getByRole('heading', { name: /online assessment/i })).toBeVisible()
    await expect(page.getByLabel('Props are passed from a parent component.')).toBeChecked()
    await expect(page.getByLabel('A component should treat its props as read-only.')).toBeChecked()

    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel('False').check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/make every component render only once/i).check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/rendered markup automatically/i).check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/browser url by default/i).check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel('False').check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/inside loops when there are many items/i).check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByTestId('exam-answer-react-009-a').check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/only once before the first render/i).check()
    await page.getByRole('button', { name: /next question/i }).click()
    await page.getByLabel(/added to every component/i).check()
    await page.getByRole('button', { name: /next question/i }).click()

    await expect(page.getByText(/question 12 \/ 20/i)).toBeVisible()
    await page.getByTestId('exam-answer-react-012-a').check()
    await page.getByRole('button', { name: /next question/i }).click()
    for (let questionNumber = 13; questionNumber <= 20; questionNumber += 1) {
        const optionId = questionNumber === 15 || questionNumber === 19 ? 'true' : 'a'
        await page.getByTestId(
            `exam-answer-react-${String(questionNumber).padStart(3, '0')}-${optionId}`,
        ).check()
        if (questionNumber < 20) await page.getByRole('button', { name: /next question/i }).click()
    }

    await expect(page.getByText(/question 20 \/ 20/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /next question/i })).toHaveCount(0)
    await expect(page.getByRole('button', { name: /submit exam/i })).toHaveCount(1)
    await page.getByRole('button', { name: /submit exam/i }).click()
    await page.getByRole('button', { name: /confirm submission/i }).click()
    await expect(page.getByRole('heading', { name: /your exam is complete/i })).toBeVisible()
    await expect(page.getByTestId('exam-result-score')).toHaveText('44')
    await expect(page.getByText(/Answered 20.*Correct 9/)).toBeVisible()

    await page.getByRole('link', { name: 'My exams' }).click()
    await expect(page.getByText(/9\/20 correct/i)).toBeVisible()
    await page.getByText('React foundations assessment').click()
    await expect(page.getByRole('heading', { name: /your exam is complete/i })).toBeVisible()
    await page.getByText('Review answers').click()
    await expect(page.getByText(/Explanation:/i).first()).toBeVisible()
})
