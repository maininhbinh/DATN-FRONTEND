import { CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons'
import { Button, Flex, Form, Input, Modal, Select } from 'antd'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const { Option } = Select

const selectBefore = (
  <Select defaultValue='http://'>
    <Option value='http://'>http://</Option>
    <Option value='https://'>https://</Option>
  </Select>
)
const selectAfter = (
  <Select defaultValue='.com'>
    <Option value='.com'>.com</Option>
    <Option value='.jp'>.jp</Option>
    <Option value='.cn'>.cn</Option>
    <Option value='.org'>.org</Option>
  </Select>
)
export default function EditBrand() {
  const params = useParams()
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const [DisplayPic, setDisplayPic] = useState<string>()

  const handleCancel = () => {
    navigate('..')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (values: any) => {
    console.log(values)
  }

  return (
    <>
      <Modal open={true} width={1400} footer='' onCancel={handleCancel}>
        <Form form={form} name='brand-edit' layout='vertical' className='w-full p-6' onFinish={handleSubmit}>
          <Form.Item>
            <Flex justify='space-between' className='pb-4' align='center'>
              <h2 className=' font-bold text-[24px]'>Create new Brand</h2>
              <Button type='primary' htmlType='submit' className=' w-[100px] p-5'>
                Create
              </Button>
            </Flex>
          </Form.Item>
          <Flex gap={30}>
            <Flex className='flex-[2] ' vertical gap={10}>
              <Flex vertical>
                <Form.Item
                  name='upload'
                  className='border-[1px] p-[20px] pt-[10px] rounded-md border-[#F1F1F4]'
                  rules={[{ required: true, message: 'Please upload a file!' }]}
                  style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}
                >
                  <div>
                    <h2 className='font-bold mb-1 text-[16px]'>Logo</h2>
                    <div
                      style={{
                        flex: 5,
                        height: '180px',
                        overflow: 'hidden',
                        boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'
                      }}
                      className='border-none rounded-[12px]  '
                    >
                      {DisplayPic ? (
                        <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                          <img
                            // src={DisplayPic}
                            alt=''
                            className='object-cover h-[100%] object-center'
                            style={{ width: '100%' }}
                          />
                          <div
                            className=' absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000'
                            style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}
                          ></div>
                          <button
                            style={{ zIndex: 999, fontSize: '20px', color: 'white' }}
                            // onClick={() => setDisplayPic('')}
                          >
                            <DeleteOutlined className=' duration-1000 opacity-0 group-hover:opacity-100 absolute top-10 right-10' />
                          </button>
                        </div>
                      ) : (
                        <Flex
                          className='border-dashed border-2 relative hover:bg-gray-100 hover:border-solid hover:border'
                          vertical
                          gap={10}
                          justify='center'
                          align='center'
                          style={{ maxWidth: '100%', height: '100%', borderRadius: '12px' }}
                        >
                          <Flex vertical gap={10} style={{ width: '100%' }}>
                            <Flex vertical align='center' justify='center'>
                              <CloudUploadOutlined style={{ fontSize: '50px', color: 'gray' }} className='' />
                            </Flex>
                          </Flex>
                          <Flex style={{ width: '100%', color: 'gray' }} vertical justify='center' align='center'>
                            <span style={{ fontSize: '11px' }}>Kích thước tối đa: 50MB</span>
                            <span style={{ fontSize: '11px' }}>JPG, PNG, GIF, SVG</span>
                          </Flex>
                          <input
                            type='file'
                            accept='image/*'
                            name='image'
                            id='image'
                            multiple
                            className='opacity-0 absolute inset-0'
                            // onChange={selectedImg}
                          />
                        </Flex>
                      )}
                    </div>
                  </div>
                </Form.Item>
              </Flex>
            </Flex>
            <Flex vertical className='flex-[9]'>
              <div
                className='  border-[1px] p-[20px] rounded-md'
                style={{ boxShadow: '0px 3px 4px 0px rgba(0, 0, 0, 0.03)' }}
              >
                <Flex vertical>
                  <Flex gap={30}>
                    <Form.Item
                      name='name'
                      label='Name'
                      className='w-full'
                      rules={[
                        { required: true, message: 'Vui lòng nhập tên thương hiệu!' },
                        { max: 120, message: 'Tên không vượt quá 120 ký tự' },
                        {
                          whitespace: true,
                          message: 'Tên thương hiệu không được để trống!'
                        }
                      ]}
                    >
                      <Input size='large' placeholder='Nhập tên thương hiệu' />
                    </Form.Item>
                    <Form.Item
                      name='brand_code'
                      label='Brand Code'
                      className='w-full'
                      rules={[
                        { required: true, message: 'Vui lòng nhập mã định danh!' },
                        { max: 20, message: 'Tên không vượt quá 20 ký tự' },
                        {
                          whitespace: true,
                          message: 'mã định danh không được để trống!'
                        }
                      ]}
                    >
                      <Input size='large' placeholder='Nhập mã định danh' />
                    </Form.Item>
                  </Flex>
                  <Flex gap={30}>
                    <Form.Item
                      name='country_origin'
                      label='Country Origin'
                      className='w-full'
                      rules={[{ required: true, message: 'Vui lòng chọn quốc gia thương hiệu!' }]}
                    >
                      <Select
                        size='large'
                        placeholder='Select Country Origin'
                        // optionFilterProp='label'
                        onChange={() => {}}
                        onSearch={() => {}}
                        options={[
                          {
                            value: 'vietnamse',
                            label: 'Việt Nam'
                          },
                          {
                            value: 'china',
                            label: 'Trung Quốc'
                          },
                          {
                            value: 'america',
                            label: 'Mỹ'
                          }
                        ]}
                      />
                    </Form.Item>
                    <Form.Item
                      name='website'
                      label='Website'
                      className='w-full'
                      rules={[
                        { required: true, message: 'Vui lòng nhập website!' },
                        {
                          whitespace: true,
                          message: 'Website không được để trống!'
                        }
                      ]}
                    >
                      <Input
                        size='large'
                        addonBefore={selectBefore}
                        addonAfter={selectAfter}
                        placeholder='Nhập đường dẫn website thương hiệu'
                      />
                    </Form.Item>
                  </Flex>
                  <div>
                    <Form.Item
                      name='description'
                      label='Description'
                      className='w-full'
                      rules={[
                        { required: true, message: 'Vui lòng nhập mô tả!' },
                        {
                          whitespace: true,
                          message: 'Mô tả không được để trống!'
                        }
                      ]}
                    >
                      <Input.TextArea rows={6} placeholder='Nhập mô tả' />
                    </Form.Item>
                  </div>
                </Flex>
              </div>
            </Flex>
          </Flex>
        </Form>
      </Modal>
    </>
  )
}
