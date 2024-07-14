import React, { FC, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import NcImage from '../shared/NcImage/NcImage'
import LikeButton from './LikeButton'
import Prices from './Prices'
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'
import { Product, PRODUCTS } from '../../../../data/data'
import { StarIcon } from '@heroicons/react/24/solid'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import ButtonSecondary from '../shared/Button/ButtonSecondary'
import BagIcon from './BagIcon'
import toast from 'react-hot-toast'
import { Transition } from '@headlessui/react'
import ModalQuickView from './ModalQuickView'
import ProductStatus from './ProductStatus'
import { IProduct } from '@/common/types/product.interface'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ICart } from '@/common/types/cart.interface'
import { addToCartFc } from '@/utils/handleCart'
import { VND } from '@/utils/formatVietNamCurrency'
export interface ProductCardProps {
  className?: string
  data?: IProduct,
  isLiked?: boolean
}

const ProductCard: FC<ProductCardProps> = ({ className = '', data, isLiked }) => {
  const [carts, setCart] = useLocalStorage('carts', [] as ICart[])
  const [productVariantDetail, setProductVariantDetail] = useState<any>(data?.products ? data?.products[0] : false)
  const [showModalQuickView, setShowModalQuickView] = React.useState(false);
  const [memories, setMemories] = React.useState([]);
  const [colors, setColors] = React.useState([]);

  useEffect(()=>{
    if(data?.products){
      var dataMemories = [];
      var dataColors = [];
      data?.products.forEach((product:any) => {
        product?.variants.forEach((item:any) => {
          if(item.variant?.code == "color"){
            dataColors.push({
              id: product.id,
              value: item.value,
              name: item.name
            })
          }
          if(item.variant?.code == "memory"){
            dataMemories.push({
              id: product.id,
              value: item.value,
              name: item.name
            })
          }
        })
      })
      setMemories(dataMemories);
      setColors(dataColors);
    }
  },[data]);

  const handleAddToCart = (item: any, name: string | undefined) => {
    const itemCart = {
      id: item.id,
      image: item.image,
      price: Number(item.price),
      price_sale: Number(item.price_sale),
      name: name ? name : '',
      quantity: 1,
      variant: `${item.variants[0]?.name} ${item.variants[1] ? `| ${item.variants[1]?.name}` : ''}`
    }
    setCart(addToCartFc(carts, itemCart))
    notifyAddTocart(itemCart)
    setProductVariantDetail(item)
  }

  const notifyAddTocart = (itemCart: ICart) => {
    toast.custom(
      (t) => (
        <Transition
          appear
          show={t.visible}
          className='p-4 max-w-md w-full bg-white dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200'
          enter='transition-all duration-150'
          enterFrom='opacity-0 translate-x-20'
          enterTo='opacity-100 translate-x-0'
          leave='transition-all duration-150'
          leaveFrom='opacity-100 translate-x-0'
          leaveTo='opacity-0 translate-x-20'
        >
          <p className='block text-base font-semibold leading-none'>Added to cart!</p>
          <div className='border-t border-slate-200 dark:border-slate-700 my-4' />
          {renderProductCartOnNotify(itemCart)}
        </Transition>
      ),
      { position: 'top-right', id: 'nc-product-notify', duration: 3000 }
    )
  }

  const renderProductCartOnNotify = (itemCart: ICart) => {
    return (
      <div className='flex '>
        <div className='h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
          <img src={itemCart.image} alt={'234'} className='h-full w-full object-cover object-center' />
        </div>

        <div className='ml-4 flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between '>
              <div>
                <h3 className='text-base font-medium '>{itemCart.name}</h3>
                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  <span className='  dark:border-slate-700 h-4'></span>
                  <span>{itemCart.variant}</span>
                </p>
              </div>

              <div className='mt-0.5'>
                <div className={` flex flex-col justify-between  w-full gap-[10px]`}>
                  <div className={`flex items-center border-2 border-green-500 rounded-lg px-2 py-2`}>
                    <span className='text-green-500 !leading-none'>
                       {VND(itemCart.price_sale)}
                    </span>
                  </div>

                  <div className={` flex items-center border-2 border-gray-300 rounded-lg`}>
                    <span className='text-gray-300 !text-[14px] !leading-none line-through px-2 py-2'>
                    {VND(itemCart.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-3 flex flex-1 items-end justify-between text-sm'>
            <p className='text-gray-500 dark:text-slate-400'>Qty 1</p>

            <div className='flex'>
              <Link to={'/cart'} className='font-medium text-primary-6000 dark:text-primary-500 '>
                View cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const getBorderClass = (Bgclass = "") => {
    if (Bgclass.includes("red")) {
      return "border-red-500";
    }
    if (Bgclass.includes("violet")) {
      return "border-violet-500";
    }
    if (Bgclass.includes("orange")) {
      return "border-orange-500";
    }
    if (Bgclass.includes("green")) {
      return "border-green-500";
    }
    if (Bgclass.includes("blue")) {
      return "border-blue-500";
    }
    if (Bgclass.includes("sky")) {
      return "border-sky-500";
    }
    if (Bgclass.includes("yellow")) {
      return "border-yellow-500";
    }
    return "border-transparent";
  };

  const getSelectProductVariant = (productVariants:any, id:number) => {
    const detail = productVariants.filter((item:any)=>item.id == id)[0];
    return detail;
  }

  const RenderVariants = ({ variants, productVariants, setProductVariantDetail }: any) => {
    return (
      <div className='flex relative'>
        {variants?.map((variant: any, index: number) => (
          <div
            key={index}
            onClick={() => {
              setProductVariantDetail(getSelectProductVariant(productVariants, variant.id))
            }}
            className={`relative w-6 h-6 rounded-full overflow-hidden z-10 border cursor-pointer ${
              productVariantDetail && productVariantDetail.id === variant.id
                ? getBorderClass()
                : 'border-transparent'
            }`}
            title={variant.name}
          >
            <div
                className={`absolute inset-0.5 rounded-full z-0 ${variant.value}`}
            ></div>
          </div>
        ))}
      </div>
    )
  }

  const RenderVariantAddToCart = ({ variants, productVariants, productVariantDetail, setProductVariantDetail }: any) => {
    return (
      <>
        {variants && (
          <div className='absolute bottom-0 inset-x-1 space-x-1.5 flex justify-center opacity-0 invisible group-hover:bottom-4 group-hover:opacity-100 group-hover:visible transition-all'>
            {variants?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`py-1 px-2 nc-shadow-lg  rounded-xl ${
                    productVariantDetail && item.id == productVariantDetail.id
                      ? 'bg-[#6CD894] text-white'
                      : 'bg-white text-slate-900'
                  }  hover:bg-slate-900 hover:text-white transition-colors cursor-pointer flex items-center flex-col justify-center uppercase font-semibold tracking-tight text-sm `}
                  onClick={() => {
                    handleAddToCart(getSelectProductVariant(productVariants, item.id), item?.name);
                    setProductVariantDetail(getSelectProductVariant(productVariants, item.id));
                  }}
                >
                  <span> {item.name} </span>
                </div>
              )
            })}
          </div>
        )}
      </>
    )
  }

  const renderGroupButtons = (productVariant,name) => {
    return (
      <div className="absolute bottom-0 group-hover:bottom-4 inset-x-1 flex justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
        <ButtonPrimary
          className="shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => handleAddToCart(productVariant, name)}
        >
          <BagIcon className="w-3.5 h-3.5 mb-0.5" />
          <span className="ml-1">Add to bag</span>
        </ButtonPrimary>
        <ButtonSecondary
          className="ml-1.5 bg-white hover:!bg-gray-100 hover:text-slate-900 transition-colors shadow-lg"
          fontSize="text-xs"
          sizeClass="py-2 px-4"
          onClick={() => setShowModalQuickView(true)}
        >
          <ArrowsPointingOutIcon className="w-3.5 h-3.5" />
          <span className="ml-1">Quick view</span>
        </ButtonSecondary>
      </div>
    );
  };

  return (
    <>
      <div className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`} data-nc-id='ProductCard'>
        <Link to={`/product-detail/${data?.slug}`} className='absolute inset-0'></Link>

        <div className='relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group'>
          <Link to={`/product-detail/${data?.slug}`} className='block'>
            <NcImage
              containerClassName='flex aspect-w-11 aspect-h-12 w-full h-0'
              src={productVariantDetail?.image}
              className='object-cover w-full h-full drop-shadow-xl'
            />
          </Link>

          <ProductStatus productVariantDetail={productVariantDetail} />
          <LikeButton liked={isLiked} className="absolute top-3 right-3 z-10" />
          {memories.length > 0 ? (
            <RenderVariantAddToCart
              productVariants={data?.products}
              variants={memories}
              productVariantDetail={productVariantDetail}
              setProductVariantDetail={setProductVariantDetail}
            />
          ) : renderGroupButtons(data?.products[0], data?.products[0]?.name)}
          
        </div>

        <div className='space-y-4 px-2.5 pt-5 pb-2.5'>
          <RenderVariants variants={colors} productVariants={data?.products} setProductVariantDetail={setProductVariantDetail} />

          <div>
            <h2 className={`nc-ProductCard__title text-base font-semibold transition-colors`}>{data?.name}</h2>
          </div>

          <div className="flex justify-between items-end ">
          <div className="flex justify-between items-end w-full">
              <div
                className={`flex items-center border-2 border-green-500 rounded-lg py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium`}
              >
                <span className="text-green-500 !leading-none">
                  ${productVariantDetail?.price}
                </span>
              </div>
            </div>
            <div className="flex items-center mb-0.5 w-[300px]">
              <StarIcon className="w-5 h-5 pb-[1px] text-amber-400" />
              <span className="text-sm ml-1 text-slate-500 dark:text-slate-400">
                {(Math.random() * 1 + 4).toFixed(1)} (
                {Math.floor(Math.random() * 70 + 20)} reviews)
              </span>
            </div>
          </div>
        </div>
      </div>

      <ModalQuickView
        show={showModalQuickView}
        onCloseModalQuickView={() => setShowModalQuickView(false)}
      />
    </>
  )
}

export default ProductCard
