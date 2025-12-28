import React from 'react';
import { Card, Badge, Space, Typography, Switch, Slider } from 'antd';
import { useStore } from '@/store/useStore';
import { wsService } from '@/services/websocket';
import { DEVICE_ICONS, STATUS_COLORS, DEVICE_TYPE_NAMES } from '@/utils/constants';
import type { Device } from '@/types';
import './DeviceCard.css';

const { Text, Title } = Typography;

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { updateDevice } = useStore();
  const statusColor = STATUS_COLORS[device.status] || '#8c8c8c';

  const handlePowerToggle = (checked: boolean) => {
    wsService.sendCommand(device.id, { ...device.properties, power: checked });
  };

  const handleBrightnessChange = (value: number) => {
    wsService.sendCommand(device.id, { ...device.properties, brightness: value });
  };

  const handleTemperatureChange = (value: number) => {
    wsService.sendCommand(device.id, { ...device.properties, temperature: value });
  };

  return (
    <Card
      className="device-card"
      hoverable
      cover={
        <div className="device-card-cover" style={{ backgroundColor: statusColor + '20' }}>
          <div className="device-icon">{DEVICE_ICONS[device.type]}</div>
          <Badge
            status={device.status === 'online' ? 'success' : 'default'}
            text={device.status === 'online' ? '在线' : '离线'}
          />
        </div>
      }
    >
      <Title level={5}>{device.name}</Title>
      <Text type="secondary">{DEVICE_TYPE_NAMES[device.type]}</Text>

      <div className="device-controls">
        {device.properties.power !== undefined && (
          <div className="control-item">
            <Space>
              <Text>开关</Text>
              <Switch
                checked={device.properties.power}
                onChange={handlePowerToggle}
                disabled={device.status !== 'online'}
              />
            </Space>
          </div>
        )}

        {device.properties.brightness !== undefined && (
          <div className="control-item">
            <Text>亮度: {device.properties.brightness}%</Text>
            <Slider
              min={0}
              max={100}
              value={device.properties.brightness}
              onChange={handleBrightnessChange}
              disabled={device.status !== 'online' || !device.properties.power}
            />
          </div>
        )}

        {device.properties.temperature !== undefined && (
          <div className="control-item">
            <Text>温度: {device.properties.temperature}°C</Text>
            <Slider
              min={16}
              max={30}
              value={device.properties.temperature}
              onChange={handleTemperatureChange}
              disabled={device.status !== 'online' || !device.properties.power}
            />
          </div>
        )}

        {device.properties.humidity !== undefined && (
          <div className="control-item">
            <Text>湿度: {device.properties.humidity}%</Text>
          </div>
        )}

        {device.energy && (
          <div className="control-item">
            <Text type="secondary">
              今日用电: {device.energy.today.toFixed(2)} kWh
            </Text>
          </div>
        )}
      </div>
    </Card>
  );
};

export default DeviceCard;

