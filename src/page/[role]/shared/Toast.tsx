import {  toast } from 'react-toastify';
import { SmileOutlined, FrownOutlined  } from '@ant-design/icons';
import Party from '../components/icon/partyIcon';
import ErrorIcon from '../components/icon/errorIcon';
export const popupSuccess = (text : string) => {
    return toast(text,{
        icon: <Party/>,
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
export const popupError = (text : string) => {
    toast.error(text, {
        icon : <ErrorIcon/>,
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}