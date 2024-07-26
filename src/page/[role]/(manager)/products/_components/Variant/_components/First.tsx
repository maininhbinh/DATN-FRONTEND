import { Input, Upload , message} from "antd";
import { FileImageOutlined, DeleteOutlined } from '@ant-design/icons';
import getRandomNumber from "@/utils/randomNumber";
import type { GetProp, UploadProps } from 'antd';
import { variantNameRequired } from "@/utils/pattern";
import _ from 'lodash';
import { useCallback } from "react";
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function FirstHandle({first,setFirst, checkFirst, setCheckFirst} : any){
  const [messageApi, contextHolder] = message.useMessage();
  
  const setErrorFirst = (message : string, id : number) => {
    setFirst((prev : any) => {
      return {
        ...prev,
        value : prev.value.map((item :any) => {
          if(item.id == id){
            return {
              ...item,
              error : message
            }
          }else {
            return item;
          }
        })
      }
    })
  }
  const debouncedSave = useCallback(
    _.debounce((value : string, id : number) => {
      if(!variantNameRequired.test(value)){
        //messageApi.error("Tên biến thể không để trống")
        setErrorFirst('Tên biến thể không để trống', id);
        return true;
      }else if(value.length >= 20){
        //messageApi.error("Tên biến thể quá dài");
        setErrorFirst('Tên biến thể quá dài', id);
        return true;
      }

      
      if(first.value.filter((obj : any) => obj[first.name] == value).length >= 1 ){
        setErrorFirst('Tên biến thể đã tồn tại', id);
        //messageApi.error("Tên biến thể đã tồn tại");
        return false;
      }

       setFirst((prev : any) => {
          return {
            ...prev,
            value : prev.value.map((item : any) => {
               
                if(item.id == id){
                  if(item.error){
                    delete item.error;
                  }
                  return {
                     ...item,
                     
                     [first.name] : value,
                  }
                }else {
                  return item
                }
                
            })
          }
       })
       if(checkFirst == id){
          const numberId = getRandomNumber();
          setFirst((prev : any) => {
            return {
              ...prev,
              value : [...prev.value, {  
                id : numberId, 
                image : null,
                [first.name] : '',
  
               }
              ]
            }
          })
          setCheckFirst(numberId);
       }

    }, 800),
    [first]
  );


   const onDelete = (id : number) => {
      
    setFirst((prev : any) => {
       return {
           ...prev,
           value : prev.value.filter((item : any) => item.id != id)
       }
    })
 }

 const handleChangeFile: any = (dataFile: any, id: any) => {
   setFirst((prev : any) => {
      return {
        ...prev,
        value : prev.value.map((item : any) => {
            if(item.id == id){
              return {
                 ...item,
                 image : dataFile
              }
            }else {
              return item
            }
            
        })
      }
   })
   return false;
  
 };

 const onRemoveImage = (id: any) => {
  
   setFirst((prev : any) => {
      return {
        ...prev,
        value : prev.value.map((item : any) => {
            if(item.id == id){
              return {
                 ...item,
                 image : null
              }
            }else {
              return item
            }
            
        })
      }
   })
 };
 
   
     return ( <>
     {contextHolder}
     {first.value.map((item : any) => (<div key={item.id} className=" flex gap-[6px] items-center ">
     <div  className="w-[70px] h-[70px] upload-custom">
        <Upload
             
             
             listType="picture-card"
             className=" w-full "
             beforeUpload={(files) => handleChangeFile(files, item.id)}
             onRemove={() => onRemoveImage(item.id)}
         >
            {item.image ? null :  <button style={{ border: 0, background: 'none' }} type="button">
                <FileImageOutlined />
             </button>}
            
         </Upload>
     </div>

     <div className="w-full" >
         <Input autoFocus={true} status={item?.error && "error"} onChange={(e) => debouncedSave(e.target.value, item.id)} placeholder="Nhập" />
        
         {item?.error &&  <span className=" text-red-500 text-[11px]">* {item?.error}</span>}
     </div>

     <div className="w-[50px] cursor-pointer">
        {item.id != checkFirst && <DeleteOutlined onClick={()=> onDelete(item.id)} style={{color : 'red'}}/>}  
     </div>
 </div>))}
      
     </>)
}