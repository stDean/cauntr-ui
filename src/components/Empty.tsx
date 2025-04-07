import React from "react";

export const Empty = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[200px] gap-2 border rounded-lg">
      <img src="/empty.png" className="w-20 h-20" />
      <p className="text-sm text-[#636363]">{text}</p>
    </div>
  );
};
