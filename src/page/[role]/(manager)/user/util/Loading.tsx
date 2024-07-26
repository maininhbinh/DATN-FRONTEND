import { Flex, Spin } from "antd";

export default function LoadingUser(){
    return <>
    
    <div className=" bg-[#00000047] fixed top-0 left-0 z-[9999] flex justify-center items-center w-[100vw] h-[100vh] text-red-500 text-[20px]">
        <Flex gap="small" vertical>
            <Flex gap="small">
            
            
            <Spin tip="Loading" size="large">
                
            </Spin>
            </Flex>
            
        </Flex>
    </div>
    
    
    
    </>
}