import React, { FC, useEffect, useId, useRef } from "react";
import Heading from "./Heading/Heading";
import Glide from "@glidejs/glide";
import ProductCard from "./ProductCard";
import { Product, PRODUCTS } from "../../../../data/data";
import { useGetProductsQuery } from "../../(manager)/products/ProductsEndpoints";
import { IProduct } from "@/common/types/product.interface";
export interface SectionSliderProductCardProps {
  className?: string;
  itemClassName?: string;
  heading?: string;
  headingFontClassName?: string;
  headingClassName?: string;
  subHeading?: string;
  data?: Product[];
}

const SectionSliderProductCard: FC<SectionSliderProductCardProps> = ({
  className = "",
  itemClassName = "",
  headingFontClassName,
  headingClassName,
  heading,
  subHeading = "",
  data = PRODUCTS.filter((_, i) => i < 8 && i > 2),
}) => {
  const {data : dataItem, isLoading } = useGetProductsQuery({});

  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");

  useEffect(() => {
    if (!sliderRef.current) {
      return () => {};
    }

    // @ts-ignore
    const OPTIONS: Glide.Options = {
      perView: 4,
      gap: 32,
      bound: true,
      breakpoints: {
        1280: {
          perView: 4 - 1,
        },
        1024: {
          gap: 20,
          perView: 4 - 1,
        },
        768: {
          gap: 20,
          perView: 4 - 2,
        },
        640: {
          gap: 20,
          perView: 1.5,
        },
        500: {
          gap: 20,
          perView: 1.3,
        },
      },
    };

    let slider = new Glide(`.${UNIQUE_CLASS}`, OPTIONS);
    slider.mount();
    return () => {
      slider.destroy();
    };
  }, [sliderRef, UNIQUE_CLASS, dataItem]);

  return (
     <>
       {dataItem && <div className={`nc-SectionSliderProductCard ${className}`}>
      <div className={`${UNIQUE_CLASS} flow-root`} ref={sliderRef}>
        <Heading
          className={headingClassName}
          fontClass={headingFontClassName}
          rightDescText={subHeading}
          hasNextPrev
        >
          { `New Arrivals. `}
          <span className="text-gray-500">Rey backpack & bag</span>
        </Heading>
        <div className="glide__track" data-glide-el="track">
           <ul className="glide__slides">
            {dataItem?.data?.map((item : IProduct, index : number) => (
              <li key={index} className={`glide__slide ${itemClassName}`}>
                 {item && <ProductCard data={item} />}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>}
     
     </>
  );
};

export default SectionSliderProductCard;