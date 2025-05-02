"use client";

import useManageRestockLevelModal from "@/hooks/useManageRestockLevel";
import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Modal } from "./Modal";
import { ManageRestockLevel } from "@/actions/inventory.a";
import { useReduxState } from "@/hooks/useRedux";
import { toast } from "sonner";

export const ManageRestockModal = () => {
  const { token, loggedInUser } = useReduxState();
  const [isPending, startTransition] = useTransition();
  const restockLevel = useManageRestockLevelModal();
  const [restock, setRestock] = useState<{ min: string; max: string }>({
    min: "",
    max: "",
  });

  const handleSave = () => {
    startTransition(async () => {
      const res = await ManageRestockLevel({
        token,
        userId: loggedInUser!.id,
        restock,
        productName: restockLevel.productName!,
      });
      if (res.error) {
        toast.error("Error", { description: res.error });
        restockLevel.onClose();
        setRestock({ min: "", max: "" });

        return;
      }

      toast.success("Success", { description: res.success.msg });
      setRestock({ min: "", max: "" });
      restockLevel.onClose();
    });
  };

  const headerContent = <h1 className="text-xl">Manage Restock Level</h1>;

  const bodyContent = (
    <div className="p-4 space-y-4">
      <p className="text-black font-semibold">Threshold</p>

      <div className="flex gap-4 w-full">
        <div className="flex-1">
          <p className="text-xs text-[#636363]">Minimum Stock Count</p>
          <Input
            placeholder="0"
            value={restock.min}
            onChange={({ target }) =>
              setRestock({ ...restock, min: target.value })
            }
          />
        </div>

        <div className="flex-1">
          <p className="text-xs text-[#636363]">
            Maximum Stock Count (Optional)
          </p>
          <Input
            placeholder="0"
            value={restock.max}
            onChange={({ target }) =>
              setRestock({ ...restock, max: target.value })
            }
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          className="cursor-pointer text-xs"
          variant={"cauntr_blue"}
          size={"sm"}
          onClick={handleSave}
          disabled={isPending}
          isLoading={isPending}
          loadingText="Saving"
        >
          Save
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={restockLevel.isOpen}
      onClose={restockLevel.onClose}
      headerContent={headerContent}
      body={bodyContent}
    />
  );
};
