import { Flex, Image, Modal, Upload } from 'antd'
import { Button, Form, Input } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'


import LoadingUser from '../../user/util/Loading'
import ErrorLoad from '../../components/util/ErrorLoad'
import { useEffect, useState } from 'react'

import { popupSuccess } from '@/page/[role]/shared/Toast'
//
import { UploadOutlined } from '@ant-design/icons'
import { useGetBrandQuery, useUpdateBrandMutation } from '../BrandEndpoints'
import { IBrand } from '@/common/types/brand.interface'
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not a valid email!',
    number: '${label} is not a valid number!'
  },
  number: {
    range: '${label} must be between ${min} and ${max}'
  }
}
/* eslint-enable no-template-curly-in-string */

export default function EditBrand() {
    const param = useParams();
  const [file, setFile] = useState({ 
    data: {},
    loading: false
  })

  const {data: dataItem, isLoading : dataLoading, isError : isErrorDataItem} = useGetBrandQuery(param.id)
  const [uploadBrand, {isLoading : isLoadingUploadBrand}] = useUpdateBrandMutation();
  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
    setFile({
      data: file,
      loading: false
    })
    onSuccess('Upload successful', file)
 
  }

 
  const [form] = Form.useForm()
  

  const onFinish = async (values: IBrand | any) => {


   
    setFile((prev) => {
      return {
        ...prev,
        loading: true
      }
    })
    const formData = new FormData()

   
    formData.append('name', values.name)
    if(values.upload){
        formData.append('logo', values.upload[0].originFileObj)
    }
    try {
        const payload = {
            id : param.id,
            data : formData
        }
        await uploadBrand(payload).unwrap();
        handleCancel();
        popupSuccess('Updated brand')
    } catch (error) {
        popupSuccess('Updated brand error')
    }
  
  }

  
 

 
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }

  if (dataLoading) return <LoadingUser />
  if (isErrorDataItem) return <ErrorLoad />
  return (
    <>
      <Modal okButtonProps={{ hidden: true }}  title='Edit brand' open={true} onCancel={handleCancel}>
        <Form
         initialValues={dataItem?.data}
          layout="vertical"
          form={form}
          {...layout}
          name='nest-messages'
          onFinish={onFinish}
          style={{ maxWidth: 600 }}
          validateMessages={validateMessages}
        >
          <Form.Item name='name' label='Name' rules={[{ required: true }]}>
            <Input type='text' placeholder='Enter your name' />
          </Form.Item>
        


          <Form.Item
            name='upload'
            label='Upload'
            valuePropName='fileList'
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
 
          >
            <Upload name='image' listType='picture' customRequest={handleUpload}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <Flex justify="flex-start">
              <Image
                width={150}
                src={dataItem?.data.logo}
              />
          </Flex>

      

          <Form.Item  className='mt-4'>
            <Button loading={isLoadingUploadBrand} disabled={isLoadingUploadBrand} type='primary' htmlType='submit'>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
