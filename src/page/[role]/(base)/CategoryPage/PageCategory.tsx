import  { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import SectionSliderCollections from "../components/SectionSliderLargeProduct";
import SectionPromo1 from "../components/SectionPromo1";
import ProductCard from "../components/ProductCard";
import { PRODUCTS } from "../../../../data/data";
import TabFilters from "../components/TabFilters"
import SidebarFilters from "./SidebarFilters";
import { IProduct } from "@/common/types/product.interface";
import {  useSearchParams } from "react-router-dom";
import { useSearchProductMutation } from "../../(manager)/products/ProductsEndpoints";

export interface PageCategory {
  className?: string;
}

const PageCategory: FC<PageCategory> = ({ className = "" }) => {
  const [searchParams] = useSearchParams()
  console.log(searchParams.get('brand'))
  const [products, setProducts] = useState<IProduct[]>([])
  const [filterProduct, {isLoading : isLoadingFiltrProduct}] = useSearchProductMutation();
  useEffect(()=> {
    const fetchData = async () => {
      const res:any = await filterProduct({
        brand: searchParams.get('brand') || undefined,
        category: searchParams.get('category') || undefined,
        min_price: searchParams.get('min_price') || undefined,
        max_price: searchParams.get('max_price') || undefined,
      })
      if (res?.data?.success) {
        console.log(res?.data?.data)
        setProducts(res?.data?.data)
      }
    }
    fetchData()
  },[searchParams])
  return (
    <div
      className={`nc-PageCollection2 ${className}`}
      data-nc-id="PageCollection2"
    >
      <Helmet>
        <title>Category || Ciseco Ecommerce Template</title>
      </Helmet>

      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 sm:space-y-20 lg:space-y-28">
        <div className="space-y-10 lg:space-y-14">
          {/* HEADING */}
          <div className="max-w-screen-sm">
            <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Man collection
            </h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-sm sm:text-base">
              We not only help you design exceptional products, but also make it
              easy for you to share your designs with more like-minded people.
            </span>
          </div>

          <hr className="border-slate-200 dark:border-slate-700" />
          <main>
            {/* LOOP ITEMS */}
            <div className="">
                <TabFilters />
              </div>
            <div className="flex flex-col lg:flex-row">
             
              <div className="flex-shrink-0 mb-10 lg:mb-0 lg:mx-4 border-t lg:border-t-0"></div>
              <div className="flex-1 ">
                <div className="flex-1 grid sm:grid-cols-2 xl:grid-cols-4 gap-x-8 gap-y-10 ">
                  {products?.map((item, index) => (
                    <ProductCard data={{...item, products: []}} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* === SECTION 5 === */}
        <hr className="border-slate-200 dark:border-slate-700" />

        <SectionSliderCollections />
        <hr className="border-slate-200 dark:border-slate-700" />

        {/* SUBCRIBES */}
        <SectionPromo1 />
      </div>
    </div>
  );
};

export default PageCategory;