import { FC, useEffect, useState } from 'react'
import imageRightPng2 from '../../../../../assets/images/base/hero-right-2.png'
import imageRightPng3 from '../../../../../assets/images/base/hero-right-3.png'
import imageRightPng from '../../../../../assets/images/base/hero-right.png'

import { useGetBannersQuery } from '@/page/[role]/(manager)/banner/BannerEndpoints'
import useBoolean from 'react-use/lib/useBoolean'
import useInterval from 'react-use/lib/useInterval'
import backgroundLineSvg from '../../../../../assets/images/base/Moon.svg'
import ButtonPrimary from '../../shared/Button/ButtonPrimary'
import Next from '../../shared/NextPrev/Next'
import Prev from '../../shared/NextPrev/Prev'

interface Hero2DataType {
  image: string
  heading: string
  subHeading: string
  btnText: string
  btnLink: string | undefined
}
export interface SectionHero2Props {
  className?: string
}

const DATA: Hero2DataType[] = [
  {
    image: imageRightPng2,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  },
  {
    image: imageRightPng3,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  },
  {
    image: imageRightPng,
    heading: 'Exclusive collection for everyone',
    subHeading: 'In this season, find the best 🔥',
    btnText: 'Explore now',
    btnLink: '/'
  }
]
let TIME_OUT: NodeJS.Timeout | null = null

const SectionHero2: FC<SectionHero2Props> = ({ className = '' }) => {
  // =================
  const [indexActive, setIndexActive] = useState(0)
  const [isRunning, toggleIsRunning] = useBoolean(true)
  const { data } = useGetBannersQuery({})
  const [bannersList, setBannersList] = useState([])

  useEffect(() => {
    if (data) {
      let aciveBanner = data?.filter((item: any) => item.is_active == 1)
      aciveBanner = aciveBanner?.length > 3 ? aciveBanner.splice(0, 3) : aciveBanner
      setBannersList(aciveBanner?.length > 0 ? aciveBanner : DATA)
    }
  }, [data])

  useInterval(
    () => {
      handleAutoNext()
    },
    isRunning ? 5500 : null
  )
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= bannersList.length - 1) {
        return 0
      }
      return state + 1
    })
  }

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= bannersList.length - 1) {
        return 0
      }
      return state + 1
    })
    handleAfterClick()
  }

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return bannersList.length - 1
      }
      return state - 1
    })
    handleAfterClick()
  }

  const handleAfterClick = () => {
    toggleIsRunning(false)
    if (TIME_OUT) {
      clearTimeout(TIME_OUT)
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true)
    }, 1000)
  }
  // =================

  const renderItem = (index: number) => {
    const isActive = indexActive === index
    const item = bannersList[index]
    if (!isActive) {
      return null
    }

    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
        key={index}
      >
        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center'>
          {bannersList.map((_: any, index: number) => {
            const isActive = indexActive === index
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index)
                  handleAfterClick()
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div className={`relative w-20 h-1 shadow-sm rounded-md bg-white`}>
                  {isActive && (
                    <div
                      className={`nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md ${
                        isActive ? ' ' : ' '
                      }`}
                    ></div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <Prev
          className='absolute left-1 sm:left-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700'
          btnClassName='w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400'
          svgSize='w-6 h-6'
          onClickPrev={handleClickPrev}
        />
        <Next
          className='absolute right-1 sm:right-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-slate-700'
          btnClassName='w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400'
          svgSize='w-6 h-6'
          onClickNext={handleClickNext}
        />

        {/* BG */}
        <div className='absolute inset-0 bg-[#E3FFE6]'>
          {/* <div className="absolute inset-0 bg-[#F7F0EA]"> */}
          <img
            className={`absolute w-full h-full ${item?.image_url ? '' : 'object-contain'}`}
            src={item?.image_url ?? backgroundLineSvg}
            alt='hero'
          />
        </div>

        <div className='relative container pb-0 pt-14 sm:pt-20 lg:py-44 md:min-h-[30rem]'>
          <div className={`relative z-[1] w-full max-w-3xl space-y-8 sm:space-y-14 nc-SectionHero2Item__left`}>
            {data && data.length > 0 ? (
              ''
            ) : (
              <div className='space-y-5 sm:space-y-6'>
                <span className='nc-SectionHero2Item__subheading block text-base md:text-xl text-slate-700 font-medium'>
                  In this season, find the best 🔥
                </span>
                <h2 className='nc-SectionHero2Item__heading font-semibold text-3xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl !leading-[114%] text-slate-900'>
                  Exclusive collection for everyone
                </h2>
              </div>
            )}

            {data && data.length > 0 ? (
              <></>
            ) : (
              <ButtonPrimary
                className='nc-SectionHero2Item__button dark:bg-slate-900'
                sizeClass='py-3 px-6 sm:py-5 sm:px-9'
                href='#'
              >
                <span>Explore now</span>
                <span>
                  <svg className='w-5 h-5 ml-2.5' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M22 22L20 20'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </ButtonPrimary>
            )}
          </div>
          {item?.image && (
            <div className='mt-10 lg:mt-0 lg:absolute right-0 bottom-0 top-0 w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl'>
              <img
                className='w-full h-full object-contain object-right-bottom nc-SectionHero2Item__image'
                src={item?.image}
                alt={item?.heading}
              />
            </div>
          )}
        </div>
      </div>
    )
  }

  return <>{bannersList.map((banner: any, index: number) => renderItem(index))}</>
}

export default SectionHero2
