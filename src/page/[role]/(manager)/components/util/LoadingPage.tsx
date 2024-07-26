import { Flex, Spin } from "antd";

export default function LoadingPage(){
    return <>
    
    <div className="flex justify-center items-center w-[100%] h-[80vh]  text-[20px] ">
        <Flex gap="small" vertical>
        <Flex gap="small">
        
        
        <Spin tip="Loading" size="large"></Spin>
        </Flex>
        
    </Flex>
    </div>
    
    
    
    </>
}