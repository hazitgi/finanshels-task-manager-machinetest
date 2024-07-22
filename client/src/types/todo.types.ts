interface Subtask {
  title: string;
  isCompleted: boolean;
}

interface Task {
  title: string;
  id: string; // Changed to string
  slug: string;
  description: string;
  status: string; // Added status
  subtasks: Subtask[];
  order: number; // Changed to 'order'
  columnId: string; // Added to match the data
  boardId: string; // Added to match the data
}

export interface TodoColumn {
  id: string; // Changed to string
  name: string;
  slug: string;
  color?: string;
  boardId: string; // Added to match the data
  tasks: Task[]; // Array of Task objects
}

export interface TodoBoard {
  id: string | number;
  name: string;
  slug: string;
  tasks: Task[];
  columns: TodoColumn[];
}
