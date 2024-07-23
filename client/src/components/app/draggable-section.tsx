import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface DraggableSectionProp {
  children: ReactNode;
  className?: string;
}
export const DraggSection = ({ children, className }: DraggableSectionProp) => {
  return (
    <section
      className={cn(
        "w-full mt-4 h-full overflow-x-auto scrollbar-thin space-x-2 whitespace-nowrap",
        className
      )}
    >
      {children}
    </section>
  );
};
