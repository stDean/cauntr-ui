import { useAppDispatch } from "@/app/redux";
import { SellProductProps } from "@/lib/types";
import { SET_CART } from "@/state";
import { ColumnDef } from "@tanstack/react-table";
import { ShoppingCart } from "lucide-react";

export const SellProductColumn: ColumnDef<SellProductProps>[] = [
  {
    accessorKey: "productName",
    header: () => <span className="text-xs md:text-sm">Product Name</span>,
  },
  {
    accessorKey: "price",
    header: () => <span className="text-xs md:text-sm">Price</span>,
  },
  {
    accessorKey: "qty",
    header: () => <span className="text-xs md:text-sm">Quantity</span>,
  },
  {
    accessorKey: "sn",
    header: () => <span className="text-xs md:text-sm">Serial No</span>,
    cell: ({ row }) => (
      <p className="text-sm ">{row.original.sn ? row.original.sn : "NIL"}</p>
    ),
  },
  {
    accessorKey: "brand",
    header: () => <span className="text-xs md:text-sm hidden">Brand</span>,
    cell: ({ row }) => <p className="hidden">{row.original.brand}</p>,
  },
  {
    accessorKey: "productType",
    header: () => (
      <span className="text-xs md:text-sm hidden">Product Type</span>
    ),
    cell: ({ row }) => <p className="hidden">{row.original.productType}</p>,
  },
  {
    accessorKey: "costPrice",
    header: () => (
      <span className="text-xs md:text-sm hidden">Cost Price</span>
    ),
    cell: ({ row }) => <p className="hidden">{row.original.costPrice}</p>,
  },
  {
    accessorKey: "action",
    header: () => <span className="hidden">Action</span>,
    cell: ({ row }) => {
      const dispatch = useAppDispatch();
      const { productName, price, id, qty, costPrice } = row.original;
      const handleAddToCart = () => {
        if (price === "0") {
          console.log("Price is 0 so open a modal!");
          return;
        }
        dispatch(
          SET_CART({
            productName,
            qty: 1,
            price,
            id,
            totalQty: qty,
          })
        );
      };
      return (
        <ShoppingCart
          className="text-[#0C049B] size-4 cursor-pointer"
          onClick={handleAddToCart}
        />
      );
    },
  },
];
