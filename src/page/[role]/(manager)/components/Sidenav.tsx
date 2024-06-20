import { Menu, Flex } from "antd";
import logo from "../../../../assets/images/manager/logo.png";
import UseSidenav from "../../../../feature/UseSidenav";
import { Typography } from 'antd';
import Tables from "./icon/Tables";
import Billing from "./icon/Billing";
import Rtl from "./icon/Rtl";
import profile from "./icon/Profile";
import Dashboard from "./icon/Dashboard";
import { useAppSelector } from "../../../../app/hooks";


function Sidenav() {
  const { Text } = Typography;

  const { bgIcon, darkColor } = useAppSelector(state => state.web)

  const useSidenav = UseSidenav({
    components: [
      {
        label: (
          <>
            <div>
              <Flex justify="center" align="center">
                <div
                  className={`icon `}
                >
                  {<Dashboard color={darkColor} />}
                </div>
                <span className="label">Demo</span>
              </Flex>
            </div>
          </>
        ),
        children : [
          {
            label: (
              <>
                <div>
                  <Flex justify="center" align="center">
                    <div
                      className={`icon `}
                    >
                      {<Dashboard color={darkColor} />}
                    </div>
                    <span className="label">Dashboard</span>
                  </Flex>
                </div>
              </>
            ),
            link: '/admin/dashboard'
          },
          {
            label: (
              <>
                <div>
                  <Flex justify="center" align="center">
                    <div
                      className={`icon `}
                    >
                      {<Dashboard color={darkColor} />}
                    </div>
                    <span className="label">Post</span>
                  </Flex>
                </div>
              </>
            ),
            link: '/admin/posts'
          },
        ]
      },
      {
        label: (
          <>
            <div>
              <Flex justify="center" align="center">
                <div
                  className={`icon `}
                >
                  {<Dashboard color={darkColor} />}
                </div>
                <span className="label">Dashboard</span>
              </Flex>
            </div>
          </>
        ),
        link: '/admin/dashboard'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Voucher</span>
            </Flex>
          </>
        ),
        link: '/admin/voucher'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Color</span>
            </Flex>
          </>
        ),
        link: '/admin/Color'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Products</span>
            </Flex>
          </>
        ),
        link: '/admin/products'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Banner</span>
            </Flex>
          </>
        ),
        link: '/admin/banner'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Categories</span>
            </Flex>
          </>
        ),
        link: '/admin/categories'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Post Categories</span>
            </Flex>
          </>
        ),
        link: '/admin/post-categories'
      },
     
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Posts</span>
            </Flex>
          </>
        ),
        link: '/admin/posts'
      },
      {
        label: (
          <>
            <div>
              <Flex justify="center" align="center">
                <div
                  className={`icon `}
                >
                  {<Tables color={darkColor} />}
                </div>
                <span className="label">Brand</span>
              </Flex>
            </div>
          </>
        ),
        link: '/admin/brand'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Users</span>
            </Flex>
          </>
        ),
        link: '/admin/users'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Attributes Product</span>
            </Flex>
          </>
        ),
        link: '/admin/attributes-product'
      },
     
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className="label">Privilege</span>
            </Flex>
          </>
        ),
        link: '/admin/privilege'
      },
      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                <Billing color={darkColor} />
              </span>
              <span className="label">Billing</span>
            </Flex>
          </>
        ),
        link: '/admin/billing'
      },
      {
        label: (
          <Flex align="center" justify="center">
            <span
              className={`icon `}
            >
              <Rtl color={darkColor} />
            </span>
            <span className="label">RTL</span>
          </Flex>
        ),
        link: '/admin/rtl'
      },
      {
        label: (
          <>
            <Text style={{ fontSize: '16px', fontWeight: '700' }} className={`text-[${bgIcon}]`}>
              Account Pages
            </Text>
          </>
        ),
        type: 'group',
      },
      {
        label: (
          <Flex align="center" justify="center">
            <span
              className={`icon  `}
            >
              {profile}
            </span>
            <span className="label">Profile</span>
          </Flex>
        ),
        link: '/admin/profile'
      }
    ]
  })
  

  const items = useSidenav.getMenu();
  const defaultActiveString = useSidenav.getKeyActive().map(num => num.toString());

  return (
    <>
      <Flex gap={10} className="brand" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="" />
        <span className=" text-center">Muse Dashboard</span>
      </Flex>
      <hr />
      <Menu theme="light" mode="inline" triggerSubMenuAction='click' defaultOpenKeys={defaultActiveString} defaultSelectedKeys={defaultActiveString} items={items} />
    </>
  );
}

export default Sidenav;
