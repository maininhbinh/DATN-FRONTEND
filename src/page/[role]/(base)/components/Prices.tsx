import { VND } from "@/utils/formatVietNamCurrency";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price: number;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  price,
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
}) => {  
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center rounded-lg ${contentClass}`}
      >
        <span className="text-red-400 font-bold !leading-none">
          {VND(price)}
        </span>
      </div>
    </div>
  );
};

export default Prices;
