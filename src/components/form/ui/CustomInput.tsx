"use client";

import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Control, FieldPath } from "react-hook-form";

interface CustomInputProps {
  control: Control<any>;
  name: FieldPath<any>;
  label: string;
  placeholder?: string;
  show?: boolean;
  handleShow?: () => void;
  disabled?: boolean;
  withSpan?: boolean;
  add?: boolean;
  profile?: boolean;
  type?: string;
}

/**
 * CustomInput is a reusable form input component that integrates with a form control system.
 * It supports various configurations such as password visibility toggling, custom labels,
 * and conditional styling based on props.
 *
 * @param {object} props - The properties for the CustomInput component.
 * @param {any} props.control - The control object used for managing form state.
 * @param {string} props.name - The name of the input field, used for form state management.
 * @param {string} props.label - The label text displayed above the input field.
 * @param {string} props.placeholder - The placeholder text displayed inside the input field.
 * @param {boolean} props.show - Determines whether the password is visible (for password fields).
 * @param {() => void} props.handleShow - Function to toggle the visibility of the password.
 * @param {boolean} props.disabled - Disables the input field when set to true.
 * @param {boolean} props.withSpan - Displays a red asterisk (*) next to the label when true.
 * @param {boolean} props.add - Applies additional styling for specific use cases.
 * @param {boolean} props.profile - Applies profile-specific styling to the input field.
 *
 * @returns {JSX.Element} A styled input field with optional password visibility toggle and validation message.
 */
export const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  show,
  handleShow,
  disabled,
  withSpan,
  add,
  profile,
  type,
}: CustomInputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div
          className={cn("flex flex-col gap-1.5 w-full", {
            "flex-1": add,
            "flex-row justify-between": profile,
          })}
        >
          <FormLabel
            className={cn(
              "text-xs w-full max-w-[280px] font-medium text-[#636363] relative",
              { "w-28": profile },
              { "flex items-center": withSpan }
            )}
          >
            <p>{label}</p>
            {withSpan && <p className="text-red-500 -ml-1 ">*</p>}
          </FormLabel>
          <div
            className={cn("flex w-full flex-col", {
              "!w-[420px]": profile,
            })}
          >
            <FormControl>
              {name === "confirmPassword" || name === "password" ? (
                <div
                  className={cn("flex justify-between items-center relative")}
                >
                  <Input
                    id={name}
                    placeholder={placeholder}
                    className={cn(
                      "input-text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 pr-[44px] py-5"
                    )}
                    type={show ? "text" : "password"}
                    {...field}
                    disabled={disabled}
                  />

                  <div
                    className="w-[18px] h-[18px] absolute right-1 top-3 md:top-3 md:right-3"
                    onClick={handleShow}
                  >
                    {show ? (
                      <Eye
                        className={cn(
                          "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer",
                          {
                            "opacity-50 cursor-not-allowed": disabled,
                          }
                        )}
                      />
                    ) : (
                      <EyeOff
                        className={cn(
                          "w-[14px] h-[14px] md:w-[18px] md:h-[18px] cursor-pointer",
                          {
                            "opacity-50 cursor-not-allowed": disabled,
                          }
                        )}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <Input
                  id={name}
                  placeholder={placeholder}
                  className={cn(
                    "input-text-16 placeholder:text-16 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-500 py-5"
                  )}
                  type={type || "text"}
                  {...field}
                  disabled={disabled}
                />
              )}
            </FormControl>

            <FormMessage className="text-12 text-red-500 mt-2" />
          </div>
        </div>
      )}
    />
  );
};
