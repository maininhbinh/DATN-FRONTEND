import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { changeStatus, getAllCategory, searchCategories } from '@/app/slices/categorySlice'
import { ICategory } from '@/common/types/category.interface'
import type { TableProps } from 'antd'
import { Button, Flex, Input, Popconfirm, Space, Table, Tag, Typography, message } from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useDebounce from '@/hooks/useDebounce'
import '../../styles/category.css';
import { useGetCategoriesQuery } from '../CategoryEndpoints'
import { useDeleteCategoryMutation } from '../CategoryEndpoints'
import axios from 'axios'
import ErrorLoad from '../../components/util/ErrorLoad'
export default function ListCategory() {
  
  const [searchValue, setSearchValue] = useState('')
  const debouncedValue = useDebounce(searchValue, 600)
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const {data : categories , isLoading, isError} = useGetCategoriesQuery({});
  const [deleteCategory, { isLoading: loadingDeleteCategory}] = useDeleteCategoryMutation();

  const handlerDistableCategory = async (value: ICategory) => {
  
    try {
     await deleteCategory(value?.id).unwrap();
     
      message.success( 'Vô hiệu hoá danh mục thành công!')
    } catch (error : any) {
      message.error( error.data ? error.data.message :'Vô hiệu hoá danh mục thất bại!')
    }


  }

  const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue)
    }
  }



  const columns: TableProps<ICategory>['columns'] = [
    {
      title: '#',
      dataIndex: 'key',
      key: 'key',
      width: 40,
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 140,
      render: (text) => <a>{text}</a>
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
      width: 50,
      render: (image) => <img src={image} alt="" className="w-[120px] object-cover" />
    },
    {
      title: 'Parent',
      dataIndex: 'parent_id',
      key: 'parent_id',
      align: 'center',
      width: 100,
      render: (text) => <>{text ? text : 'No Parent'}</>
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
      width: 100,
      render: (active) => {
        const color = active == 0 ? 'volcano' : 'green'
        const text = active == 0 ? 'Disable' : 'Enable'

        return <Tag color={color}>{text.toUpperCase()}</Tag>
      }
    },
    {
      title: 'Action',
      key: 'action',
      width: 150,
      align: 'center',
      render: (record) => (
        <Space size={'middle'}>
           <Link to={"" + record.id}>
              <Button type='primary'>Edit </Button>
            </Link>
          <Popconfirm
            placement='topRight'
            title={record.active == 1 ? 'Are you sure distable this category?' : 'Are you sure enable this category?'}
            onConfirm={() => handlerDistableCategory(record)}
            onCancel={() => {}}
            okText='Đồng ý'
            cancelText='Hủy bỏ'
          >
            <Button type='primary' danger>
               Delete
            </Button>
          </Popconfirm>
        </Space>
      )
    },
  ]

  const newData = categories?.data?.map((category: ICategory, index: number) => ({
    ...category,
    key: index + 1
  }))
  if(isError ){
    return <ErrorLoad />
  }
  return (
    <>
      <div className='flex items-center justify-between my-2'>
        <Typography.Title editable level={2} style={{ margin: 0 }}>
          List Category
        </Typography.Title>
      </div>
      <div className=''>
        <Flex wrap='wrap' gap='small' className='my-5' align='center' justify='space-between'>
          <Input
            className='header-search w-[250px]'
            prefix={
              <div className=' px-2'>
                <SearchRoundedIcon />
              </div>
            }
            value={searchValue}
            spellCheck={false}
            allowClear
            onChange={handleChangeSearch}
            size='small'
            placeholder={'search'}
            style={{
              borderRadius: '2rem',
            }}
          />
          <Link to='add'>
            <Button type='primary'>Add Category</Button>
          </Link>
        </Flex>
        <Table
          style={{border: '2px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', height: '100%'}}
          columns={columns}
          sticky={{ offsetHeader: 0 }}
          dataSource={newData}
          loading={isLoading}
         
        />
      </div>
    </>
    
  )
}

