import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "./reducers/task.reducer";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const reduxStore = configureStore({
  reducer: {
    task: taskReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Remove or comment out the following line
// export type AppStore = ReturnType<typeof reduxStore>;
