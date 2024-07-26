import { Modal, Upload } from 'antd'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useLazyGetDistrictsQuery, useGetProvincesQuery } from '../../../../../utils/addressRTKQuery'
import { Select } from 'antd'
import type { SelectProps } from 'antd'

import LoadingUser from '../../user/util/Loading'
import ErrorLoad from '../../components/util/ErrorLoad'
import { useEffect, useState } from 'react'
import { Iuser } from '../../../../../common/types/user.interface'


import { popupSuccess, popupError } from '@/page/[role]/shared/Toast'
//
import { UploadOutlined } from '@ant-design/icons'
import { useCreateBrandMutation } from '../BrandEndpoints'
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

export default function AddBrand() {
  const [createBrand, {isLoading : isLoadingCreateBrand, isError}] = useCreateBrandMutation();
  const [file, setFile] = useState({ 
    data: {},
    loading: false
  })
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

    formData.append('logo', values?.upload[0].originFileObj)
    formData.append('name', values.name)
   
     try {
      await createBrand(formData).unwrap();
      popupSuccess('Create brand success');
      handleCancel();
     } catch (error) {
         popupError('Create brand error');
     }

  
  }

  
 


  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }

 
  if (isError) return <ErrorLoad />
  return (
    <>
      <Modal okButtonProps={{ hidden: true }}  title='Add brand' open={true} onCancel={handleCancel}>
        <Form
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
            rules={[{ required: true }]}
          >
            <Upload name='image' listType='picture' customRequest={handleUpload}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

       

      

          <Form.Item>
            <Button loading={isLoadingCreateBrand || file.loading} disabled={isLoadingCreateBrand || file.loading} type='primary' htmlType='submit'>
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
