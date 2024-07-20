import React, { useState } from 'react'
import { TeamOutlined, BankOutlined, CalendarOutlined } from '@ant-design/icons'
import { Layout, Menu, theme } from 'antd'
const { Content, Footer, Sider } = Layout
import useAuth from '../hooks/useAuth'
import { useRouter } from 'next/router'

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  }
}
const items = [
  getItem('calendar', '/calendar', <CalendarOutlined />),
  getItem('Room', '/rooms', <BankOutlined />, [
    getItem('View All', '/rooms'),
    getItem('Add New', '/rooms/create'),
  ]),
  getItem('Tenants', '/tenants', <TeamOutlined />),
]

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const { authLoading, isAuthenticated } = useAuth()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()
  const router = useRouter()
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className='demo-logo-vertical' />
        <Menu
          theme='dark'
          defaultSelectedKeys={['1']}
          mode='inline'
          items={items.map((item) => ({
            ...item,
            onClick: () => router.push(item.key),
          }))}
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
            margin: '0 16px',
          }}
        >
          {authLoading && !isAuthenticated ? <div>Loading...</div> : children}
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          Nyumbani ©{new Date().getFullYear()}
        </Footer>
      </Layout>
    </Layout>
  )
}
export default App
