import type { TableProps } from 'antd'
import { Button, Card, Col, Flex, Input, Popconfirm, Row, Segmented, Select, Space, Table, Tag, Typography, message } from 'antd'
import { Link } from 'react-router-dom'
import { useCallback } from 'react'


import { IBanner } from '@/common/types/banner.interface'

import { Breadcrumb, Layout, Menu, theme } from 'antd'
import { CloseSquareOutlined, CheckSquareOutlined, ScheduleOutlined } from '@ant-design/icons'
import { useChangeStatusOrderMutation, useGetOrdersQuery } from '@/services/OrderEndPoints'
import { VND } from '@/utils/formatVietNamCurrency'
import { formatTimestamp } from '@/utils/formatDate'
import useQuerySearch from '../../hooks/useQuerySearch'
import { getColumnSearchProps } from '../../components/util/SortHandle'
import { exportToExcel } from '@/utils/exportExcelFile'
import { popupError, popupSuccess } from '@/page/[role]/shared/Toast'
export default function ListOrder() {

  const [changeStatus] = useChangeStatusOrderMutation();
  const {searchText,setSearchText,setSearchedColumn, searchedColumn, searchInput, handleSearch, handleReset } = useQuerySearch();

   
  

  const {  Content } = Layout
  const {data : dataItem, isLoading : isLoadingOrders} = useGetOrdersQuery({})

  const handleTotalSuccess = useCallback((typeOfStatus : number) => {

    if(dataItem){
      let total = 0;
      for (const item of dataItem?.data) {
       if(item.order_status_id == typeOfStatus){
         total ++;
       }
      }
      const percent = (total / dataItem?.data?.length) * 100;
      return [total, percent];
    }else {
      return [0, 0]
    }
  
  }, [])

  const handleDisableSelect = (statusCurrent: number, statusOrder: number) => {
    if(statusOrder === 8 || (statusCurrent === 8 && statusOrder === 7)) return true;
    if(statusOrder === 3 && statusCurrent === 7) return false;
    if(statusCurrent === 8 && statusOrder === 1) return false;
     if(statusOrder + 1 === statusCurrent) return false;
     return true;
  }
  const handleOnChangeStatus = async (status: number, order_id: number) => {
    const payload = {
      id : order_id,
      status: status
    }
    try {
      await changeStatus(payload).unwrap();
      popupSuccess('Cập nhật trạng thái đơn hàng thành công')
    } catch (error) {
      popupError('Cập nhật trạng thái đơn hàng thất bại');
    }
  }

  const columns: TableProps<IBanner>['columns'] = [
    {
      title: 'Đơn hàng',
      dataIndex: 'sku',
      key: 'sku',
      width: 150,
      align: 'center',
      ...getColumnSearchProps(
        'sku',
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
      title: 'Ngày giờ tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      width: 160,
      render: (text) => (
        <a>
          {formatTimestamp(text)}
        </a>
      )
    },
    {
      title: 'Khách hàng',
      dataIndex: 'receiver_name',
      key: 'receiver_name',
      align: 'center',
      width: 160,
      render: (text) => <>{text}</>,
      ...getColumnSearchProps(
        'receiver_name',
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
      title: 'Số điện thoại',
      dataIndex: 'receiver_phone',
      key: 'receiver_phone',
      align: 'center',
      width: 160,
      render: (text) => <>{text}</>,
      ...getColumnSearchProps(
        'receiver_phone',
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
      title: 'Trạng thái',
      width: 150,
      align: 'center',
      filters: [
        {
          text:  <Tag color="red">Chờ xử lý</Tag>,
          value: '1',
        },
        {
          text: <Tag color="orange">Đang chuẩn bị</Tag> ,
          value: '2',
        },
        {
          text: <Tag color="green">Đơn hàng sẵn sàng</Tag> ,
          value: '3',
        },
        {
          text: <Tag color="cyan">Đang vận chuyển</Tag>,
          value: '4',
        },
        {
          text: <Tag color="blue"> Đang giao hàng</Tag>,
          value: '5',
        },
        {
          text: <Tag color="geekblue"> Đã giao hàng</Tag>,
          value: '6',
        },
        {
          text: <Tag color="success"> Hoàn thành</Tag>,
          value: '7',
        },
        {
          text: <Tag color="#000000"> Đơn hàng bị hủy</Tag>,
          value: '8',
        },
      ],
      onFilter: (value, record : any) => String(record.order_status_id).startsWith(value as string),
      
      render: (item : any) => {
        return (<div className='w-[150px]'><Select
          defaultValue={String(item.order_status_id)}
          style={{ width: 150 }}
          onChange={(e) => { handleOnChangeStatus(Number(e), Number(item.id)) }}
          options={[
            { value: '1', label: <Tag color="red">Chờ xử lý</Tag>, disabled: handleDisableSelect(1, Number(item.order_status_id))},
            { value: '2', label: <Tag color="orange">Đang chuẩn bị</Tag>, disabled: handleDisableSelect(2, Number(item.order_status_id))},
            { value: '3', label: <Tag color="green">Đơn hàng sẵn sàng</Tag>, disabled: handleDisableSelect(3, Number(item.order_status_id))},
            { value: '4', label: <Tag color="cyan">Đang vận chuyển</Tag>, disabled: handleDisableSelect(4, Number(item.order_status_id))},
            { value: '5', label: <Tag color="blue"> Đang giao hàng</Tag>, disabled: handleDisableSelect(5, Number(item.order_status_id))},
            { value: '6', label: <Tag color="geekblue"> Đã giao hàng</Tag>, disabled: handleDisableSelect(6, Number(item.order_status_id))},
            { value: '7', label: <Tag color="success"> Hoàn thành</Tag>, disabled: handleDisableSelect(7, Number(item.order_status_id))},
            { value: '8', label: <Tag color="#000000"> Đơn hàng bị hủy</Tag>, disabled: handleDisableSelect(8, Number(item.order_status_id))},
          ]}
        /></div>)
        
      }
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      align: 'center',
      width: 160,
      render: (text) => <>{VND(text)}</>
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      render: (record) => (
        <Space size={'middle'}>
          <Link to={'' + record?.id}>
            <Button type='primary'>Chi tiết</Button>
          </Link>
        </Space>
      )
    }
  ]

  const newData = dataItem?.data?.map((item: any, index: number) => ({
    ...item,
    key: item.id
  }))

  const {
    token: { colorBgContainer, borderRadiusLG }
  } = theme.useToken()
  const handleExportExcelFile = () => {
    exportToExcel(newData, 'report-order');
  }
  return (
    <>
      <Content
        style={{
          background: colorBgContainer,
          padding: 24,
          borderRadius: borderRadiusLG,
          boxShadow: 'rgba(0, 0, 0, 0.05) 0rem 1.25rem 1.6875rem 0rem'
        }}
        className='h-full'
      >
        <div className='lable font-bold text-[24px] text-[#344767]'>Đơn hàng</div>
        <Row gutter={16} className='my-4'>
          <Col span={8}>
            <Card title='Tổng đơn đã hủy' bordered={false} extra={<CloseSquareOutlined />}>
              <div className='text-[25px]'>
                <b> {handleTotalSuccess(6)[0]} </b>
              </div>
              <span className=''>{handleTotalSuccess(6)[1]}% trên tổng đơn</span>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Tổng đơn đã hoàn thành' bordered={false} extra={<CheckSquareOutlined />}>
              <div className='text-[25px]'>
                <b> 0 </b>
              </div>
              <span className=''>0% trên tổng đơn</span>
            </Card>
          </Col>
          <Col span={8}>
            <Card title='Tổng đơn hàng' bordered={false} extra={<ScheduleOutlined />}>
              <div className='text-[25px]'>
                <b> {dataItem?.data.length} </b>
               
              </div>
             
            </Card>
          </Col>
        </Row>

        <Flex justify='space-between' className='my-5'>
        <div className='lable font-bold text-[17px] text-[#344767]'>Danh sách đơn hàng</div>
          <Flex gap={10}>
            <Button onClick={() => handleExportExcelFile()} >Xuất</Button>
            <Button className='bg-[#344767] text-white'>Thêm order</Button>
          </Flex>
        </Flex>

        <Flex gap={20} vertical>
        
          <Table
            
            pagination={{ pageSize: 8 }}
            columns={columns}
            size='middle'
            scroll={{ x: 1000, y: 500 }}
            sticky={{ offsetHeader: 0 }}
            dataSource={newData}
            loading={isLoadingOrders}
            className='border-2 rounded-md'
          />
        </Flex>
      </Content>
    </>
  )
}