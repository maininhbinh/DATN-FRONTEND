import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'productsApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Products']});


export const productsApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products?_expand=category',
      providesTags: (result) =>
      result
        ? [
            ...result.map(({ id } : {id : number | string}) => ({ type: 'Products' as const, id })),
            { type: 'Products', id: 'LIST' },
          ]
        : [{ type: 'Products', id: 'LIST' }],
    }),
    getProduct: builder.query({
      query: (id) => `products/${id}?_embed=galleries`,
      providesTags: (id) => [{ type: 'Products', id }],
    }),
    createProduct: builder.mutation({
      query: (newProduct) => ({
        url: 'products',
        method: 'POST',
        body: newProduct,
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: (updatedProduct) => ({
        url: `products/${updatedProduct.id}`,
        method: 'PUT',
        body: updatedProduct,
      }),
      invalidatesTags: (id) => [{ type: 'Products', id },  { type: 'Products', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Products', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateProductMutation
} = productsApi;