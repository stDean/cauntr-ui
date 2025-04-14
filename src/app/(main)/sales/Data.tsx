import { PaymentHistoryType, SalesType } from "@/lib/types";

export  const Data : SalesType[] = [
    {
        salesId : 1234,
        itemsCount: 2,
        dateSold: "2023-10-01",
        employer: "John Doe",
        costOfSale: 1000,
    },
    {
        salesId : 1235,
        itemsCount: 3,
        dateSold: "2023-10-02",
        employer: "Jane Smith",
        costOfSale: 1500,
    },
    {
        salesId : 1236,
        itemsCount: 1,
        dateSold: "2023-10-03",
        employer: "Alice Johnson",
        costOfSale: 500,
    },
    {
        salesId : 1237,
        itemsCount: 4,
        dateSold: "2023-10-04",
        employer: "Bob Brown",
        costOfSale: 2000,
    },
    {
        salesId : 1238,
        itemsCount: 2,
        dateSold: "2023-10-05",
        employer: "Charlie Davis",
        costOfSale: 1200,
    },
    {
        salesId : 1239,
        itemsCount: 5,
        dateSold: "2023-10-06",
        employer: "Diana Evans",
        costOfSale: 2500,
    },
    {
        salesId : 1240,
        itemsCount: 3,
        dateSold: "2023-10-07",
        employer: "Ethan Foster",
        costOfSale: 1800,
    },
    {
        salesId : 1241,
        itemsCount: 4,
        dateSold: "2023-10-08",
        employer: "Fiona Green",
        costOfSale: 2200,
    },

]


export const PaymentHistoryData : PaymentHistoryType[] = [
    {
        paymentId: 1,
        paymentDate: "2023-10-01",
        amount: 1000,
        paymentMethod: "Credit Card",
    },
    {
        paymentId: 2,
        paymentDate: "2023-10-02",
        amount: 1500,
        paymentMethod: "PayPal",
    },
    {
        paymentId: 3,
        paymentDate: "2023-10-03",
        amount: 500,
        paymentMethod: "Bank Transfer",
    },
    {
        paymentId: 4,
        paymentDate: "2023-10-04",
        amount: 2000,
        paymentMethod: "Credit Card",
    },
    ] 