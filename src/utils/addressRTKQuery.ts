

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'


export const addressApi = createApi({
    reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://esgoo.net/api-tinhthanh' }),
  endpoints: (builder) => ({
      getProvinces: builder.query({
        query: () => '1/0.htm',
      }),
      getDistricts: builder.query({
        query: (id : string | number) => `2/${id}.htm`,
      }),
      getWards: builder.query({
        query: (id : string | number) => `3/${id}.htm`,
      })
  }),
})

export const { 
    useGetProvincesQuery,
    useLazyGetDistrictsQuery,
    useLazyGetWardsQuery
 } = addressApi;