import { Button, Flex, Form, Input, InputNumber } from 'antd'
import React, { Dispatch, SetStateAction } from 'react'
import { CloudUploadOutlined, DeleteOutlined  } from '@ant-design/icons';

interface attribute{
    id: string,
    value: string,
    image: File|null,
    url: string|null
  }
  interface variant{
    id: string,
    name: string,
    attribute: attribute[]
  }

  interface TableVariantProps {
    variant: Array<variant>;
    setVariant: Dispatch<SetStateAction<variant[]>>;
  }

const TableVariant: React.FC<TableVariantProps> = ({variant, setVariant}) => {
    
    const selectedImgVariant = (e, id) => {
    
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
            const newDetail = variant.map((item)=> {
                return {
                    ...item,
                    attribute: item.attribute.map((attr)=>{                    
                        if(attr.id == id){
                            return {
                                ...attr,
                                image: fileSelected,
                                url: URL.createObjectURL(fileSelected)
                            }
                        }
                        return attr
                    })
                };
            })
            setVariant(newDetail);
            
        } else {
            e.target.value = ''
        }
    
    }
    
    const handelRemoveImage = (id) => {
      const newDetail = variant.map((item)=> {
          return {
              ...item,
              attribute: item.attribute.map((attr)=>{                    
                  if(attr.id == id){
                      return {
                          ...attr,
                          image: null,
                          url: null
                      }
                  }
                  return attr
              })
          };
      })
      setVariant(newDetail)
    }
  return (
    <>
        <h2 className='font-bold text-[16px]'>Danh sách phân loại hàng</h2>

        <Flex className=' rounded-lg border-[1px] p-3 bg-[#f6f6f6]' gap={10}>
            <Form.Item
                className='m-0 flex-1'
                
            >
                <InputNumber 
                    placeholder='Nhập số lượng'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className=' border-gray-300  w-full' min={0}
                />
            </Form.Item>
            <hr />
            <Form.Item
                className='m-0 flex-1'
            >
                <InputNumber 
                    placeholder='Nhập giá tiền'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className=' border-gray-300 w-full h-[40px]' min={0}
                />
            </Form.Item>
            <hr />
            <Form.Item
                className='m-0 flex-1'
            >
                <InputNumber 
                    placeholder='Nhập giá sale'
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    className=' border-gray-300 w-full h-[40px]' min={0}
                />
            </Form.Item>
            <hr />
            <Form.Item
                className='m-0 flex-1'
            >
                <Input  placeholder='SKU'/>
            </Form.Item>
            <Form.Item
                className='m-0 '
            >
                <Button className='h-[40px]' type='primary'>
                    Áp dụng cho tất cả
                </Button>
            </Form.Item>

        </Flex>
        
        <Form.List
            name={'variant'}
        >
            {() => (
            <div className="relative overflow-x-auto border-[1px] sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-[#f6f6f6] dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {
                            variant.map((item, key)=>(
                                <th scope="col" className="px-6 py-3 text-center" key={key}>
                                {item.name ? item.name : `Phân loại ${key+1}`}
                                </th>
                            ))
                            }
                            <th scope="col" className="px-6 py-3">
                                Quantity
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Price sale
                            </th>
                            <th scope="col" className="px-6 py-3">
                                SKU
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        variant[0].attribute.map((parent, index)=>(                        
                        index == 0 || index < variant[0].attribute.length - 1
                        ?
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-[#f6f6f6] dark:hover:bg-gray-600" key={index}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white text-center">
                            <Flex vertical align='center' justify='center' gap={10}>
                                {parent.value}
                                {
                                parent.url 
                                ?
                                <div style={{ height: '50px', width: '50px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
                                    {
                                        parent.url 
                                        ?
                                        <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                                            <img src={parent.url } alt="" className='object-cover h-[100%] object-center' style={{width: '100%' }} />
                                            <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                                <DeleteOutlined onClick={() => handelRemoveImage(parent.id)} className=" duration-1000 opacity-0 group-hover:opacity-100 absolute left-[50%] top-[50%]" style={{transform: 'translate(-50%, -50%)', zIndex: 999, fontSize: "20px", color: 'white'}} />
                                        </div>
                                        :
                                        <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "100%", borderRadius: '12px' }}>
                                            <Flex vertical gap={10} style={{ width: '100%' }}>
                                                <Flex vertical align='center' justify='center'>
                                                    <CloudUploadOutlined style={{ fontSize: '10px', color: 'gray' }} className='' />
                                                </Flex>
                                            </Flex>
                                            <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                                                onChange={(e)=> selectedImgVariant(e, parent.id)}
                                            />
                                        </Flex>
                                    }
                                </div>
                                :
                                ''
                                }
                            </Flex>
                            </th>
                        {
                            variant.length < 2
                            ?
                            <>
                                <td className="px-6 py-4">
                                    <Form.Item
                                        name={[parent.id, 'quantity']}
                                        className='m-0' 
                                        rules={[
                                            { required: true, message: 'Nhập số lượng' }
                                        ]}
                                    >
                                        <InputNumber 
                                        placeholder='Nhập số lượng'
                                        className=' border-gray-300 w-full' min={0}/>
                                    </Form.Item>
                                </td>
                                <td className="px-6 py-4">
                                    <Form.Item
                                        name={[parent.id, 'price']}
                                        className='m-0' 
                                        rules={[
                                            { required: true, message: 'Nhập số tiền!' },
                                        ]}
                                    >
                                        <InputNumber 
                                        placeholder='Nhập giá tiền'
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        className=' border-gray-300 w-full' min={0}/>
                                    </Form.Item>
                                </td>
                                <td className="px-6 py-4">
                                    <Form.Item
                                        name={[parent.id, 'price_sale']}
                                        className='m-0'
                                        dependencies={[`${parent.id}.price`]}
                                        rules={[
                                            { required: true, message: 'Nhập giá sale!' },
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    
                                                  if (!value || getFieldValue(['variant',parent.id, 'price']) > value) {
                                                    
                                                    return Promise.resolve();
                                                  }
                                                  return Promise.reject(new Error('Giá khuyến mãi phải nhỏ hơn giá bán'));
                                                },
                                              }),
                                        ]}
                                        >
                                        <InputNumber 
                                        defaultValue={0}
                                         placeholder='Nhập giá sale'
                                         formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                         className='border-gray-300 w-full'
                                         min={0}
                                        />
                                    </Form.Item>
                                </td>
                                <td className="px-6 py-4">
                                    <Form.Item
                                        name={[parent.id, 'sku']}
                                        className='m-0' 
                                        help=''
                                    >
                                        <Input  placeholder='Nhập SKU' />
                                    </Form.Item>
                                </td>
                            </>
                            :
                            <>
                            <th className="px-6 py-4 text-center">
                            {variant[1].attribute.map((item, key)=>(
                                key ==  0 || key < variant[1].attribute.length - 1
                                ?
                                <div className="block py-5" key={key}>
                                {item.value}
                                </div>
                                :
                                ''
                            ))}
                            </th>
                            <td className="px-6 py-4">
                                {
                                variant[1].attribute.map((item, key)=>(
                                key ==  0 || key < variant[1].attribute.length - 1
                                ?
                                <div className="block py-3" key={key}>
                                    <Form.Item
                                        name={[parent.id + '-' + item.id, 'quantity']}
                                        className='m-0'
                                        rules={[
                                            { required: true, message: 'Nhập số lượng' },
                                        ]}
                                        help=''
                                        >
                                        <InputNumber 
                                            defaultValue={0}
                                            placeholder='Nhập giá số lượng'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            className='border-gray-300 w-full'
                                            min={0}
                                        />
                                    </Form.Item>
                                </div>
                                :
                                ''
                                ))}
                            </td>
                            <td className="px-6 py-4">
                            {variant[1].attribute.map((item, key)=>(
                                key ==  0 || key < variant[1].attribute.length - 1
                                ?
                                <div className="block py-3" key={key}>
                                    <Form.Item
                                        name={[parent.id + '-' + item.id, 'price']}
                                        className='m-0' 
                                        rules={[
                                        { required: true, message: 'Nhập giá sản phẩm'},
                                        
                                        ]}
                                        help=''
                                    >
                                         <InputNumber 
                                            defaultValue={0}
                                            placeholder='Nhập giá số lượng'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            className='border-gray-300 w-full'
                                            min={0}
                                        />
                                    </Form.Item>
                                </div>
                                :
                                ''
                                ))}
                            </td>
                            <td className="px-6 py-4">
                            {
                            variant[1].attribute.map((item, key)=>(
                                key ==  0 || key < variant[1].attribute.length - 1
                                ?
                                <div className="block py-3" key={key}>
                                    <Form.Item
                                        name={[parent.id + '-' + item.id, 'price_sale']}
                                        className='m-0' 
                                        rules={[
                                        { required: true, message: 'Nhập giá sale' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                
                                              if (!value || getFieldValue(['variant',parent.id + '-' + item.id, 'price']) > value) {
                                                
                                                return Promise.resolve();
                                              }
                                              return Promise.reject(new Error('Giá khuyến mãi phải nhỏ hơn giá bán'));
                                            },
                                          }),
                                        ]}
                                    >
                                        <InputNumber 
                                            defaultValue={0}
                                            placeholder='Nhập giá số lượng'
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                            className='border-gray-300 w-full'
                                            min={0}
                                        />
                                    </Form.Item>
                                </div>
                                :
                                ''
                                ))}
                            </td>
                            <td className="px-6 py-4">
                                {
                                    variant[1].attribute.map((item, key)=>(
                                    key ==  0 || key < variant[1].attribute.length - 1
                                    ?
                                    <div className="block py-3" key={key}>
                                        <Form.Item
                                            name={[parent.id + '-' + item.id, 'sku']}
                                            className='m-0' 
                                            help=''
                                        >
                                            <Input size='large' placeholder='Nhập SKU' />
                                        </Form.Item>
                                    </div>
                                    :
                                    ''
                                    ))
                                }
                            </td>
                            </>
                        }
                        </tr>
                        :
                        ''
                        ))
                    }
                    </tbody>
                </table>
            </div>
            )}
        </Form.List>
    </>
  )
}


export default TableVariant