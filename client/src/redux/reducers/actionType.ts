// actionTypes.ts
export const BOARD_CREATED = 'BOARD_CREATED';
export const BOARD_UPDATED = 'BOARD_UPDATED';
export const BOARD_REMOVED = 'BOARD_REMOVED';
export const TASK_CREATED = 'TASK_CREATED';
export const TASK_UPDATED = 'TASK_UPDATED';
export const TASK_REMOVED = 'TASK_REMOVED';
export const COLUMN_REMOVED = 'COLUMN_REMOVED';

export type EventSubject =
  | typeof BOARD_CREATED
  | typeof BOARD_UPDATED
  | typeof BOARD_REMOVED
  | typeof TASK_CREATED
  | typeof TASK_UPDATED
  | typeof TASK_REMOVED
  | typeof COLUMN_REMOVED;
