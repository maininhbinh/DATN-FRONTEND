import axios, { AxiosInstance } from 'axios'
import { setLogin } from '@/app/webSlice'


const instance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// const onRequest = (config: InternalAxiosRequestConfig | any): InternalAxiosRequestConfig => {
// instance.interceptors.response.use(
//   (response) => {
//     return response
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

const instanceTest: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
 
})

instanceTest.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export {instanceTest}

export default instance
