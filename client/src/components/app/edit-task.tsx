import { Task } from "@/types/todo.types";
import { Edit2, X } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editTaskSchema } from "@/lib/schema/edittask.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import API from "@/app/(root)/api";

export const EditTask = ({
    data,
    uniqueId,
    task
}: {
    data: { title: string; description: string };
    uniqueId: string;
    task: Task;
}) => {
    type editTaskSchema = z.infer<typeof editTaskSchema>;
    const { setValue, watch, handleSubmit, trigger } = useForm<editTaskSchema>({
        resolver: zodResolver(editTaskSchema),
        mode: "onChange",
        reValidateMode: "onChange",
        defaultValues: {
            description: "",
            title: "",
        },
    });
    useEffect(() => {
        setValue("description", data.description);
        setValue("title", data.title);
    }, [data]);

    const handleEditTask = async (values: editTaskSchema) => {
        const Editeddata = {
            title: values.title,
            description: values.description,
            column: task.id,
            board: task.boardId
        }
        await API.put(`/task/${task.id}`, { ...Editeddata });
        (document?.getElementById(
                `my_modal_${uniqueId}`
            ) as HTMLDialogElement
        )?.close()
        values.description = "";
        values.title = "";
    };

    return (
        <>
            <Edit2
                className="w-4 hover:text-blue-600 cursor-pointer hover:bg-yellow-300"
                onClick={() =>
                    (
                        document?.getElementById(
                            `my_modal_${uniqueId}`
                        ) as HTMLDialogElement
                    )?.showModal()
                }
            />
            <dialog
                id={`my_modal_${uniqueId}`}
                className="modal modal-bottom sm:modal-middle"
            >
                <div className="modal-box bg-white-2">
                    <div className="w-full flex justify-between">
                        <h1>Edit task</h1>
                        <div>
                            <button
                                className=" "
                                onClick={() =>
                                    (
                                        document?.getElementById(
                                            `my_modal_${uniqueId}`
                                        ) as HTMLDialogElement
                                    )?.close()
                                }
                            >
                                <X className="w-5" />
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(handleEditTask)} className="w-full mt-4">
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
                                {/* {errors && errors.name && errors.name?.message} */}
                            </span>
                        </div>
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
                                {/* {errors && errors.name && errors.name?.message} */}
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