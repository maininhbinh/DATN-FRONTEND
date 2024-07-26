import { Flex, Form, InputNumber, Segmented, Select, Slider, SliderSingleProps, Switch } from 'antd';
import React, { useEffect, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import axios from 'axios';
import { useGetBrandsQuery } from '../../../brand/BrandEndpoints';
import { IBrand } from '@/common/types/brand.interface';
import LoadingPage from '../../../components/util/LoadingPage';
import { useGetCategoriesQuery } from '../../../category/CategoryEndpoints';
import { ICategory } from '@/common/types/category.interface';
interface option{
    setImageUrl: React.Dispatch<React.SetStateAction<any>>
    discount: {
        typeDiscount: string;
        setTypeDiscount: React.Dispatch<React.SetStateAction<string>>
    };
    setDetails: React.Dispatch<React.SetStateAction<any>>
}

export default function Option({setImageUrl, discount, setDetails}: option) {
    const {data: dataCategories, isLoading : isLoadingCategory} = useGetCategoriesQuery({});
    const {data : dataBrands, isLoading : isLoadingBrand} = useGetBrandsQuery({});
    const [DisplayPic, setDisplayPic] = useState<string>();
    const formatter: NonNullable<SliderSingleProps['tooltip']>['formatter'] = (value) => `${value}%`;
   

    const brands = dataBrands ? dataBrands?.data?.map((item : IBrand) => {
        return {
            label : item.name,
            value : item.id
        }
    }) : [];

    const categories  = dataCategories ? dataCategories?.data?.map((item : ICategory) => {
        return {
            label : item.name,
            value : item.id
        }
    }) : [];

    const selectedImg = (e : any) => {

        const types = [
            'jpeg',
            'png',
            'jpg',
            'gif',
        ]

        const fileSelected = e.target.files[0];    

        const size = fileSelected.size;
        const type = types.includes(fileSelected.type.replace('image/', ''));

        if (size <= 1048576 && type) {
            setImageUrl(fileSelected);
            setDisplayPic(URL.createObjectURL(fileSelected));
        }

    }

    const getDetails = async (value) => {
        const {data} = await axios.get(`http://127.0.0.1:8000/api/category/${value}`);        
        setDetails(data.data)
    }


    
    return (
        <Flex vertical gap={30}>

            {/* Thumbnail */}
            <Form.Item
                name="upload"
                className='p-[2rem] sm:rounded-lg border-[#F1F1F4] m-0'
                rules={[{ required: true, message: 'Please upload a file!' }]}
                style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem'}}
            >
                <Flex vertical gap={20}>
                    <h2 className='font-bold text-[16px]'>Thumbnail</h2>
                    <div style={{ height: '12vw', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}} className='border-none rounded-[12px]  ' >
                        {
                        DisplayPic
                        ?
                        <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                            <img src={DisplayPic} alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
                            <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                            <button style={{ zIndex: 999, fontSize: "20px", color: 'white' }}
                                onClick={() => setDisplayPic('')}
                            >
                                <DeleteOutlined className=" duration-1000 opacity-0 group-hover:opacity-100 absolute top-10 right-10" />
                            </button>
                        </div>
                        :
                        <Flex className='border-dashed  border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ maxWidth: '100%', height: "100%", borderRadius: '12px' }}>
                            <Flex vertical gap={10} style={{ width: '100%' }}>
                                <Flex vertical align='center' justify='center'>
                                    <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                                </Flex>
                            </Flex>
                            <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                                <span style={{ fontSize: '11px' }}>
                                    Kích thước tối đa: 50MB
                                </span>
                                <span style={{ fontSize: '11px' }}>
                                    JPG, PNG, GIF, SVG
                                </span>
                            </Flex>
                            <input type="file" accept="image/*" name="image" id="image" className='opacity-0 absolute inset-0'
                                onChange={selectedImg}
                            />
                        </Flex>
                        }
                    </div>
                </Flex>
            </Form.Item>
            {/* Thumbnail */}

            {/* category */}
            <div className='sm:rounded-lg flex-1 p-2 relative' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                <div className='p-2'>
                    <h2 className='font-bold'>Danh mục</h2>
                </div>
                <Flex justify='center' align='' vertical className='p-2' gap={10} >
                <Form.Item 
                    className='m-0' 
                    name='category_id' 
                    rules={
                    [
                        {
                        required: true,
                        message: 'Vui lòng chọn danh mục'
                        }
                    ]
                    }
                >
                    <Select
                        loading={isLoadingCategory}
                        className='h-[40px] relative'
                        options={categories}
                        onChange={getDetails}
                    />
                </Form.Item>
                <Flex align='center' justify='center' className='w-[30px] h-[30px] text-white cursor-pointer rounded-[9999px] absolute top-[-10px] right-[-9px] bg-blue-500'>
                    <PlusOutlined />
                    </Flex>
                </Flex>
            </div>
            {/* category */}

            {/* Brand */}
            <div className='sm:rounded-lg flex-1 p-2 relative' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                <div className='p-2'>
                    <h2 className='font-bold'>Thương hiệu</h2>
                </div>
                <Flex justify='center' align='' vertical className='p-2' gap={10} >
                <Form.Item 
                    className='m-0' 
                    name='brand_id' 
                    rules={
                    [
                        {
                        required: true,
                        message: 'Vui lòng chọn thượng hiệu'
                        }
                    ]
                    }
                >
                    <Select
                     loading={isLoadingBrand}
                    className='h-[40px] relative'
                    options={brands}
                    />
                </Form.Item>
                <Flex align='center' justify='center' className='w-[30px] h-[30px] text-white cursor-pointer rounded-[9999px] absolute top-[-10px] right-[-9px] bg-blue-500'>
                    <PlusOutlined />
                    </Flex>
                </Flex>
            </div>
            {/* Brand */}

            {/* Setting */}
            <div className='sm:rounded-lg overflow-hidden flex-1 p-2' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                <div className='p-2'>
                <h2 className='font-bold'>Setting</h2>
                </div>
                <hr />
                <div className='flex justify-between items-center p-2'>

                <h2>Is Active</h2>
                <Form.Item 
                    className='m-0' 
                    label=''
                    name='is_active' 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                </div>
                <div className='flex justify-between items-center p-2'>

                <h2>Is Hot Deal</h2>
                <Form.Item 
                    className='m-0' 
                    label=''
                    name='is_hot_deal' 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                </div>
                <div className='flex justify-between items-center p-2'>

                <h2>Is Good Deal</h2>
                <Form.Item 
                    className='m-0' 
                    label=''
                    name='is_good_deal' 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                </div>
                <div className='flex justify-between items-center p-2'>

                <h2>Is New</h2>
                <Form.Item 
                    className='m-0' 
                    label=''
                    name='is_new' 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                </div>
                <div className='flex justify-between items-center p-2'>

                <h2>Is Show Home</h2>
                <Form.Item 
                    className='m-0' 
                    label=''
                    name='is_show_home' 
                    valuePropName="checked"
                >
                    <Switch />
                </Form.Item>
                </div>
            </div>
            {/* Setting */}

            {/* Tags */}
            <div className='sm:rounded-lg flex-1 p-2 relative' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                <div className='p-2'>
                    <h2 className='font-bold'>Tags</h2>
                </div>
                <Flex justify='center' align='' vertical className='p-2' gap={10} >
                <Form.Item 
                    className='m-0' 
                    name='tags' 
                >
                    <Select 
                    mode='tags'
                    className='h-[40px]'
                    style={{ width: '100%' }}  
                    
                    />
                </Form.Item>  
                </Flex>
            </div>
            {/* Tags */}

            {/* Discount */}
            <div className='sm:rounded-lg flex-1 p-2 relative' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                <div className='p-2'>
                    <h2 className='font-bold'>Discount</h2>
                </div>
                <Flex justify='center' align='' vertical className='p-2' gap={10} >
                <Form.Item 
                    className='m-0 w-full' 
                    name='discount' 
                >
                    <Segmented
                    className='w-full flex justify-center items-center'
                    options={[
                        { label: 'none', value: '' },
                        { label: '%', value: 'percent' },
                        { label: 'Cố định', value: 'fixed'},
                    ]}
                    block
                    onChange={(e)=>{
                        discount.setTypeDiscount(e);
                    }
                    }
                    />
                </Form.Item>  
                {
                    discount.typeDiscount == 'percent'
                    ?
                    <>
                    <Form.Item
                        name={'percent'}
                        rules={[
                        {
                            required: true,
                            message: 'Chọn mức giá'
                        }
                        ]}
                    >
                        <Slider
                        tooltip={{ formatter }} 
                        />
                    </Form.Item>
                    </>
                    :
                    discount.typeDiscount == "fixed"
                    ?
                    <>
                    <Form.Item
                        name={'fixed'}
                        rules={[
                        {
                            required: true,
                            message: 'Chọn mức giá'
                        },
                        {
                            validator: (_, value)=>{
                            if(value == 0){
                                return Promise.reject('Phần trăm phải lớn hơn 0')
                            }
                            }
                        }
                        ]}
                    >
                        <InputNumber<number>
                        defaultValue={0}
                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                        className='w-full'
                        />
                    </Form.Item>
                    </>
                    :
                    ''
                }
                </Flex>
            </div>
            {/* Discount */}
        </Flex>
    )
}
