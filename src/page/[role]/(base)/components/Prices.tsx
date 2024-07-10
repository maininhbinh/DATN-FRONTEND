import { VND } from "@/utils/formatVietNamCurrency";
import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  productVariantDetail : any;
  contentClass?: string;
}

const Prices: FC<PricesProps> = ({
  className = "",
  productVariantDetail,
  contentClass = "ml-[20px] md:py-1.5 md:px-2.5 font-medium w-full",
}) => {
  return (
    <div className={` flex justify-between  w-full gap-[20px]`}>
      <div
        className={`flex items-center rounded-lg ${contentClass}`}
      >
        <h1 className="text-red-500 text-[20px] !leading-none">
          {productVariantDetail && VND(productVariantDetail.price)}
        </h1>
        <h1 className="ml-[7px] text-gray-500 !leading-none line-through">
        {productVariantDetail && VND(productVariantDetail.price_sale)}
        </h1>
      </div>

    </div>
  );
};

export default Prices;
