import type { Device, Scene, EnergyStats } from '@/types';

// 模拟设备数据
export const mockDevices: Device[] = [
  {
    id: 'light-001',
    name: '客厅主灯',
    type: 'light',
    room: 'living_room',
    status: 'online',
    position: { x: 3, y: 2.7, z: 3 }, // 天花板中央，房间中心
    properties: { power: true, brightness: 80, color: '#ffffff' },
    lastUpdate: Date.now(),
    energy: { current: 12, today: 0.5, week: 3.2, month: 12.8 },
  },
  {
    id: 'ac-001',
    name: '客厅空调',
    type: 'air_conditioner',
    room: 'living_room',
    status: 'online',
    position: { x: 5, y: 2.3, z: 0.3 }, // 墙上，靠近后墙
    properties: { power: true, temperature: 24, mode: 'cool', speed: 3 },
    lastUpdate: Date.now(),
    energy: { current: 1500, today: 8.5, week: 56.2, month: 220.5 },
  },
  {
    id: 'door-001',
    name: '智能门锁',
    type: 'door_lock',
    room: 'hallway',
    status: 'online',
    position: { x: 6.75, y: 1.2, z: 1 }, // 走廊内
    properties: { locked: true, battery: 85 },
    lastUpdate: Date.now(),
  },
  {
    id: 'camera-001',
    name: '客厅摄像头',
    type: 'camera',
    room: 'living_room',
    status: 'online',
    position: { x: 0.5, y: 2.5, z: 0.5 }, // 角落高处
    properties: { recording: true, motion: false },
    lastUpdate: Date.now(),
    energy: { current: 8, today: 0.2, week: 1.4, month: 5.6 },
  },
  {
    id: 'curtain-001',
    name: '客厅窗帘',
    type: 'curtain',
    room: 'living_room',
    status: 'online',
    position: { x: 5, y: 1.6, z: 0.3 }, // 窗户位置，靠墙
    properties: { open: 60 },
    lastUpdate: Date.now(),
    energy: { current: 2, today: 0.05, week: 0.3, month: 1.2 },
  },
  {
    id: 'fridge-001',
    name: '厨房冰箱',
    type: 'refrigerator',
    room: 'kitchen',
    status: 'online',
    position: { x: 0.8, y: 1.8, z: 9.5 }, // 厨房靠墙
    properties: { temperature: 4, mode: 'normal' },
    lastUpdate: Date.now(),
    energy: { current: 120, today: 2.8, week: 19.6, month: 78.4 },
  },
  {
    id: 'sensor-001',
    name: '温湿度传感器',
    type: 'sensor',
    room: 'living_room',
    status: 'online',
    position: { x: 1.5, y: 1.6, z: 4 }, // 房间内
    properties: { temperature: 24, humidity: 55, pm25: 35 },
    lastUpdate: Date.now(),
  },
  {
    id: 'tv-001',
    name: '客厅电视',
    type: 'tv',
    room: 'living_room',
    status: 'online',
    position: { x: 4.5, y: 1.3, z: 0.8 }, // 电视墙，对着沙发
    properties: { power: false, volume: 30 },
    lastUpdate: Date.now(),
    energy: { current: 0, today: 1.2, week: 8.4, month: 33.6 },
  },
  {
    id: 'light-002',
    name: '卧室主灯',
    type: 'light',
    room: 'bedroom',
    status: 'online',
    position: { x: 10.5, y: 2.7, z: 3 }, // 天花板中央，房间中心
    properties: { power: false, brightness: 0, color: '#ffffff' },
    lastUpdate: Date.now(),
    energy: { current: 0, today: 0.3, week: 2.1, month: 8.4 },
  },
  {
    id: 'ac-002',
    name: '卧室空调',
    type: 'air_conditioner',
    room: 'bedroom',
    status: 'online',
    position: { x: 12, y: 2.3, z: 0.3 }, // 墙上，靠近后墙
    properties: { power: true, temperature: 26, mode: 'sleep', speed: 1 },
    lastUpdate: Date.now(),
    energy: { current: 800, today: 5.2, week: 34.4, month: 135.2 },
  },
];

// 模拟场景数据
export const mockScenes: Scene[] = [
  {
    id: 'scene-sleep',
    name: '睡眠模式',
    description: '关灯+调温至24℃+拉窗帘+开启睡眠监测',
    icon: '🌙',
    isPreset: true,
    isActive: false,
    devices: [
      { deviceId: 'light-002', actions: { power: false } },
      { deviceId: 'ac-002', actions: { temperature: 24, mode: 'sleep', speed: 1 } },
      { deviceId: 'curtain-001', actions: { open: 0 } },
    ],
  },
  {
    id: 'scene-leave',
    name: '离家模式',
    description: '锁门+关家电+启动安防摄像头+降低路由器功耗',
    icon: '🚪',
    isPreset: true,
    isActive: false,
    devices: [
      { deviceId: 'door-001', actions: { locked: true } },
      { deviceId: 'light-001', actions: { power: false } },
      { deviceId: 'tv-001', actions: { power: false } },
      { deviceId: 'camera-001', actions: { recording: true, motion: true } },
    ],
  },
  {
    id: 'scene-elderly',
    name: '养老守护模式',
    description: '监测跌倒/异常静止+联动床垫抬升床头+推送预警给家属',
    icon: '👴',
    isPreset: true,
    isActive: false,
    devices: [],
  },
  {
    id: 'scene-energy',
    name: '节能模式',
    description: '降低非必要设备功耗，优化能源使用',
    icon: '🌱',
    isPreset: true,
    isActive: false,
    devices: [
      { deviceId: 'ac-001', actions: { temperature: 26, speed: 2 } },
      { deviceId: 'light-001', actions: { brightness: 50 } },
    ],
  },
];

// 模拟能源统计数据
export const mockEnergyStats: EnergyStats = {
  total: 245.6,
  byDevice: [
    { deviceId: 'ac-001', deviceName: '客厅空调', value: 220.5 },
    { deviceId: 'ac-002', deviceName: '卧室空调', value: 135.2 },
    { deviceId: 'fridge-001', deviceName: '厨房冰箱', value: 78.4 },
    { deviceId: 'tv-001', deviceName: '客厅电视', value: 33.6 },
    { deviceId: 'light-001', deviceName: '客厅主灯', value: 12.8 },
    { deviceId: 'light-002', deviceName: '卧室主灯', value: 8.4 },
    { deviceId: 'camera-001', deviceName: '客厅摄像头', value: 5.6 },
    { deviceId: 'curtain-001', deviceName: '客厅窗帘', value: 1.2 },
  ],
  byRoom: [
    { room: 'living_room', value: 280.1 },
    { room: 'bedroom', value: 145.6 },
    { room: 'kitchen', value: 78.4 },
  ],
  trend: [
    { date: '2025-01-01', value: 8.2 },
    { date: '2025-01-02', value: 7.8 },
    { date: '2025-01-03', value: 8.5 },
    { date: '2025-01-04', value: 7.9 },
    { date: '2025-01-05', value: 8.1 },
    { date: '2025-01-06', value: 7.6 },
    { date: '2025-01-07', value: 8.3 },
  ],
};

