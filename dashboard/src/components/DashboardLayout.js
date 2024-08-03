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
import { Button, Layout, Menu, theme, Popover, List } from "antd";
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
    getItem("Home", "/dashboard", false, <HomeOutlined />),
    getItem("Bookings", "/calendar", false, <CalendarOutlined />, [
      getItem("Calendar", "/calendar", false),
      getItem("List", "/calendar/list", true),
    ]),
    getItem("Building", "/buildings", true, <BankOutlined />, [
      getItem("View All", "/buildings", true),
      getItem("Add New", "/buildings/create", true),
    ]),
    getItem("Room", "/rooms", true, <ShopOutlined />, [
      getItem("View All", "/rooms", true),
      getItem("Add New", "/rooms/create", true),
    ]),
    getItem("Tenants", "/tenants", true, <TeamOutlined />),
    getItem("Restaurants", "/restaurants", false, <LayoutOutlined />, [
      getItem("View All", "/restaurants", false),
      getItem("Add New", "/restaurants/create", true),
      getItem("View All Menus", "/menus", false),
      getItem("Add New Menu", "/menus/create", true),
    ]),
    getItem("Logout", "/logout", false, <PoweroffOutlined />),
  ];

  function getAllItems() {
    if (user && user.is_admin) {
      return items;
    }
    return items.filter((item) => !item.isAdmin);
  }

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
            width={150}
            height={75}
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
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "auto 20px",
              margin: "auto 10px",
              height: "100%",
            }}
          >
            <Popover
              placement="leftBottom"
              content={
                <List size="small">
                  <List.Item>
                    <Button
                      type="text"
                      onClick={() => {
                        logout();
                      }}
                    >
                      {" "}
                      Logout
                    </Button>
                  </List.Item>
                </List>
              }
              trigger="click"
              open={open}
              onOpenChange={handleOpenChange}
            >
              <MenuOutlined />
            </Popover>
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
