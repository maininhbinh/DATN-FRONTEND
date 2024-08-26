
import { Image, Popconfirm, Table, Typography } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';
import { IBrand } from '../../../../../common/types/brand.interface';
import useBrand from '../utils/brand.hooks';
import ConfirmModal from '../../../(base)/brand/confirm.modal';
import ModalCreateBrand from './add';
import { Link } from 'react-router-dom';
import { formatDate } from '@/utils/convertCreatedLaravel';
import { useGetBrandsQuery, useDeleteBrandMutation } from '../BrandEndpoints';
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast';
import { ITEM_PER_PAGE } from '@/utils/paginate';

export default function ListBrand() {

  const { data, isLoading } = useGetBrandsQuery({});
  const [deleteBrand, { isLoading: isLoadingDeleteBrand }] = useDeleteBrandMutation();
  const confirm = async (id: number | string) => {
    try {
      await deleteBrand(id).unwrap();
      popupSuccess('Delete brand success');
    } catch (error) {
      popupError('Delete brand error');
    }
  };
  const columns: TableProps<IBrand>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IBrand, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên hãng',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, item: IBrand) => {
        return item.name;
      },
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'logo',
      key: 'logo',
      render: (_: any, item: IBrand) => {
        return <Image src={item.logo} alt="" width={'90px'} />;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (_: any, item: IBrand) => {
        // print(item.create_at);
        return <>
          <p>{formatDate(item.created_at)}</p>
        </>
          ;
      },
    },


    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Link to={String(record.id)} ><Button type="primary" >
            Sửa
          </Button></Link>
          <Popconfirm
            disabled={isLoadingDeleteBrand}
            title="Delete the user"
            description={`Are you sure to delete "${record.name}" ?`}
            onConfirm={() => confirm(String(record.id))}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={isLoadingDeleteBrand} >Xóa</Button>
          </Popconfirm>
        </Flex>
      ),
    },
  ];
  const dataItem = data?.data.map((item: IBrand, key: number) => {
    return {
      ...item,
      key: key
    }
  })

  return <>
    <Typography.Title editable level={2} style={{ margin: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        Danh sách thương hiệu <Flex wrap="wrap" gap="small">

          <Link to="add">  <Button type="primary" danger >
            Thêm thương hiệu
          </Button></Link>

        </Flex>
      </div>

    </Typography.Title>

    <Table columns={columns} dataSource={dataItem} loading={isLoading} pagination={{
      pageSize: ITEM_PER_PAGE,
    }} />




  </>
}