import { Skeleton } from 'antd'
import React, { useState } from 'react'
import NcImage from '../shared/NcImage/NcImage'


type SizeType = 'default' | 'small' | 'large';
type ButtonShapeType = 'circle' | 'square' | 'round' | 'default';

export default function LoadingProduct({className}: {className: string}) {

    const [active, setActive] = useState(true);
    const [block, setBlock] = useState(true);
    const [size, setSize] = useState<SizeType>('default');
    const [buttonShape, setButtonShape] = useState<ButtonShapeType>('default');

  return (
        <li>
            <div
            className={`nc-ProductCard relative flex flex-col bg-transparent ${className}`}
            data-nc-id="ProductCard"
            >
                <div className="relative flex-shrink-0 bg-slate-50 dark:bg-slate-300 rounded-3xl overflow-hidden z-1 group">
                    <div className="block">
                    <NcImage
                        containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0"
                        className="object-cover w-full h-full drop-shadow-xl"
                    />
                    </div>
                </div>

                <div className="space-y-4 px-2.5 pt-5 pb-2.5">

                    <div className="flex justify-between items-end ">
                    <Skeleton.Input active={active} size={size} />
                    </div>

                    <div>
                    <h2
                        className={`nc-ProductCard__title text-base font-semibold transition-colors`}
                    >
                        <Skeleton.Button active={active} size={size} shape={buttonShape} block={block} />
                    </h2>
                    </div>

                </div>
            </div>
        </li>
  )
}
