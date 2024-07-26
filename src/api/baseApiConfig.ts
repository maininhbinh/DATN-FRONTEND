import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseApiConfig = {
    
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://127.0.0.1:8000/api',
        prepareHeaders: (headers, { getState }) => {
            // Use getState to access your redux store
            //const token = getState().auth.token;
           
            //console.log('token will prepare in here')
            headers.set('authorization', `Bearer ${localStorage.getItem('access_token')}`);
            
            return headers;
        },
    }),
 
    endpoints: () => ({}),
};