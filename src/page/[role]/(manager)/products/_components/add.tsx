import { Card, Col, Modal, Row, Switch, Upload } from 'antd'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import type { SelectProps, UploadFile, GetProp, UploadProps } from 'antd'
import ClassicEditor from '@/utils/ckeditorConfig'
import LoadingUser from '../../user/util/Loading'
import ErrorLoad from '../../components/util/ErrorLoad'
import React, { useEffect, useRef, useState } from 'react'
import { IGallery, IProduct } from '@/common/types/product.interface'
import { popupSuccess, popupError } from '@/page/[role]/shared/Toast'
import { UploadOutlined } from '@ant-design/icons'
import axios from 'axios'

import { ICategory } from '@/common/types/category.interface'
import instance from '@/api/axios'
import { IBrand } from '@/common/types/brand.interface'
import { useCreateProductMutation } from '../ProductsEndpoints'
import { useGetAttributesQuery } from '../../attribute/_components/attribute/AttributeEndpoints'
import { IAttribute } from '@/common/types/attribute.interface'
import { IValueAttribute } from '@/common/types/valueAttribute.interface'
import { Typography } from 'antd'
import UploadFileGallery from './uploadGallery/uploadGallery'
import { getBase64 } from '@/utils/getBase64'
import Variant from './Variant/variant'
const { Title } = Typography
const validateMessages = {
  required: '${label} is required!'
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
function AddProduct() {
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { data, isLoading } = useGetAttributesQuery({})
  const [loadingUploadGallery, setLoadingUploadGallery] = useState<boolean>(false)
  const [createProduct, { isLoading: loadingCreateProduct }] = useCreateProductMutation()
  const [status, setStatus] = useState({
    isLoading: false,
    isError: false
  })
  const [dataBrands, setDataBrands] = useState<IBrand[]>([])
  const [dataCategories, setDataCategories] = useState<ICategory[]>([])
  const box = useRef<any>()
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
        setStatus((prev) => {
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
    form.setFieldsValue({ in_active: true })
    if (box.current) {
      ClassicEditor.create(box.current as HTMLElement)
        .then((editor) => {
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
        .catch((error) => {
          console.error(error.stack)
        })
    }
  }, [status.isLoading])

  const handleUpload = async (options: any) => {
    const { onSuccess, file } = options
    setFile({
      data: file,
      loading: false
    })
    onSuccess('Upload successful', file)
  }
  const getIdAttribute = (attributeName: string) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].name == attributeName) {
        return data[i].id
      }
    }
  }

  const handleUploadGallery = async (productId: number) => {
    for (const image of fileList) {
      const blob = new Blob([await getBase64(image.originFileObj as FileType)], { type: image.type })
      const newFile = new File([blob], image.name, { type: image.type })

      const formData = new FormData()
      formData.append('file', newFile as FileType)
      formData.append('upload_preset', 'vuminhhung904')
      const response: any = await axios.post('https://api.cloudinary.com/v1_1/dqouzpjiz/upload', formData)
      //console.log(response.data.secure_url)
      const payload: IGallery = {
        productId: productId,
        image: response.data.secure_url
      }
      await instance.post('galleries', payload)
    }
  }
  const onFinish = async (values: IProduct | any) => {
    const deviceSpecs = values.inforDetailProduct
    const modifiedDeviceSpecs: { [key: number | string]: [] } = {}
    for (const key in values.inforDetailProduct) {
      modifiedDeviceSpecs[getIdAttribute(String(key))] = deviceSpecs[key]
    }

    const newData = {
      ...values,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sales_information: values?.sales_information?.map((value: any) => ({
        ...value,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        list: value?.list?.map((item: any) => ({
          ...item,
          ...(item?.image && { image: item.image?.file?.response?.url })
        }))
      }))
    }

    if (fileList.length <= 2) {
      popupError('At least 3 photos are required')
      return true
    }

    newData.avg_stars = 0
    newData.total_review = 0

    newData.avg_stars = 0
    newData.total_review = 0

    delete newData.upload
    setFile((prev) => {
      return {
        ...prev,
        loading: true
      }
    })

    const formData = new FormData()

    formData.append('file', file.data as any)
    formData.append('upload_preset', 'vuminhhung904')

    Promise.all([axios.post('https://api.cloudinary.com/v1_1/dqouzpjiz/upload', formData)])
      .then(async ([response]: any) => {
        setFile({
          data: {},
          loading: false
        })
        try {
          const responseCreate: any = await createProduct({
            ...newData,
            thumbnail: response.data.secure_url
          })
          setLoadingUploadGallery(true)
          await handleUploadGallery(Number(responseCreate.data.id))
          setLoadingUploadGallery(false)
          popupSuccess(`Add product "${values.name}"  success`)
          handleCancel()
        } catch (err) {
          popupError(`Add product "${values.name}"  error`)
          handleCancel()
        }
      })
      .catch(() => {
        popupError('Upload file Error ! lets try again ')
      })
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
  const convertArrayValueAtrribute = (arr: IValueAttribute[] | undefined) => {
    if (!arr) return []
    return arr.map((item) => {
      return {
        value: item.value,
        label: item.value
      }
    })
  }

  if (status.isLoading) return <LoadingUser />
  if (status.isError) return <ErrorLoad />
  return (
    <>
      <Modal width={1400} okButtonProps={{ hidden: true }} title='Add product' open={true} onCancel={handleCancel}>
        <Form
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
                <Select style={{ width: '100%' }} placeholder='Enter category' options={optionCategories} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item rules={[{ required: true }]} name='brandId' label='Brand'>
                <Select style={{ width: '100%' }} placeholder='Enter brand' options={optionBrands} />
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
                rules={[{ required: true }]}
              >
                <Upload name='image' listType='picture' customRequest={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name='upload'
                label='Image'
                valuePropName='fileList'
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                rules={[{ required: true }]}
              >
                <Upload name='image' listType='picture' customRequest={handleUpload}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='Gallery'>
                <UploadFileGallery fileList={fileList} setFileList={setFileList} />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Title level={5}>Thông Tin Chi Tiết</Title>
              <Row gutter={[24, 1]}>
                <Form.List name='inforDetailProduct'>
                  {(fields) => (
                    <>
                      {data?.map((item: IAttribute, key: number) => (
                        <Col span={8} key={key}>
                          <Form.Item {...fields[key]} name={[item.name]} rules={[{ required: true }]} label={item.name}>
                            <Select
                              loading={isLoading}
                              mode='tags'
                              placeholder='Enter value'
                              options={convertArrayValueAtrribute(item.value_attributes)}
                            />
                          </Form.Item>
                        </Col>
                      ))}
                    </>
                  )}
                </Form.List>
              </Row>
            </Col>

            <Col span={24}>
              <Title level={5}>Thông Tin bán hàng</Title>
              <Variant />
            </Col>

            <Col span={24}>
              <Form.Item name='in_active' label='Active?'>
                <Switch defaultChecked />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item>
                <Button
                  loading={loadingCreateProduct || file.loading || loadingUploadGallery}
                  disabled={false}
                  type='primary'
                  htmlType='submit'
                >
                  Create
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  )
}
export default React.memo(AddProduct)
