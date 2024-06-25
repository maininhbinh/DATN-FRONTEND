import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import webReducer from './webSlice'
import { usersApi } from '../page/[role]/(manager)/user/UsersEndpoints'
import { categoryAttributesApi } from '../page/[role]/(manager)/attribute/_components/category_attribute/CategoryAttributeEndpoints'
import { attributesApi } from '../page/[role]/(manager)/attribute/_components/attribute/AttributeEndpoints'
import { addressApi } from '../utils/addressRTKQuery'

import bannerSlice from './slices/bannerSlice'
import categorySlice from './slices/categorySlice'
import { valueAttributesApi } from '../page/[role]/(manager)/attribute/_components/value_attribute/ValueAttributeEndPoints'
import postCategorySlice from './slices/postCategorySlice'
import { privilegeGroupApi } from '@/page/[role]/(manager)/privilege/_components/privilege_group/PrivilegeGroupEndpoint'
import { privilegeApi } from '@/page/[role]/(manager)/privilege/_components/privilege/PrivilegeEndpoint'
import { privilegeUsersApi } from '@/page/[role]/(manager)/user/PrivilegeUsersEndpoints'
import postSlice from './slices/postSlice'
import authSlice from './slices/authSlide'
import { categoriesApi } from '@/page/[role]/(manager)/category/CategoryEndpoints'
import { productsApi } from '@/page/[role]/(manager)/products/ProductsEndpoints'
export const store = configureStore({
  reducer: {
    web: webReducer,
    banner: bannerSlice,
    //category: categorySlice,
    postCategory: postCategorySlice,
    post: postSlice,
    auth: authSlice,
    [usersApi.reducerPath]: usersApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [attributesApi.reducerPath]: attributesApi.reducer,
    [categoryAttributesApi.reducerPath]: categoryAttributesApi.reducer,
    [valueAttributesApi.reducerPath] : valueAttributesApi.reducer,
    [privilegeGroupApi.reducerPath] : privilegeGroupApi.reducer,
    [privilegeApi.reducerPath] : privilegeApi.reducer,
    [privilegeUsersApi.reducerPath] : privilegeUsersApi.reducer,
    [productsApi.reducerPath] : productsApi.reducer,
    [categoriesApi.reducerPath] : categoriesApi.reducer
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  middleware: (getDefaultMiddleware) => //attributesApi.middleware
  getDefaultMiddleware({ serializableCheck: false }).concat(usersApi.middleware, addressApi.middleware, attributesApi.middleware, categoryAttributesApi.middleware, valueAttributesApi.middleware, privilegeGroupApi.middleware, privilegeApi.middleware, privilegeUsersApi.middleware, productsApi.middleware, categoriesApi.middleware),
});


export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
