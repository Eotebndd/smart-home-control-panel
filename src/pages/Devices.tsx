import React, { useState } from 'react';
import { Row, Col, Tabs, Input, Select, Card } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import DeviceCard from '@/components/Device/DeviceCard';
import House3D from '@/components/House3D/House3D';
import { useStore } from '@/store/useStore';
import { ROOM_NAMES, DEVICE_TYPE_NAMES } from '@/utils/constants';
import type { RoomType, DeviceType } from '@/types';
import './Devices.css';

const { Search } = Input;
const { Option } = Select;

const Devices: React.FC = () => {
  const { devices } = useStore();
  const [searchText, setSearchText] = useState('');
  const [filterRoom, setFilterRoom] = useState<RoomType | 'all'>('all');
  const [filterType, setFilterType] = useState<DeviceType | 'all'>('all');

  const filteredDevices = devices.filter((device) => {
    const matchSearch = device.name.toLowerCase().includes(searchText.toLowerCase());
    const matchRoom = filterRoom === 'all' || device.room === filterRoom;
    const matchType = filterType === 'all' || device.type === filterType;
    return matchSearch && matchRoom && matchType;
  });

  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = [];
    }
    acc[device.room].push(device);
    return acc;
  }, {} as Record<RoomType, typeof devices>);

  return (
    <div className="devices-page">
      <Card 
        title={<span style={{ color: '#2d3748', fontWeight: 600 }}>3D全屋户型图</span>}
        className="card-glow"
        style={{ marginBottom: 16 }}
      >
        <House3D />
      </Card>

      <div style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={12} md={8}>
            <Search
              placeholder="搜索设备"
              allowClear
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择房间"
              value={filterRoom}
              onChange={setFilterRoom}
            >
              <Option value="all">全部房间</Option>
              {Object.entries(ROOM_NAMES).map(([key, name]) => (
                <Option key={key} value={key}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Select
              style={{ width: '100%' }}
              placeholder="选择设备类型"
              value={filterType}
              onChange={setFilterType}
            >
              <Option value="all">全部类型</Option>
              {Object.entries(DEVICE_TYPE_NAMES).map(([key, name]) => (
                <Option key={key} value={key}>
                  {name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <Tabs
        defaultActiveKey="all"
        items={[
          {
            key: 'all',
            label: '全部设备',
            children: (
              <Row gutter={[16, 16]}>
                {filteredDevices.map((device) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={device.id}>
                    <DeviceCard device={device} />
                  </Col>
                ))}
              </Row>
            ),
          },
          ...Object.entries(devicesByRoom).map(([room, roomDevices]) => ({
            key: room,
            label: ROOM_NAMES[room as RoomType],
            children: (
              <Row gutter={[16, 16]}>
                {roomDevices.map((device) => (
                  <Col xs={24} sm={12} md={8} lg={6} key={device.id}>
                    <DeviceCard device={device} />
                  </Col>
                ))}
              </Row>
            ),
          })),
        ]}
      />

    </div>
  );
};

export default Devices;

