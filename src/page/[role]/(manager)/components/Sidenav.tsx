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
import { useEffect, useState } from "react";

import type { MenuProps } from 'antd';

function Sidenav() {
  const { Text } = Typography;

  const { bgIcon, darkColor, inActiveColor } = useAppSelector(state => state.web)
  const [stateOpenKeys, setStateOpenKeys] = useState<string[]>([]);

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
                <span className={`label font-bold text-[#344767]`}>Dashboard</span>
              </Flex>
            </div>
          </>
        ),
        link: '/admin/dashboard'
      },
      //dashboard

      {
        label: (
          <>
            <Flex align="center" justify="center">
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className={`label font-bold text-[#344767]`}>Maketing</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={'#9ca3af'} />}
                  <span className="label font-bold text-gray-400">Voucher</span>
                </Flex>
              </>
            ),
            link: '/admin/voucher'
          }
        ]
      },

      {
        label: (
          <>
            <Flex align="center" justify="center" >
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className={`label font-bold text-[#344767]`}>Catalog</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Products</span>
                </Flex>
              </>
            ),
            link: '/admin/products'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Categories</span>
                </Flex>
              </>
            ),
            link: '/admin/categories'
          },
          {
            label: (
              <>
               <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Color</span>
                </Flex>
              </>
            ),
            link: '/admin/color'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Attributes Product</span>
                </Flex>
              </>
            ),
            link: '/admin/attributes-produc t'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Brands</span>
                </Flex>
              </>
            ),
            link: '/admin/brand'
          },

        ]
      },

      {
        label: (
          <>
            <Flex align="center" justify="center" >
              <span
                className={`icon `}
              >
                {<Tables color={darkColor} />}
              </span>
              <span className={`label font-bold text-[#344767]`}>Post</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Post Categories</span>
                </Flex>
              </>
            ),
            link: '/admin/post-categories'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Posts</span>
                </Flex>
              </>
            ),
            link: '/admin/posts'
          },

        ]
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
              <span className={`label font-bold text-[#344767]`}>User</span>
            </Flex>
          </>
        ),
        children: [
          {
            label: (
              <>
               <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Users</span>
                </Flex>
              </>
            ),
            link: '/admin/users'
          },
          {
            label: (
              <>
                <Flex align="center" gap={10} justify="center" className="children-menu">
                  {<Tables color={darkColor} />}
                  <span className="label font-bold text-gray-400">Privilege</span>
                </Flex>
              </>
            ),
            link: '/admin/privilege'
          },
        ]
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
              <span className="label font-bold text-[#344767]">Banner</span>
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
              <span className="label font-bold text-[#344767]">Orders</span>
            </Flex>
          </>
        ),
        link: '/admin/order'
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
              <span className="label font-bold text-[#344767]">Billing</span>
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
            <span className="label font-bold text-[#344767]">RTL</span>
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
            <span className="label font-bold text-[#344767]">Profile</span>
          </Flex>
        ),
        link: '/admin/profile'
      }
    ]
  })

  interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
  }

  const items = useSidenav.getMenu();

  const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
      items2.forEach((item) => {
        if (item.key) {
          key[item.key] = level;
        }
        if (item.children) {
          func(item.children, level + 1);
        }
      });
    };
    func(items1);
    return key;
  };

  const levelKeys = getLevelKeys(items as LevelKeysProps[]);
  

  const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
    // open
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter((key) => key !== currentOpenKey)
        .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };

  useEffect(()=>{
    const defaultActiveString = useSidenav.getKeyActive().map(num => num.toString());
    setStateOpenKeys(defaultActiveString);
  }, []);

  return (
    <>
      <Flex gap={10} className="brand" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="" />
        <span className=" text-center">Muse Dashboard</span>
      </Flex>
      <hr />
      <Menu theme="light" mode="inline" triggerSubMenuAction='click' openKeys={stateOpenKeys} defaultSelectedKeys={stateOpenKeys} items={items} onOpenChange={onOpenChange} />
    </>
  );
}

export default Sidenav;
