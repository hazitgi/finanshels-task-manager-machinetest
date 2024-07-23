import API from "@/app/(root)/api";
import { TaskReducerInitial } from "@/types/taskReducer.type";
import { TodoBoard, TodoColumn, Task } from "@/types/todo.types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";



const initialState: TaskReducerInitial = {
  loading: false,
  error: false,
  boards: [
    // { name: "Task1", id: 1, slug: "task1" },
    // { name: "Task2", id: 2, slug: "task1" },
    // { name: "Task3", id: 3, slug: "task1" },
  ],
  columns: [
    // {
    //   id: "column-1",
    //   name: "To Do",
    //   slug: "to-do",
    //   color: "#ffcc00",
    //   boardId: "board-1",
    //   tasks: [
    //     {
    //       subtasks: [
    //         {
    //           title: "Design UI",
    //           isCompleted: false,
    //         },
    //         {
    //           title: "Set up database",
    //           isCompleted: false,
    //         },
    //       ],
    //       id: "task-1",
    //       title: "Create UI Mockups",
    //       slug: "create-ui-mockups",
    //       description: "Design and create mockups for the user interface.",
    //       order: 1,
    //       columnId: "column-1",
    //       status: "pending",
    //       boardId: "board-1",
    //     },
    //   ],
    // },
    // {
    //   id: "column-2",
    //   name: "In Progress",
    //   slug: "in-progress",
    //   color: "#3399ff",
    //   boardId: "board-2",
    //   tasks: [
    //     {
    //       subtasks: [
    //         {
    //           title: "Implement authentication",
    //           isCompleted: false,
    //         },
    //         {
    //           title: "Connect to API",
    //           isCompleted: false,
    //         },
    //       ],
    //       id: "task-2",
    //       title: "Develop User Login",
    //       slug: "develop-user-login",
    //       description: "Implement user authentication and login functionality.",
    //       order: 1,
    //       columnId: "column-2",
    //       status: "in-progress",
    //       boardId: "board-2",
    //     },
    //     {
    //       subtasks: [
    //         {
    //           title: "Setup CI/CD pipeline",
    //           isCompleted: false,
    //         },
    //         {
    //           title: "Write unit tests",
    //           isCompleted: false,
    //         },
    //       ],
    //       id: "task-3",
    //       title: "Configure Deployment",
    //       slug: "configure-deployment",
    //       description:
    //         "Set up continuous integration and deployment pipelines.",
    //       order: 2,
    //       columnId: "column-2",
    //       status: "in-progress",
    //       boardId: "board-2",
    //     },
    //   ],
    // },
    // {
    //   id: "column-3",
    //   name: "Done",
    //   slug: "done",
    //   color: "#66cc66",
    //   boardId: "board-3",
    //   tasks: [
    //     {
    //       subtasks: [
    //         {
    //           title: "Set up project repository",
    //           isCompleted: true,
    //         },
    //         {
    //           title: "Install dependencies",
    //           isCompleted: true,
    //         },
    //       ],
    //       id: "task-4",
    //       title: "Initial Project Setup",
    //       slug: "initial-project-setup",
    //       description:
    //         "Complete the initial project setup and install necessary dependencies.",
    //       order: 1,
    //       columnId: "column-3",
    //       status: "completed",
    //       boardId: "board-3",
    //     },
    //   ],
    // },
  ],
  selectedBoardId: 0,
};

// Async thunk to fetch tasks
export const fetchBoard = createAsyncThunk(
  'tasks/fetchBoard',
  async (_, thunkAPI) => {
    try {
      const response = await API.get('/board');
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const fetchColumnTask = createAsyncThunk(
  'tasks/fetchColumnTask',
  async ({ columnId }: { columnId: number | string }, thunkAPI) => {
    console.log(columnId);

    try {
      const response = await API.get(`board/${columnId}/column`);
      console.log(">>>>>>>>>>>>", response.data, ">>>>>");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const addNewBoard = createAsyncThunk(
  'tasks/addNewBoard',
  async ({ name, slug, columns }: TodoBoard, thunkAPI) => {
    try {
      const response = await API.post(`/board`, { name, slug, columns });
      console.log(">>>>>>>>>>>>", response.data, ">>>>>");

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const taskReducer = createSlice({
  name: "task-reducer",
  initialState: initialState,
  reducers: {
    moveTasks: (state, { payload }: { payload: Array<TodoColumn> }) => {
      state.columns = payload;
    },
    setErrorData: (state, { payload }: { payload: any | string }) => {
      state.error = payload;
    },
    setSelectedBoard: (state, { payload }: { payload: number | string }) => {
      state.selectedBoardId = payload;
    },

    // real-time updates
    boardCreated: (state, action: PayloadAction<any>) => {
      state.boards.push(action.payload);
      state.columns = action.payload.columns;
    },
    boardUpdated: (state, action: PayloadAction<any>) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      state.columns = action.payload.columns;
    },
    boardRemoved: (state, action: PayloadAction<{ id: string }>) => {
      state.boards = state.boards.filter(board => board.id !== action.payload.id);
      state.columns = state.columns?.filter(column => column.boardId !== action.payload.id) || [];
    },
    taskCreated: (state, action: PayloadAction<{ columnId: string | number; task: Task }>) => {
      const column = state.columns?.find(col => col.id === action.payload.columnId);
      if (column) {
        column.tasks.push(action.payload.task);
      }
    },
    taskUpdated: (state, action: PayloadAction<{ columnId: string | number; task: Task }>) => {
      const column = state.columns?.find(col => col.id === action.payload.columnId);
      if (column) {
        const taskIndex = column.tasks.findIndex(task => task.id === action.payload.task.id);
        if (taskIndex !== -1) {
          column.tasks[taskIndex] = action.payload.task;
        }
      }
    },
    taskRemoved: (state, action: PayloadAction<{ columnId: string | number; taskId: string | number }>) => {
      const column = state.columns?.find(col => col.id === action.payload.columnId);
      if (column) {
        column.tasks = column.tasks.filter(task => task.id !== action.payload.taskId);
      }
    },
    // real-time updates end
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.fulfilled, (state, action) => {
        state.boards = action.payload;
        state.selectedBoardId = action?.payload[0].id;
      })
      .addCase(fetchBoard.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchColumnTask.fulfilled, (state, action) => {
        state.columns = action.payload;
      })
      .addCase(fetchColumnTask.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(addNewBoard.fulfilled, (state, action) => {
        state.boards = [...state.boards, action.payload];
      })
      .addCase(addNewBoard.rejected, (state, action) => {
        state.error = action.payload as string;
      })
  },
});

export default taskReducer.reducer;
export const { moveTasks, setErrorData, setSelectedBoard, boardCreated, boardUpdated, boardRemoved, taskCreated, taskRemoved, taskUpdated } = taskReducer.actions;