import { Plus, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { taskSchema } from "@/lib/schema/task.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { TodoColumn } from "@/types/todo.types";
import API from "@/app/(root)/api";

export const AddTask = ({ index, column }: { index: number | string, column: TodoColumn }) => {
  type TaskSchema = z.infer<typeof taskSchema>;
  const {
    setValue,
    watch,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TaskSchema>({
    resolver: zodResolver(taskSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      description: "",
      title: "",
    },
  });

  const handleAddTask = async (values: TaskSchema) => {
    const data = {
      title: values.title,
      description: values.description,
      column: column.id,
      board: column.boardId,
      order: column.tasks?.length + 1,
    }
    await API.post(`/task/`, { ...data });
    (
      document?.getElementById(
        `my_modal_${index + "TaskAdding"}`
      ) as HTMLDialogElement
    )?.close()
    values.description = "";
    values.title = "";
  };

  return (
    <>
      <button
        onClick={() =>
          (
            document?.getElementById(
              `my_modal_${index + "TaskAdding"}`
            ) as HTMLDialogElement
          )?.showModal()
        }
        className=""
      >
        <div className="p-2 border fullcenter rounded-md bg-[white] shadow-md cursor-pointer hover:text-green-700 hover:bg-yellow-300">
          <button
            className="min-w-20 rounded-sm fullcenter px-4 text-sm bg-forgroundSecondary-1 h-9 font-medium text-[white] gap-2"
          >
            Add Status
            <Plus className="w-5" />
          </button>
        </div>
      </button>
      <dialog
        id={`my_modal_${index + "TaskAdding"}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white-2">
          <div className="w-full flex justify-between">
            <h1>Add task</h1>
            <div>
              <button
                className=" "
                onClick={() =>
                  (
                    document?.getElementById(
                      `my_modal_${index + "TaskAdding"}`
                    ) as HTMLDialogElement
                  )?.close()
                }
              >
                <X className="w-5" />
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit(handleAddTask)} className="w-full mt-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Task title
              </label>
              <Input
                type="text"
                placeholder="task title"
                value={watch("title")}
                onChange={(e) => {
                  setValue("title", e.target.value);
                  trigger("title");
                }}
              />
              <span className="text-[13px] text-red-600">
                {errors && errors.title && errors.title?.message}
              </span>
            </div>
            {/* <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Task Order
              </label>
              <Input
                type="text"
                placeholder="task order eg: 2"
                value={watch("order")}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty value for backspace and numeric values
                  if (value === "" || /^\d+$/.test(value)) {
                    setValue("order", value === "" ? "" : value);
                    trigger("order");
                  }
                }}
              />
              <span className="text-[13px] text-red-600">
                {errors && errors.order && errors.order?.message}
              </span>
            </div> */}
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Task description
              </label>
              <Textarea
                placeholder="description"
                value={watch("description")}
                onChange={(e) => {
                  setValue("description", e.target.value);
                  trigger("description");
                }}
              />
              <span className="text-[13px] text-red-600">
                {errors && errors.description && errors.description?.message}
              </span>
            </div>
            <div className="w-full mt-2">
              <Button type="submit" className="bg-forgroundSecondary-1 w-full">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};