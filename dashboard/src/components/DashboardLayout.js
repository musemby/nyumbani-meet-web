import React, { useState } from "react";
import {
  TeamOutlined,
  BankOutlined,
  CalendarOutlined,
  LayoutOutlined,
  PoweroffOutlined,
  ShopOutlined,
  HomeOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme, Popover, List, Typography, Dropdown } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
const { Content, Footer, Sider, Header } = Layout;
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useUser } from "../api-client/user";
import Image from "next/image";

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };
  const { authLoading, isAuthenticated, logout } = useAuth();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();

  const {
    data: user,
    isLoading: userIsLoading,
    isError: userIsError,
    refetch: refetchUser,
  } = useUser("me", isAuthenticated && !authLoading);

  function getItem(label, key, isAdmin, icon, children) {
    const returnItem = {
      key,
      isAdmin,
      icon,
      children,
      label,
    };

    if (!children) {
      if (key === "/logout") {
        returnItem.onClick = () => logout();
      } else {
        returnItem.onClick = () => router.push(key);
      }
    }
    return returnItem;
  }
  const items = [
    getItem("Home", "/dashboard", true, <HomeOutlined />),
    getItem("Bookings", "/calendar", false, <CalendarOutlined />, [
      getItem("Calendar", "/calendar", false),
      getItem("List", "/calendar/list", true),
    ]),
    // getItem("Building", "/buildings", true, <BankOutlined />, [
    //   getItem("View All", "/buildings", true),
    //   getItem("Add New", "/buildings/create", true),
    // ]),
    getItem("Room", "/rooms", true, <ShopOutlined />, [
      getItem("View All", "/rooms", true),
      getItem("Add New", "/rooms/create", true),
    ]),
    getItem("Tenants", "/tenants", true, <TeamOutlined />),
    getItem("Restaurants", "/restaurants", true, <LayoutOutlined />, [
      getItem("View All", "/restaurants", true),
      getItem("Add New", "/restaurants/create", true),
      getItem("View All Menus", "/menus", true),
      getItem("Add New Menu", "/menus/create", true),
    ])
  ];

  function getAllItems() {
    if (user && user.is_admin) {
      return items;
    }
    return items.filter((item) => !item.isAdmin);
  }

  const menu = (
    <Menu>
      <Menu.Item key="1">
        <Button
          type="text"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div
          style={{
            margin: "2px auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            src="/images/Dark2-bg_Logo.png"
            alt="logo"
            width={155}
            height={40}
          />
        </div>

        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={getAllItems()}
        />
      </Sider>
      <Layout>
      <Header style={{ padding: 0, background: colorBgContainer, margin: '0' }}>
        <div
            style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
            height: "100%",
            }}
        >
            {/* First div (left-aligned) */}
            <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
            >
            <Typography.Title level={3} style={{ textTransform: 'uppercase' }}>
                {user.organization_name}
            </Typography.Title>
            </div>

            {/* Right-aligned group */}
            <div
            style={{
                display: "flex",
                alignItems: "center",
            }}
            >
            {/* Second div (right-aligned) */}
            <div
                style={{
                display: "flex",
                alignItems: "center",
                marginRight: "20px",
                }}
            >
                <Typography.Title level={4} style={{ fontWeight: "normal" }}>
                {user.building_name}
                </Typography.Title>
            </div>

            {/* Third div (right-aligned next to second) */}
            <div
                style={{
                display: "flex",
                alignItems: "center",
                }}
            >
                <Dropdown overlay={menu} trigger={['click']}>
                <Typography.Title
                    level={4}
                    style={{ fontWeight: 'normal', cursor: 'pointer' }}
                >
                    {user.name} <CaretDownOutlined />
                </Typography.Title>
                </Dropdown>
            </div>
            </div>
        </div>
        </Header>

        <Content
          style={{
            margin: "0 16px",
            padding: "16px 0",
          }}
        >
          {authLoading && !isAuthenticated ? <div>Loading...</div> : children}
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Nyumbani ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  );
};
export default App;
