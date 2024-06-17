
import { Input, Table, Typography } from 'antd';
import moment from 'moment';
import type { TableProps } from 'antd';
import { Button, Flex } from 'antd';
import { IBrand } from '../../../../../common/types/brand.interface';
import useBrand from '../utils/brand.hooks';
import ConfirmModal from '../../../(base)/brand/confirm.modal';
import ModalCreateBrand from './add';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'


export default function ListBrand() {
  const hooks = useBrand();
  console.log(hooks.dataList);


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
      dataIndex: 'age',
      key: 'age',
      render: (_: any, item: IBrand) => {
        return item.logo;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'age',
      key: 'age',
      render: (_: any, item: IBrand) => {
        // print(item.create_at);
        return <>
          <p>{moment(item.create_at).format("DD-MM-YYYY")}</p>
        </>
          ;
      },
    },


    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Flex wrap="wrap" gap="small">
          <Button type="primary" onClick={() => hooks.onEditBrand(record)}  >
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
        List Brand
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
          Add Brand
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


    <ModalCreateBrand
      form={hooks.form}
      isEdit={hooks.Index}
      onCancelModalCreate={hooks.onCancelModalDetail}
      onSubmit={hooks.onSubmit}
      visible={hooks.visibleModalBrandDetail}
    />
    {/* {
      hooks.visibleModalBrandDetail &&
      <ModalNewsDetail
        visible={hooks.visibleModalBrandDetail}
        onCancel={hooks.onCancelModalDetail}
        dataEdit={hooks.BrandEdit}
        onSubmit={hooks.onSubmitModalDetail}
      />
    } */}
  </>
}