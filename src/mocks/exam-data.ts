import type { ExamQuestion } from '../types'

export type MockExamQuestion = ExamQuestion & {
    correctAnswer: string | string[]
    explanation: string
}

export const mockExamId = 'react-foundations-2026-v2'
export const MAX_EXAM_SCORE = 100

export const mockExamQuestions: MockExamQuestion[] = [
    {
        id: 'react-001',
        type: 'single',
        stem: 'Which Hook is used to add local state to a function component?',
        options: [
            { id: 'a', text: 'useState' },
            { id: 'b', text: 'useRoute' },
            { id: 'c', text: 'useFetch' },
            { id: 'd', text: 'useClass' },
        ],
        correctAnswer: 'a',
        explanation: 'useState declares a state value and a setter in a function component.',
        points: 3,
    },
    {
        id: 'react-002',
        type: 'multiple',
        stem: 'Which statements about props are correct?',
        options: [
            { id: 'a', text: 'Props are passed from a parent component.' },
            { id: 'b', text: 'A component should treat its props as read-only.' },
            { id: 'c', text: 'A child should directly mutate its props.' },
            { id: 'd', text: 'Props can contain callback functions.' },
        ],
        correctAnswer: ['a', 'b', 'd'],
        explanation: 'Props flow into a component and should be treated as immutable inputs.',
        points: 4,
    },
    {
        id: 'react-003',
        type: 'judgment',
        stem: 'A useEffect cleanup function can run before the effect is re-run.',
        options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
        ],
        correctAnswer: 'true',
        explanation:
            'React runs the previous cleanup before running an updated effect, and on unmount.',
        points: 5,
    },
    {
        id: 'react-004',
        type: 'single',
        stem: 'Why should list items have a stable key?',
        options: [
            { id: 'a', text: 'To help React match items between renders.' },
            { id: 'b', text: 'To make every component render only once.' },
            { id: 'c', text: 'To automatically sort the list.' },
            { id: 'd', text: 'To replace the item value.' },
        ],
        correctAnswer: 'a',
        explanation:
            'Stable keys help React identify which list items were added, removed, or moved.',
        points: 6,
    },
    {
        id: 'react-005',
        type: 'multiple',
        stem: 'Which are valid reasons to extract a custom Hook?',
        options: [
            { id: 'a', text: 'Reuse stateful logic between components.' },
            { id: 'b', text: 'Share a component’s rendered markup automatically.' },
            { id: 'c', text: 'Group related stateful behavior.' },
            { id: 'd', text: 'Call built-in Hooks conditionally.' },
        ],
        correctAnswer: ['a', 'c'],
        explanation:
            'Custom Hooks reuse logic, not markup; Hooks must still follow the Rules of Hooks.',
        points: 7,
    },
    {
        id: 'react-006',
        type: 'single',
        stem: 'A controlled input gets its current value from:',
        options: [
            { id: 'a', text: 'React state passed through value.' },
            { id: 'b', text: 'The browser URL by default.' },
            { id: 'c', text: 'A list key.' },
            { id: 'd', text: 'The component display name.' },
        ],
        correctAnswer: 'a',
        explanation:
            'A controlled input receives value from React state and updates it with an event handler.',
        points: 3,
    },
    {
        id: 'react-007',
        type: 'judgment',
        stem: 'Calling a state setter schedules a future render; it does not change the current render’s state variable.',
        options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
        ],
        correctAnswer: 'true',
        explanation:
            'Each render observes a snapshot of state. A setter requests a render with the next value.',
        points: 4,
    },
    {
        id: 'react-008',
        type: 'multiple',
        stem: 'Which statements about the Rules of Hooks are correct?',
        options: [
            { id: 'a', text: 'Call Hooks at the top level of a component or custom Hook.' },
            { id: 'b', text: 'Call Hooks inside loops when there are many items.' },
            { id: 'c', text: 'Call Hooks in the same order on every render.' },
            { id: 'd', text: 'Call Hooks from event handlers.' },
        ],
        correctAnswer: ['a', 'c'],
        explanation:
            'Hooks must be called at the top level and in a consistent order on every render.',
        points: 5,
    },
    {
        id: 'react-009',
        type: 'single',
        stem: 'How should an object in React state usually be updated?',
        options: [
            { id: 'a', text: 'Create a new object and pass it to the state setter.' },
            { id: 'b', text: 'Mutate the existing object directly.' },
            { id: 'c', text: 'Change the object without calling the setter.' },
            { id: 'd', text: 'Store the object in a list key.' },
        ],
        correctAnswer: 'a',
        explanation:
            'Creating a new object and using the state setter gives React a new value to render.',
        points: 6,
    },
    {
        id: 'react-010',
        type: 'single',
        stem: 'When does an effect with no dependency array run?',
        options: [
            { id: 'a', text: 'After every committed render.' },
            { id: 'b', text: 'Only once before the first render.' },
            { id: 'c', text: 'Only when the browser tab becomes active.' },
            { id: 'd', text: 'It never runs.' },
        ],
        correctAnswer: 'a',
        explanation:
            'Without a dependency array, an effect runs after each committed render; cleanup runs before the next effect and on unmount.',
        points: 7,
    },
    {
        id: 'react-011',
        type: 'multiple',
        stem: 'Which statements about useMemo and useCallback are correct?',
        options: [
            { id: 'a', text: 'useMemo caches the result of a calculation.' },
            { id: 'b', text: 'useCallback caches a function reference.' },
            { id: 'c', text: 'Both Hooks should be added to every component.' },
            { id: 'd', text: 'Both Hooks can replace state.' },
        ],
        correctAnswer: ['a', 'b'],
        explanation:
            'useMemo memoizes a calculated value and useCallback memoizes a function reference; neither is needed by default in every component.',
        points: 3,
    },
    {
        id: 'react-012',
        type: 'single',
        stem: 'In a controlled text input, what should the onChange handler do?',
        options: [
            { id: 'a', text: 'Update the state that supplies the input value.' },
            { id: 'b', text: 'Change the input key on every keystroke.' },
            { id: 'c', text: 'Remove the value prop from the input.' },
            { id: 'd', text: 'Reload the page after each character.' },
        ],
        correctAnswer: 'a',
        explanation:
            'The onChange handler stores the latest input value in state, which React passes back to the input.',
        points: 4,
    },
    {
        id: 'react-013',
        type: 'single',
        stem: 'Which prop lets a component render different content inside its opening and closing tags?',
        options: [
            { id: 'a', text: 'children' },
            { id: 'b', text: 'contentKey' },
            { id: 'c', text: 'innerState' },
            { id: 'd', text: 'renderId' },
        ],
        correctAnswer: 'a',
        explanation: 'React passes nested JSX to a component through its children prop.',
        points: 5,
    },
    {
        id: 'react-014',
        type: 'multiple',
        stem: 'Which are valid ways to render a list in React?',
        options: [
            { id: 'a', text: 'Use map to transform items into elements.' },
            { id: 'b', text: 'Give each sibling element a stable key.' },
            { id: 'c', text: 'Call a component conditionally inside map.' },
            { id: 'd', text: 'Return an element for each item.' },
        ],
        correctAnswer: ['a', 'b', 'd'],
        explanation:
            'Lists are commonly rendered with map, returning an element per item and assigning stable keys.',
        points: 6,
    },
    {
        id: 'react-015',
        type: 'judgment',
        stem: 'A controlled input should update the state that supplies its value when the user types.',
        options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
        ],
        correctAnswer: 'true',
        explanation:
            'An onChange handler should update the state used as the controlled input value.',
        points: 7,
    },
    {
        id: 'react-016',
        type: 'single',
        stem: 'Which event handler is typically used to respond to a form submission?',
        options: [
            { id: 'a', text: 'onSubmit' },
            { id: 'b', text: 'onRender' },
            { id: 'c', text: 'onMount' },
            { id: 'd', text: 'onRoute' },
        ],
        correctAnswer: 'a',
        explanation: 'React forms use onSubmit to handle a form submission event.',
        points: 3,
    },
    {
        id: 'react-017',
        type: 'multiple',
        stem: 'Which statements about useEffect dependencies are correct?',
        options: [
            { id: 'a', text: 'Dependencies describe reactive values used by the effect.' },
            {
                id: 'b',
                text: 'An empty dependency array runs the effect after the initial commit.',
            },
            { id: 'c', text: 'Dependencies should be omitted to silence stale-value issues.' },
            { id: 'd', text: 'React compares dependencies between renders.' },
        ],
        correctAnswer: ['a', 'b', 'd'],
        explanation:
            'React compares listed dependencies between renders and re-runs the effect when one changes.',
        points: 4,
    },
    {
        id: 'react-018',
        type: 'single',
        stem: 'What should an event handler call to update a state value created with useState?',
        options: [
            { id: 'a', text: 'The setter returned by useState.' },
            { id: 'b', text: 'The component function directly.' },
            { id: 'c', text: 'The browser refresh method.' },
            { id: 'd', text: 'The key prop.' },
        ],
        correctAnswer: 'a',
        explanation: 'The setter returned from useState schedules the component state update.',
        points: 5,
    },
    {
        id: 'react-019',
        type: 'judgment',
        stem: 'React state should usually be mutated directly so that a render happens immediately.',
        options: [
            { id: 'true', text: 'True' },
            { id: 'false', text: 'False' },
        ],
        correctAnswer: 'false',
        explanation:
            'State should be updated through its setter with a new value; direct mutation does not reliably trigger rendering.',
        points: 6,
    },
    {
        id: 'react-020',
        type: 'single',
        stem: 'Which attribute should be used to provide a stable identity to a rendered list item?',
        options: [
            { id: 'a', text: 'key' },
            { id: 'b', text: 'refName' },
            { id: 'c', text: 'indexName' },
            { id: 'd', text: 'identity' },
        ],
        correctAnswer: 'a',
        explanation:
            'A stable key helps React preserve the identity of list items between renders.',
        points: 7,
    },
]
