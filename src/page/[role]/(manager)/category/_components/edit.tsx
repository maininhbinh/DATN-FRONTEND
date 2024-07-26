
import { createNewCategory } from '@/app/slices/categorySlice'
import { useNavigate, useParams } from 'react-router-dom'
import { CloudUploadOutlined, DeleteOutlined  } from '@ant-design/icons';
import { Flex, Form, Input, Modal, Button, Switch, Select, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import { Typography } from 'antd';
import ButtonEdit from '../../shared/ButtonEdit/ButtonEdit';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import {  useGetCategoriesQuery, useUpdateCategoryMutation } from '../CategoryEndpoints';
import { ICategory } from '@/common/types/category.interface';
import ButtonEditNext from '../../shared/ButtonEdit/ButtonEditNext';
import getRandomNumber from '@/utils/randomNumber';
import { useGetCategoryQuery } from '../CategoryEndpoints';
import ErrorLoad from '../../components/util/ErrorLoad';
import { useDeleteDetailMutation } from '../CategoryEndpoints';
export default function EditCategory() {
  const [deleteDetail, {isLoading : isLoadingDeleteDetail}] = useDeleteDetailMutation();
  const [isShowInputAddDetail, setIsShowInputAddDetail] = useState<any>({
     detailId : 0,
     attributeId : 0
  })
  const [addDetail, setAddDetail] = useState<number>(0);
  const params = useParams();
  const {refetch, data : dataItem, isLoading : isLoadingGetCategory, isError : isErrorGetCategory} = useGetCategoryQuery(params.id)
  const {data :listCategory, isLoading : isLoadingCategories} = useGetCategoriesQuery({});
  const [updateCategory, {isLoading : loadingUpdateCategory}] = useUpdateCategoryMutation();

  const navigate = useNavigate()
  const [form] = Form.useForm()
  const dataCategories = listCategory ? listCategory.data.map((item : ICategory) => {
    return {
      label : item.name,
      value : item.id
    }
  }) : [];
  
 
  const [imageUrl, setImageUrl] = useState<File>();
  const [DisplayPic, setDisplayPic] = useState<string>();

  
  const [details, setDetails] = useState<Array <object>>([]);

  useEffect(() => {
    
    if(dataItem) {
        setDisplayPic(dataItem.data.image)
        const setData = dataItem.data;
        
        setDetails(() => {
          return setData.details.map((item : any) => {
              return {
                 detailId : item.id,
                 id : getRandomNumber(),
                 name : item.name,
                 attribute : item.attributes.map((item1 : any) => {
                  return {
                    attributeId : item1.id,
                    id : getRandomNumber(),
                    value : item1.name
                  }
               })
              }
          })
        })
    }
  },[dataItem]);

  const validateNoDuplicate = (fieldName, setNo, setError) => (_, value) => {    
    const fields = form.getFieldsValue();
    const inputValues = Object.keys(fields)
      .filter(key => key.startsWith(fieldName))
      .map(key => fields[key]);
    
    const duplicateValues = inputValues.filter((item) => item === value && item);
    
    if (duplicateValues.length > 1) {
      setNo(true)
      return Promise.reject(`không được trùng với các cột khác!`);
    }
    setNo(false)
    return Promise.resolve();
  };

  const validateOption = (fieldName, setError, field) => (_, value) => {    
    const fields = form.getFieldsValue();
    const inputValues = Object.keys(fields)
      .filter(key => key.startsWith(fieldName))
      .map(key => fields[key]);
    
    const duplicateValues = inputValues.filter((item) => item === value && item);

    
    if (duplicateValues.length > 1) {
      setError((prevErrors) => ({
        ...prevErrors,
        [field]: 'không được trùng',
    }));

      return Promise.reject(`không được trùng với các cột khác!`);
    }
    return Promise.resolve();
  };

  const handleCancel = () => {
    navigate('..')
  }

  const handleRemoveDetail = async (name : any, detailId : number) => {  
   
 

    if(!detailId){
      if(details.length > 1){
        setDetails([
          ...details.filter((item, index)=>item.id != name)
        ])
      }
    }else {
      try {
        await deleteDetail(String(detailId)).unwrap();
        if(details.length > 1){
          setDetails([
            ...details.filter((item, index)=>item.id != name)
          ])
        }
        refetch();
        popupSuccess('Delete detail success');
      } catch (error) {
        popupError('Delete detail error');
      }
    }
   
  }

  const handleSetDetail = () => {
    const detailId = getRandomNumber();
    const attributeId = getRandomNumber()

    setIsShowInputAddDetail({
      detailId: detailId,
      attributeId : attributeId
    })

    setDetails([
        ...details,
      {
        id: detailId,
        name: '',
        attribute: [
          {
            id: attributeId,

            value: ''
          }
        ]
      }
    ])
  }

  const handleSubmit = async (values) => {
   
    
    const name = form.getFieldValue('name');
    const active = form.getFieldValue('active') ? 1 : 0;
    const parent_id = form.getFieldValue('parent_id');    
 

    const formData = new FormData();
    
   
    formData.append('name', name);
    formData.append('active', active as any);
    formData.append('parent_id', parent_id);
   
    if(imageUrl){      
      formData.append('image', imageUrl);
    }
   
    try {
      const payload = {
        id : params.id,
        payload : formData
      }
      await updateCategory(payload).unwrap();
      popupSuccess('Update category success');
      navigate('..')
    } catch (error) {
      popupError('Update category error');
    }

 
   

  
  }

  const selectedImg = (e) => {
    
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
    } else {
        e.target.value = ''
    }

  }
  if(isErrorGetCategory){
    return <ErrorLoad />
  }
  return (
    <>
    <Drawer width={'70%'} loading={isLoadingGetCategory || isLoadingCategories} title="Create new category" onClose={() => handleCancel()} open={true}>
    {dataItem &&  <Form 
          form={form} 
          name='category' 
          layout='vertical' 
          className='w-full p-6' 
          onFinish={handleSubmit}
          initialValues={{
            parent_id: dataItem?.data?.parent_id ? dataItem?.data?.parent_id : '',
            active: dataItem?.data?.active == 1 ? true : false,
            name : dataItem?.data?.name
          }}
        >
          <Form.Item>
            <Flex justify='space-between' className='pb-4' align='center'>
              <h2 className=' font-bold text-[24px]'>Update category "{dataItem?.data?.name}"</h2>
              <Button loading={loadingUpdateCategory} disabled={loadingUpdateCategory} type="primary" htmlType="submit" className=" w-[100px] p-5">
                Update
              </Button>
            </Flex>
          </Form.Item>
          <Flex gap={100}>
            <Flex className='flex-[2] ' vertical gap={10}>
              <Flex vertical>
                <Form.Item
                  name="upload"
                  className='border-[1px] p-[50px] rounded-md border-[#F1F1F4]'
    
                  style={{boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)'}}
                >
                  <div>
                  <h2 className='font-bold mb-2 text-[16px]'>Thumbnail</h2>
                  <div style={{ flex: 5, height: '200px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
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
                      <Flex className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ maxWidth: '100%', height: "100%", borderRadius: '12px' }}>
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
                          <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                              onChange={selectedImg}
                          />
                      </Flex>
                    }
                  </div>
                  </div>
                </Form.Item>
              </Flex>
              <div className='border border-1 rounded-md overflow-hidden flex-1 ' style={{ boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>
                <div className='p-2'>
                  <h2>Setting</h2>
                </div>
                <hr />
                <div className='flex justify-between items-center p-2'>
                  
                      <h2>active</h2>
                      <Form.Item 
                        className='m-0' 
                        label=''
                        name='active' 
                        valuePropName="checked"
                      >
                        <Switch />
                      </Form.Item>

                </div>
              </div>
            </Flex>
            <Flex vertical className='flex-[6]'>
              <div className='  border-[1px] p-[50px] rounded-md' style={{boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)'}}>
                <h2 className='mb-5 font-bold text-[16px]'>General</h2>
                <Flex vertical  gap={20}>
                  <Flex gap={30}>
                    <Form.Item
                      name='name'
                      label='Name'
                      className='w-full'
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên danh mục!' },
                        { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                        {
                          whitespace: true,
                          message: 'Tên danh mục không được để trống!'
                        }
                      ]}
                    >
                      <Input size='large' placeholder='Nhập tên danh mục' />
                    </Form.Item>
                    <Form.Item
                      name='parent_id'
                      label='parent_id'
                    >
                      <Select
                        loading={isLoadingCategories}
                        style={{ width: '200px',height:40 }}
                        onChange={(v)=>{console.log(v);
                        }}
                        options={[
                          { value: '', label: 'none' },
                          ...dataCategories
                        ]}
                      />
                    </Form.Item>
                  </Flex>
                  <div>
                  </div>
                </Flex>
              </div>
            </Flex>
          </Flex>
          <Flex vertical gap={20}>
            <h2 className='font-bold text-[24px] mt-5'>Thông tin chi tiết</h2>

            {details.map((name, i) => (
                <ButtonEditNext refetch={refetch} setIsShowInputAddDetail={setIsShowInputAddDetail} isShowInputAddDetail={isShowInputAddDetail} addDetail={addDetail} setAddDetail={setAddDetail} item={name} key={name.id} keyValue={name.id} detail={details} setDetail={setDetails} handleRemoveDetail={handleRemoveDetail} validateNoDuplicate={validateNoDuplicate} validateOption={validateOption}/>
            ))}
            <div>
            <Button className=' border-dashed' onClick={handleSetDetail}>Thêm thông tin chi tiết</Button>
            </div>
          </Flex>
        </Form>}
    </Drawer>
     
    </>
  )
}
