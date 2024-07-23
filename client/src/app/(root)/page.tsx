"use client";
import { DraggableCard } from "@/components/app/draggable-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  boardCreated,
  boardRemoved,
  boardUpdated,
  columnRemoved,
  fetchColumnTask,
  moveTasks,
  taskCreated,
  taskRemoved,
  taskUpdated, columnCreated
} from "@/redux/reducers/task.reducer";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { Task, TodoColumn } from "@/types/todo.types";
import { Plus, Trash2, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Droppable,
  DragDropContext,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { statusAddSchema } from "../../lib/schema/statusAddschema";
import useSocket from "@/hooks/useSocket";
import {
  BOARD_CREATED,
  BOARD_REMOVED,
  BOARD_UPDATED,
  COLUMN_CREATED,
  COLUMN_REMOVED,
  TASK_CREATED,
  TASK_DRAGGED,
  TASK_REMOVED,
  TASK_UPDATED,
} from "@/redux/reducers/actionType";
import API from "./api";
import { AddTask } from "@/components/app/add-task";
import { getRandomColor } from "@/lib/utils";

const Home = () => {
  const { columns: reduxCol, error, selectedBoardId } = useAppSelector(
    (state) => state.task
  );
  // let columns = reduxCol as TodoColumn[];
  const dispatch = useAppDispatch();
  const [columns, setColumns] = useState<TodoColumn[]>([]);

  useEffect(() => {
    dispatch(fetchColumnTask({ columnId: selectedBoardId }));
  }, [dispatch, selectedBoardId]);

  useEffect(() => {
    setColumns(reduxCol as TodoColumn[]);
  }, [reduxCol]);

  const socket = useSocket(process.env.NEXT_SOCKET_URL || "http://localhost:5000");

  useEffect(() => {
    if (socket) {
      socket.on(BOARD_CREATED, (data) => {
        dispatch(boardCreated(data));
      });
      socket.on(BOARD_REMOVED, (data) => {
        dispatch(boardRemoved(data));
      });
      socket.on(BOARD_UPDATED, (data) => {
        dispatch(boardUpdated(data));
      });
      socket.on(TASK_CREATED, (data) => {
        dispatch(taskCreated(data));
      });
      socket.on(TASK_UPDATED, (data) => {
        dispatch(taskUpdated(data));
      });
      socket.on(TASK_REMOVED, (data) => {
        dispatch(taskRemoved(data));
      });
      socket.on(COLUMN_REMOVED, (data) => {
        dispatch(columnRemoved(data));
      });
      socket.on(TASK_DRAGGED, async (data) => {
        dispatch(taskRemoved(data));
        dispatch(taskCreated(data));
      });
      socket.on(COLUMN_CREATED, async (data) => {
        dispatch(columnCreated(data));
      });
    }
  }, [socket, dispatch]);

  type StatusSchema = z.infer<typeof statusAddSchema>;
  const {
    watch,
    setValue,
    formState: { errors },
    trigger,
    handleSubmit,
  } = useForm<StatusSchema>({
    resolver: zodResolver(statusAddSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const handleStatusAddFormSubmit = async (values: StatusSchema) => {
    console.log(values);
    await API.post(`/board/${selectedBoardId}/addcolumn`, { name: values.status, color: getRandomColor() });
  };

  const handleDragEnd = async (result: DropResult) => {
    const { draggableId, source, destination } = result;

    // If there's no destination, return
    if (!destination) return;

    // If the source and destination are the same, return
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    // Create a deep copy of the columns array
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: column.tasks.map((task) => ({ ...task })), // Ensure tasks are deeply copied
    }));

    // Find the source and destination columns
    const startColumnIndex = updatedColumns.findIndex(
      (col) => col.id === parseInt(source.droppableId)
    );
    const endColumnIndex = updatedColumns.findIndex(
      (col) => col.id === parseInt(destination.droppableId)
    );

    if (startColumnIndex !== -1 && endColumnIndex !== -1) {
      const startColumn = updatedColumns[startColumnIndex];
      const endColumn = updatedColumns[endColumnIndex];

      let updatedTask: Task | null = null;

      // Reorder tasks within the same column
      if (source.droppableId === destination.droppableId) {
        const [movedTask] = startColumn.tasks.splice(source.index, 1);
        startColumn.tasks.splice(destination.index, 0, movedTask);

        // Update the task's order in the start column
        startColumn.tasks = startColumn.tasks.map((task, index) => {
          if (task.id === parseInt(draggableId)) {
            updatedTask = { ...task, order: index + 1 };
            return updatedTask;
          }
          return { ...task, order: index + 1 };
        });
      } else {
        // Move tasks between columns
        const [movedTask] = startColumn.tasks.splice(source.index, 1);

        // Update the moved task's columnId and order
        updatedTask = { ...movedTask, columnId: destination.droppableId.toString(), order: destination.index + 1 };
        endColumn.tasks.splice(destination.index, 0, updatedTask);

        // Update the task's order in the destination column
        endColumn.tasks = endColumn.tasks.map((task, index) => {
          if (task.id === parseInt(draggableId)) {
            return { ...task, order: index + 1 };
          }
          return { ...task, order: index + 1 };
        });

        // Update the task's order in the start column
        startColumn.tasks = startColumn.tasks.map((task, index) => ({
          ...task,
          order: index + 1,
        }));
      }

      // Save the updated task data to the API
      if (updatedTask) {
        try {
          let columnId = parseInt(updatedTask.columnId)
          await API.put(`/task/${updatedTask.id}/drag`, { ...updatedTask, columnId });
        } catch (error) {
          console.error('Failed to save task data:', error);
        }
      }

      // Update the state with the modified columns array
      // setColumns(updatedColumns);
      dispatch(moveTasks(updatedColumns));
    }
  };

  const columnDelete = async (columnId: string | number, boardId: number | string) => {
    const userConfirmation = window.confirm(`Are you sure you want to delete this?`);
    if (!userConfirmation) return;
    await API.delete(`/board/${boardId}/column/${columnId}`);
  }


  return (
    <main className="w-full h-full p-5 overflow-x-hidden scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-300 ">
      <div className="w-full flex justify-between h-10 items-center">
        <div>
          <h1 className="font-medium">Task 1 !🎇🎨🎏</h1>
        </div>
        <div className="">
          <dialog
            id="my_modal_6"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-white-2">
              <div className="w-full flex justify-between">
                <h1>Add new status</h1>
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className=" ">
                    <X className="w-5" />
                  </button>
                </form>
              </div>
              <form
                className="w-full flex flex-col"
                onSubmit={handleSubmit(handleStatusAddFormSubmit)}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="" className="text-sm">
                    status
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter new status"
                    value={watch("status")}
                    onChange={(e) => {
                      setValue("status", e.target.value);
                      trigger("status");
                    }}
                  />
                  <span className="text-[13px] text-red-600">
                    {/* {errors && errors.name && errors.name?.message} */}
                  </span>
                </div>
                <div className="w-full mt-3">
                  <Button
                    type="submit"
                    className="bg-forgroundSecondary-1 w-full"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </dialog>
          <button
            onClick={() =>
              (
                document?.getElementById("my_modal_6") as HTMLDialogElement
              )?.showModal()
            }
            className="min-w-20 rounded-sm fullcenter px-4 text-sm bg-forgroundSecondary-1 h-9 font-medium text-[white] gap-2"
          >
            Add Status
            <Plus className="w-5" />
          </button>
        </div>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal">
          {(provided) => (
            <section
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full mt-4 h-full pb-10 overflow-x-auto scrollbar-none space-x-2 whitespace-nowrap relative flex"
            >
              {columns?.map((column, I) => (
                <Droppable key={column.id} droppableId={column.id.toString()}>
                  {(provider) => (
                    <div
                      className="h-full relative top-0"
                      {...provider.droppableProps}
                      ref={provider.innerRef}
                    >
                      <div className={`bg-white-2 w-80 h-full rounded-xl p-5`}>
                        <div className="w-full flex justify-between pb-5 ">
                          <div>
                            <span className="font-medium">{column.name}</span>
                          </div>
                          <div className="flex gap-2">
                            <div className="size-7 border fullcenter rounded-md bg-[white] shadow-md cursor-pointer hover:bg-yellow-300">
                              <Trash2 className="w-4 hover:text-red-800 " onClick={() => columnDelete(column.id, column.boardId)} />
                            </div>
                            {/* <div className="size-7 border fullcenter rounded-md bg-[white] shadow-md cursor-pointer hover:bg-yellow-300">
                              <Trash2 className="w-4 hover:text-red-800 " onClick={() => columnDelete(column.id, column.boardId)} />
                            </div> */}

                          </div>
                        </div>
                        <div className="w-full flex justify-end pb-5 border-b-2">
                          <AddTask index={I} column={column} />
                        </div>
                        <div className="flex flex-col mt-4">
                          {column.tasks?.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={`${task.id}`}
                              index={index}
                            >
                              {(provided) => (
                                <DraggableCard
                                  title={task.title}
                                  Idx={index + "TSK" + I}
                                  description={task.description}
                                  task={task}
                                  draggableProps={provided.draggableProps}
                                  dragHandleProps={provided.dragHandleProps}
                                  ref={provided.innerRef}
                                  style={{ ...provided.draggableProps.style }} // Ensure the style is applied
                                />
                              )}
                            </Draggable>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
              {provided.placeholder}
            </section>
          )}
        </Droppable>
      </DragDropContext>
    </main >
  );
};

export default Home;