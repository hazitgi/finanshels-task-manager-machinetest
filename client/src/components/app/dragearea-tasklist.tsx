import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface TaskListProp {
  children: ReactNode;
  className?: string;
}
export const DraggableTaskList = ({ children,className }: TaskListProp) => {
  return <div className={cn("inline-block  ",className)}>{children}</div>;
};
