"use client";
import { productType } from "@/constants";
import Link from "next/link";
interface Props {
  selectedTab: string;
  onTabSelect: (tab: string) => void;
}

const HomeTabbar = ({ selectedTab, onTabSelect }: Props) => {
  return (
    <div className="flex items-center flex-wrap gap-5 justify-between">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <div className="flex items-center gap-1.5 md:gap-3">
          {productType?.map((item) => (
            <button
              onClick={() => onTabSelect(item?.title)}
              key={item?.title}
              className={`border border-zamzam-primary-hover/30 px-4 py-1.5 md:px-6 md:py-2 rounded-full hover:bg-zamzam-primary-hover hover:border-zamzam-primary-hover hover:text-white hoverEffect ${selectedTab === item?.title ? "bg-zamzam-primary-hover text-white border-zamzam-primary-hover" : "bg-zamzam-primary-hover/10"}`}
            >
              {item?.title}
            </button>
          ))}
        </div>
      </div>
      <Link
        href={"/products"}
        className="border border-zamzam-text-dark px-4 py-1 rounded-full hover:bg-zamzam-primary-hover hover:text-white hover:border-zamzam-primary-hover hoverEffect"
      >
        See all
      </Link>
    </div>
  );
};

export default HomeTabbar;
