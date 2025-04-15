import { Button } from "@/components/ui/button";
import React from "react";

export const CartContent = () => {
  return (
    <div className="m-4">
      <Button>Go Back</Button>
      <div className="p-4 border rounded-lg bg-white">
        <p>This is where the cart content will be at!</p>
      </div>
    </div>
  );
};
