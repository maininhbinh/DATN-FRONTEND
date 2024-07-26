import { Outlet } from "react-router-dom";

import ListOrder from "./_components/list";

export default function OrderManagement(){
    return (
        <>
            <ListOrder />
            <Outlet />  
        </>
    )
}