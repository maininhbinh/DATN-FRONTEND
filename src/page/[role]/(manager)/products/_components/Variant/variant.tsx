/* eslint-disable @typescript-eslint/no-explicit-any */
import { CloseOutlined, PlusOutlined } from '@ant-design/icons'
import { Badge, Button, Card, Form, Input } from 'antd'

import './variant.css'
import UploadVariant from './UploadVariant'

export default function Variant({ form }: { form?: any }) {
  return (
    <div className='app__variant'>
      <Badge status='processing' text='Phân loại hàng' />
      <div>
        <Form.List name='sales_information' initialValue={[]}>
          {(fields, { add, remove }) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {fields.map((field, index) => (
                <Card className='my-2' size='small' key={field.key} style={{ background: '#F6F6F6' }}>
                  <div className='mb-4 flex items-center justify-between border-b border-solid border-[#ccc]'>
                    <Form.Item name={[field.name, 'name']} className='m-0'>
                      <Input placeholder={`Nhập name phân loại ${index + 1}`} />
                    </Form.Item>

                    <CloseOutlined
                      className='p-2'
                      onClick={() => {
                        remove(field.name)
                      }}
                    />
                  </div>

                  {/* Nest Form.List */}
                  <Form.Item className='m-0'>
                    <Form.List name={[field.name, 'list']} initialValue={[{}]}>
                      {(subFields, subOpt) => (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div className='flex items-center flex-wrap'>
                            {subFields.map((subField) => (
                              <div key={subField.key} className='flex items-center gap-2 mx-4 w-[46%] mb-4'>
                                {index === 0 && <UploadVariant subField={subField} form={form}/>}

                                <Form.Item noStyle name={[subField.name, 'name']}>
                                  <Input placeholder='Nhập' />
                                </Form.Item>
                                <CloseOutlined
                                  onClick={() => {
                                    subOpt.remove(subField.name)
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                          <Button type='dashed' className='mb-4 !w-48 mx-auto' onClick={() => subOpt.add()} block>
                            + Add
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
              ))}

              <div className='my-2 bg-[#F6F6F6] p-3 rounded-[4px]'>
                <Button icon={<PlusOutlined />} onClick={() => add()} type='dashed' className='w-[240px]' danger>
                  Thêm nhóm phân loại {fields.length + 1}
                </Button>
              </div>
            </div>
          )}
        </Form.List>
      </div>

      <Badge status='processing' text='Danh sách phân loại hàng' />

      <div className='bg-[#F6F6F6] p-3 rounded-[4px] my-3'>
        <div className='flex'>
          <div className='p-3 w-[200px]'>
            <Badge status='processing' /> Color
          </div>
          <div className='p-3 w-[90px]'> Ram </div>
          <div className='p-3 w-full'>Giá</div>
          <div className='p-3 w-full'>Số lượng</div>
          <div className='p-3 w-full'>SKU</div>
        </div>
        <div className=''>
          <div className='flex items-center h-full '>
            <div className='p-3 w-[200px] flex justify-center'> Red</div>
            <div className=' flex flex-col gap-3 w-[90px]  h-[100%] '>
              <span className='p-2'>4Gb</span>
              <span className='p-2'>8Gb</span>
              <span className='p-2'>8Gb</span>
            </div>

            <div className='p-3 flex flex-col gap-3 w-full'>
              <Input placeholder='0' />
              <Input placeholder='0' />
              <Input placeholder='0' />
            </div>
            <div className='p-3 flex flex-col gap-3 w-full'>
              <Input placeholder='0' />
              <Input placeholder='0' />
              <Input placeholder='0' />
            </div>
            <div className='p-3 flex flex-col gap-3 w-full'>
              <Input placeholder='0' />
              <Input placeholder='0' />
              <Input placeholder='0' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
