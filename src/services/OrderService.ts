import { instanceTest } from '@/api/axios'
import { IOrder } from '@/common/types/Order.interface'

export const GetOrderService = () => {
    const token = localStorage.getItem('access_token') || ''

    return instanceTest.get('order', {
        headers: {
        Authorization: `Bearer ${token}`
        }
    })
}

export const AddOrderService = (payload: IOrder) => {
  const token = localStorage.getItem('access_token') || ''

  return instanceTest.post('order', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const UpdateOrderStatusService = (payload: IOrder) => {
    const token = localStorage.getItem('access_token') || ''
    return instanceTest.put(
        `order/${payload?.id}`,
        { order_status: payload.status_id },
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
    )
}

export const UpdatePaymentStatusService = (payload: IOrder) => {
    const token = localStorage.getItem('access_token') || ''
    return instanceTest.put(
        `cart/payment/${payload?.id}`,
        { payment_status: payload.payment_status_id },
        {
        headers: {
            Authorization: `Bearer ${token}`
        }
        }
    )
}
