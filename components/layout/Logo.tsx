import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { ShoppingBag } from "lucide-react";

interface Props {
  className?: string;
  compact?: boolean;
}

const Logo = ({ className, compact = false }: Props) => {
  return (
    <Link
      href={"/"}
      className={cn("group inline-flex items-center gap-2", className)}
    >
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-zamzam-primary/10 group-hover:bg-zamzam-primary/20 transition-colors duration-300">
        <ShoppingBag className="w-6 h-6 text-zamzam-primary transform group-hover:scale-110 transition-transform duration-300" />
        <div className="absolute -right-1 -top-1 w-3 h-3 bg-zamzam-primary-hover rounded-full border-2 border-white" />
      </div>
      {!compact && (
        <div className="flex flex-col -space-y-1">
          <span className="text-xl font-bold text-zamzam-text-dark tracking-tight">
            Zam<span className="text-zamzam-primary">Zam</span>
          </span>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest pl-0.5">
            Fashion Store
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;
