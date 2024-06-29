import { createSlice, Dispatch } from "@reduxjs/toolkit";
import { ISignin, ISignup } from "@/common/types/Auth.interface";
import { LogoutService, SigninService } from "@/services/AuthService";
import { AxiosError } from "axios";
import Cookies from 'js-cookie';
import { ErrorResponse } from "react-router-dom";

interface IInitialState {
    isAuthenticated: boolean
}

const initialState: IInitialState = {
    isAuthenticated: !!Cookies.get("access_token")
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, {payload}) => {
           // Cookies.set('user',JSON.stringify(payload?.result?.data));
            Cookies.set('access_token',payload?.result?.access_token);
            Cookies.set('token_type',payload?.result?.token_type);
         localStorage.setItem('user', JSON.stringify(payload?.result?.data));
            // localStorage.setItem('access_token', payload.result?.access_token)
            // localStorage.setItem('token_type', payload.result?.token_type)   
            state.isAuthenticated = true;
        },
        logout: (state) => {     
           // Cookies.remove('user');
            Cookies.remove('access_token');
            Cookies.remove('token_type');
             localStorage.removeItem('user')
            // localStorage.removeItem('access_token')
            // localStorage.removeItem('token_type')
            state.isAuthenticated = false;
        },
        loadAuthState: (state, {payload}) => {
           // Cookies.set("user",payload?.result?.data )
            localStorage.setItem('user', JSON.stringify(payload?.result?.data));            
            state.isAuthenticated = true;
        },
        setIsAuthenticated: (state) => {
            state.isAuthenticated = !state.isAuthenticated
        }
    }
})

export const Signin = (payload: ISignin) => async (dispatch: Dispatch) => {
    try{
        const {data} = await SigninService(payload)

        if(data && data.success == true){         

            return data

        }

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;

        if(axiosError?.response?.status == 422){
            return axiosError?.response?.data
        }
        
        return {
            success: false,
            result: {
                message: 'Request failed'
            }
        }
    }
}

export const Logout = (payload: string) => async (dispatch: Dispatch) => {
    try{
        const {data} = await LogoutService(payload)
        
        if(data && data.success == true){         

            return data

        }

    }catch(error){
        const axiosError = error as AxiosError<ErrorResponse>;
        console.log(error);
        
        if(axiosError?.response?.status == 422){
            return {
                success: false,
                result: {
                    message: axiosError?.response?.data?.message
                }
            }
        }
        
        return {
            success: false,
            result: {
                message: 'Request failed'
            }
        }
    }
}

export const {login, logout, loadAuthState, setIsAuthenticated} = authSlice.actions;

export default authSlice.reducer;