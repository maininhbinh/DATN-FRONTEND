import { IProduct } from '@/common/types/product.interface'
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast'
import ClassicEditor from '@/utils/ckeditorConfig'
import { UploadOutlined } from '@ant-design/icons'
import type { SelectProps } from 'antd'
import { Button, Col, Drawer, Form, Image, Input, Row, Select, Space, Switch, Typography, Upload } from 'antd'
import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ErrorLoad from '../../components/util/ErrorLoad'
import LoadingUser from '../../user/util/Loading'
const { Title } = Typography

import instance from '@/api/axios'
import { IBrand } from '@/common/types/brand.interface'
import { ICategory } from '@/common/types/category.interface'
import { useGetProductQuery, useUpdateProductMutation } from '../ProductsEndpoints'
import Variant from './Variant/variant'
const validateMessages = {
  required: '${label} is required!'
}

function EditProduct() {
  const params = useParams()
  const { data: dataItem, isLoading: dataLoading } = useGetProductQuery(params.id)
  const [updateProduct, { isLoading: loadingUpdateProduct }] = useUpdateProductMutation()
  const [status, setStatus] = useState({
    isLoading: false,
    isError: false
  })
  const [dataBrands, setDataBrands] = useState<IBrand[]>([])
  const [dataCategories, setDataCategories] = useState<ICategory[]>([])
  const box = useRef<HTMLTextAreaElement | undefined>()
  const [form] = Form.useForm()
  const [file, setFile] = useState({
    data: {},
    loading: false
  })
  useEffect(() => {
    ;(async () => {
      try {
        setStatus((prev) => {
          return {
            ...prev,
            isLoading: true
          }
        })
        const reponse = await instance.get('categories')

        const reponseBrand = await instance.get('brand')
        setDataBrands(reponseBrand.data)
        setDataCategories(reponse.data)
      } catch (error) {
        setStatus(() => {
          return {
            isLoading: false,
            isError: true
          }
        })
      } finally {
        setStatus((prev) => {
          return {
            ...prev,
            isLoading: false
          }
        })
      }
    })()
    form.setFieldsValue({ in_active: dataItem?.in_active })
    if (box.current) {
      ClassicEditor.create(box.current as HTMLElement).then((editor) => {
        editor.model.document.on('change:data', () => {
          form.setFieldsValue({ description: editor.getData() })
        })
        const editorElement = document.querySelectorAll('.ck-editor')
        editorElement.forEach((element, key) => {
          if (key != 0) {
            element.remove()
          }
        })
      })
    }
  }, [dataLoading])

  useEffect(() => {
    setTimeout(() => {
      if (box.current) {
        ClassicEditor.create(box.current as HTMLElement).then((editor) => {
          editor.model.document.on('change:data', () => {
            form.setFieldsValue({ description: editor.getData() })
          })
          const editorElement = document.querySelectorAll('.ck-editor')
          editorElement.forEach((element, key) => {
            if (key != 0) {
              element.remove()
            }
          })
        })
      }
    }, 600)
  }, [form])

  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
    setFile({
      data: file,
      loading: false
    })
    onSuccess('Upload successful', file)
  }

  const onFinish = async (values: IProduct) => {
    const newData = {
      ...values,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sales_information: values?.sales_information?.map((value: any) => ({
        ...value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        list: value?.list?.map((item: any) => ({
          ...item,
          ...(item?.image?.file ? { image: item.image?.file?.response?.url } : { image: item.image })
        }))
      }))
    }
    console.log(newData)

    if (newData.upload) {
      delete newData.upload
      setFile((prev) => {
        return {
          ...prev,
          loading: true
        }
      })

      const formData = new FormData()

      formData.append('file', file.data as Blob)
      formData.append('upload_preset', 'vuminhhung904')

      Promise.all([axios.post('https://api.cloudinary.com/v1_1/dqouzpjiz/upload', formData)])
        .then(async ([response]: any) => {
          console.log(response)
          setFile({
            data: {},
            loading: false
          })

          try {
            await updateProduct({
              ...newData,
              thumbnail: response.data.secure_url,
              id: dataItem.id
            })
            popupSuccess(`Update product "${values.name}"  success`)
            handleCancel()
          } catch (err) {
            popupError(`Update product "${values.name}"  error`)
            handleCancel()
          }
        })
        .catch(() => {
          popupError('Upload file Error ! lets try again ')
        })
    } else {
      try {
        await updateProduct({ ...newData, id: dataItem.id, thumbnail: dataItem.thumbnail })
        popupSuccess(`Update product "${newData.name}"  success`)
        handleCancel()
      } catch (err) {
        popupError(`Update prooduct "${newData.name}"  error`)
        handleCancel()
      }
    }
  }

  const optionCategories: SelectProps['options'] = []
  dataCategories?.forEach((item) => {
    optionCategories.push({
      value: item.id,
      label: item.name
    })
  })

  const optionBrands: SelectProps['options'] = []
  dataBrands?.forEach((item) => {
    optionBrands.push({
      value: item.id,
      label: item.name
    })
  })
  const navigate = useNavigate()

  const handleCancel = () => {
    navigate('..')
  }
  if (dataLoading) return <LoadingUser />
  if (status.isError) return <ErrorLoad />
  return (
    <>
      <Drawer
        width={1400}
        placement='right'
        title={`Edit product "${dataItem?.name}"`}
        open={true}
        onClose={handleCancel}
        extra={
          <Space>
            <Button onClick={handleCancel}>Cancel</Button>
          </Space>
        }
      >
        <Form
          initialValues={dataItem}
          layout='vertical'
          form={form}
          name='nest-messages'
          onFinish={onFinish}
          validateMessages={validateMessages}
        >
          <Row gutter={[24, 8]}>
            <Col span={8}>
              <Form.Item rules={[{ required: true }]} name='name' label='Name'>
                <Input type='text' placeholder='Enter your name' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name='price' rules={[{ required: true }]} label='Price'>
                <Input type='number' placeholder='Enter your price' />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item rules={[{ required: true }]} name='discount' label='Discount'>
                <Input type='number' placeholder='Enter your discount' />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item rules={[{ required: true }]} name='categoryId' label='Category'>
                <Select
                  loading={status.isLoading}
                  style={{ width: '100%' }}
                  placeholder='Enter category'
                  options={optionCategories}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item rules={[{ required: true }]} name='brandId' label='Brand'>
                <Select
                  loading={status.isLoading}
                  style={{ width: '100%' }}
                  placeholder='Enter brand'
                  options={optionBrands}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='total_review' label='Total review'>
                <Input type='number' placeholder='0' readOnly={true} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name='avg_stars' label='Average star'>
                <Input type='number' placeholder='0' readOnly={true} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item rules={[{ required: true }]} name='description' label='Content'>
                <textarea ref={box} className='form-control' id='ckeditor' cols={30} rows={10}></textarea>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name='upload'
                label='Image'
                valuePropName='fileList'
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
              >
                <Upload name='image' listType='picture' customRequest={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item name='in_active' label='Active?'>
                <Switch />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Image width={150} src={dataItem?.thumbnail} />
            </Col>

            <Col span={24}>
              <Title level={5}>Thông Tin bán hàng</Title>
              <Variant form={form} />
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  loading={loadingUpdateProduct || file.loading}
                  disabled={loadingUpdateProduct || file.loading}
                  type='primary'
                  htmlType='submit'
                >
                  Update
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  )
}
export default React.memo(EditProduct)