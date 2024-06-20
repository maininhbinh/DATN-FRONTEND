// import { baseApiConfig } from "../../../../../../api/baseApiConfig";
// import { createApi } from "@reduxjs/toolkit/query";

import { createApi} from '@reduxjs/toolkit/query/react'
import { baseApiConfig } from '../../../../../../api/baseApiConfig';
const emptySplitApi = createApi({
    reducerPath: 'attributesApi',
    ...baseApiConfig
  });

const apiWithTag = emptySplitApi.enhanceEndpoints({ addTagTypes: ['Attributes']});
export const attributesApi = apiWithTag.injectEndpoints({
  
  endpoints: (builder) => ({
    getAttributes: builder.query({
        
      query: () => ({
         url : 'attributes?_embed=value_attributes',
        //  prepareHeaders: (headers : Headers) => {
        //     console.log('token will prepare in request attribute')
        //     headers.set('authorization', `Bearer tokencustomhere`);
        //     return headers;
        //  },
      }),
      providesTags: (result) => 
        result
          ? [
              ...result.map(({ id }: { id: number | string }) => ({ type: 'Attributes' as const, id })),
              { type: 'Attributes', id: 'LIST' }
            ]
          : [{ type: 'Attributes', id: 'LIST' }]
    }),
    getAttribute: builder.query({
      query: (id) => `attributes/${id}`,
      providesTags: (id) => [{ type: 'Attributes', id }]
    }),
    createAttribute: builder.mutation({
      query: (newAttribute) => ({
        url: 'attributes',
        method: 'POST',
        body: newAttribute
      }),
      invalidatesTags: [{ type: 'Attributes', id: 'LIST' }]
    }),
    updateAttribute: builder.mutation({
      query: (updatedAttribute) => ({
        url: `attributes/${updatedAttribute.id}`,
        method: 'PUT',
        body: updatedAttribute,
      }),
      invalidatesTags: (id) => [
         { type: 'Attributes', id },  
         { type: 'Attributes', id: 'LIST' }
      ],
    }),
    deleteAttribute: builder.mutation({
      query: (id) => ({
        url: `attributes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Attributes', id: 'LIST' }]
    })
  })
})

export const { 
  useGetAttributesQuery, 
  useGetAttributeQuery, 
  useCreateAttributeMutation, 
  useDeleteAttributeMutation,
  useUpdateAttributeMutation
} =
  attributesApi
