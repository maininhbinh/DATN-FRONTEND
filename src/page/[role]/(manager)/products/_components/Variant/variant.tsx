
import { Badge, Button, Card, Form, Input, Select, Tag, Typography, message} from 'antd'
import { FileImageOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { useEffect, useRef, useState } from 'react'
import FirstHandle from './_components/First'
import getRandomNumber from '@/utils/randomNumber'
import SecondHandle from './_components/Second'
import { variantNamePattern } from '@/utils/pattern'
const { Paragraph } = Typography;
export default function Variant({
  formatVariant,
  setFormatVariant
} : any) {
  const [messageApi, contextHolder] = message.useMessage();
 
  
  const [checkFirst, setCheckFirst] = useState<number>(0)
 
  const [first, setFirst] = useState<any>(false)

  const [checkFirst2, setCheckFirst2] = useState<number>(0)
  const [second, setSecond] = useState<any>(false)


  const [showAddSecond, setShowAddSecond] = useState<boolean>(false)

  

  const removeSecond = () => {
    setCheckFirst2(0)
    setSecond(false)
    
    setShowAddSecond(false)
  }

  useEffect(() => {
    
    
    if (first && second && second.value.length >= 2) {
      let newArr: any = [];
    
      const firstArr = first.value
      const secondArr = second.value
      
      for (const item of firstArr) {
        if (item && item[first.name]) {
         
          for (const item1 of secondArr) {
    
            if (item1 && item1[second.name]) {
             
              newArr = [
                ...newArr,
                {
                  image: item.image,
                  price: 0,
                  quantity: 0,
                  SKU: '',
                  id: getRandomNumber(),
                  variant: {
                    [first.name]: item[first.name],
                    [second.name]: item1[second.name]
                  }
                }
              ]
              
            }
          }
        }
      }

     // 
      setFormatVariant(newArr)
    } else if (first) {
  
      setFormatVariant(() => {
        return first.value
          .map((item: any) => {
            if (item[first.name]) {
              return {
                image: item.image,
                price: 0,
                quantity: 0,
                SKU: '',
                id: getRandomNumber(),
                variant: {
                  [first.name]: item[first.name]
                }
              }
            } else {
              return null
            }
          })
          .filter((item: any) => item !== null)
      })
    }
  }, [first, second])




  function handleClickOutside(value: (string[])) {
    if (value[0]) {
      if(!variantNamePattern.test(value[0])){
        messageApi.error("Tên nhóm phân loại 1 không hợp lệ")
        return true;
      }
      const numberId = getRandomNumber()
      setFirst({
        name: value[0],
        value: [
          {
            image: null,
            id: numberId,
            [value[0]]: ''
          }
        ]
      })

      setCheckFirst(numberId)
    }
  }

 

  function handleClickOutside2(value: (string)[]) {
    if (value[0]) {
      if(!variantNamePattern.test(value[0])){
        messageApi.error("Tên nhóm phân loại 2 không hợp lệ")
        return false;
      }

      if(value[0] == first.name){
        messageApi.error("Tên nhóm phân loại 2 trùng tên phân loại 1")
        return false;
      }
      const numberId = getRandomNumber()
      setSecond({
        name: value[0],
        value: [
          {
            id: numberId,
            [value[0]]: ''
          }
        ]
      })

      setCheckFirst2(numberId)
    }
  }

  const getImagePreview = (file: File): string => {
    const previewUrl = URL.createObjectURL(file);

    return previewUrl;
  };
  const onChangeVariantInput = (id : number, type : any, value : string) => {
     //console.log(id, type, value)
     setFormatVariant((prev : any) => {
       return prev.map((item : any) => {
          if(item.id == id){
            item[type] = value;
            return item;
          }else {
            return item;
          }
       })
     })

  }
  const handleGetInput = (iFirst : any, iSecond : any, type : any) => {
     if(iSecond != null){
       for (const i of formatVariant) {
          if( i.variant[first.name] == iFirst && i.variant[second.name] == iSecond){
            return <Input type={type == 'quantity' || type == 'price' ? "number" : "text"} onChange={(e) => onChangeVariantInput(i.id, type, e.target.value)} key={i.id} placeholder='0' />
          }
       }
     }else {
      for (const i of formatVariant) {
        if( i.variant[first.name] == iFirst ){
          return <Input type={type == 'quantity' || type == 'price' ? "number" : "text"} onChange={(e) => onChangeVariantInput(i.id, type, e.target.value)} key={i.id} placeholder='0' />
        }
      }
     }
       
  }
 const setEditableTab = (value : string, type : number) => {
  if(!variantNamePattern.test(value)){
    messageApi.error("Tên nhóm phân loại không hợp lệ")
    return true;
  }
  if((type == 1 && second.name == value) || (type == 2 && first.name == value)){
    messageApi.error("Tên 2 nhóm phân loại không được trùng nhau")
    return true;
  }
   if(type == 1){

    setFirst((prev : any) => {
      return {
        name : value,
        value : prev.value.map((item : any) => {
          return {
            id : item.id,
            image : item.image,
            [value] : item[first.name]
          }
        }),
      }
    })

   }
   if(type == 2){
   

    setSecond((prev : any) => {
      return {
        value : prev.value.map((item : any) => {
          return {
            id : item.id,
            [value] : item[second.name]
          }
        }),
        name : value
      }
    })
   }
 }
 

  return (
    <div className='app__variant'>

       {contextHolder}
      <Badge status='processing' text='Phân loại hàng' />
      <Card size='small' title={first && first.name ? <Paragraph className='w-[120px] !z-[9999]' editable={{ onChange: (e) => setEditableTab(e, 1) }}>{first.name}</Paragraph> : false} className=' w-full my-3' style={{ background: '#F6F6F6' }}>
        {!first && (
           <div  className='w-1/2 mb-4'>
          <Select
          onChange={(e) => {handleClickOutside(e)}}
          className='w-[50%]'
          maxCount={1}
           mode='tags'
           placeholder='Nhập tên biến thể 1'
           options={[
             { value: 'Màu xanh', label: 'Màu sắc' },
           ]}
         />
            
          </div>

       
        )}
        <div className=' grid grid-cols-2 gap-4'>
          {first && (
            <FirstHandle first={first} setFirst={setFirst} checkFirst={checkFirst} setCheckFirst={setCheckFirst} />
          )}
        </div>
      </Card>

      {!showAddSecond && first && (
        <div className='my-5 bg-[#F6F6F6] p-3 rounded-[4px]'>
          <Button
            onClick={() => setShowAddSecond(true)}
            icon={<PlusOutlined />}
            type='dashed'
            className='w-[240px]'
            danger
          >
            Thêm nhóm phân loại 2
          </Button>
        </div>
      )}

      {showAddSecond && (
        <Card size='small' title={second && second.name ? <Paragraph className='w-[120px] !z-[9999]' editable={{ onChange: (e) => setEditableTab(e, 2) }}>{second.name}</Paragraph> : false} className=' w-full my-3' style={{ background: '#F6F6F6' }} >
          <div
            onClick={() => removeSecond()}
            className=' absolute top-[-5px] right-[-5px] text-[20px] text-white bg-black rounded-full w-[20px] h-[20px] flex items-center justify-center cursor-pointer'
          >
            {' '}
            &times;{' '}
          </div>
          <div className=' grid grid-cols-2 gap-4'>
            {!second && (
              <div className=' flex gap-[6px] items-center '>
                <div  className='w-full'>
                
                  <Select
                    onChange={(e) => {handleClickOutside2(e)}}
                    className='w-[50%]'
                    maxCount={1}
                    mode='tags'
                    placeholder='Nhập tên biến thể 2'
                    options={[
                      { value: 'Ram', label: 'Ram' },
                      { value: 'Rom', label: 'Bộ nhớ trong' },
                      { value: 'mAh', label: 'Dung lượng pin' },
                    ]}
                  />
                </div>

                <div className='w-[50px] cursor-pointer'></div>
              </div>
            )}

            {second && (
              <SecondHandle
                second={second}
                setSecond={setSecond}
                checkFirst2={checkFirst2}
                setCheckFirst2={setCheckFirst2}
              />
            )}
          </div>
        </Card>
      )}


     
      <Badge status='processing' text='Danh sách phân loại hàng' />

      <div className='bg-[#F6F6F6] p-3 rounded-[4px] my-3'>
        <table className='  w-full'>
          <thead>
            <tr>
              {first && <th className='flex justify-start  w-[120px]'>
              
              <div className='p-3 '>
                <Badge status='processing' /> {first.name}
              </div>
            </th>}
              {second && <th className=''>
                <div className='p-3 flex justify-start'> {second.name} </div>
              </th>}
              <th>
                
                <div className='p-3 flex justify-start w-full'>Giá</div>
              </th>
              <th>
               
                <div className='p-3 flex justify-start w-full'>Số lượng</div>
              </th>
              <th>
           
                <div className='p-3 flex justify-start w-full'>SKU</div>
              </th>
            </tr>
          </thead>
          <tbody className=''>
            {first && first.value.map((item : any) => {
                if(item[first.name] || item.image){
                 
                    return (<tr key={item.id} >
                        <td className='p-3 text-center    !w-[90px]'>
                        <div className="relative w-full">
                        <div className={`bg-red-500 text-white rounded-[5px] text-[12px] px-2   top-[-10px] right-[0px] !z-[9999] w-fit ${item.image ? ' absolute ' : ' flex justify-center'}`} color="red">{item[first.name]}</div>
                          {item.image && <div className=' relative '><img  src={getImagePreview(item.image)} alt="" className=" w-[100px] object-cover" /></div>}
                        </div>
                        </td>
          
                       {second  &&    <td>
                          <div className=' flex flex-col gap-3 w-[90px]  h-[100%] '>
                             {
                                second?.value?.map((i : any, k : any) => {
                                    if(i[second.name]){
                                        return (<span key={k} className='p-2'>{i[second.name]}</span>)
                                    }else {
                                        return "";
                                    }
                                })
                             }
                            
                            
                          </div>
                        </td>}



                        <td>
                          <div className='p-3 flex flex-col gap-3 w-full'>
                             {second && second.value.length > 1 ? second.value.map((item1 : any) => {
                                if(item1[second.name]){
                                  return handleGetInput(item[first.name], item1[second.name], 'price');
                                }
                             }) : handleGetInput(item[first.name], null, 'price')}
                          </div>
                        </td>
                        <td>
                          <div className='p-3 flex flex-col gap-3 w-full'>
                          {second && second.value.length > 1 ? second.value.map((item1 : any) => {
                                if(item1[second.name]){
                                  return handleGetInput(item[first.name], item1[second.name], 'quantity');
                                }
                             }) : handleGetInput(item[first.name], null, 'quantity')}
                          </div>
                        </td>
          
                        <td>
                          <div className='p-3 flex flex-col gap-3 w-full'>
                           {second && second.value.length > 1 ? second.value.map((item1 : any) => {
                                if(item1[second.name]){
                                  return handleGetInput(item[first.name], item1[second.name], 'SKU');
                                }
                             }) : handleGetInput(item[first.name], null, 'SKU')}
                          </div>
                        </td>
                      </tr>)
                }else {
                    return "";
                }
            })}

           
          </tbody>
        </table>

      
      </div>



    </div>
  )
}