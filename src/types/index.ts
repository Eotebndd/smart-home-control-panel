// 设备类型
export type DeviceType = 
  | 'light' 
  | 'air_conditioner' 
  | 'door_lock' 
  | 'camera' 
  | 'sensor' 
  | 'curtain' 
  | 'refrigerator' 
  | 'tv' 
  | 'speaker' 
  | 'fan' 
  | 'heater' 
  | 'humidifier' 
  | 'dehumidifier' 
  | 'washing_machine' 
  | 'dishwasher' 
  | 'oven' 
  | 'vacuum' 
  | 'gateway' 
  | 'switch' 
  | 'outlet' 
  | 'thermostat' 
  | 'smoke_detector' 
  | 'motion_sensor';

// 设备状态
export type DeviceStatus = 'online' | 'offline' | 'error' | 'warning';

// 房间类型
export type RoomType = 'living_room' | 'bedroom' | 'kitchen' | 'bathroom' | 'study' | 'balcony' | 'hallway';

// 设备接口
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: RoomType;
  status: DeviceStatus;
  position: { x: number; y: number; z: number };
  properties: DeviceProperties;
  lastUpdate: number;
  energy?: EnergyData;
}

// 设备属性
export interface DeviceProperties {
  power?: boolean;
  brightness?: number;
  temperature?: number;
  humidity?: number;
  mode?: string;
  speed?: number;
  color?: string;
  [key: string]: any;
}

// 能源数据
export interface EnergyData {
  current: number; // 当前功率 (W)
  today: number; // 今日用电量 (kWh)
  week: number; // 本周用电量 (kWh)
  month: number; // 本月用电量 (kWh)
}

// 场景接口
export interface Scene {
  id: string;
  name: string;
  description: string;
  icon: string;
  devices: SceneDevice[];
  trigger?: SceneTrigger;
  isPreset: boolean;
  isActive: boolean;
}

// 场景设备动作
export interface SceneDevice {
  deviceId: string;
  actions: Record<string, any>;
}

// 场景触发器
export interface SceneTrigger {
  type: 'manual' | 'time' | 'condition' | 'ai';
  value?: string | Condition;
}

// 条件触发器
export interface Condition {
  deviceId: string;
  property: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  value: any;
}

// 告警信息
export interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  deviceId: string;
  deviceName: string;
  message: string;
  timestamp: number;
  position?: { x: number; y: number; z: number };
}

// 能耗统计
export interface EnergyStats {
  total: number;
  byDevice: Array<{ deviceId: string; deviceName: string; value: number }>;
  byRoom: Array<{ room: RoomType; value: number }>;
  trend: Array<{ date: string; value: number }>;
}

// WebSocket消息
export interface WSMessage {
  type: 'device_update' | 'alert' | 'scene_triggered' | 'energy_update' | 'status';
  data: any;
  timestamp: number;
}

