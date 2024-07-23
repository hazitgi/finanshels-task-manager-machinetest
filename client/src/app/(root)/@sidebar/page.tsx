
"use client";
import { Logs, Trash, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { Input } from "../../../components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { boardSchema } from "../../../lib/schema/board.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  addNewBoard,
  fetchBoard,
  setSelectedBoard,
} from "@/redux/reducers/task.reducer";
import { getRandomColor } from "@/lib/utils";
import { EditBoard } from "@/components/app/edit-bard";
import API from "../api";
import { TodoBoard } from "@/types/todo.types";

export default function SideBar() {
  const dispatch = useAppDispatch();
  const { boards, selectedBoardId } = useAppSelector((state) => state.task);
  const modalRef = useRef<HTMLButtonElement>(null);
  const modalRef2 = useRef<HTMLButtonElement>(null);
  type BoardSchema = z.infer<typeof boardSchema>;

  useEffect(() => {
    const fetchAndSetBoard = async () => {
      await dispatch(fetchBoard());
      if (boards.length > 0 && selectedBoardId === null) {
        dispatch(setSelectedBoard(boards[0].id));
      }
    };
    fetchAndSetBoard();
  }, [dispatch]);

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
  const [statusTxt, setStatusTx] = useState<string>("");
  const handleBoardAdd = (values: BoardSchema) => {
    const userConfirmatin = window.confirm(
      "Are you sure you want to add a new board?"
    );
    if (!userConfirmatin) {
      return;
    }

    // const slug = values.name.toLowerCase().replace(/\s+/g, "-");
    const columns = values.columns.map((item) => {
      return {
        name: item,
        // slug: item.toLocaleLowerCase().replace(/\s+/g, "-"),
        color: getRandomColor(),
      };
    });
    const data = {
      name: values.name,
      // slug: slug,
      columns: [...columns],
    };
    dispatch(addNewBoard(data));
    modalRef.current?.click();
  };
  return (
    <aside className="h-screen overflow-y-auto scroll-smooth scrollbar-thin min-w-80 border-r  flex flex-col justify-between">
      <div className="flex-col flex">
        <div className="border-b p-5">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src={"/images/kanban-logo.svg"}
                width={30}
                height={30}
                alt=""
              />
              <span className="font-medium font-sm">Kanban</span>
            </div>
            <div className="cursor-pointer h-full">
              <Image src={"/icons/expand.svg"} alt="" width={26} height={26} />
            </div>
          </div>
        </div>
        <div className="mt-6">
          {boards?.map((item) => (
            <div
              key={item.id}
              // href={"/"}
              className={`flex px-5 items-center h-12 gap-3 relative hover:bg-black/5 transition-all duration-300 cursor-pointer ${item.id === selectedBoardId ? "bg-slate-300" : ""
                }`}
              onClick={() => {
                dispatch(setSelectedBoard(item.id));
              }}
            >
              <div>
                <Logs className="w-5" />
              </div>
              <div className="flex justify-between w-full">
                <div>
                  <p className="text-sm font-medium mr-4">{item.name}</p>
                </div>
                <div className="flex gap-2 ">
                  {/* <EditBoard key={item.id} data={item}/> */}
                  <button onClick={() => {
                    const userConfirmatin = window.confirm('Are you sure you want to delete this board?');
                    if (userConfirmatin) {
                      API.delete(`/board/${item.id}`)
                    }
                  }}>
                    <Trash className="w-4" />
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 h-full w-2 bg-black/10 shadow-md rounded-tl-md rounded-bl-md"></div>
            </div>
          ))}
        </div>
      </div>
      <section className="w-full px-5 pb-5">
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-white-2">
            <div className="w-full flex justify-between">
              <h3 className="font-bold text-lg">Add new Board!</h3>
              <X
                className="w-5 cursor-pointer"
                onClick={() => modalRef.current?.click()}
              />
            </div>
            <div className="modal-action">
              <form
                className="w-full flex flex-col gap-3"
                onSubmit={handleSubmit(handleBoardAdd)}
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
                  <Button
                    type="submit"
                    className="bg-forgroundSecondary-1 w-full"
                  >
                    Submit
                  </Button>
                </div>
              </form>
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button
                  ref={modalRef}
                  className="btn bg-forgroundSecondary-1 h-10 hidden"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>

        <div
          className="w-full px-3 h-10 fullcenter rounded-md text-sm bg-forgroundSecondary-1 text-white-2 btn"
          onClick={() =>
            (
              document?.getElementById("my_modal_5") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add board
        </div>
      </section>
      {/* <div className="w-full px-5 pb-5 ">
       
      </div> */}
    </aside>
  );
}