import { TodoColumn } from "./todo.types";

export interface TaskReducerInitial {
  loading: boolean;
  error: boolean | string;
  boards: { name: string; _id: string }[] | null;
  columns: TodoColumn[] | null;
}
