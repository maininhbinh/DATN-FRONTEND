import { Col, Flex, Row, Button, Form, Input, Drawer, Select, UploadProps, GetProp } from 'antd'
import { useNavigate } from 'react-router-dom'
import React, {  useEffect, useRef, useState } from 'react'
import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import Variant from './Variant/variant';
import getRandomNumber from '@/utils/randomNumber';
import TableVariant from './Variant/TableVariant'
import Option from './Option/Option'
import TextEditor from './TextEditor/TextEditor';
import { useCreateProductMutation } from '../ProductsEndpoints';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';

interface gallery{
  image: File | string
  displayPic: string
}

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

interface detailsAtrr{
  id: string,
  idDetail: string
  values: Array<string>
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];


function AddProduct() {
  const [addProduct, {isLoading : isLoadingAddProduct}] = useCreateProductMutation();
  const [imageUrl, setImageUrl] = useState<Blob>();
  const [form] = Form.useForm();
  const [gallery, setGallery] = useState<Array<gallery>>([]);
  const navigate = useNavigate()
  const fileInputRef = useRef<any>(null);
  const numberFile = useRef<number>(0);
  const [typeDiscount, setTypeDiscount] = useState<string>('');
  const [details, setDetails] = useState({});
  const [detailsAttr, setDetailsAttr] = useState<detailsAtrr[]>([]);


  const [variant, setVariant] = useState<Array<variant>>([{
    id: `${Date.now()}${getRandomNumber()}`,
    name: '',
    attribute: [
      {
        id: `${Date.now()}${getRandomNumber()}`,
        image: null,
        url: null,
        value: ''
      },
    ]
  }]);  
  

  const onFinish = async () => {

    const name = form.getFieldValue('name');
    const content = form.getFieldValue('content');
    const category_id = form.getFieldValue('category_id');
    const brand_id = form.getFieldValue('brand_id');
    const product_item = form.getFieldValue('variant');
    const percentage = form.getFieldValue('percentage');
    const fixed = form.getFieldValue('fixed');
    const is_active = form.getFieldValue('is_active') ? 1 : 0;
    const is_hot_deal = form.getFieldValue('is_hot_deal') ? 1 : 0;
    const is_good_deal = form.getFieldValue('is_good_deal') ? 1 : 0;
    const is_new = form.getFieldValue('is_new') ? 1 : 0;
    const is_show_home = form.getFieldValue('is_show_home') ? 1 : 0;
    
    const newProductItem = [];

    for(const key in product_item){      
      const id = key.split('-');
      const image = variant[0].attribute.find(item => item.id === id[0])?.image;
      const newVariant = variant.map((item, key)=>({
        variant: item.name,
        attribute: item.attribute.find(item => item.id == id[key] && item.value)?.value 
      }));

      newProductItem.push({
        id: id[0],
        image,
        variants: newVariant,
        ...product_item[key]
      });
    }    

    const formdata = new FormData();

    formdata.append('thumbnail', imageUrl ? imageUrl : '');
    formdata.append('gallery', gallery ? JSON.stringify(gallery) : '');
    formdata.append('name', name);
    formdata.append('content', content);
    formdata.append('category_id', category_id);
    formdata.append('brand_id', brand_id);
    formdata.append('is_active', String(is_active));
    formdata.append('is_hot_deal', String(is_hot_deal));
    formdata.append('is_good_deal', String(is_good_deal));
    formdata.append('is_new', String(is_new));
    formdata.append('is_show_home', String(is_show_home));
    formdata.append('type_discount', String(typeDiscount));
    formdata.append('discount', typeDiscount == 'percent' ? percentage : typeDiscount == 'fixed' ? fixed : '');
    formdata.append('product_details', JSON.stringify(detailsAttr));
    formdata.append('product_items', JSON.stringify(newProductItem));
        
    try {
      await addProduct(formdata).unwrap();
      popupSuccess('Add product success');
      navigate('..');
    } catch (error) {
      popupError('Add product error');
    }
    
  }

  const handleCancel = () => {
    navigate('..')
  }

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  
  const selectGallery = async (e) => {
    if(gallery.length > 6) return;
    
    const types = [
      'jpeg',
      'png',
      'jpg',
      'gif',
    ]

    const fileSelected = e.target.files;  

    for(const key in fileSelected){
      if(numberFile.current == 5) break;
      if(typeof fileSelected[key] == 'number') break;
      
      const file = await fileSelected[key] ;
      if (!(file instanceof File)) continue;

      const size = file.size;
      const type = types.includes(file.type.replace('image/', ''));

      const newFile = await getBase64(fileSelected[key]) ;
        
      if (size <= 1048576 && type) {
        numberFile.current++;
        setGallery((pveImages)=>[
          ...pveImages,
          {
            image: newFile,
            displayPic:  URL.createObjectURL(file)
          }
        ]);        
      }
    }
    e.target.value = null;
      
  }  

  const handleDeleteGallery = (id: number) => {
    numberFile.current--
    setGallery([
      ...gallery.filter((item, key) => key != id)
    ])
  }


  const handleSetDetail = () => {
    form.resetFields(['variant']);
    setVariant([
        ...variant,
      {
        id: Date.now() + '',
        name: '',
        attribute: [
          {
            id: Date.now() + '',
            value: '',
            image: null,
            url: null
          }
        ]
      }
    ])
  }  
  
  const handleRemoveDetail = (name: string) => {  
    form.resetFields(['variant']);
    const updatedVariant = variant.filter((item)=>item.id != name)  
    if(variant.length > 1){
      setVariant(updatedVariant)
    }
  }

  return (
    <>
    <Drawer
        open={true}
        title={
        <>
          <h2 className=' font-bold text-[24px]'>Create new product</h2>
        </>
        }
        width={'85%'}
        styles={{
          header: {
            height: 60,
          },
          body: {
            paddingBottom: 80,
          },
        }}
        onClose={handleCancel}
      >
        
        <Form
          layout='vertical'
          form={form}
          name='nest-messages'
          onFinish={onFinish}
          className='p-10 relative'
        >
          <Flex className='fixed z-[10000000] top-[15px] right-10' gap={20}>
            <Button  loading={isLoadingAddProduct} disabled={isLoadingAddProduct} htmlType='submit' type='primary' className=' '>
              Create
            </Button>
            <Button type='dashed'>
              Reset
            </Button>
          </Flex>
          <Flex vertical gap={30}>
            <Row gutter={[24, 8]} align={'stretch'}>
              <Col span={5} className='w-full'>
                <Option setImageUrl={setImageUrl} discount={{typeDiscount, setTypeDiscount}} setDetails={setDetails}/>
              </Col>
              <Col span={19}>
                <Flex vertical className='' gap={30}>

                  {/* Gallery */}
                  <Form.Item
                    name="gallery"
                    className='p-[30px] sm:rounded-lg border-[#F1F1F4] m-0'
                    style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 1rem'}}
                  >
                    <Flex vertical gap={20}>
                    <h2 className='font-bold text-[16px]'>Gallery</h2>
                    <div style={{ flex: 5, overflow: 'hidden',  boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'}} className='border-none rounded-[12px] relative' >
                        <Flex className='border-dashed border-2 p-5 relative hover:bg-gray-100 hover:border-solid  ' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "7.5vw", borderRadius: '12px' }}>
                            {
                              gallery.length < 1
                              ?
                              (
                                <>
                                  <Flex vertical gap={10} style={{ width: '100%' }}>
                                    <Flex vertical align='center' justify='center'>
                                        <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                                    </Flex>
                                  </Flex>
                                  <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                                      <span style={{ fontSize: '11px' }}>
                                          Kích thước tối đa: 50MB <span className={`${gallery.length != 5 ? 'text-red-400' : 'text-blue-400' }`}>{gallery.length}/5</span>
                                      </span>
                                      <span style={{ fontSize: '11px' }}>
                                          JPG, PNG, GIF, SVG
                                      </span>
                                  </Flex>
                                </>
                              )
                              :
                              ''
                            }
                            <input 
                              type="file" 
                              accept="image/*" 
                              name="image" 
                              id="image" 
                              multiple 
                              className='opacity-0 absolute inset-0'
                              onChange={selectGallery}
                              ref={fileInputRef}
                            />
                            <Flex justify='center' align='center' gap={20} wrap className='w-full h-[100%]'>
                              {gallery.map((item, index)=>(
                                <div className='h-[100px] w-[15%] rounded-lg overflow-hidden' key={index}>
                                  <div style={{ height: '100%', width: '100%' }} className='relative group' key={index}>
                                    <img src={item.displayPic} alt="" className='object-cover h-full object-center' style={{width: '100%' }} />
                                    <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                    <div 
                                      style={{ zIndex: 999, fontSize: "20px", color: 'white' }}
                                      className=' cursor-pointer'
                                      onClick={() => handleDeleteGallery(index)}
                                    >
                                      <DeleteOutlined className=" duration-1000 opacity-0 group-hover:opacity-100 absolute top-[50%] left-[50%]" style={{transform: 'translate(-50%, -50%)'}}/>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </Flex>
                        </Flex>
                    </div>
                    </Flex>
                  </Form.Item>
                  {/* Gallery */}
                  
                  {/* General */}
                  <div className=' p-[2rem] sm:rounded-lg h-full' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                    <h2 className='mb-5 font-bold text-[16px]'>General</h2>
                    <Flex vertical  gap={20}>
                      <Form.Item
                        name='name'
                        label='Name'
                        className='w-full'
                        rules={[
                          { required: true, message: 'Vui lòng nhập tên sản phẩm!' },
                          { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                          {
                            whitespace: true,
                            message: 'Tên sản phẩm không được để trống!'
                          }
                        ]}
                      >
                        <Input size='large' placeholder='Nhập tên sản phẩm' />
                      </Form.Item>
                      <Flex vertical>
                          <TextEditor/>
                      </Flex>
                    </Flex>
                  </div>
                  {/* General */}

                   {/* Detail */}
                   <Flex vertical gap={20} className='sm:rounded-lg p-10' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                    <h2 className={`font-bold text-[16px]`}>Thông tin chi tiết sản phẩm</h2>
                    {details?.details && details?.details.map((item)=>(
                      <Flex vertical gap={20} className='p-3' key={item.id}>
                          <h2 className=' font-bold'>{item.name}</h2>
                          <hr />
                          <Flex align='center' wrap gap={20}>
                              {item.attributes.map((attr)=>(
                                <Flex vertical gap={5} key={attr.id} className='w-[25%]'>
                                  <h2 className='font-bold'>{attr.name}</h2>
                                  <Form.Item 
                                    className='m-0' 
                                    name={`attr-${attr.id}`} 
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Trường này không được bỏ trống'
                                      }
                                    ]}
                                  >
                                    <Select
                                      className='h-[40px]'
                                      mode='tags'
                                      onChange={(e)=>{
                                        const existingAttrIndex = detailsAttr.findIndex(item => item.id === attr.id);
                                        if(existingAttrIndex > -1){
                                          const newDetailAttr = detailsAttr.map((item, index) => {
                                            if (index === existingAttrIndex) {
                                              return {
                                                ...item,
                                                values: e
                                              };
                                            }
                                            return item;
                                          });
                                          setDetailsAttr(newDetailAttr)
                                        }else {
                                          // Nếu mục không tồn tại, thêm mới vào mảng
                                          const newDetailAttr = [
                                            ...detailsAttr,
                                            {
                                              id: attr.id,
                                              idDetail: item.id,
                                              values: e
                                            }
                                          ];
                                          setDetailsAttr(newDetailAttr);
                                        }

                                      }}
                                      style={{ width: '100%' }} 
                                    />
                                  </Form.Item> 
                                </Flex>
                              ))}
                          </Flex>
                      </Flex>
                    ))}
                  </Flex>
                  {/* Detail */}

                  {/* Variant */}
                  <Flex vertical gap={20} className='sm:rounded-lg p-10' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1rem 1rem 1rem'}}>
                    <h2 className='font-bold text-[16px]'>Thông tin bán hàng</h2>
                    <Flex vertical gap={20}>
                      {variant.map((name, i) => (
                          <Variant key={name.id} show={i} keyValue={name.id} detail={variant} setDetail={setVariant} handleRemoveDetail={handleRemoveDetail} form={form}/>
                      ))}
                      {
                        variant.length == 1
                        ?
                        <>
                          <div>
                            <Button className=' border-dashed' onClick={handleSetDetail}>Thêm biến thể 2</Button>
                          </div>
                        </>
                        :
                        ''
                      }
                    </Flex>

                    <Flex vertical gap={20}>
                      <TableVariant variant={variant} setVariant={setVariant} />
                    </Flex>
                  </Flex>
                  {/* Variant */}

                </Flex>
              </Col>
            </Row>
          </Flex>
        </Form>
      </Drawer>
    </>
  )
}
export default React.memo(AddProduct)