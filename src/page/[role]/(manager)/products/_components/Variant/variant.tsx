import React, { useRef, useState, useCallback } from 'react';
import { EditOutlined, CloudUploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd';
import { Flex } from 'antd';
import { FormInstance } from 'antd/es/form';
import debounce from 'lodash.debounce'; 
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface Attribute {
    id: string,
    value: string,
    image: File | null,
    url: string | null
}

interface Variant {
    id: string,
    name: string,
    attribute: Attribute[]
}

interface ButtonEditProps {
    keyValue: string;
    handleRemoveDetail: (name: any) => void;
    detail: Array<Variant>;
    setDetail: React.Dispatch<React.SetStateAction<any>>;
    show: number;
    form: FormInstance;
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export default function Variant({ keyValue, detail, show, setDetail, handleRemoveDetail, form }: ButtonEditProps) {
    const [edit, setEdit] = useState(true);
    const [value, setValue] = useState('');
    const inputRef = useRef<null>(null);
    const [inputField, setInputField] = useState<number>(1);
    const [error, setError] = useState({});
    const [no, setNo] = useState<boolean>(false);

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });

    const validateNoDuplicate = (fieldName: string) => (_, value) => {
        const fields = form.getFieldsValue();
        const inputValues = Object.keys(fields)
            .filter(key => key.startsWith(fieldName))
            .map(key => fields[key]);

        const duplicateValues = inputValues.filter((item) => item === value && item);

        if (duplicateValues.length > 1) {
            setNo(true);
            return Promise.reject(`không được trùng với các cột khác!`);
        }
        setNo(false);
        return Promise.resolve();
    };

    const validateOption = (fieldName: string, field: string) => (_, value) => {
        const fields = form.getFieldsValue();
        const inputValues = Object.keys(fields)
            .filter(key => key.startsWith(fieldName))
            .map(key => fields[key]);

        const duplicateValues = inputValues.filter((item) => item === value && item);

        if (duplicateValues.length > 1) {
            setError((prevErrors) => ({
                ...prevErrors,
                [field]: 'không được trùng',
            }));
            return Promise.reject(`không được trùng với các cột khác!`);
        }
        return Promise.resolve();
    };

    const handleChangeParentDebounced = useCallback(debounce((parent) => {
        setValue(parent);
        const newFields = detail.map(field => {
            if (field.id === keyValue) {
                return {
                    ...field,
                    name: parent
                };
            }
            return field;
        });
        setDetail(newFields);
    }, 700), [detail, keyValue]);

    const handleChangeParent = (e) => {
        handleChangeParentDebounced(e.target.value);
    };

    const handleRemoveOption = (id) => {
        if (inputField > 1) {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: field.attribute.filter((item) => item.id !== id)
                    };
                }
                return field;
            });
            setDetail(newFields);
            setInputField(inputField - 1);
        }
    };

    const handleAddFieldDebounced = useCallback(debounce((value, index, id) => {
        if (index === inputField) {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: [
                            ...field.attribute.map((attr) => {
                                if (attr.id === id) {
                                    return {
                                        ...attr,
                                        value: value
                                    };
                                }
                                return attr;
                            }),
                            {
                                id: Date.now() + '',
                                value: ''
                            }
                        ]
                    };
                }
                return field;
            });
            setDetail(newFields);
            setInputField(inputField + 1);
        } else {
            const newFields = detail.map(field => {
                if (field.id === keyValue) {
                    return {
                        ...field,
                        attribute: field.attribute.map((attr) => {
                            if (attr.id === id) {
                                return {
                                    ...attr,
                                    value: value
                                };
                            }
                            return attr;
                        })
                    };
                }
                return field;
            });
            setDetail(newFields);
        }
    }, 1500), [detail, keyValue, inputField]);

    const handleAddField = (e, index, id) => {
        handleAddFieldDebounced(e.target.value, index, id);
    };

    const selectedImg = async (e, id) => {
        const types = [
            'jpeg',
            'png',
            'jpg',
            'gif',
        ];

        const fileSelected = e.target.files[0];

        const size = fileSelected.size;
        const type = types.includes(fileSelected.type.replace('image/', ''));

        const newFile = await getBase64(fileSelected);

        if (size <= 1048576 && type) {
            const newDetail = detail.map((item) => {
                return {
                    ...item,
                    attribute: item.attribute.map((attr) => {
                        if (attr.id === id) {
                            return {
                                ...attr,
                                image: newFile,
                                url: URL.createObjectURL(fileSelected)
                            };
                        }
                        return attr;
                    })
                };
            });
            setDetail(newDetail);
        } else {
            e.target.value = '';
        }
    };

    const handleRemoveImage = (id) => {
        const newDetail = detail.map((item) => {
            return {
                ...item,
                attribute: item.attribute.map((attr) => {
                    if (attr.id === id) {
                        return {
                            ...attr,
                            image: null,
                            url: null
                        };
                    }
                    return attr;
                })
            };
        });
        setDetail(newDetail);
    };

    return (
        <Flex vertical gap={30} className='sm:rounded-lg overflow-hidden relative p-8 px-10 bg-[#f6f6f6]'>
            <CloseRoundedIcon className=' absolute right-1 top-1 cursor-pointer' onClick={() => { handleRemoveDetail(keyValue) }} />

            <div>
                <>
                    <div className={`relative inline pr-5 ${edit ? 'hidden' : ''}`} >
                        <EditOutlined onClick={() => {
                            setEdit(true);
                            setTimeout(() => {
                                if (inputRef.current) {
                                    inputRef.current.focus();
                                }
                            }, 0);
                        }} className=' absolute top-0 right-0 hover:cursor-pointer' />
                        <h2 className=' font-bold  inline-block'>{value}</h2>
                    </div>
                    <Form.Item
                        name={`input-${keyValue}`}
                        rules={[
                            {
                                required: true,
                                message: 'Không được để trống',
                            },
                            {
                                validator: validateNoDuplicate(`input-`)
                            },
                            { max: 20, message: 'Tên không vượt quá 20 ký tự' },
                        ]}
                        className={`m-0 ${!edit ? 'hidden' : ''}`}
                    >
                        <Input placeholder="Nhập vào" ref={inputRef} onBlur={(e) => { e.target.value && !no && setEdit(false) }} onPressEnter={(e) => { e.target.value && !no && setEdit(false) }} onChange={handleChangeParent} />
                    </Form.Item>
                </>
            </div>
            <hr />
            <Flex className='' wrap gap={25}>
                {detail.find((item, i) => item.id === keyValue).attribute.map((value, index) => (
                    index < 5
                        ? <Flex className='relative w-[30%]' key={index} justify='center' align='center' gap={10}>
                            {
                                show === 0
                                    ? <div style={{ height: '50px', width: '50px', overflow: 'hidden', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem' }} className='border-none rounded-[12px] ' >
                                        {
                                            value.url
                                                ? <div style={{ height: '100%', maxWidth: '100%' }} className='relative group'>
                                                    <img src={value.url} alt="" className='object-cover h-[100%] object-center' style={{ width: '100%' }} />
                                                    <div className=" absolute inset-0 z-1 opacity-0 group-hover:opacity-100 duration-1000" style={{ backgroundColor: 'rgb(0, 0, 0, 0.5)' }}></div>
                                                    <DeleteOutlined onClick={() => handleRemoveImage(value.id)} className=" duration-1000 opacity-0 group-hover:opacity-100 absolute left-[50%] top-[50%]" style={{ transform: 'translate(-50%, -50%)', zIndex: 999, fontSize: "20px", color: 'white' }} />
                                                </div>
                                                : <Flex className='border-dashed border-2 relative hover:bg-gray-100 bg-white hover:border-solid hover:border' vertical gap={10} justify='center' align='center' style={{ width: '100%', height: "100%", borderRadius: '12px' }}>
                                                    <Flex vertical gap={10} style={{ width: '100%' }}>
                                                        <Flex vertical align='center' justify='center'>
                                                            <CloudUploadOutlined style={{ fontSize: '10px', color: 'gray' }} className='' />
                                                        </Flex>
                                                    </Flex>
                                                    <input type="file" accept="image/*" name="image" id="image" multiple className='opacity-0 absolute inset-0'
                                                        onChange={(e) => selectedImg(e, value.id)}
                                                    />
                                                </Flex>
                                        }
                                    </div>
                                    : ''
                            }
                            <Form.Item
                                name={`attr-value-${value.id}`}
                                className='m-0 relative flex-[3]'
                                validateStatus={error[value.id] ? 'error' : ''}
                                help={<p className=' absolute'>{error[value.id]}</p>}
                                rules={[
                                    {
                                        required: true,
                                        validator: (_, name) => {
                                            if (index === 0 && !name) {
                                                setError((prevErrors) => ({
                                                    ...prevErrors,
                                                    [value.id]: 'Không được để trống',
                                                }));
                                                return Promise.reject();
                                            }

                                            if (index + 1 < inputField && !name) {
                                                setError((prevErrors) => ({
                                                    ...prevErrors,
                                                    [value.id]: 'Không được để trống',
                                                }));
                                                return Promise.reject();
                                            }

                                            setError((prevErrors) => {
                                                const newErrors = { ...prevErrors };
                                                delete newErrors[value.id];
                                                return newErrors;
                                            });
                                            return Promise.resolve();
                                        }
                                    },
                                    {
                                        validator: validateOption('attr-value-', value.id)
                                    }
                                ]}
                            >
                                <Input placeholder='Nhập' onChange={(e) => handleAddField(e, index + 1, value.id)} />
                            </Form.Item>
                            {
                                index < inputField - 1
                                    ? (
                                        <DeleteForeverRoundedIcon className='cursor-pointer absolute right-[2px]' onClick={(e) => { handleRemoveOption(value.id) }} style={{ color: 'red' }} />
                                    )
                                    : ''
                            }
                        </Flex>
                        : ''
                ))}
            </Flex>
        </Flex>
    );
}

