import { TaskReducerInitial } from "@/types/taskReducer.type";
import { createSlice } from "@reduxjs/toolkit";

const initialState: TaskReducerInitial = {
  loading: false,
  error: false,
  boards: [
    { name: "Task1", _id: "asdf" },
    { name: "Task2", _id: "asdifou" },
    { name: "Task3", _id: "asfd" },
  ],
  columns: [
    {
      id: "column-1",
      name: "To Do",
      slug: "to-do",
      color: "#ffcc00",
      boardId: "board-1",
      tasks: [
        {
          subtasks: [
            {
              title: "Design UI",
              isCompleted: false,
            },
            {
              title: "Set up database",
              isCompleted: false,
            },
          ],
          id: "task-1",
          title: "Create UI Mockups",
          slug: "create-ui-mockups",
          description: "Design and create mockups for the user interface.",
          order: 1,
          columnId: "column-1",
          status: "pending",
          boardId: "board-1",
        },
      ],
    },
    {
      id: "column-2",
      name: "In Progress",
      slug: "in-progress",
      color: "#3399ff",
      boardId: "board-2",
      tasks: [
        {
          subtasks: [
            {
              title: "Implement authentication",
              isCompleted: false,
            },
            {
              title: "Connect to API",
              isCompleted: false,
            },
          ],
          id: "task-2",
          title: "Develop User Login",
          slug: "develop-user-login",
          description: "Implement user authentication and login functionality.",
          order: 1,
          columnId: "column-2",
          status: "in-progress",
          boardId: "board-2",
        },
        {
          subtasks: [
            {
              title: "Setup CI/CD pipeline",
              isCompleted: false,
            },
            {
              title: "Write unit tests",
              isCompleted: false,
            },
          ],
          id: "task-3",
          title: "Configure Deployment",
          slug: "configure-deployment",
          description:
            "Set up continuous integration and deployment pipelines.",
          order: 2,
          columnId: "column-2",
          status: "in-progress",
          boardId: "board-2",
        },
      ],
    },
    {
      id: "column-3",
      name: "Done",
      slug: "done",
      color: "#66cc66",
      boardId: "board-3",
      tasks: [
        {
          subtasks: [
            {
              title: "Set up project repository",
              isCompleted: true,
            },
            {
              title: "Install dependencies",
              isCompleted: true,
            },
          ],
          id: "task-4",
          title: "Initial Project Setup",
          slug: "initial-project-setup",
          description:
            "Complete the initial project setup and install necessary dependencies.",
          order: 1,
          columnId: "column-3",
          status: "completed",
          boardId: "board-3",
        },
      ],
    },
  ],
};
const taskReducer = createSlice({
  name: "task-reducer",
  initialState: initialState,
  reducers: {
    moveTasks: (state, { payload }) => {
      state.columns = payload;
      
    },
  },
});

export default taskReducer.reducer;
export const { moveTasks } = taskReducer.actions;
