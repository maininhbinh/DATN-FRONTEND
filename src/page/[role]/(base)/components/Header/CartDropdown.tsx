import { Popover, Transition } from '@headlessui/react'
import Prices from '../Prices'
import { Product, PRODUCTS } from '../../../../../data/data'
import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ButtonPrimary from '../../shared/Button/ButtonPrimary'
import ButtonSecondary from '../../shared/Button/ButtonSecondary'
import { useLocalStorage } from '@uidotdev/usehooks'
import { ICart } from '@/common/types/cart.interface'
import { getTotalIconCart, getTotalPriceCart, deleteCart } from '@/utils/handleCart'
import { VND } from '@/utils/formatVietNamCurrency'
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast'
import { setLoading } from '@/app/webSlice'
import { DeleteCart, GetAllCart, getAllSuccess } from '@/app/slices/cartSlide'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { useSelector } from 'react-redux'
export default function CartDropdown() {
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  const dispatch = useAppDispatch()
  const [cartsLocal, setCartsLocal] = useLocalStorage('carts', [] as ICart[])
  const [carts, setCarts] = useState<ICart[]>([])
  const cartsUser = useSelector((state: any) => state.carts.carts)

  const getCart = async () => {
    const access_token = localStorage.getItem('access_token')
    if (!access_token) {
      popupError('unAuth')
    } else {
      dispatch(setLoading(true))
      const result = await dispatch(GetAllCart(access_token))
      dispatch(setLoading(false))
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

  useEffect(() => {
    if (isAuthenticated) {
      setCarts(cartsUser)
    }
  }, [cartsUser])

  useEffect(() => {
    if (isAuthenticated) {
      getCart()
    }
  }, [])
  const deleteCartUser = async (id: number) => {
    try {
      const access_token = localStorage.getItem('access_token')
      const result = await dispatch(DeleteCart({ id, token: access_token as string }))
      if (result?.success == false) {
        popupError(result?.result?.message)
      } else {
        popupSuccess(result?.result?.message)
        const allCart = await dispatch(GetAllCart(access_token as string))
        const data = allCart?.data?.map((item: any) => {
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
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteCart = (item: ICart) => {
    if (isAuthenticated) {
      deleteCartUser(item.id as number)
    } else {
      setCartsLocal(deleteCart(cartsLocal, Number(item.id as number)))
    }
  }

  const renderProduct = (item: ICart, index: number, close: () => void) => {
    return (
      <div key={index} className='flex py-5 last:pb-0'>
        <div className='relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100'>
          <img src={item.image} alt={item.name} className='h-full w-full object-contain object-center' />
          <Link onClick={close} className='absolute inset-0' to={'/product-detail'} />
        </div>

        <div className='ml-4 flex flex-1 flex-col'>
          <div>
            <div className='flex justify-between '>
              <div>
                <h3 className='text-base font-medium '>
                  <Link onClick={close} to={'/product-detail'}>
                    {item.name}
                  </Link>
                </h3>
                <p className='mt-1 text-sm text-slate-500 dark:text-slate-400'>
                  <span>{item.variant}</span>
                </p>
              </div>
              <div className='mt-0.5'>
                <div className={` flex flex-col justify-between  w-full gap-[10px]`}>
                  <div className={`flex items-center border-2 border-green-500 rounded-lg px-2 py-2`}>
                    <span className='text-green-500 !leading-none'>{VND(item.price_sale)}</span>
                  </div>

                  <div className={` flex items-center border-2 border-gray-300 rounded-lg`}>
                    <span className='text-gray-300 !text-[14px] !leading-none line-through px-2 py-2'>
                      {VND(item.price)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mt-2 flex flex-1 items-end justify-between text-sm'>
            <p className='text-gray-500 dark:text-slate-400'>{`Qty x ${item.quantity}`}</p>

            <div className='flex'>
              <button
                onClick={() => handleDeleteCart(item)}
                type='button'
                className='font-medium text-primary-6000 dark:text-primary-500 '
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Popover className='relative'>
      {({ open, close }) => (
        <>
          <Popover.Button
            className={`
                ${open ? '' : 'text-opacity-90'}
                 group w-10 h-10 sm:w-12 sm:h-12 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 relative`}
          >
            <div className='w-3.5 h-3.5 flex items-center justify-center bg-primary-500 absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-white font-medium'>
              <span className='mt-[1px]'>{getTotalIconCart(isAuthenticated ? carts : cartsLocal)}</span>
            </div>
            <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M2 2H3.74001C4.82001 2 5.67 2.93 5.58 4L4.75 13.96C4.61 15.59 5.89999 16.99 7.53999 16.99H18.19C19.63 16.99 20.89 15.81 21 14.38L21.54 6.88C21.66 5.22 20.4 3.87 18.73 3.87H5.82001'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M16.25 22C16.9404 22 17.5 21.4404 17.5 20.75C17.5 20.0596 16.9404 19.5 16.25 19.5C15.5596 19.5 15 20.0596 15 20.75C15 21.4404 15.5596 22 16.25 22Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M8.25 22C8.94036 22 9.5 21.4404 9.5 20.75C9.5 20.0596 8.94036 19.5 8.25 19.5C7.55964 19.5 7 20.0596 7 20.75C7 21.4404 7.55964 22 8.25 22Z'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M9 8H21'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeMiterlimit='10'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>

            <Link className='block md:hidden absolute inset-0' to={'/cart'} />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter='transition ease-out duration-200'
            enterFrom='opacity-0 translate-y-1'
            enterTo='opacity-100 translate-y-0'
            leave='transition ease-in duration-150'
            leaveFrom='opacity-100 translate-y-0'
            leaveTo='opacity-0 translate-y-1'
          >
            <Popover.Panel className='hidden md:block absolute z-10 w-screen max-w-xs sm:max-w-md px-4 mt-3.5 -right-28 sm:right-0 sm:px-0'>
              <div className='overflow-hidden rounded-2xl shadow-lg ring-1 ring-black/5 dark:ring-white/10'>
                <div className='relative bg-white dark:bg-neutral-800'>
                  <div className='max-h-[60vh] p-5 overflow-y-auto hiddenScrollbar'>
                    <h3 className='text-xl font-semibold'>Shopping cart</h3>
                    <div className='divide-y divide-slate-100 dark:divide-slate-700'>
                      {isAuthenticated
                        ? carts.map((item, index) => renderProduct(item, index, close))
                        : cartsLocal.map((item, index) => renderProduct(item, index, close))}
                    </div>
                  </div>
                  <div className='bg-neutral-50 dark:bg-slate-900 p-5'>
                    <p className='flex justify-between font-semibold text-slate-900 dark:text-slate-100'>
                      <span>
                        <span>Subtotal</span>
                        <span className='block text-sm text-slate-500 dark:text-slate-400 font-normal'>
                          Shipping and taxes calculated at checkout.
                        </span>
                      </span>
                      <span className=''>{VND(getTotalPriceCart(isAuthenticated ? carts : cartsLocal))}</span>
                    </p>
                    <div className='flex space-x-2 mt-5'>
                      <ButtonSecondary
                        href='/cart'
                        className='flex-1 border border-slate-200 dark:border-slate-700'
                        onClick={close}
                      >
                        View cart
                      </ButtonSecondary>
                      <ButtonPrimary
                        href='/checkout'
                        onClick={close}
                        disabled={(isAuthenticated ? carts.length : cartsLocal.length) <= 0}
                        className={`flex-11 ${
                          (isAuthenticated ? carts.length : cartsLocal.length) <= 0
                            ? 'bg-gray-400 text-white hover:bg-gray-400 cursor-default'
                            : ''
                        }`}
                      >
                        Check out
                      </ButtonPrimary>
                    </div>
                  </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  )
}
