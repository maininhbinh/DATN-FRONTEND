import React, { FC } from "react";
import { Link } from "react-router-dom";
import NcImage from "../shared/NcImage/NcImage";
import LikeButton from "./LikeButton";
import Prices from "./Prices";

import { StarIcon } from "@heroicons/react/24/solid";

import { IProduct } from "@/common/types/product.interface";

export interface ProductCardProps {
  className?: string;
  data?: IProduct;
  isLiked?: boolean;
}

const ProductCard: FC<ProductCardProps> = ({
  className = "",
  data,
  isLiked,
}) => {
  

  return (
    <>
      <div
        className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
        data-nc-id="ProductCard"
      >
        <Link to={"/product-detail"} className="absolute inset-0"></Link>

        <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
          <Link to={"/product-detail"} className="block">
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
              src={data?.thumbnail}
              className="object-cover w-full h-full drop-shadow-xl"
            />
          </Link>

        

          <LikeButton liked={isLiked} className="absolute top-3 right-3 z-10" />

         
        </div>

        <div className="space-y-4 px-2.5 pt-5 pb-2.5">
        

          <div>
            <h2
              className={`nc-ProductCard__title text-base font-semibold transition-colors`}
            >
               {data?.name}
            </h2>
           
          </div>

          <div className="flex justify-between items-end ">
            <Prices price={Number(data?.price)} />
            <div className="flex items-center mb-0.5">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ml-1 text-slate-500 dark:text-slate-400">
                {(Math.random() * 1 + 4).toFixed(1)} (
                {data?.total_review} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      
    </>
  );
};

export default ProductCard;
