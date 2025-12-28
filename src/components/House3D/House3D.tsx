import React, { useRef, Suspense, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text, Html, Billboard } from '@react-three/drei';
import { Drawer, Descriptions, Switch, Slider, Space, Typography, InputNumber, Button } from 'antd';
import { useStore } from '@/store/useStore';
import { wsService } from '@/services/websocket';
import { DEVICE_ICONS, STATUS_COLORS, DEVICE_TYPE_NAMES, ROOM_NAMES } from '@/utils/constants';
import type { Device } from '@/types';
import * as THREE from 'three';
import './House3D.css';

const { Text: AntText } = Typography;

interface DeviceMarkerProps {
  device: Device;
  onClick: () => void;
  showControls?: boolean;
}

// 设备标记组件，带脉冲动画和开关状态显示
const DeviceMarker: React.FC<DeviceMarkerProps> = ({ device, onClick, showControls }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const statusColor = STATUS_COLORS[device.status] || '#8c8c8c';
  const isOn = device.properties.power === true;
  const intensity = isOn ? 1.2 : 0.3;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      // 脉冲效果（开启时更明显）
      const scale = isOn 
        ? 1 + Math.sin(state.clock.elapsedTime * 3) * 0.15
        : 1 + Math.sin(state.clock.elapsedTime * 1) * 0.05;
      meshRef.current.scale.setScalar(scale);
    }
  });

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newPower = !device.properties.power;
    wsService.sendCommand(device.id, { ...device.properties, power: newPower });
  };

  return (
    <group position={[device.position.x, device.position.y, device.position.z]}>
      <mesh 
        ref={meshRef} 
        onClick={onClick} 
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }} 
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial 
          color={isOn ? statusColor : '#8c8c8c'} 
          emissive={isOn ? statusColor : '#4a5568'} 
          emissiveIntensity={intensity}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <Billboard>
        <Text
          position={[0, 0.6, 0]}
          fontSize={0.35}
          color={isOn ? "#1a202c" : "#718096"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.05}
          outlineColor="#ffffff"
          fontWeight="bold"
        >
          {device.name}
        </Text>
      </Billboard>
      <Html position={[0, 0.4, 0]} center>
        <div style={{ 
          fontSize: '24px', 
          textAlign: 'center',
          opacity: isOn ? 1 : 0.5,
          filter: isOn ? 'none' : 'grayscale(100%)',
          transition: 'all 0.3s',
          background: 'transparent',
          padding: 0,
          margin: 0,
          border: 'none',
          boxShadow: 'none'
        }}>
          {DEVICE_ICONS[device.type]}
        </div>
      </Html>
      {showControls && device.properties.power !== undefined && (
        <Html position={[0, -0.3, 0]} center>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: `2px solid ${isOn ? statusColor : '#cbd5e0'}`,
            cursor: 'pointer',
            userSelect: 'none'
          }} onClick={handleToggle}>
            <Switch 
              checked={isOn} 
              size="small"
              style={{ pointerEvents: 'none' }}
            />
          </div>
        </Html>
      )}
    </group>
  );
};

// 房间组件 - 更合理的户型设计
const Room: React.FC<{
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  name: string;
  doorPosition?: 'left' | 'right' | 'front' | 'back';
}> = ({ position, size, color, name, doorPosition }) => {
  const wallThickness = 0.15;
  const doorWidth = 1.2;
  const doorHeight = 2;

  return (
    <group position={position}>
      {/* 地板 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[2]]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      
      {/* 天花板 */}
      <mesh position={[0, size[1], 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[size[0], size[2]]} />
        <meshStandardMaterial color="#f8fafc" />
      </mesh>

      {/* 后墙 */}
      {doorPosition !== 'back' && (
        <mesh position={[0, size[1] / 2, -size[2] / 2]} receiveShadow>
          <boxGeometry args={[size[0], size[1], wallThickness]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
      )}
      {doorPosition === 'back' && (
        <>
          <mesh position={[-(size[0] - doorWidth) / 4, size[1] / 2, -size[2] / 2]} receiveShadow>
            <boxGeometry args={[size[0] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[(size[0] - doorWidth) / 4, size[1] / 2, -size[2] / 2]} receiveShadow>
            <boxGeometry args={[size[0] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[0, doorHeight / 2, -size[2] / 2]} receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </>
      )}

      {/* 前墙 */}
      {doorPosition !== 'front' && (
        <mesh position={[0, size[1] / 2, size[2] / 2]} receiveShadow>
          <boxGeometry args={[size[0], size[1], wallThickness]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
      )}
      {doorPosition === 'front' && (
        <>
          <mesh position={[-(size[0] - doorWidth) / 4, size[1] / 2, size[2] / 2]} receiveShadow>
            <boxGeometry args={[size[0] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[(size[0] - doorWidth) / 4, size[1] / 2, size[2] / 2]} receiveShadow>
            <boxGeometry args={[size[0] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[0, doorHeight / 2, size[2] / 2]} receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </>
      )}

      {/* 左墙 */}
      {doorPosition !== 'left' && (
        <mesh position={[-size[0] / 2, size[1] / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[size[2], size[1], wallThickness]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
      )}
      {doorPosition === 'left' && (
        <>
          <mesh position={[-size[0] / 2, size[1] / 2, -size[2] / 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[size[2] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[-size[0] / 2, size[1] / 2, size[2] / 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[size[2] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[-size[0] / 2, doorHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </>
      )}

      {/* 右墙 */}
      {doorPosition !== 'right' && (
        <mesh position={[size[0] / 2, size[1] / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <boxGeometry args={[size[2], size[1], wallThickness]} />
          <meshStandardMaterial color="#cbd5e0" />
        </mesh>
      )}
      {doorPosition === 'right' && (
        <>
          <mesh position={[size[0] / 2, size[1] / 2, -size[2] / 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[size[2] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[size[0] / 2, size[1] / 2, size[2] / 4]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[size[2] / 2 - doorWidth / 2, size[1], wallThickness]} />
            <meshStandardMaterial color="#cbd5e0" />
          </mesh>
          <mesh position={[size[0] / 2, doorHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
            <boxGeometry args={[doorWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
        </>
      )}

      {/* 房间标签 */}
      <Billboard>
        <Text
          position={[0, size[1] + 0.5, 0]}
          fontSize={0.7}
          color="#1a202c"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="#ffffff"
          fontWeight="bold"
        >
          {name}
        </Text>
      </Billboard>
    </group>
  );
};

// 家具组件
const Furniture: React.FC<{
  type: 'sofa' | 'table' | 'bed' | 'tv' | 'cabinet';
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ type, position, rotation = [0, 0, 0] }) => {
  const colors: Record<string, string> = {
    sofa: '#8b5cf6',
    table: '#f59e0b',
    bed: '#ec4899',
    tv: '#1f2937',
    cabinet: '#64748b',
  };

  return (
    <group position={position} rotation={rotation} castShadow>
      {type === 'sofa' && (
        <>
          <mesh>
            <boxGeometry args={[2, 0.5, 0.8]} />
            <meshStandardMaterial color={colors.sofa} />
          </mesh>
          <mesh position={[-1, 0.5, 0]}>
            <boxGeometry args={[0.2, 1, 0.8]} />
            <meshStandardMaterial color={colors.sofa} />
          </mesh>
        </>
      )}
      {type === 'table' && (
        <>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
            <meshStandardMaterial color={colors.table} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <cylinderGeometry args={[0.5, 0.5, 0.05, 32]} />
            <meshStandardMaterial color={colors.table} />
          </mesh>
        </>
      )}
      {type === 'bed' && (
        <>
          <mesh>
            <boxGeometry args={[2, 0.4, 1.5]} />
            <meshStandardMaterial color={colors.bed} />
          </mesh>
          <mesh position={[-1, 0.5, 0]}>
            <boxGeometry args={[0.2, 1, 1.5]} />
            <meshStandardMaterial color={colors.bed} />
          </mesh>
        </>
      )}
      {type === 'tv' && (
        <mesh>
          <boxGeometry args={[1.5, 0.9, 0.1]} />
          <meshStandardMaterial color={colors.tv} metalness={0.8} roughness={0.2} />
        </mesh>
      )}
      {type === 'cabinet' && (
        <mesh>
          <boxGeometry args={[1.5, 1.2, 0.6]} />
          <meshStandardMaterial color={colors.cabinet} />
        </mesh>
      )}
    </group>
  );
};

// 窗帘组件 - 根据开合度显示
const Curtain: React.FC<{
  device: Device;
  onClick: () => void;
}> = ({ device, onClick }) => {
  const openPercent = device.properties.open || 0; // 0-100，0为完全关闭，100为完全打开
  const closedPercent = 100 - openPercent;
  
  // 窗帘位置，假设在窗户位置（靠墙）
  const position: [number, number, number] = [
    device.position.x,
    device.position.y,
    device.position.z,
  ];

  return (
    <group position={position} onClick={onClick}>
      {/* 窗帘轨道 */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[2, 0.05, 0.05]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* 左窗帘（从左边打开） */}
      <mesh 
        position={[-1 + (closedPercent / 100), 0.25, 0]} 
        castShadow
      >
        <boxGeometry args={[2 * (closedPercent / 100), 2, 0.02]} />
        <meshStandardMaterial 
          color={openPercent > 50 ? '#fef3c7' : '#e2e8f0'} 
          roughness={0.8}
          opacity={0.9}
          transparent
        />
      </mesh>
      
      {/* 右窗帘（从右边打开） */}
      <mesh 
        position={[1 - (closedPercent / 100), 0.25, 0]} 
        castShadow
      >
        <boxGeometry args={[2 * (closedPercent / 100), 2, 0.02]} />
        <meshStandardMaterial 
          color={openPercent > 50 ? '#fef3c7' : '#e2e8f0'} 
          roughness={0.8}
          opacity={0.9}
          transparent
        />
      </mesh>
    </group>
  );
};

const House3D: React.FC = () => {
  const { devices, selectedDevice, setSelectedDevice, updateDevice } = useStore();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [showControls, setShowControls] = React.useState(false);

  // 实时更新设备状态
  useEffect(() => {
    const interval = setInterval(() => {
      devices.forEach((device) => {
        if (device.status === 'online') {
          // 模拟实时数据更新
          if (device.type === 'sensor') {
            updateDevice(device.id, {
              properties: {
                ...device.properties,
                temperature: 20 + Math.random() * 8,
                humidity: 40 + Math.random() * 30,
              },
            });
          }
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [devices, updateDevice]);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setDrawerOpen(true);
  };

  const handleDeviceControl = (deviceId: string, property: string, value: any) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      wsService.sendCommand(deviceId, {
        ...device.properties,
        [property]: value,
      });
    }
  };

  return (
    <>
      <div className="house-3d-container">
        <div style={{ 
          position: 'absolute', 
          top: 10, 
          right: 10, 
          zIndex: 10,
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <Button 
            size="small" 
            type={showControls ? 'primary' : 'default'}
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? '隐藏开关' : '显示开关'}
          </Button>
        </div>
        <Canvas shadows camera={{ position: [15, 13, 15], fov: 50 }}>
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={[15, 13, 15]} fov={50} />
            
            {/* 环境光 */}
            <ambientLight intensity={0.7} />
            <directionalLight 
              position={[10, 15, 8]} 
              intensity={1.5} 
              castShadow 
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
              shadow-camera-left={-10}
              shadow-camera-right={10}
              shadow-camera-top={10}
              shadow-camera-bottom={-10}
            />
            <pointLight position={[0, 10, 0]} intensity={0.4} />

            {/* 房间布局 - 合理户型设计，每个房间的底板作为边界，所有房间都有门连接走廊 */}
            {/* 注意：position是房间的中心点，不是左下角 */}
            {/* 客厅 - 左上，6x6，中心在[3, 0, 3]，占据x:0-6, z:0-6，门在右边连接走廊 */}
            <Room position={[3, 0, 3]} size={[6, 3, 6]} color="#fef3c7" name="客厅" doorPosition="right" />
            {/* 卧室 - 右上，6x6，中心在[10.5, 0, 3]，占据x:7.5-13.5, z:0-6，门在左边连接走廊 */}
            <Room position={[10.5, 0, 3]} size={[6, 3, 6]} color="#dbeafe" name="卧室" doorPosition="left" />
            {/* 厨房 - 左下，6x5，中心在[3, 0, 9.5]，占据x:0-6, z:7-12，门在右边连接走廊 */}
            <Room position={[3, 0, 9.5]} size={[6, 3, 5]} color="#fce7f3" name="厨房" doorPosition="right" />
            {/* 书房 - 右下，6x5，中心在[10.5, 0, 9.5]，占据x:7.5-13.5, z:7-12，门在左边连接走廊 */}
            <Room position={[10.5, 0, 9.5]} size={[6, 3, 5]} color="#e0e7ff" name="书房" doorPosition="left" />
            {/* 走廊 - 中间纵向，1.5x12，中心在[6.75, 0, 6]，占据x:6-7.5, z:0-12，连接所有房间 */}
            <Room position={[6.75, 0, 6]} size={[1.5, 3, 12]} color="#f1f5f9" name="走廊" />

            {/* 家具 - 客厅（房间中心在[3, 0, 3]） */}
            <Furniture type="sofa" position={[1.5, 0.25, 2]} />
            <Furniture type="table" position={[3, 0.2, 2]} />
            <Furniture type="tv" position={[5, 1.5, 0.5]} rotation={[0, Math.PI, 0]} />
            <Furniture type="cabinet" position={[5, 0.6, 0.5]} rotation={[0, Math.PI, 0]} />
            {/* 家具 - 卧室（房间中心在[10.5, 0, 3]） */}
            <Furniture type="bed" position={[9.5, 0.2, 2]} />
            <Furniture type="cabinet" position={[12, 0.6, 2]} />
            {/* 家具 - 厨房（房间中心在[3, 0, 9.5]） */}
            <Furniture type="cabinet" position={[2, 0.6, 9]} />
            <Furniture type="table" position={[4, 0.2, 9]} />
            {/* 家具 - 书房（房间中心在[10.5, 0, 9.5]） */}
            <Furniture type="table" position={[9.5, 0.2, 9]} />
            <Furniture type="cabinet" position={[12, 0.6, 9]} />

            {/* 窗帘3D模型 */}
            {devices
              .filter((device) => device.type === 'curtain')
              .map((device) => (
                <Curtain
                  key={device.id}
                  device={device}
                  onClick={() => handleDeviceClick(device)}
                />
              ))}

            {/* 设备标记（排除窗帘，因为窗帘使用3D模型） */}
            {devices
              .filter((device) => device.type !== 'curtain')
              .map((device) => (
                <DeviceMarker
                  key={device.id}
                  device={device}
                  onClick={() => handleDeviceClick(device)}
                  showControls={showControls}
                />
              ))}

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              minDistance={12}
              maxDistance={35}
              target={[6.75, 0, 6]}
            />
          </Suspense>
        </Canvas>
      </div>

      <Drawer
        title={
          selectedDevice ? (
            <Space>
              <span style={{ fontSize: '24px' }}>{DEVICE_ICONS[selectedDevice.type]}</span>
              <span>{selectedDevice.name}</span>
            </Space>
          ) : (
            '设备详情'
          )
        }
        placement="right"
        onClose={() => {
          setDrawerOpen(false);
          setSelectedDevice(null);
        }}
        open={drawerOpen}
        width={450}
        className="device-detail-drawer"
      >
        {selectedDevice && (
          <div className="device-detail-content">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="设备类型">
                {DEVICE_TYPE_NAMES[selectedDevice.type]}
              </Descriptions.Item>
              <Descriptions.Item label="所在房间">
                {ROOM_NAMES[selectedDevice.room]}
              </Descriptions.Item>
              <Descriptions.Item label="状态">
                <span style={{ 
                  color: STATUS_COLORS[selectedDevice.status],
                  fontWeight: 'bold'
                }}>
                  {selectedDevice.status === 'online' ? '在线' : 
                   selectedDevice.status === 'offline' ? '离线' : 
                   selectedDevice.status === 'error' ? '异常' : '警告'}
                </span>
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 16, color: '#2d3748' }}>设备控制</h4>
              
              {selectedDevice.properties.power !== undefined && (
                <div style={{ marginBottom: 20, padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                    <AntText strong>开关</AntText>
                    <Switch
                      checked={selectedDevice.properties.power}
                      onChange={(checked) => handleDeviceControl(selectedDevice.id, 'power', checked)}
                      disabled={selectedDevice.status !== 'online'}
                    />
                  </Space>
                </div>
              )}

              {selectedDevice.properties.brightness !== undefined && (
                <div style={{ marginBottom: 20, padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AntText strong>亮度</AntText>
                      <InputNumber
                        min={0}
                        max={100}
                        value={selectedDevice.properties.brightness}
                        onChange={(value) => handleDeviceControl(selectedDevice.id, 'brightness', value || 0)}
                        disabled={selectedDevice.status !== 'online' || !selectedDevice.properties.power}
                        addonAfter="%"
                        style={{ width: 100 }}
                      />
                    </Space>
                    <Slider
                      min={0}
                      max={100}
                      value={selectedDevice.properties.brightness}
                      onChange={(value) => handleDeviceControl(selectedDevice.id, 'brightness', value)}
                      disabled={selectedDevice.status !== 'online' || !selectedDevice.properties.power}
                    />
                  </Space>
                </div>
              )}

              {selectedDevice.properties.temperature !== undefined && (
                <div style={{ marginBottom: 20, padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AntText strong>温度</AntText>
                      <InputNumber
                        min={selectedDevice.type === 'refrigerator' ? 2 : 16}
                        max={selectedDevice.type === 'refrigerator' ? 8 : 30}
                        value={selectedDevice.properties.temperature}
                        onChange={(value) => handleDeviceControl(selectedDevice.id, 'temperature', value || (selectedDevice.type === 'refrigerator' ? 4 : 24))}
                        disabled={selectedDevice.status !== 'online' || (selectedDevice.properties.power !== undefined && !selectedDevice.properties.power)}
                        addonAfter="°C"
                        style={{ width: 100 }}
                      />
                    </Space>
                    <Slider
                      min={selectedDevice.type === 'refrigerator' ? 2 : 16}
                      max={selectedDevice.type === 'refrigerator' ? 8 : 30}
                      value={selectedDevice.properties.temperature}
                      onChange={(value) => handleDeviceControl(selectedDevice.id, 'temperature', value)}
                      disabled={selectedDevice.status !== 'online' || (selectedDevice.properties.power !== undefined && !selectedDevice.properties.power)}
                    />
                  </Space>
                </div>
              )}

              {selectedDevice.properties.open !== undefined && (
                <div style={{ marginBottom: 20, padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                      <AntText strong>开合度</AntText>
                      <InputNumber
                        min={0}
                        max={100}
                        value={selectedDevice.properties.open}
                        onChange={(value) => handleDeviceControl(selectedDevice.id, 'open', value || 0)}
                        disabled={selectedDevice.status !== 'online'}
                        addonAfter="%"
                        style={{ width: 100 }}
                      />
                    </Space>
                    <Slider
                      min={0}
                      max={100}
                      value={selectedDevice.properties.open}
                      onChange={(value) => handleDeviceControl(selectedDevice.id, 'open', value)}
                      disabled={selectedDevice.status !== 'online'}
                    />
                  </Space>
                </div>
              )}

              {selectedDevice.properties.humidity !== undefined && (
                <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
                  <Descriptions.Item label="温度">
                    {selectedDevice.properties.temperature}°C
                  </Descriptions.Item>
                  <Descriptions.Item label="湿度">
                    {selectedDevice.properties.humidity}%
                  </Descriptions.Item>
                  {selectedDevice.properties.pm25 !== undefined && (
                    <Descriptions.Item label="PM2.5">
                      {selectedDevice.properties.pm25}
                    </Descriptions.Item>
                  )}
                </Descriptions>
              )}

              {selectedDevice.energy && (
                <Descriptions column={1} bordered size="small" style={{ marginTop: 16 }}>
                  <Descriptions.Item label="当前功率">
                    {selectedDevice.energy.current}W
                  </Descriptions.Item>
                  <Descriptions.Item label="今日用电">
                    {selectedDevice.energy.today.toFixed(2)}kWh
                  </Descriptions.Item>
                  <Descriptions.Item label="本月用电">
                    {selectedDevice.energy.month.toFixed(2)}kWh
                  </Descriptions.Item>
                </Descriptions>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </>
  );
};

export default House3D;
