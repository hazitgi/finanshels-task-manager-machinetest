import { Plus } from "lucide-react";

interface DraggListTItleProp {
  title: string;
}
export const DraggListTItle = ({ title }: DraggListTItleProp) => {
  return (
    <div className="w-full flex justify-between pb-5 border-b-2">
      <div>
        <span className=" font-medium">{title}</span>
      </div>
      <div className="size-7 border fullcenter rounded-md bg-[white] shadow-md cursor-pointer">
        <Plus className="w-4" />
      </div>
    </div>
  );
};
