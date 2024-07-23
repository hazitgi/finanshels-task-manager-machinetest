export const EventSubjects = {
    BOARD_CREATED: 'BOARD_CREATED',
    BOARD_UPDATED: 'BOARD_UPDATED',
    BOARD_REMOVED: 'BOARD_REMOVED',
    TASK_CREATED: 'TASK_CREATED',
    TASK_UPDATED: 'TASK_UPDATED',
    TASK_REMOVED: 'TASK_REMOVED',
} as const;

export type EventSubject = typeof EventSubjects[keyof typeof EventSubjects];