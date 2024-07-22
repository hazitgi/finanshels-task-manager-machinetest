import React, { forwardRef } from "react";
import { DraggableProvided } from "react-beautiful-dnd";

interface DraggableCardProps {
  title: string;
  description: string;
  draggableProps: any; // Fix types for better accuracy
  dragHandleProps: any; // Fix types for better accuracy
  style?: React.CSSProperties; // Add optional style prop
}

export const DraggableCard = forwardRef<HTMLDivElement, DraggableCardProps>(
  ({ title, description, draggableProps, dragHandleProps, style, ...props }, ref) => {
    return (
      <div
        className="w-full min-h-20 rounded-xl shadow-sm bg-[#ffffff] p-3 my-2"
        {...draggableProps} // Apply draggable props
        {...dragHandleProps} // Apply drag handle props
        ref={ref}
        style={style} // Apply any additional styles
      >
        <div className="w-full">
          <h1 className="text-sm font-semibold">{title}</h1>
        </div>
        <div className="whitespace-nowrap text-wrap text-[13px] font-medium">
          {description}
        </div>
      </div>
    );
  }
);

DraggableCard.displayName = "DraggableCard";
