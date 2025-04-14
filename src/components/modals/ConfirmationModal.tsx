"use client";

import { LucideIcon, X } from "lucide-react";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  Icon: LucideIcon;
  subText: string | ReactElement;
  variant: string;
  secondaryText: string;
  secondaryButtonAction: () => void;
  isPending?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  Icon,
  subText,
  variant,
  secondaryText,
  secondaryButtonAction,
  isPending,
}: ModalProps) => {
  const [showModal, setShowModal] = useState<boolean>(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none bg-neutral-800/70">
      <div className="relative w-[350px] md:w-[550px] my-6 mx-auto h-fit lg:h-auto md:h-auto">
        <div
          className={`translate duration-300 h-full ${
            showModal ? "translate-y-0" : "translate-y-full"
          } ${showModal ? "opacity-100" : "opacity-0"}
          `}
        >
          <div
            className={`translate h-full lg:h-auto md:h-auto border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none p-6`}
          >
            {/* Header */}
            <div className="flex items-center justify-center rounded-full p-4">
              <Icon />
            </div>

            {/* Body */}
            <div className="relative flex-auto flex flex-col gap-2 items-center justify-center pb-4">
              <h1 className="text-xl font-semibold">Are You Sure?</h1>
              <p className="text-sm text-center">{subText}</p>
            </div>

            {/* Footer */}
            <div className=" items-center justify-between gap-3 grid grid-cols-12">
              <Button
                onClick={handleClose}
                variant={"outline"}
                className="col-span-6 cursor-pointer"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                className="col-span-6 cursor-pointer"
                variant={variant === "destructive" ? "destructive" : "default"}
                onClick={secondaryButtonAction}
                disabled={isPending}
                isLoading={isPending}
                loadingText="please wait"
              >
                {secondaryText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
