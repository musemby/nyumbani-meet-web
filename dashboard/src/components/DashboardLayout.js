import React, { useState, Suspense } from "react";
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
import { Loading } from "../components/loading";
import { Button, Layout, Menu, theme, Spin, List, Typography, Dropdown, Grid, Drawer } from "antd";
import { CaretDownOutlined } from '@ant-design/icons';
const { Content, Footer, Sider, Header } = Layout;
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/router";
import { useUser } from "../api-client/user";
import Image from "next/image";

const { useBreakpoint } = Grid;

const Loader = () => {
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState(50);
  const showLoader = () => {
    setSpinning(true);
    let ptg = -10;
    const interval = setInterval(() => {
      ptg += 5;
      setPercent(ptg);
      if (ptg > 120) {
        clearInterval(interval);
        setSpinning(false);
        setPercent(0);
      }
    }, 100);
  };
  return (
    <>
      <Spin spinning={spinning} percent={percent} fullscreen />
    </>
  );
};

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);

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
  const screens = useBreakpoint();

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
        returnItem.onClick = () => {
          router.push(key);
          setDrawerVisible(false);
        };
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
    if (user && user?.is_admin) {
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
        {/* Desktop Sider */}
        <Sider
          collapsible={true}
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          breakpoint="lg"
          collapsedWidth="0"
          style={{
            display: { xs: 'none', sm: 'none', md: 'block' }
          }}
          trigger={null}
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
        {/* Mobile menu button - show only on mobile screens */}
        {screens.xs && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ display: 'inline-block' }}
          />
        )}

        {/* Organization name and Building name */}
        <div
          style={{
            display: 'flex',
            flexDirection: screens.xs ? 'column' : 'row',
            alignItems: screens.xs ? 'flex-start' : 'center',
            justifyContent: screens.xs ? 'center' : 'flex-start',
          }}
        >
          {/* Organization name */}
          <Typography.Title
            level={3}
            style={{
              textTransform: 'uppercase',
              margin: screens.xs ? '0' : '0 10px 0 0',
              fontSize: screens.xs ? '16px' : screens.sm ? '20px' : '24px',
            }}
          >
            {user?.organization_name}
          </Typography.Title>

          {/* Building name */}
          <Typography.Title
            level={4}
            style={{
              fontWeight: "normal",
              margin: screens.xs ? '0' : '0 10px',
              fontSize: screens.xs ? '14px' : screens.sm ? '16px' : '18px',
            }}
          >
            {user?.building_name}
          </Typography.Title>
        </div>

        {/* Right-aligned group */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* User dropdown */}
          <Dropdown overlay={menu} trigger={['click']}>
            <Typography.Title
              level={4}
              style={{
                fontWeight: 'normal',
                cursor: 'pointer',
                margin: 0,
                fontSize: screens.xs ? '14px' : screens.sm ? '16px' : '18px',
              }}
            >
              {user?.name} <CaretDownOutlined />
            </Typography.Title>
          </Dropdown>
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

          {/* Mobile Drawer */}
          <Drawer
            title="Menu"
            placement="left"
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
          >
            <Menu
              theme="light"
              mode="inline"
              items={getAllItems()}
            />
          </Drawer>
        </Layout>
    </Layout>
  );
};

export default App;