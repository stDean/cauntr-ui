import React from "react";

export const BillingAndSubscriptions = () => {
  const classStyle = "border rounded-md p-4 md:p-6 bg-white border-[#EEEEEE]";

  return (
    <div className="space-y-3">
      <div className={`bg-[#feecec]! border-[#A00F0F]! ${classStyle}`}>
        <p>Hide this banner unless subscription is expired or canceled</p>
      </div>
      <div className={classStyle}>
        <p>The subscription cards</p>
      </div>
      <div className={classStyle}>
        <p>Card details</p>
      </div>
      <div className={classStyle}>
        <p>The billing history table</p>
      </div>
    </div>
  );
};
