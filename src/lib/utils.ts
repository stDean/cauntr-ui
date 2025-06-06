import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const AddProductsType = {
  name: "add_products",
  options: [
    {
      title: "Hide",
      subTitle: "Make this the first item but hidden",
    },
    {
      title: "Add an Item",
      subTitle: "Add one product at a time",
    },
    {
      title: "Bulk items upload",
      subTitle: "Add multiple products by uploading them in a file",
    },
  ],
} as const;

export const calculateTotals = (
  payFull: boolean,
  payAmount: string,
  taxFee: string,
  cartItems: any[],
  payTax: boolean
) => {
  const subTotal = payFull
    ? cartItems.reduce((acc, i) => acc + parseFloat(i.price), 0)
    : Number(payAmount) || 0;

  const taxAmount = payTax ? (subTotal * (Number(taxFee) || 0)) / 100 : 0;

  return {
    subTotal: subTotal.toFixed(2),
    total: (subTotal + taxAmount).toFixed(2),
    taxAmount: taxAmount.toFixed(2),
  };
};

export const formatNaira = (value: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value).replace('NGN', '₦');
};