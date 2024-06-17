
import { Input, Table, Typography } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';
import _ from 'lodash';
import ModalCreateVoucher from './add';
import useVoucher from '../utils/brand.hooks';
import { IVoucher } from '@/common/types/voucher.interface copy';
import ConfirmModal from '@/page/[role]/(base)/brand/confirm.modal';
import { Link } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'



export default function ListVoucher() {
  const hooks = useVoucher();
  const columns: TableProps<IVoucher>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IVoucher, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      render: (_: any, item: IVoucher) => {
        return item.code;
      },
    },
    {
      title: 'Tên voucher',
      dataIndex: 'age',
      key: 'age',
      render: (_: any, item: IVoucher) => {
        return item.name;
      },
    },
    {
      title: 'Số tiền chiết khấu ',
      dataIndex: 'discount_amount',
      key: 'discount_amount',
      render: (_: any, item: IVoucher) => {
        return item.discount_amount;
      },
    },

    {
      title: 'Ngày bắt đầu',
      dataIndex: 'start_date',
      key: 'tart_date',
      render: (_: any, item: IVoucher) => {
        // print(item.create_at);
        return <>
          <p>{moment(item.start_date).format("YYYY-MM-DD")}</p>
        </>
          ;
      },
    },

    {
      title: 'Ngày kết thúc',
      dataIndex: 'end_date',
      key: 'end_date',
      render: (_: any, item: IVoucher) => {
        // print(item.create_at);
        return <>
          <p>{moment(item.end_date).format("YYYY-MM-DD")}</p>
        </>
          ;
      },
    },


    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Button type="primary" onClick={() => hooks.onEditVoucher(record)}  >
            Edit
          </Button>
          <Button type="primary" danger onClick={() => hooks.onShowDeletePopup(record)}>
            Delete
          </Button>
        </Flex>
      ),
    },
  ];




  return <>


    <div className='flex items-center justify-between my-2'>
      <Typography.Title editable level={2} style={{ margin: 0 }}>
        List Voucher
      </Typography.Title>
    </div>
    <div className=''>
      <Flex wrap='wrap' gap='small' className='my-5' align='center' justify='space-between'>
        <Input
          className='header-search w-[250px]'
          prefix={
            <div className=' px-2'>
            <SearchRoundedIcon/>
            </div>
          }
          spellCheck={false}
          allowClear
          onChange={hooks.onSearch}
          size='small'
          placeholder={'search'}
          style={{
            borderRadius: '2rem',
            border: 'none',
            backgroundColor: '#ffff',
            boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'
          }}
        />
        <Button type="primary" danger onClick={() => hooks.onShowModalDetail()}>
          Add Voucher
        </Button>
      </Flex>
    </div>

    <Table columns={columns} dataSource={hooks.dataList} loading={hooks.loading} />



    <ConfirmModal
      handleCancel={hooks.onHideConfirmPopup}
      handleOk={hooks.handleOkPopup}
      visible={hooks.modalParams.visible}
      title={hooks.modalParams.title}
      content={hooks.modalParams.content}
    />


    <ModalCreateVoucher
      form={hooks.form}
      isEdit={hooks.Index}
      onCancelModalCreate={hooks.onCancelModalDetail}
      onSubmit={hooks.onSubmit}
      visible={hooks.visibleModalVoucherDetail}
    />
  </>
}