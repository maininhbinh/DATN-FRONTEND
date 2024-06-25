
import { Input, Popconfirm, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';
import { Link } from 'react-router-dom';
import { IProduct } from '@/common/types/product.interface';
import { useGetProductsQuery,useUpdateProductMutation } from '../ProductsEndpoints';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import { useState } from 'react';
import { popupSuccess } from '@/page/[role]/shared/Toast';
import Title from 'antd/es/typography/Title';

export default function ListProduct(){

  const { data, isLoading, isError } = useGetProductsQuery({});
  const [searchValue, setSearchValue] = useState('')

  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);

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
          render: (thumbnail) => (
            <div className=' rounded-md w-[40px] h-[40px] overflow-hidden ' style={{boxShadow: 'rgba(1, 1, 1, 0.06) 1rem 1.25rem 1.6875rem 1rem'}}>
              <img src={thumbnail} alt="" width={110} className=' object-cover object-center'/>
            </div>
          )
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

    const handleChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const searchValue = event.target.value
      if (!searchValue.startsWith(' ')) {
        setSearchValue(searchValue)
      }
    }

    return <>
   
      <div className='flex items-center justify-between my-2'>
        <Title editable level={2} style={{ margin: 0 }}>
          List Product
        </Title>
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
            <Button type='primary'>Add Product</Button>
          </Link>
        </Flex>

        <Table 
          style={{border: '2px', borderRadius: '10px', boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem', height: '100%'}}
          columns={columns} 
          dataSource={dataItem} 
          loading={isLoading}
          pagination={{
            current: current,
            pageSize: pageSize,
            total: columns.length,
            onChange: (page, pageSize) => {
              setCurrent(page);
              setPageSize(pageSize);
            },
          }}
        />
      </div>
    </>
}