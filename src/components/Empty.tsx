import React from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const Empty = ({
  text,
  color,
  buttonText,
  customer,
  handleClick,
}: {
  text: string;
  color?: boolean;
  buttonText?: string;
  customer?: boolean;
  handleClick?: () => void;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] gap-2 border rounded-lg">
      <img
        src={color ? "/frame.png" : customer ? "/Frame1.png" : "/empty.png"}
        className="w-20 h-20"
      />
      <p className="text-sm text-[#636363]">{text}</p>
      {buttonText && (
        <Button
          variant={"cauntr_blue"}
          size={"sm"}
          className="cursor-pointer"
          onClick={() => handleClick!()}
        >
          <Plus className="size-4 mr-2" />
          {buttonText}
        </Button>
      )}
    </div>
  );
};
