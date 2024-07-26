import { createSlice, Dispatch } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { ErrorResponse } from 'react-router-dom'
import { AddOrderService, GetOrderService, UpdateOrderStatusService } from '@/services/OrderService'
import { IOrder } from '@/common/types/Order.interface'

interface IInitialState {
    order: IOrder[]
}

const initialState: IInitialState = {
  order: []
}

const cartSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    
  }
})

export const GetOrder = () => async (dispatch: Dispatch) => {
  try {
    const { data } = await GetOrderService()

    if (data && data.success == true) {
      return data
    }
  } catch (error) {
    return {
      success: false,
      message: 'Request failed'
    }
  }
}

export const AddOrder = (payload: IOrder) => async (dispatch: Dispatch) => {
  try {
    const { data } = await AddOrderService(payload)    
    return data;
  } catch (error) {
    return {
      success: false,
      message: 'Không thể thêm vào giỏ hàng'
    }
  }
}

export const UpdateOrderStatus = (payload: IOrder) => async (dispatch: Dispatch) => {
  try {
    const { data } = await UpdateOrderStatusService(payload)

    if (data && data.success == true) {
      return data
    }
  } catch (error) {

    return {
        success: false,
        message: 'Cập nhật trạng thái đơn hàng thất bại'
    }

  }
}

export const UpdateOrderPayment = (payload: IOrder) => async (dispatch: Dispatch) => {
    try {
      const { data } = await UpdateOrderStatusService(payload)
  
      if (data && data.success == true) {
        return data
      }
    } catch (error) {
  
      return {
          success: false,
          message: 'Cập nhật trạng thái đơn hàng thất bại'
      }
  
    }
  }


export default cartSlice.reducer
