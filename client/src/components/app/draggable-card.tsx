import { Edit2, Trash2, X } from "lucide-react";
import React, { forwardRef } from "react";
import { DraggableProvided } from "react-beautiful-dnd";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { EditTask } from "./edit-task";
import { Task } from "@/types/todo.types";
import API from "@/app/(root)/api";

interface DraggableCardProps {
  title: string;
  description: string;
  draggableProps: any; // Fix types for better accuracy
  dragHandleProps: any; // Fix types for better accuracy
  Idx: number | string;
  style?: React.CSSProperties; // Add optional style prop
  task: Task;
}

export const DraggableCard = forwardRef<HTMLDivElement, DraggableCardProps>(
  (
    {
      title,
      description,
      draggableProps,
      dragHandleProps,
      Idx,
      style,
      task,
      ...props
    },
    ref
  ) => {
    const handleTaskDelete = async () => {
      const userConfirmation = window.confirm(`Are you sure you want to delete '${task.title}'?`);
      if(!userConfirmation) return;
      await API.delete(`/task/${task.id}`)
     };
    // const handleTaskDelete = () => {};
    return (
      <div
        className="w-full min-h-20 rounded-xl shadow-sm bg-[#ffffff] p-3 my-2"
        {...draggableProps} // Apply draggable props
        {...dragHandleProps} // Apply drag handle props
        ref={ref}
        style={style} // Apply any additional styles
      >
        <div className="w-full justify-between flex border-b pb-2">
          <h1 className="text-sm font-semibold">{title}</h1>
          <div className="flex gap-3 bg-white-2 ">
            <Trash2 className="w-4 hover:text-red-600  cursor-pointer hover:bg-yellow-300" onClick={handleTaskDelete} />
            <EditTask
              data={{ description, title }}
              uniqueId={Idx + "EditTask"}
              task={task}
            />
          </div>
        </div>
        <div className="whitespace-nowrap text-wrap text-[13px] font-medium pt-2">
          {description}
        </div>
      </div>
    );
  }
);

DraggableCard.displayName = "DraggableCard";