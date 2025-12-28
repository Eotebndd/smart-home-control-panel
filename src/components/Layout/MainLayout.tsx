import React, { useState } from 'react';
import { Layout, Menu, Badge, Space, Typography } from 'antd';
import {
  AppstoreOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  BellOutlined,
  WifiOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import AlertDrawer from './AlertDrawer';
import './MainLayout.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { alerts, isOnline, isLocalMode } = useStore();
  const [alertDrawerOpen, setAlertDrawerOpen] = useState(false);

  const menuItems = [
    {
      key: '/devices',
      icon: <AppstoreOutlined />,
      label: '设备管理',
    },
    {
      key: '/scenes',
      icon: <ThunderboltOutlined />,
      label: '场景中心',
    },
    {
      key: '/energy',
      icon: <ThunderboltOutlined />,
      label: '能源管理',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const unreadAlerts = alerts.filter((a) => a.type === 'error' || a.type === 'warning').length;

  return (
    <Layout className="main-layout">
      <Sider
        width={200}
        className="layout-sider"
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <h2>🏠 智能家居</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header className="layout-header">
          <Space size="large">
            <Badge count={unreadAlerts} size="small">
              <BellOutlined 
                style={{ fontSize: 20, cursor: 'pointer' }} 
                onClick={() => setAlertDrawerOpen(true)}
              />
            </Badge>
            <Space>
              {isOnline ? (
                <WifiOutlined style={{ color: '#52c41a' }} />
              ) : (
                <CloudOutlined style={{ color: '#faad14' }} />
              )}
              <Text type={isOnline ? 'success' : 'warning'}>
                {isLocalMode ? '本地模式' : '在线模式'}
              </Text>
            </Space>
          </Space>
        </Header>
        <Content className="layout-content">{children}</Content>
      </Layout>
      <AlertDrawer open={alertDrawerOpen} onClose={() => setAlertDrawerOpen(false)} />
    </Layout>
  );
};

export default MainLayout;

