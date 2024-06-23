import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { createNewCategory } from '@/app/slices/categorySlice'
import { useNavigate, useParams } from 'react-router-dom'
import { CloudUploadOutlined, DeleteOutlined  } from '@ant-design/icons';
import { Flex, Form, Input, Modal, Button, Switch, Select } from 'antd';
import { useState } from 'react';
import { Typography } from 'antd';
import ButtonEdit from '../../shared/ButtonEdit/ButtonEdit';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import { useCreateCategoryMutation, useGetCategoryQuery } from '../CategoryEndpoints';

export default function EditCategory() {
 
  const params = useParams();
  
  const {data : dataItem , isLoading} = useGetCategoryQuery(params.id)


  console.log(dataItem)
 
  const [createCategory, { isLoading: loadingCreateCategory}] = useCreateCategoryMutation()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  
  const [imageUrl, setImageUrl] = useState<File>();
  const [DisplayPic, setDisplayPic] = useState<string>();

  const [details, setDetails] = useState<Array <object>>([
    {
      id : 55,
      name : '1111',
      attribute : [
         {
            id : 56,
            value : '1'
         },
         {
          id : 57,
          value : '2'
         },
         {
          id : 58,
          value : '3'
         },
         {
          id : 100,
          value : ''
       }
      ]
    },
    {
      id : 59,
      name : '2222',
      attribute : [
         {
            id : 60,
            value : '4'
         },
         {
          id : 61,
          value : '5'
         },
         {
          id : 62,
          value : '6'
         },
         {
          id : 110,
          value : ''
       }
      ]
    },
    {
      id : 63,
      name : '',
      attribute : [
         
         {
          id : 113,
          value : ''
       }
      ]
    }
    
  ]);

  const validateNoDuplicate = (fieldName : any, setNo : any, setError : any) => (_ : any, value : any) => {    
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

  const validateOption = (fieldName : any, setError : any, field : any) => (_ : any, value : any) => {    
    const fields = form.getFieldsValue();
    const inputValues = Object.keys(fields)
      .filter(key => key.startsWith(fieldName))
      .map(key => fields[key]);
    
    const duplicateValues = inputValues.filter((item) => item === value && item);

    
    if (duplicateValues.length > 1) {
      setError((prevErrors : any) => ({
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

  const handleRemoveDetail = (name : any) => {    
    if(details.length > 1){
      setDetails([
        ...details.filter((item : any, index)=>item.id != name)
      ])
    }
  }

  const handleSetDetail = () => {
    setDetails([
        ...details,
      {
        id: Date.now() + '',
        name: '',
        attribute: [
          {
            id: Date.now() + '',
            value: ''
          }
        ]
      }
    ])
  }

  const handleSubmit = async () => {
    // console.log(values);
    
    const name = form.getFieldValue('name');
    const active = form.getFieldValue('active');
    const parent_id = form.getFieldValue('parent_id');    
    const detail = details.map((item : any)=>{
      return {
        ...item,
        attribute: item.attribute.filter((field : any)=>field.value)
      }
    });

    const formData = new FormData();
    
    formData.append('name', name);
    formData.append('active', active);
    formData.append('parent_id', parent_id);
    formData.append('detail', JSON.stringify(detail));
    if(imageUrl){      
      formData.append('image', imageUrl);
    }

    try {
      //console.log(name, active, parent_id, detail, imageUrl)
      await createCategory(formData);
      popupSuccess('Tạo danh mục thành công')
      navigate('..')
    } catch (error) {
      popupError('Tạo danh mục thất bại!')
    }
   
  }

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
    } else {
        e.target.value = ''
    }

  }

  return (
    <>
      <Modal
        confirmLoading={isLoading}
        open={true}
        width={1400}
        footer=''
        onCancel={handleCancel}
      >
        
      {dataItem && <Form 
          
          form={form} 
          name='category' 
          layout='vertical' 
          className='w-full p-6' 
          onFinish={handleSubmit}
          
          initialValues={{
            parent_id: '',
            active: true,
            name : dataItem.data.name
          }}
        >
          <Form.Item>
            <Flex justify='space-between' className='pb-4' align='center'>
              <h2 className=' font-bold text-[24px]'>Edit category "{dataItem?.data.name}"</h2>
              <Button loading={loadingCreateCategory} disabled={loadingCreateCategory} type="primary" htmlType="submit" className=" w-[100px] p-5">
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
                  rules={[{ required: true, message: 'Please upload a file!' }]}
                  style={{boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)'}}
                >
                  <div>
                  <h2 className='font-bold mb-2 text-[16px]'>Thumbnail</h2>
                  <div style={{ flex: 5, height: '200px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px]  ' >
                    {
                      imageUrl && DisplayPic
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
                        style={{ width: '200px',height:40 }}
                        onChange={(v)=>{console.log(v);
                        }}
                        options={[
                          { value: '', label: 'none' },
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

            {details.map((name : any, i) => (
                <ButtonEdit key={name.id} keyValue={name.id} detail={details} setDetail={setDetails} handleRemoveDetail={handleRemoveDetail as any} validateNoDuplicate={validateNoDuplicate as any} validateOption={validateOption as any}/>
            ))}

            <div>
            <Button className=' border-dashed' onClick={handleSetDetail}>Thêm thông tin chi tiết</Button>
            </div>
          </Flex>
        </Form>}
      </Modal>
    </>
  )
}
