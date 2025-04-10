"use client";

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { Control, FieldPath } from "react-hook-form";

interface CustomSelectProps {
  control: Control<any>;
  name: FieldPath<any>;
  label: string;
  items: ReactNode; // Render your select items here (e.g., multiple <SelectItem />)
  placeholder?: string;
  disabled?: boolean;
}

export const CustomSelect = ({
  control,
  name,
  label,
  items,
  placeholder,
  disabled,
}: CustomSelectProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5 w-full">
          <FormLabel className="text-xs font-medium text-gray-700">
            {label}
          </FormLabel>
          <FormControl>
            <Select
              value={field.value as string}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger className={cn("h-10 w-full")}>
                <SelectValue
                  placeholder={placeholder ? placeholder : "Select an option"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{label}</SelectLabel>
                  {items}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </div>
      )}
    />
  );
};
