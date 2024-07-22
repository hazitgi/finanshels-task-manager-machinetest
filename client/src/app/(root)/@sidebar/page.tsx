"use client";
import { useAppSelector } from "@/redux/store";
import { Logs, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState } from "react";
import { z } from "zod";
import { Input } from "../../../components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { boardSchema } from "../../../lib/schema/board.schema";
import { zodResolver } from "@hookform/resolvers/zod";
export default function SideBar() {
  const { boards } = useAppSelector((state) => state.task);
  const modalRef = useRef<HTMLButtonElement>(null);
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
      status: [],
    },
  });
  const [statusTxt, setStatusTx] = useState<string>("");
  const handleBoardAdd = (values: BoardSchema) => {};
  return (
    <aside className="h-screen overflow-y-auto scroll-smooth scrollbar-thin min-w-56 border-r  flex flex-col justify-between">
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
            <Link
              key={item._id}
              href={"/"}
              className="flex px-5 items-center h-12 gap-3 relative hover:bg-black/5 transition-all duration-300"
            >
              <div>
                <Logs className="w-5" />
              </div>
              <span className="text-sm font-medium">{item.name}</span>
              <div className="absolute top-0 right-0 h-full w-2 bg-black/10 shadow-md rounded-tl-md rounded-bl-md"></div>
            </Link>
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
                          let ar = getValues("status");
                          setValue("status", [...ar, statusTxt]);
                          setStatusTx("");
                          trigger("status");
                        }
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <span className="text-[13px] text-red-600">
                    {errors && errors.status && errors.status.message}
                  </span>
                </div>
                <div className="w-full flex flex-wrap gap-2">
                  {watch("status")?.map((val, I) => (
                    <div
                      key={val}
                      className="px-3 h-9 flex justify-between gap-2 items-center bg-forgroundSecondary-1/10 text-sm rounded-md"
                    >
                      {val}{" "}
                      <X
                        className="w-4 cursor-pointer"
                        onClick={() => {
                          let ar = getValues("status");
                          ar.splice(I, 1);
                          setValue("status", ar);
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
