import { TodoColumn } from "./todo.types";

export interface TaskReducerInitial {
  loading: boolean;
  error: boolean | string;
  boards: Array<{ name: string; id: string | number; slug: string; }>;
  columns: TodoColumn[] | null;
  selectedBoardId:  number | string;
  // task: Task[] | null;
}
