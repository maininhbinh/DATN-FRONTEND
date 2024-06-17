
import { Input, Table, Typography } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';

import ModalCreateColor from './add';
import ConfirmModal from '@/page/[role]/(base)/brand/confirm.modal';
import { IColor } from '@/common/types/color.interface';
import useColor from '../utils/color.hooks';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'


export default function ListColor() {
  const hooks = useColor();
  const columns: TableProps<IColor>['columns'] = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: '5%',
      render: (_: any, __: IColor, index: number) => {
        return index + 1;
      },
    },
    {
      title: 'Tên Color',
      dataIndex: 'age',
      key: 'age',
      render: (_: any, item: IColor) => {
        return item.name;
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Button type="primary" onClick={() => hooks.onEditColor(record)}  >
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
        List Color
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
          Add Color
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


    <ModalCreateColor
      form={hooks.form}
      isEdit={hooks.Index}
      onCancelModalCreate={hooks.onCancelModalDetail}
      onSubmit={hooks.onSubmit}
      visible={hooks.visibleModalColorDetail}
    />
  </>
}