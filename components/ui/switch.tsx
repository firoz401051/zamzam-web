"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <label
        className={cn(
          "relative inline-flex items-center cursor-pointer",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          disabled={disabled}
          ref={ref}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer transition-colors",
            checked ? "bg-blue-600" : "bg-gray-200"
          )}
        >
          <div
            className={cn(
              "absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform",
              checked ? "translate-x-5" : "translate-x-0"
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
