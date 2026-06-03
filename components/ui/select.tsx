"use client";

import * as React from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Select = PopoverPrimitive.Root;

const SelectGroup = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-1", className)} {...props} />
));
SelectGroup.displayName = "SelectGroup";

const SelectValue = React.forwardRef<
  React.ElementRef<"span">,
  React.ComponentPropsWithoutRef<"span"> & {
    placeholder?: string;
  }
>(({ className, placeholder, children, ...props }, ref) => (
  <span ref={ref} className={cn("block truncate", className)} {...props}>
    {children || placeholder}
  </span>
));
SelectValue.displayName = "SelectValue";

interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverTrigger> {
  className?: string;
}

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof PopoverTrigger>,
  SelectTriggerProps
>(({ className, children, ...props }, ref) => (
  <PopoverTrigger asChild>
    <Button
      ref={ref}
      variant="ghost"
      role="combobox"
      className={cn(
        "flex h-8 w-full items-center justify-between bg-transparent px-2 py-1 text-xs hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-zamzam-primary disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-3 w-3 opacity-50" />
    </Button>
  </PopoverTrigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = React.forwardRef<
  React.ElementRef<typeof PopoverContent>,
  React.ComponentPropsWithoutRef<typeof PopoverContent>
>(({ className, children, ...props }, ref) => (
  <PopoverContent
    ref={ref}
    className={cn(
      "relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-zamzam-text-dark shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {children}
  </PopoverContent>
));
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    value: string;
    disabled?: boolean;
  }
>(({ className, children, disabled, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-xs outline-none focus:bg-zamzam-primary/10 focus:text-zamzam-primary data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      disabled && "opacity-50 cursor-not-allowed",
      !disabled && "hover:bg-zamzam-primary/10 hover:text-zamzam-primary",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
};
