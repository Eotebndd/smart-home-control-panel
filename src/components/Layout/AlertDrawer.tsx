import React from 'react';
import { Drawer, List, Tag, Typography, Empty, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { DEVICE_ICONS } from '@/utils/constants';
import dayjs from 'dayjs';
import './AlertDrawer.css';

const { Text } = Typography;

interface AlertDrawerProps {
  open: boolean;
  onClose: () => void;
}

const AlertDrawer: React.FC<AlertDrawerProps> = ({ open, onClose }) => {
  const { alerts, removeAlert, clearAlerts } = useStore();

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'red';
      case 'warning':
        return 'orange';
      default:
        return 'blue';
    }
  };

  const getAlertText = (type: string) => {
    switch (type) {
      case 'error':
        return '错误';
      case 'warning':
        return '警告';
      default:
        return '信息';
    }
  };

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>系统提醒</span>
          {alerts.length > 0 && (
            <Button type="link" size="small" onClick={clearAlerts}>
              清空全部
            </Button>
          )}
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      className="alert-drawer"
    >
      {alerts.length === 0 ? (
        <Empty description="暂无提醒" />
      ) : (
        <List
          dataSource={alerts}
          renderItem={(alert) => (
            <List.Item
              className="alert-item"
              actions={[
                <Button
                  type="text"
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => removeAlert(alert.id)}
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <div style={{ fontSize: '24px', background: 'transparent' }}>
                    {(() => {
                      const deviceType = alert.deviceId.split('-')[0];
                      const iconKey = Object.keys(DEVICE_ICONS).find(key => 
                        deviceType.includes(key) || key.includes(deviceType)
                      ) as keyof typeof DEVICE_ICONS;
                      return DEVICE_ICONS[iconKey] || '📱';
                    })()}
                  </div>
                }
                title={
                  <div>
                    <Tag color={getAlertColor(alert.type)}>{getAlertText(alert.type)}</Tag>
                    <Text strong>{alert.deviceName}</Text>
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary">{alert.message}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {dayjs(alert.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      )}
    </Drawer>
  );
};

export default AlertDrawer;

