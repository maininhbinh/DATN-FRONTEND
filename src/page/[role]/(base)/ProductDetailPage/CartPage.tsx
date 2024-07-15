import { NoSymbolIcon, CheckIcon } from '@heroicons/react/24/outline'
import NcInputNumber from '../components/NcInputNumber'
import Prices from '../components/Prices'
import { Product, PRODUCTS } from '../../../../data/data'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../shared/Button/ButtonPrimary'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ICart } from '@/common/types/cart.interface'
import { VND } from '@/utils/formatVietNamCurrency'
import { setQuantityCart, getTotalPriceCart, deleteCart } from '@/utils/handleCart'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { DeleteCart, GetAllCart, getAllSuccess, UpdateCart } from '@/app/slices/cartSlide'
import { popupError, popupSuccess } from '../../shared/Toast'

const CartPage = () => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [cartsLocal, setCartLocal] = useLocalStorage('carts', [] as ICart[])
  const [carts, setCarts] = useState<ICart[]>([])
  const cartsUser = useSelector((state: any) => state.carts.carts)

  useEffect(() => {
    if (isAuthenticated) {
      setCarts(cartsUser)
    }
  }, [cartsUser])

  const getCart = async () => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      popupError('unAuth')
    } else {
      const result = await dispatch(GetAllCart(access_token))
      if (result?.success == false) {
        popupError(result?.result?.message)
      } else {
        popupSuccess(result?.result?.message)
        const data = result?.data?.map((item: any) => {
          return {
            id: item?.id,
            name: item?.product_item?.product_name,
            variant: item?.product_item?.variants?.[0].name,
            quantity: item?.quantity,
            image: item?.product_item?.image,
            price: item?.product_item?.price,
            price_sale: item?.product_item?.price_sale,
            product_item_id: item?.product_item?.id
          }
        })
        dispatch(getAllSuccess(data))
      }
    }
  }

  const updateCartUser = async (quantity: number, id: number) => {
    try {
      const access_token = localStorage.getItem('access_token')
      const result = await dispatch(UpdateCart({ id, quantity, token: access_token as string }))
      if (result?.success == false) {
        popupError(result?.result?.message)
      } else {
        popupSuccess(result?.result?.message)
        getCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCartUser = async (id: number) => {
    try {
      const access_token = localStorage.getItem('access_token')
      const result = await dispatch(DeleteCart({ id, token: access_token as string }))
      if (result?.success == false) {
        popupError(result?.result?.message)
      } else {
        popupSuccess(result?.result?.message)
        getCart()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteCart = (item: ICart) => {
    if (isAuthenticated) {
      deleteCartUser(item?.product_item_id as number)
    } else {
      setCartLocal(deleteCart(cartsLocal, Number(item.id)))
    }
  }

  const renderProduct = (item: ICart, index: number) => {
    const { image, price, name, price_sale, quantity, id, variant, product_item_id } = item
    const onChangeQuantity = (quantity: number, id: number) => {
      if (isAuthenticated) {
        updateCartUser(quantity, product_item_id as number)
      } else {
        setCartLocal(setQuantityCart(cartsLocal, id, quantity))
      }
    }
    return (
      <div key={index} className='relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0'>
        <div className='relative h-36 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
          <img src={image} alt={name} className='h-full w-full object-contain object-center' />
          <Link to='/product-detail' className='absolute inset-0'></Link>
        </div>

        <div className='ml-3 sm:ml-6 flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between '>
              <div className='flex-[1.5] '>
                <h3 className='text-base font-semibold'>
                  <Link to='/product-detail'>{name}</Link>
                </h3>
                <div className='mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300'>
                  <div className='flex items-center space-x-1.5'>
                    <span>{variant}</span>
                  </div>
                </div>
              </div>

              <div className='hidden sm:block text-center relative'>
                <NcInputNumber className='relative z-10' defaultValue={quantity} onChange={onChangeQuantity} id={id} />
              </div>

              <div className='hidden flex-1 sm:flex justify-end'>
                <div className='mt-0.5'>
                  <div className={` flex flex-col justify-between  w-full gap-[10px]`}>
                    <div className={`flex items-center border-2 border-green-500 rounded-lg px-2 py-2`}>
                      <span className='text-green-500 !leading-none'>{VND(price_sale)}</span>
                    </div>

                    <div className={` flex items-center border-2 border-gray-300 rounded-lg`}>
                      <span className='text-gray-300 !text-[14px] !leading-none line-through px-2 py-2'>
                        {VND(price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className='flex mt-auto pt-4 items-center justify-between text-sm'>
            <span
              onClick={() => handleDeleteCart(item)}
              className=' cursor-pointer relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm '
            >
              <span>Remove</span>
            </span>

            <span className=''>{VND(price_sale * quantity)}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='nc-CartPage'>
      <Helmet>
        <title>Shopping Cart || Ciseco Ecommerce Template</title>
      </Helmet>

      <main className='container py-16 lg:pb-28 lg:pt-20 '>
        <div className='mb-12 sm:mb-16'>
          <h2 className='block text-2xl sm:text-3xl lg:text-4xl font-semibold '>Shopping Cart</h2>
          <div className='block mt-3 sm:mt-5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-400'>
            <Link to={'/'} className=''>
              Homepage
            </Link>
            <span className='text-xs mx-1 sm:mx-1.5'>/</span>
            <Link to={'/'} className=''>
              Clothing Categories
            </Link>
            <span className='text-xs mx-1 sm:mx-1.5'>/</span>
            <span className='underline'>Shopping Cart</span>
          </div>
        </div>

        <hr className='border-slate-200 dark:border-slate-700 my-10 xl:my-12' />

        <div className='flex flex-col lg:flex-row'>
          <div className='w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 '>
            {isAuthenticated ? carts.map(renderProduct) : cartsLocal.map(renderProduct)}
          </div>
          <div className='border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0'></div>
          <div className='flex-1'>
            <div className='sticky top-28'>
              <h3 className='text-lg font-semibold '>Order Summary</h3>
              <div className='mt-7 text-sm text-slate-500 dark:text-slate-400 divide-y divide-slate-200/70 dark:divide-slate-700/80'>
                <div className='flex justify-between pb-4'>
                  <span>Subtotal</span>
                  <span className='font-semibold text-slate-900 dark:text-slate-200'>
                    {VND(getTotalPriceCart(isAuthenticated ? carts : cartsLocal))}
                  </span>
                </div>
                <div className='flex justify-between py-4'>
                  <span>Shpping estimate</span>
                  <span className='font-semibold text-slate-900 dark:text-slate-200'>0đ</span>
                </div>
                <div className='flex justify-between py-4'>
                  <span>Tax estimate</span>
                  <span className='font-semibold text-slate-900 dark:text-slate-200'>0đ</span>
                </div>
                <div className='flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4'>
                  <span>Order total</span>
                  <span> {VND(getTotalPriceCart(carts))}</span>
                </div>
              </div>
              <ButtonPrimary
                disabled={(isAuthenticated ? carts.length : cartsLocal.length) <= 0}
                href={(isAuthenticated ? carts.length : cartsLocal.length) <= 0 ? '' : '/checkout'}
                className={`mt-8 w-full ${
                  (isAuthenticated ? carts.length : cartsLocal.length) <= 0
                    ? 'bg-gray-400 text-white hover:bg-gray-400 cursor-default'
                    : ''
                }`}
              >
                Checkout
              </ButtonPrimary>
              <div className='mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center'>
                <p className='block relative pl-5'>
                  <svg className='w-4 h-4 absolute -left-1 top-0.5' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M12 8V13'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M11.9945 16H12.0035'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                  Learn more{` `}
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='##'
                    className='text-slate-900 dark:text-slate-200 underline font-medium'
                  >
                    Taxes
                  </a>
                  <span>
                    {` `}and{` `}
                  </span>
                  <a
                    target='_blank'
                    rel='noopener noreferrer'
                    href='##'
                    className='text-slate-900 dark:text-slate-200 underline font-medium'
                  >
                    Shipping
                  </a>
                  {` `} infomation
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CartPage
