"use client";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const LocalSearchBar = () => {
  const [value, setValue] = useState("");
  return (
    <div className="relative w-full">
      <div className="background-light800_darkgradient relative flex min-h-[56px] items-center gap-1 rounded-xl px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Search questions..."
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          className="no-focus text-dark100_light900 paragraph-regular placeholder border-none bg-transparent shadow-none outline-none"
        />
      </div>
    </div>
  );
};

export default LocalSearchBar;
