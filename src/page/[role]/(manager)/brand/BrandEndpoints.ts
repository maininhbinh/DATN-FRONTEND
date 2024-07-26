import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'brandApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Brands']});
export const brandsApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getBrands: builder.query({
      query: () => 'brand',
      providesTags: (result) =>
      result
        ? [
            ...result?.data.map(({ id } : {id : number | string}) => ({ type: 'Brands' as const, id })),
            { type: 'Brands', id: 'LIST' },
          ]
        : [{ type: 'Brands', id: 'LIST' }],
    }),
    getBrand: builder.query({
      query: (id) => `brand/${id}`,
      providesTags: (id) => [{ type: 'Brands', id }],
    }),
    createBrand: builder.mutation({
      query: (newUser) => ({
        url: 'brand',
        method: 'POST',
        body: newUser,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Brands', id: 'LIST' }],
    }),
    updateBrand: builder.mutation({
      query: (payload) => ({
        url: `brand/${payload.id}`,
        method: 'POST',
        body: payload.data,
        formData: true,
      }),
      invalidatesTags: (id) => [{ type: 'Brands', id },  { type: 'Brands', id: 'LIST' }],
    }),
    deleteBrand: builder.mutation({
      query: (id) => ({
        url: `brand/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Brands', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBrandsQuery,
  useGetBrandQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandsApi;