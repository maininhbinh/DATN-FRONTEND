import { Layout, Drawer, Affix } from "antd";
import Sidenav from "./components/Sidenav";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import "./styles/main.css";
import "./styles/responsive.css";
import { useAppSelector } from "../../../app/hooks";
import { setVisible } from "../../../app/webSlice";
import { useAppDispatch } from "../../../app/hooks";

const Manager = () => {
    const { Header: AntHeader, Content, Sider } = Layout;
    const {fixedNavbar, miniSidenav} = useAppSelector(state => state.web)
    const dispatch = useAppDispatch()

    return (
        <Layout
        className={`layout-dashboard `}
        style={{ padding: '0 30px' }}
        id="manager"
        >
        <Drawer
            title={false}
            placement={"left"}
            closable={false}
            onClose={() => dispatch(setVisible(false))}
            open={miniSidenav}
            key={"left"}
            width={250}
            className={`drawer-sidebar`}
        >
            <Layout
            className={`layout-dashboard`} 
            >
            <Sider
                trigger={null}
                width={270}
                theme="light"
                className={`sider-primary ant-layout-sider-primary`}
                style={{ background: '#ffffff' }}
            >
                <Sidenav />
            </Sider>
            </Layout>
        </Drawer>
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            trigger={null}
            width={240}
            theme="light"
            className={`sider-primary ant-layout-sider-primary`}
            style={{ background: '#ffffff', boxShadow: '0rem 1.25rem 1.6875rem 0rem rgba(0, 0, 0, 0.05)'}}
            id="sidenav"
        >
            <Sidenav />
        </Sider>
        <Layout >
            {fixedNavbar ? (
            <Affix>
                <AntHeader className={`${fixedNavbar ? "ant-header-fixed" : ""} bg-[#fff]`}>
                    <Header/>
                </AntHeader>
            </Affix>
            ) : (
            <AntHeader className={`${fixedNavbar ? "ant-header-fixed" : ""} ` }>
                <Header/>
            </AntHeader>
            )}
            <Content className="content-ant">
                <Outlet/>
            </Content>
            <Footer />
        </Layout>
        </Layout>
    );
}

export default Manager
