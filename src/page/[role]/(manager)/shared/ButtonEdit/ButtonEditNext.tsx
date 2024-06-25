import React, { Children, useEffect, useRef, useState } from 'react'
import {EditOutlined, PlusOutlined} from '@ant-design/icons'
import { Button, Flex, Form, Input, Tooltip } from 'antd';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import getRandomNumber from '@/utils/randomNumber';
import { useParams } from 'react-router-dom';
import { useCreateDetailMutation, useCreateAttributeMutation,useUpdateDetailMutation, useUpdateAttributeMutation, useDeleteAttributeMutation } from '../../category/CategoryEndpoints';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import { string } from 'prop-types';
interface ButtonEditProps {
    refetch : any;
    setIsShowInputAddDetail : any
    isShowInputAddDetail : any;
    addDetail : number;
    setAddDetail : any;
    item : any;
    keyValue: string;
    handleRemoveDetail: (name: any, detailId : number) => void;
    detail: Array<object>;
    setDetail: React.Dispatch<React.SetStateAction<any>>
    validateNoDuplicate: (any)=>void;
    validateOption: (any)=>void
  }

export default function ButtonEditNext({refetch, setIsShowInputAddDetail, isShowInputAddDetail, addDetail,setAddDetail, item, keyValue, detail, setDetail, handleRemoveDetail, validateNoDuplicate, validateOption}:ButtonEditProps) {
    const [createDetail, {isLoading : isLoadingCreateDetail}] = useCreateDetailMutation();
    
    const [createAttribute, {isLoading : isLoadingCreateAttribute}] = useCreateAttributeMutation();
    const [deleteAttribute, {isLoading : isLoadingDeleteAttribute}] = useDeleteAttributeMutation();
    const [updateAttribute, {isLoading : isLoadingUpdateAttribute}] = useUpdateAttributeMutation();
    const [updateDetail, {isLoading : isLoadingUpdateDetail}] = useUpdateDetailMutation();
    const params = useParams();
    const [edit, setEdit] = useState(false);
    const [value, setValue] = useState('');
    const inputRef = useRef<null>(null);
    const [inputField, setinputField] = useState<number>(1);
    const [error, setError] = useState({});
    const [no, setNo] = useState(false);
    const [editSecond, setEditSecond] = useState<number>(0);
   
    const [lastId, setLastId] = useState<any>(0)
   
    

    const handelChangeParent = (value) => {    
        setValue(value)
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
              return {
                ...field,
                name: value
              };
            }
            return field;
        });
        setDetail(newFields)
    }
  
    const handelRemoveOption = async (secondId : any, firstId : any, attributeId : number) => {   
       
       
        try {
            await deleteAttribute(attributeId).unwrap();
            popupSuccess(`Delete attribute success`);
            setDetail((prev : any) => {
                return prev.map((item : any) => {
                    if(item.id == firstId){
                     
                       return {
                        ...item,
                        attribute : item.attribute.filter((i : any) => i.id != secondId)
                       }
                    }else {
                        return item;
                    }
                    
                })
            })   
            refetch();
        } catch (error) {
            popupError(`Delete attribute error`);
            return false;
        }
        
      

           
    }

    const handelAddField = (value : any, firstId : any, secondId : any) => {        
       
        setDetail((prev : any) => {
          
            return prev.map((item : any) => {
                if(item.id == firstId){
             
                   return {
                    ...item,
                    attribute : item.attribute.map((item1 : any) => {
                        if(item1.id == secondId){
                            return {
                                ...item1,
                                value : value
                            }
                        }else {
                            return item1;
                        }
                    })
                   }
                }else {
                    return item;
                }
                
            })
        })
    }
    const onBrulFirst =  async (value : any, id : any, detailId : number)  => {
        
        if(!value) {
            popupError('Nội dung không được để trống');
            return false;
        }
        if(detailId){
            const payload = {
                name : value,
                id : detailId,
                category_id : params.id
            }
           
            try {
                await updateDetail(payload).unwrap();
                refetch();
                popupSuccess(`Update detail "${value}" success`);
            } catch (error) {
                console.log(error)
                popupError(`Update detail "${value}" error`);
                return false;
            }
          
           
            setEdit(false)
            if(!value){
                return true;
            }
            setDetail((prev : any) => {
                return prev.map((item : any) => {
                    if(item.id == id){
                        return {
                            ...item,
                            name : value
                        }
                    }else {
                        return item;
                    }
                })
            })
        } else {
            
            const payload = {
                category_id : String(params.id),
                name : value
            }
            try {
                const response : any = await createDetail(payload).unwrap();
               
                setDetail((prev : any) => {
                    return prev.map((item : any) => {
                        if(isShowInputAddDetail.detailId == item.id){
                            return {
                               ...item,
                               detailId : response.id
                            }
                        }else {
                            return item;
                        }
                    })
                })
                setEdit(false)
                setIsShowInputAddDetail((prev : any) => {
                    return {
                        ...prev,
                        detailId : 0
                    }
                })

               


                popupSuccess(`Create detail "${value}" success`);
                refetch();
            } catch (error) {
                popupError(`Create detail "${value}" error`);
            }
        }
    
    }

    const onSetEdit = (id : number) => {
       
        setEditSecond(id);
    }
    const onBlurSecond = async (value : string, attributeId: number, detailID: any  ) => {
        //console.log(attributeId, detailID); return true;
        if(!value) {
            popupError('Nội dung không được để trống');
            return false;
        }
        if(attributeId){
            try {
                const payload = {
                    name : value,
                    id : attributeId
                }
                await updateAttribute(payload).unwrap();
                popupSuccess(`Update attribute name "${value}" success`);
                refetch();
            } catch (error) {
                popupError(`Update attribute name "${value}" success`);
            }
            setEditSecond(0);
        }else {
            try {
                const payload = {
                    detail_id : String(detailID),
                    name : value
                }
                const response : any = await createAttribute(payload).unwrap();
                setDetail((prev : any) => {
                    return prev.map((item: any) => {
                        if(item.detailId == detailID){
                            return {
                                ...item,
                                attribute : item.attribute.map((item1 : any) => {
                                    if(item1.attributeId == isShowInputAddDetail.attributeId){
                                        return {
                                            ...item1,
                                            attributeId : response.id
                                        }
                                    }else {
                                        return item1;
                                    }
                                })
                            }
                        }else {
                            return item;
                        }
                    })
                } )
                setEdit(false)
                setIsShowInputAddDetail((prev : any) => {
                    return {
                        ...prev,
                        attributeId : 0
                    }
                })
                refetch();
                popupSuccess(`Create attribute "${value}" success`);

            } catch (error) {
                popupError(`Create attribute "${value}" error`);
            }
        }
      
    }
    const onAddDetail =  async (value : string, detailId : number, firstId : number) => {
        if(!value) {
            popupError('Nội dung không được để trống');
            return false;
        }
        const payload = {
            detail_id : String(detailId),
            name : value
        }

        try {
            const response = await createAttribute(payload).unwrap();
            setAddDetail(0);
            setDetail((prev : any) => {
                return detail.map((item : any) => {
                    if(item.id == firstId){
                        return {
                            ...item,
                            attribute : [
                                ...item.attribute,
                                {
                                    id : getRandomNumber(),
                                    attributeId : response.id,
                                    value : value
                                }
    
                            ]
                        }
                    } else {
                        return item;
                    }
                })
            })
            refetch();
            popupSuccess(`Create attribute  "${value}" success`);
        } catch (error) {
            popupError(`Create attribute  "${value}" error`);
            return false;
        }

      
    }
  return (
    <Flex vertical gap={20} className='border border-1 rounded-md overflow-hidden relative p-8 px-10' style={{boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }}>

        <CloseRoundedIcon className=' absolute right-1 top-1 cursor-pointer' onClick={()=>{handleRemoveDetail(keyValue, item.detailId)}}/>

        <div>
            <>
                <div className={`relative inline pr-5 ${edit || item.id == isShowInputAddDetail.detailId  ? 'hidden' : ''}`} >
                    <EditOutlined onClick={()=>{
                        setEdit(true);
                        setTimeout(() => {
                            if (inputRef.current) {
                            inputRef.current.focus();
                            }
                        }, 0);
                        }} 
                        className=' absolute top-0 right-0 hover:cursor-pointer'
                    />
                    <h2 className=' font-bold  inline-block'>{item.name}</h2>
                </div>
                <Form.Item
                   
                    name={`input-${keyValue}`}
                 
                    className={`m-0 ${!edit && item.id != isShowInputAddDetail.detailId ? 'hidden' : ''}`}
                >
                    <Input autoFocus={true}  disabled={isLoadingUpdateDetail || isLoadingCreateDetail} defaultValue={item.name}  placeholder="Nhập vào" ref={inputRef} onBlur={(e)=> onBrulFirst(e.target.value, item.id, item.detailId)} onPressEnter={(e)=>{e.target.value && !no && setEdit(false)}} onChange={(e)=>handelChangeParent(e.target.value)}/>
                </Form.Item>
            </>

        </div>
        <hr/>
        <Flex className='' wrap gap={30}>
            {detail.find((item : any, i : number)=>item.id == keyValue).attribute.map((value : any, index : number) => (
                <Flex  key={index} justify='center' align='center' gap={10} >


              


                {editSecond == value.id || value.id == isShowInputAddDetail.attributeId  ? <Form.Item 
                    name={`attr-value-${value.id}`}
                    className='m-0' 
                    validateStatus={error[value.id] ? 'error' : ''}
                    help={<p className=' absolute'>{error[value.id]}</p>}
                    
                >
                        <Input disabled={isLoadingUpdateAttribute} autoFocus={value.id == isShowInputAddDetail.attributeId ? false : true} defaultValue={value.value} onBlur={(e) => onBlurSecond(e.target.value, value.attributeId, item.detailId)}  placeholder='Nhập' onChange={(e)=>handelAddField(e.target.value, item.id, value.id)}/>
                    </Form.Item> :  <div className={`flex flex-row-reverse items-center gap-[6px]`} >
                    <EditOutlined onClick={()=>{ onSetEdit(value.id)}} 
                        className=' hover:cursor-pointer'
                    />
                    <h2 className=' font-bold  inline-block'>{value.value}</h2>
                </div> }
                <DeleteForeverRoundedIcon  className={`${isLoadingDeleteAttribute ? 'cursor-not-allowed' : 'cursor-pointer'} z-10 `} onClick={(e)=>{handelRemoveOption(value.id, item.id, value.attributeId)}} style={{color: 'red'}}/>
                </Flex>
            ))}

            <div className='custom-add-ant'>
                {item.id != addDetail ? <Tooltip title="add">
                    <Button onClick={() => setAddDetail(item.id)} className='' type="primary" shape="circle" icon={<PlusOutlined />} />
                </Tooltip> : <Input disabled={isLoadingCreateAttribute} autoFocus={true} onBlur={(e) => onAddDetail(e.target.value, item.detailId, item.id)} placeholder="Nhập vào"  />}
            </div>
        </Flex>
    </Flex>
  )
}
