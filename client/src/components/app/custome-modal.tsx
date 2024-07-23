"use client";
import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "../ui/alert-dialog";
import { X } from "lucide-react";
interface ModalProps {
  triggerComponent: ReactNode;
  children: ReactNode;
  className?: string;
  title: string;
}
export default function CustomModal({
  title,
  children,
  className,
  triggerComponent,
}: ModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="p-0 bg-transparent m-0">
        {triggerComponent}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <section className="w-full flex justify-between items-center">
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogCancel className="w-auto p-0 border-none bg-transparent hover:bg-transparent">
              <X className="w-5" />
            </AlertDialogCancel>
          </section>
          <AlertDialogDescription className={className}>
            {children}
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
