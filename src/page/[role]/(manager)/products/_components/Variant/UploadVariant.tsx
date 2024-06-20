import { Form, Upload, UploadProps, message } from 'antd'
import { FileImageOutlined, LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import axios from 'axios'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UploadVariant = ({ subField, form }: { subField: any; form?: any }) => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState(
    form?.getFieldValue(['sales_information', 0, 'list', subField.name, 'image']) || ''
  )

  const handleChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    if (info.file.status === 'done') {
      setLoading(false)
      const url = info.file.response.url
      setImageUrl(url)
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      // Gọi hàm tải lên ảnh của bạn và chờ kết quả
      const response = await uploadFiles(file)

      // Kiểm tra kết quả và xử lý tùy theo trạng thái tải lên
      if (response?.status === 200) {
        message.success(`${file.name} uploaded successfully`)
        onSuccess({ url: response.data.secure_url }, file)
      } else {
        message.error(`${file.name} upload failed.`)
        onError(response)
      }
    } catch (error) {
      // Xử lý lỗi nếu có
      message.error('An error occurred while uploading the image.')
      onError(error)
    }
  }

  const uploadFiles = async (file: File) => {
    if (file) {
      const CLOUD_NAME = 'do7coevfh'
      const PRESET_NAME = 'bcm4uxe3'
      const FOLDER_NAME = 'datn-img'
      const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

      const formData = new FormData()
      formData.append('upload_preset', PRESET_NAME)
      formData.append('folder', FOLDER_NAME)
      formData.append('file', file)

      const response = await axios.post(api, formData)

      return response
    }
  }

  return (
    <Form.Item noStyle name={[subField.name, 'image']}>
      <Upload
        name='image'
        listType='picture-card'
        showUploadList={false}
        onChange={handleChange}
        customRequest={customRequest}
      >
        {imageUrl ? (
          <img src={imageUrl} alt='avatar' style={{ width: '100%' }} />
        ) : (
          <button
            style={{
              border: 0,
              background: 'none',
              padding: 0,
              width: '30px',
              height: '30px'
            }}
            type='button'
          >
            {loading ? <LoadingOutlined /> : <FileImageOutlined />}
          </button>
        )}
      </Upload>
    </Form.Item>
  )
}

export default UploadVariant
