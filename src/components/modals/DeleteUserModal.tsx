"use client";

import { DeleteUser } from "@/actions/settings.a";
import { ConfirmationModal } from "./ConfirmationModal";
import useConfirmationModal from "@/hooks/useConfirmationModal";
import { CircleAlert } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { useReduxState } from "@/hooks/useRedux";

export const DeleteUserModal = () => {
  const confirmationModal = useConfirmationModal();
  const [isPending, startTransition] = useTransition();
  const { token } = useReduxState();

  const subText = (
    <>
      Yow want to delete user{" "}
      <span className="text-xl">
        {confirmationModal.confirmationData?.firstData}
      </span>{" "}
      with role of{" "}
      <span className="text-xl">
        {confirmationModal.confirmationData?.secondData}
      </span>
    </>
  );

  const handleDelete = () => {
    startTransition(async () => {
      const res = await DeleteUser({
        token,
        userId: confirmationModal.confirmationData!.thirdData!,
      });

      if (res.error) {
        toast.error("Error", { description: res.error });
        confirmationModal.onClose();
        return;
      }

      confirmationModal.onClose();
      toast.success("Success", { description: res.success.msg });
    });
  };

  return (
    <ConfirmationModal
      onClose={confirmationModal.onClose}
      isOpen={confirmationModal.isOpen}
      Icon={CircleAlert}
      subText={subText}
      variant="destructive"
      secondaryText="Delete User"
      secondaryButtonAction={handleDelete}
      isPending={isPending}
    />
  );
};
