import { createApi } from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../api/baseApiConfig';

const emptySplitApi = createApi({
    reducerPath: 'bannersApi',
    ...baseApiConfig
  });
const apiWithTag = emptySplitApi.enhanceEndpoints({addTagTypes: ['Banners']});
export const bannersApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getBanners: builder.query({
      query: () => 'slider',
      providesTags: (result) =>
      result
        ? [
            ...result.map(({ id } : {id : number | string}) => ({ type: 'Banners' as const, id })),
            { type: 'Banners', id: 'LIST' },
          ]
        : [{ type: 'Banners', id: 'LIST' }],
    }),
    getBanner: builder.query({
      query: (id) => `slider/${id}`,
      providesTags: (id) => [{ type: 'Banners', id }],
    }),
    createBanner: builder.mutation({
      query: (newUser) => ({
        url: 'slider',
        method: 'POST',
        body: newUser,
        formData: true,
      }),
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
    }),
    updateBanner: builder.mutation({
      query: (payload) => ({
        url: `slider/${payload.id}`,
        method: 'POST',
        body: payload.data,
        formData: true,
      }),
      invalidatesTags: (id) => [{ type: 'Banners', id },  { type: 'Banners', id: 'LIST' }],
    }),
    deleteBanner: builder.mutation({
      query: (id) => ({
        url: `slider/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Banners', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetBannersQuery,
  useGetBannerQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} = bannersApi;