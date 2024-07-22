import { TodoColumn } from "./todo.types";

export interface TaskReducerInitial {
  loading: boolean;
  error: boolean | string;
  boards: Array<{ name: string; id: string; slug: string; }>;
  columns: TodoColumn[] | null;
  selectedBoardId: string | null;
  // task: Task[] | null;
}
