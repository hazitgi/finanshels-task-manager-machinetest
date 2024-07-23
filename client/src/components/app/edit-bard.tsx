import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Edit2, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { boardSchema } from "@/lib/schema/board.schema";
import { z } from "zod";
import { TodoColumn } from "@/types/todo.types";
import API from "@/app/(root)/api";

export const EditBoard = ({
  data,
}: {
  data: {
    name: string;
    id: string | number;
    // slug: string;
    columns?: TodoColumn[];
  };
}) => {
  type BoardSchema = z.infer<typeof boardSchema>;
  const {
    watch,
    setValue,
    trigger,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<BoardSchema>({
    resolver: zodResolver(boardSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      columns: [],
    },
  });
  useEffect(() => {
    setValue("name", data.name);

    // commend this after api call
    setValue("columns", [
      ...(data.columns?.map((val) => val.name) as Array<string>),
    ]);

    console.log(data.columns);
  }, [data]);
  const modalRef2 = useRef(null);
  const [statusTxt, setStatusTx] = useState<string>("");

  const handleBoardEdit = async (values: BoardSchema) => {
    console.log("handleBoardEdit", values);
    console.log("original columns", data);
    
    await API.put('/board/' + data.id, { name:values.name, columns: values.columns });
  };

  return (
    <>
      <dialog
        id={`my_modal_${data.id}`}
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-box bg-white-2">
          <div className="w-full flex justify-between">
            <h3 className="font-bold text-lg">Edit board!</h3>
            <X
              className="w-5 cursor-pointer"
              onClick={(e) => {
                // e.stopPropagation()
                (
                  document?.getElementById(
                    `my_modal_${data.id}`
                  ) as HTMLDialogElement
                )?.close();
              }}
            />
          </div>
          <form
            className="w-full flex flex-col gap-3"
            onSubmit={handleSubmit(handleBoardEdit)}
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="" className="text-sm">
                Board name
              </label>
              <Input
                type="text"
                placeholder="Board name"
                value={watch("name")}
                onChange={(e) => {
                  setValue("name", e.target.value);
                  trigger("name");
                }}
              />
              <span className="text-[13px] text-red-600">
                {errors && errors.name && errors.name?.message}
              </span>
            </div>
            <div className="w-full p-2 border rounded-md space-y-3">
              <div className="w-full flex justify-between gap-2">
                <Input
                  placeholder="status"
                  value={statusTxt}
                  onChange={(e) => setStatusTx(e.target.value)}
                  className="w-full"
                />
                <Button
                  type="button"
                  className="bg-blue-600 text-sm "
                  onClick={() => {
                    if (statusTxt.trim()) {
                      let ar = getValues("columns");
                      setValue("columns", [...ar, statusTxt]);
                      setStatusTx("");
                      trigger("columns");
                    }
                  }}
                >
                  Add
                </Button>
                <br />
              </div>
              <span className="text-[13px] text-red-600">
                {errors && errors.columns && errors.columns.message}
              </span>
            </div>
            <div className="w-full flex flex-wrap gap-2">
              {watch("columns")?.map((val, I) => (
                <div
                  key={val}
                  className="px-3 h-9 flex justify-between gap-2 items-center bg-forgroundSecondary-1/10 text-sm rounded-md"
                >
                  {val}{" "}
                  <X
                    className="w-4 cursor-pointer"
                    onClick={() => {
                      let ar = getValues("columns");
                      ar.splice(I, 1);
                      setValue("columns", ar);
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="w-full">
              <Button type="submit" className="bg-forgroundSecondary-1 w-full">
                Submit
              </Button>
            </div>
          </form>
        </div>
        <form method="dialog">
          {/* if there is a button in form, it will close the modal */}
          <button
            ref={modalRef2}
            className="btn bg-forgroundSecondary-1 h-10 hidden"
          >
            Close
          </button>
        </form>
      </dialog>
      <button
        onClick={(e) => {
          // e.stopPropagation()
          (
            document?.getElementById(`my_modal_${data.id}`) as HTMLDialogElement
          )?.showModal();
        }}
      >
        <Edit2 className="w-4" />
      </button>
    </>
  );
};