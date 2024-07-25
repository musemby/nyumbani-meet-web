import React, { useState } from "react";
import {
  TeamOutlined,
  BankOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
const { Content, Footer, Sider } = Layout;
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useUser } from "../api-client/user";
import { on } from "events";

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { authLoading, isAuthenticated } = useAuth();
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
      returnItem.onClick = () => router.push(key);
    }
    return returnItem;
  }
  const items = [
    getItem("calendar", "/calendar", false, <CalendarOutlined />),
    getItem("Room", "/rooms", false, <BankOutlined />, [
      getItem("View All", "/rooms", false),
      getItem("Add New", "/rooms/create", false),
    ]),
    getItem("Tenants", "/tenants", false, <TeamOutlined />),
    getItem("Restaurants", "/restaurants", false, <BankOutlined />, [
      getItem("View All", "/restaurants", false),
      getItem("Add New", "/restaurants/create", false),
      getItem("View All Menus", "/menus", false),
      getItem("Add New Menu", "/menus/create", false),
    ]),
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
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={getAllItems()}
        />
      </Sider>
      <Layout>
        {/* <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        /> */}
        <Content
          style={{
            margin: "0 16px",
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
