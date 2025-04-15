"use client";

import { useAppDispatch } from "@/app/redux";
import { useReduxState } from "@/hooks/useRedux";
import { cn } from "@/lib/utils";
import { SET_PREVIEW_DATA } from "@/state";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Pagination } from "../Pagination";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CreateProducts } from "@/actions/inventory.a";
import { toast } from "sonner";

const PreviewTableData = ({
  products,
  page,
}: {
  products: any[];
  page?: number;
}) => {
  const rowsPerPage = 20;
  const totalPages = Math.ceil(products.length / rowsPerPage);
  const currentPage = page || 1;

  const indexOfLastTransaction = currentPage * rowsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  const productsByPage = products.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  return (
    <div className="rounded-md border w-full  shadow-md">
      <Table>
        <TableHeader className="bg-[#f3f4f4]">
          <TableRow className="font-semibold">
            <TableHead className={cn("px-2 border-r w-5 md:w-10")}>
              S/N
            </TableHead>
            <TableHead className={`px-2 border-r`}>Serial No</TableHead>
            <TableHead className="px-2 border-r">Product Name</TableHead>
            <TableHead className="px-2 border-r">Brand</TableHead>
            <TableHead className="px-2 border-r">Type</TableHead>
            <TableHead className="px-2 border-r">Quantity</TableHead>
            <TableHead className="px-2">Supplied By</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productsByPage.map((item, idx) => (
            <TableRow
              key={`${item["Product Name"]} ${idx}`}
              className="hover:!bg-none"
            >
              <TableCell className="border-r">{idx + 1}</TableCell>
              <TableCell className="border-r capitalize">
                {item["Serial Number"]}
              </TableCell>
              <TableCell className="border-r capitalize">
                {item["Product Name"]}
              </TableCell>
              <TableCell className="border-r capitalize">
                {item.Brand}
              </TableCell>
              <TableCell className="border-r capitalize">
                {item["Item Type"]}
              </TableCell>
              <TableCell className="border-r">{item.Quantity}</TableCell>
              <TableCell className="border-r">
                {item["Supplier Name"]}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="my-4 w-full">
          <Pagination totalPages={totalPages} currentPage={1} />
        </div>
      )}
    </div>
  );
};

export const PreviewTable = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { previewProducts, token, loggedInUser } = useReduxState();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

  const handleCancel = () => {
    router.push("/inventory");
    setTimeout(() => {
      dispatch(SET_PREVIEW_DATA([]));
    }, 500);
  };

  const handleUpload = () => {
    startTransition(async () => {
      const res = await CreateProducts({
        token,
        userId: loggedInUser!.id!,
        products: previewProducts,
      });

      if (res.error) {
        if (Array.isArray(res.error)) {
          if (res.error.length > 5) {
            toast.error("Error", {
              description: "Error creating products, serial number conflict!",
            });
          }
          res.error.forEach((e) => {
            toast.error("Error", { description: e.error });
          });
        } else {
          toast.error("Error", { description: res.error });
        }

        router.push("/inventory");

        setTimeout(() => {
          dispatch(SET_PREVIEW_DATA([]));
        }, 500);
        return;
      }

      if (res.success) {
        toast.success("Success", {
          description: "Products added successfully",
        });
        router.push("/inventory");
        setTimeout(() => {
          dispatch(SET_PREVIEW_DATA([]));
        }, 500);
      }
    });
  };

  return (
    <div className="mx-4 space-y-4">
      <div className="">
        <h1 className="text-xl font-semibold">Preview And Upload</h1>
        <p className="text-xs text-[#808080]">
          Preview your file to ensure that all your data is correct and accurate
        </p>
      </div>

      <PreviewTableData products={previewProducts} page={page} />

      <div className="flex justify-between items-center4">
        <Button
          onClick={handleCancel}
          className="cursor-pointer"
          size={"sm"}
          variant={"outline_red"}
        >
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          size={"sm"}
          variant={"cauntr_blue"}
          className="cursor-pointer"
          isLoading={isPending}
          disabled={isPending}
          loadingText="uploading"
        >
          Save Product(s)
        </Button>
      </div>
    </div>
  );
};
