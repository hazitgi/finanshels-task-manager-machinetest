"use client";
import { DraggableCard } from "@/components/app/draggable-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { moveTasks } from "@/redux/reducers/task.reducer";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import { TodoColumn } from "@/types/todo.types";
import { Plus, X } from "lucide-react";
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
const Home = () => {
  const { columns: reduxCol } = useAppSelector((state) => state.task);
  const dispatch = useAppDispatch();

  const [columns, setColumns] = useState<TodoColumn[]>([]);

  useEffect(() => {
    setColumns(reduxCol as TodoColumn[]);
  }, [reduxCol]);

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
  const handleStatusAddFormSubmit = (values: StatusSchema) => {};
  const handleDragEnd = (result: DropResult) => {
    console.log("Drag result:", result); // Debugging output

    const { source, destination } = result;

    // If there's no destination, exit the function
    if (!destination) {
      return;
    }

    // Create a copy of the columns array to ensure immutability
    const updatedColumns = columns.map((column) => ({
      ...column,
      tasks: [...column.tasks], // Ensure tasks are copied
    }));

    // Find the source and destination columns
    const startColumnIndex = updatedColumns.findIndex(
      (col) => col.id === source.droppableId
    );
    const endColumnIndex = updatedColumns.findIndex(
      (col) => col.id === destination.droppableId
    );

    if (startColumnIndex !== -1 && endColumnIndex !== -1) {
      const startColumn = updatedColumns[startColumnIndex];
      const endColumn = updatedColumns[endColumnIndex];

      // Reorder tasks within the same column
      if (source.droppableId === destination.droppableId) {
        const [movedTask] = startColumn.tasks.splice(source.index, 1);
        startColumn.tasks.splice(destination.index, 0, movedTask);
      } else {
        // Move tasks between columns
        const [movedTask] = startColumn.tasks.splice(source.index, 1);
        endColumn.tasks.splice(destination.index, 0, movedTask);
      }

      // Update the state with the modified columns array
      setColumns(updatedColumns);
      dispatch(moveTasks(updatedColumns));
    }
  };

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
                    placeholder="Board name"
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
              {columns?.map((column) => (
                <Droppable key={column.id} droppableId={column.id.toString()}>
                  {(provider) => (
                    <div
                      className="h-full relative top-0"
                      {...provider.droppableProps}
                      ref={provider.innerRef}
                    >
                      <div className="bg-white-2 w-80 h-full rounded-xl p-5">
                        <div className="w-full flex justify-between pb-5 border-b-2">
                          <div>
                            <span className="font-medium">{column.name}</span>
                          </div>
                          <div className="size-7 border fullcenter rounded-md bg-[white] shadow-md cursor-pointer">
                            <Plus className="w-4" />
                          </div>
                        </div>
                        <div className="flex flex-col mt-4">
                          {column.tasks?.map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={task.id}
                              index={index}
                            >
                              {(provided) => (
                                <DraggableCard
                                  title={task.title}
                                  description={task.description}
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
    </main>
  );
};

export default Home;
