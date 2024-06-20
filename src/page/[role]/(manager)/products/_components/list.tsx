
import {   Popconfirm,  Table, Tag, Typography } from 'antd';
import type {    TableProps } from 'antd';
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { IProduct } from '@/common/types/product.interface';
import { useGetProductsQuery,useUpdateProductMutation } from '../ProductsEndpoints';
import HandleLoading from '../../components/util/HandleLoading';

import {  useState } from 'react';

import useQuerySearch from '../../hooks/useQuerySearch';
import { getColumnSearchProps } from '../../components/util/SortHandle';
import { popupSuccess } from '@/page/[role]/shared/Toast';
export default function ListProduct(){


  const {searchText,setSearchText,setSearchedColumn, searchedColumn, searchInput, handleSearch, handleReset } = useQuerySearch();
  const {
    data ,
    isLoading,
    isError
  } = useGetProductsQuery({});

  const [id, setId] = useState<number | string>();
  const [hiddenProduct, {isLoading : isHiddenProduct}, ] = useUpdateProductMutation();
 
  const confirm = async (id : number | string) => {
    setId(id)
    
    data.map(async (item : IProduct) => {
      if(id == item.id){
        const mutableItem  = { ...item };
        delete mutableItem.category;
        await hiddenProduct({
              ...mutableItem,
            in_active : false
        });
        popupSuccess('Hidden product success');
      }
    })
  };
    const dataItem = data?.map((item : IProduct, key : number) => {
      return {
        ...item,
        key : key
      }
    })
    
    const columns: TableProps<IProduct>['columns'] = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          showSorterTooltip: { target: 'full-header' },
          render: (text) => <a>{text}</a>,
          onFilter: (value, record) => record.name.indexOf(value as string) === 0,
          sorter: (a, b) => a.name.length - b.name.length,
          sortDirections: ['descend'],
          ...getColumnSearchProps(
            'name',
             handleSearch,
             handleReset,
             searchText,
             setSearchText,
             searchedColumn,
             setSearchedColumn,
             searchInput
            ),
        },
        {
          title: 'Price',
          dataIndex: 'price',
          key: 'price',
        },
        {
            title: 'Discount',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
          title: 'Image',
          dataIndex: 'thumbnail',
          key: 'thumbnail',
          render: (thumbnail) => <img src={thumbnail} alt="" width={110} />
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (category: { name: string }) => category.name,
        },
        {
          title: 'Active',
          key: 'in_active',
          dataIndex: 'in_active',
          render: (_, { in_active  }) => (
            <>
                  <Tag color={in_active ? 'green' : 'red'} >
                      {in_active ? 'Active' : 'InActive'}
                  </Tag>
            </>
          )
        },
        {
          title: 'Action',
          key: 'action',
          render: (data: IProduct) => (
            <Flex wrap="wrap" gap="small">
              
               <Link to={String(data?.id)}>   <Button type="primary"  >
                  Edit
                </Button> </Link>
                <Popconfirm
                    disabled={isHiddenProduct}
                    title="Hidden the product"
                    description={`Are you sure to hidden product "${data.name}" ?`}
                    onConfirm={() => confirm(String(data.id))}
                    okText="Yes"
                    cancelText="No"
                  >
                {data.in_active && <Button danger loading={isHiddenProduct && data.id == id} >Disable</Button>} 
                  </Popconfirm>
          </Flex>
          ),
        },
    ];


    return <>
   
    <HandleLoading isLoading={isLoading} isError={isError}>
          <Typography.Title editable level={2} style={{ margin: 0 }}>
                List products
            </Typography.Title>
            <Table columns={columns} dataSource={dataItem} />

            <Flex wrap="wrap" gap="small">
          <Link to="add">    <Button type="primary" danger className='my-[20px]'>
            Add product
          </Button> </Link>
          

        </Flex>
    </HandleLoading>
     
    </>
}