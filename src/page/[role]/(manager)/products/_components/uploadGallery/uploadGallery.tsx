import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { popupError } from '@/page/[role]/shared/Toast';
import axios from 'axios';
import {  Dispatch, SetStateAction} from 'react';
import { getBase64 } from '@/utils/getBase64';
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];



interface IUploadFile {
   fileList : UploadFile[],
   setFileList :  Dispatch<SetStateAction<UploadFile[]>>
}
export default function UploadFileGallery({
  fileList, setFileList
} : IUploadFile){

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  
  const handlePreview = async (file: UploadFile) => {
    
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {

    setFileList(newFileList);
  }

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

 const customBeforeUpload = async (file : any) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
          if (!isJpgOrPng) {
            popupError('You can only upload JPG/PNG file!');
            return  Upload.LIST_IGNORE;
          }
          
          return false
 }

  const onUploadSubmit =  async () => {
    
     for (const image  of fileList) {
      const blob = new Blob([await getBase64(image.originFileObj as FileType)], { type: image.type });
      const newFile = new File([blob], image.name, { type: image.type });
    
      const formData = new FormData()
      formData.append('file', newFile as any)
      formData.append('upload_preset', 'vuminhhung904')
      const response : any = await axios.post('https://api.cloudinary.com/v1_1/dqouzpjiz/upload', formData);
      console.log(response.secure_url)
    }

  }
  

  return (
    <>
     
      <Upload
        
        multiple={true}
        listType="picture-card"
        onPreview={handlePreview}
        onChange={handleChange}
        beforeUpload={(file) => customBeforeUpload(file)}
       
      >
       {uploadButton}
      </Upload>
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(''),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}