"use client";

import { CancelSubscription, ManageSubscription } from "@/actions/settings.a";
import { Empty } from "@/components/Empty";
import { BillingTable } from "@/components/table/BillingTable";
import { Button } from "@/components/ui/button";
import { useReduxState } from "@/hooks/useRedux";
import { BillingHistoryProps, CardDetailsProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CircleCheck, TriangleAlert } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const BillingCard = ({
  planName,
  current,
  planDetails,
  managePlan,
  cancelPlan,
  type,
  price,
  daysLeft,
}: {
  planName: string;
  current?: boolean;
  planDetails: string[];
  managePlan?: () => void;
  cancelPlan?: () => void;
  type: string;
  price: string;
  daysLeft: number;
}) => {
  return (
    <div
      className={cn("border rounded-lg col-span-12 md:col-span-4 px-4 py-6", {
        "bg-[#FFFAF0] border-2 border-[#FBAD1A]": current,
      })}
    >
      <div className="flex flex-col h-[350px]">
        <div className="flex justify-between items-center mb-6">
          <p className="text-[#3B3B3B] text-sm font-semibold">{planName}</p>
          {current && (
            <p className="py-1 px-4 text-xs rounded-full bg-black text-white">
              {daysLeft > 0 ? `${daysLeft} days left` : "Overdue"}
            </p>
          )}
        </div>

        <p className="text-xl md:text-2xl font-semibold">
          ₦{price} <span className="text-sm! font-normal!">per {type}</span>
        </p>

        <div className="mt-10 space-y-2">
          {planDetails.map((detail) => (
            <p className="flex gap-3 items-center text-[#3B3B3B]" key={detail}>
              <CircleCheck className="size-5 text-[#FBAD1A]" /> {detail}
            </p>
          ))}
        </div>

        <div className="mt-auto w-full">
          <Button
            className={cn("w-full cursor-pointer", {})}
            onClick={current ? cancelPlan : managePlan}
            variant={current ? "outline_red" : "default"}
          >
            {current ? "Cancel Plan" : "Change Plan"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const getDateDifference = (endDate: Date) => {
  const now = new Date();
  const end = new Date(endDate);
  const differenceInTime = end.getTime() - now.getTime();
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
  return differenceInDays;
};

export const BillingAndSubscriptions = ({
  billingHistory,
  cardDetails,
}: {
  billingHistory: BillingHistoryProps[];
  cardDetails: CardDetailsProps;
}) => {
  const [type, setType] = useState<"monthly" | "yearly">("monthly");
  const [isPending, startTransaction] = useTransition();
  const { token } = useReduxState();
  const router = useRouter();
  const classStyle = "border rounded-md p-4 md:p-6 bg-white border-[#EEEEEE]";
  const card_type = cardDetails.card_type.split("");
  const card = card_type[0].toUpperCase() + card_type.slice(1).join("");
  const expiry = `${cardDetails.exp_month}/${String(cardDetails.exp_year).slice(
    2
  )}`;

  const manageSubscription = () => {
    startTransaction(async () => {
      const res = await ManageSubscription({ token });
      if (res.error) {
        toast.error("Error", { description: res.error });
      }

      const url = res.success.stripeManageUrl;
      router.push(url);
    });
  };

  const cancelSubscription = () => {
    startTransaction(async () => {
      const res = await CancelSubscription({ token });
      if (res.error) {
        toast.error("Error", { description: res.error });
      }

      const url = res.success.stripeCancelUrl;
      router.push(url);
    });
  };

  const companyStatus = cardDetails.company.subscriptionStatus !== "ACTIVE";
  const currentPlan =
    billingHistory.length > 0 && billingHistory[0].planName.split("(");
  const planName = currentPlan && currentPlan[0].trim();
  const planType = currentPlan && currentPlan[1].split(")")[0];

  return (
    <div className="space-y-3">
      {companyStatus && (
        <div
          className={`bg-[#feecec]! border-[#A00F0F]! ${classStyle} flex justify-between items-center`}
        >
          <div className="flex items-start gap-3">
            <div>
              <TriangleAlert className="text-red-500 size-5 mt-[2px]" />
            </div>
            <div>
              <p className="text-sm font-semibold">Retry your payment </p>
              <p className="text-xs text-[#3B3B3B]">
                Your payment for the Enterprise plan due on the 5th of March
                2025 has failed
              </p>
            </div>
          </div>
          <div>
            <Button
              variant={"outline_red"}
              onClick={manageSubscription}
              className="cursor-pointer"
              size={"sm"}
            >
              Manage Payment
            </Button>
          </div>
        </div>
      )}

      <div className={classStyle}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl">Billing and Subscription</p>
            <p className="text-sm text-[#636363] ">
              Track your subscription details, update your billing information,
              and control your account’s payment
            </p>
          </div>

          <div className="w-[200px] bg-white border rounded-full flex p-1">
            <p
              className={`flex-1 text-center p-1 text-xs ${
                type === "monthly" &&
                "rounded-full text-white font-semibold bg-[#0C049B] transition ease-linear"
              } cursor-pointer`}
              onClick={() => {
                setType("monthly");
              }}
            >
              Monthly
            </p>
            <p
              className={`flex-1 text-center p-1 text-xs ${
                type === "yearly" &&
                "rounded-full text-white font-semibold bg-[#0C049B] transition ease-linear"
              } cursor-pointer`}
              onClick={() => {
                setType("yearly");
              }}
            >
              Yearly
            </p>
          </div>
        </div>

        <div className={` grid grid-cols-12 gap-4`}>
          <BillingCard
            planName="Personal Plan"
            planDetails={["Up to 2 individual users", "Unlimited inventory."]}
            type={type === "monthly" ? "month" : "year"}
            price={type === "monthly" ? "1000" : "10000"}
            current={planName === "Personal" && planType === type}
            managePlan={manageSubscription}
            cancelPlan={cancelSubscription}
            daysLeft={getDateDifference(billingHistory[0].endDate)}
          />
          <BillingCard
            planName="Team Plan"
            planDetails={[
              "Up to 5 individual users",
              "Unlimited inventory.",
              "Suppliers Information",
            ]}
            type={type === "monthly" ? "month" : "year"}
            price={type === "monthly" ? "2000" : "20000"}
            current={planName === "Team" && planType === type}
            managePlan={manageSubscription}
            cancelPlan={cancelSubscription}
            daysLeft={getDateDifference(billingHistory[0].endDate)}
          />
          <BillingCard
            planName="Enterprise Plan"
            planDetails={[
              "Up to 10 individual users",
              "Unlimited inventory.",
              "Suppliers Information",
              "Customer Information",
              "Creditor Information",
            ]}
            current={planName === "Enterprise" && planType === type}
            type={type === "monthly" ? "month" : "year"}
            price={type === "monthly" ? "3000" : "30000"}
            managePlan={manageSubscription}
            cancelPlan={cancelSubscription}
            daysLeft={getDateDifference(billingHistory[0].endDate)}
          />
        </div>
      </div>

      <div className={classStyle}>
        <div className="flex justify-between items-center">
          <p className="text-xl">Card Details</p>
          <Button
            className="border border-[#0c049b] text-[#0c049b] cursor-pointer  hover:text-[#0c049b]/70"
            variant={"outline"}
            size={"sm"}
            onClick={manageSubscription}
            isLoading={isPending}
            disabled={isPending}
            loadingText="please wait"
          >
            Manage Card
          </Button>
        </div>

        <div className="bg-[#f8f8f8] p-4 rounded-lg mt-2 flex gap-3 items-center">
          <div className="rounded-lg bg-white">
            {card === "Visa" ? (
              <Image
                width={50}
                height={50}
                src="/visamain.jpg"
                alt="visa card"
                priority
              />
            ) : (
              <Image
                width={50}
                height={50}
                src="/master2.webp"
                alt="visa card"
                priority
              />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold">
              {card} ending {cardDetails.last4}
            </p>
            <p className="text-sm font-semibold">Expiry {expiry}</p>
            <p className="text-sm mt-2">{cardDetails.company.company_email}</p>
          </div>
        </div>
      </div>

      <div className={classStyle}>
        <div className="flex justify-between items-center mb-4">
          <p className="text-xl">Billing History</p>
        </div>
        {billingHistory.length > 0 ? (
          <BillingTable data={billingHistory} />
        ) : (
          <Empty text="Oops seems like you currently don’t have an active billing cycle" />
        )}
      </div>
    </div>
  );
};
