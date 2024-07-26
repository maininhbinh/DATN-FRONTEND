import { instanceTest } from '@/api/axios'
import { IAddCart } from '@/common/types/cart.interface'

export const GetAllCartService = (payload: string) => {
  return instanceTest.get('cart', {
    headers: {
      Authorization: `Bearer ${payload}`
    }
  })
}

export const addCartService = (payload: IAddCart) => {
  const token = payload.token
  delete payload.token
  return instanceTest.post('cart/add', payload, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

export const updateCartService = (payload: { id: number; quantity: number; token: string }) => {
  const token = payload.token
  return instanceTest.put(
    `cart/${payload?.id}`,
    { quantity: payload.quantity },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
}

export const deleteCartService = (payload: { id: number; token: string }) => {
  const token = payload?.token
  return instanceTest.delete(`cart/${payload?.id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}

// curl --location 'http://127.0.0.1:8000/api/cart' \
// --header 'Authorization: Bearer 1|UgWPn78xRLVT2QGWDajs1dRAioOd0D2qeJJxPaYaadac775f'
