import React from "react";

export const ResendLink = ({ handleClick }: { handleClick: () => void }) => {
  return (
    <p className="text-xs">
      Didn't get OTP?{" "}
      <span
        className="font-semibold text-blue-500 hover:text-blue-400 hover:underline hover:underline-offset-4 cursor-pointer"
        onClick={handleClick}
      >
        Resend Code
      </span>
    </p>
  );
};
