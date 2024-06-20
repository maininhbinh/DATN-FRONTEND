import React, { FC, useEffect, useId, useRef, useState } from "react";
import Heading from "./Heading/Heading";
import Glide from "@glidejs/glide";
import ProductCard from "./ProductCard";
import { Product, PRODUCTS } from "../../../../data/data";
import instance from "@/api/axios";

import { ICategory } from "@/common/types/category.interface";
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
  const [dataItem, setData] = useState<ICategory[]>([]);
  const sliderRef = useRef(null);
  const id = useId();
  const UNIQUE_CLASS = "glidejs" + id.replace(/:/g, "_");
  useEffect(() => {
    (async() => {
       const response = await instance.get('categories?_embed=products');

       setData(response.data);
    })();
  }, [])
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
  }, [sliderRef, UNIQUE_CLASS]);

  return (
    <>
     {dataItem.map((item : ICategory, key : number) => (
         <div key={key} className={`nc-SectionSliderProductCard ${className}`}>
         <div className={`${UNIQUE_CLASS} flow-root`} >
           <Heading
             className={headingClassName}
             fontClass={headingFontClassName}
             rightDescText={subHeading}
             hasNextPrev
           >
             {heading || item.name}
           </Heading>
           <div className="glide__track" data-glide-el="track">
             <ul className=" grid grid-cols-4 gap-5">
               {item.products?.map((item1, index) => (
                 <li key={index} className={`glide__slide ${itemClassName}`}>
                   <ProductCard data={item1} />
                 </li>
               ))}
             </ul>
           </div>
         </div>
       </div>
     ))}


    
    </>
  );
};

export default SectionSliderProductCard;
