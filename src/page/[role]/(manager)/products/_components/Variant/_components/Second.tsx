import { Input } from "antd";
import {  DeleteOutlined } from '@ant-design/icons';
import getRandomNumber from "@/utils/randomNumber";
import _ from 'lodash';
import { useCallback } from "react";
import { message} from "antd";
export default function SecondHandle({second, setSecond, checkFirst2, setCheckFirst2} : any) {
   console.log(second)
  const [messageApi, contextHolder] = message.useMessage();
  const setErrorSecond = (message : string, id : number) => {
    setSecond((prev : any) => {
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
    //  console.log(value,second.value )
      if(!value){
        //messageApi.error("Giá trị biến thể không được để trống");
        setErrorSecond("Giá trị biến thể không được để trống", id);
        return false;
      }
      if(second.value.some((obj : any) => obj[second.name] == value)){
        setErrorSecond("Giá trị biến thể đã tồn tại", id);
       // messageApi.error("Giá trị biến thể đã tồn tại")
         return false;
      }
      setSecond((prev : any) => {
        return {
          ...prev,
          value : prev.value.map((item : any) => {
              if(item.id == id){
                if(item.error){
                  delete item.error;
                }
                return {
                   ...item,
                   [second.name] : value
                }
              }else {
                return item
              }
              
          })
        }
     })
     if(checkFirst2 == id){
        const numberId = getRandomNumber();
        setSecond((prev : any) => {
          return {
            ...prev,
            value : [...prev.value, { id : numberId,[second.name] : ''}]
          }
        })
        setCheckFirst2(numberId);
     }

    }, 800),
    [second]
  );


      const onDelete = (id : number) => {
         setSecond((prev : any) => {
            return {
                ...prev,
                value : prev.value.filter((item : any) => item.id != id)
            }
         })
      }
  
    return (
        <>
          {contextHolder}
          {second.value.map((item : any) => (

            <div key={item.id} className=" flex gap-[6px] items-center ">
                             
            <div className="w-full">
                <Input  autoFocus={true} status={item?.error && "error"}   onChange={(e) => debouncedSave(e.target.value, item.id)}  placeholder="Nhập" />
                {item?.error &&  <span className=" text-red-500 text-[11px]">* {item?.error}</span>}
            </div>
            <div className="w-[50px] cursor-pointer" >
               {item.id != checkFirst2 && <DeleteOutlined onClick={() => onDelete(item.id)} style={{color : 'red'}}/>}  
            </div>
            </div>
          ))}
        
        </>
 
  )
}