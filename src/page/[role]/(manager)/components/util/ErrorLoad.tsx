import { Alert, Space} from "antd";

export default function ErrorLoad(){
    return <>
    <Space direction="vertical" className="my-4" style={{ width: '100%' }}>
   
  <Alert
    message="Error :(("
    description="Something went error F12 to check error "
    type="error"
    showIcon
  />
</Space>
  </>
}