import { DialogContent, Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";

interface ModalProps {
  children: React.ReactNode;
  openModal: boolean;
  className?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal = ({
  children, //contenido del modal
  openModal,
  setOpenModal,
  className,
}: ModalProps) => {
  return (
    <Dialog open={openModal} onOpenChange={setOpenModal}>
      <DialogContent
        className={cn(`bg-stone-700 border-none rounded-lg p-4`, className)}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
