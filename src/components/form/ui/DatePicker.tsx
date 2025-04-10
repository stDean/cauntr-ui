"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Control, FieldPath } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, months } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format, getMonth, getYear, setMonth, setYear } from "date-fns";
import { useEffect, useState } from "react";

interface CustomDatePickerProps {
  control: Control<any>;
  name: FieldPath<any>;
  label: string;
  placeholder?: string;
}

export function CustomDatePicker<T>({
  control,
  name,
  label,
  placeholder = "Pick a date",
}: CustomDatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const startYear = getYear(new Date()) - 10;
  const endYear = getYear(new Date()) + 5;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        useEffect(() => {
          if (field.value) {
            setCurrentMonth(field.value as Date);
          }
        }, [field.value]);

        const handleMonthChange = (month: string) => {
          const newDate = setMonth(currentMonth, months.indexOf(month));
          setCurrentMonth(newDate);
        };

        const handleYearChange = (year: string) => {
          const newDate = setYear(currentMonth, Number(year));
          setCurrentMonth(newDate);
        };

        return (
          <FormItem className="space-y-1 w-full">
            <FormLabel className="text-xs w-full max-w-[280px] font-medium text-gray-700 relative">
              {label}
            </FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full py-5 justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value as Date, "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <div className="flex justify-around pt-1">
                  <Select
                    onValueChange={handleMonthChange}
                    value={months[getMonth(currentMonth)]}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    onValueChange={handleYearChange}
                    value={getYear(currentMonth).toString()}
                  >
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={String(year)}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Calendar
                  mode="single"
                  selected={field.value as Date}
                  onSelect={(date) => {
                    if (date) {
                      field.onChange(date);
                      setCurrentMonth(date);
                    }
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        );
      }}
    />
  );
}
