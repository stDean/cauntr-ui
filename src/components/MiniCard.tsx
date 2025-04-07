import { ReactNode } from "react";

interface CardDataProps {
  title: string;
  subText: string | ReactNode;
  optionalText?: string;
}

export const Card = ({ cardData }: { cardData: CardDataProps[] }) => {
  return (
    <div className="grid grid-cols-12 gap-2">
      {cardData.map(({ subText, title, optionalText }) => (
        <div
          className="border rounded-lg p-4 col-span-6 md:col-span-3"
          key={`${title} - ${subText}`}
        >
          <div className="border-l-2 border-[#FBAD1A] pl-4">
            <p className="text-sm text-[#636363]">{title}</p>
            {typeof subText === "string" ? (
              <p className="text-xl mt-3 md:mt-5 font-semibold">{subText}</p>
            ) : (
              subText
            )}
            {optionalText && (
              <p className="text-[#808080] text-xs">{optionalText}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};