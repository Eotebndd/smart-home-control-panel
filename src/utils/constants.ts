import type { RoomType, DeviceType } from '@/types';

// 房间中文名称映射
export const ROOM_NAMES: Record<RoomType, string> = {
  living_room: '客厅',
  bedroom: '卧室',
  kitchen: '厨房',
  bathroom: '卫生间',
  study: '书房',
  balcony: '阳台',
  hallway: '走廊',
};

// 设备类型中文名称映射
export const DEVICE_TYPE_NAMES: Record<DeviceType, string> = {
  light: '灯光',
  air_conditioner: '空调',
  door_lock: '门锁',
  camera: '摄像头',
  sensor: '传感器',
  curtain: '窗帘',
  refrigerator: '冰箱',
  tv: '电视',
  speaker: '音响',
  fan: '风扇',
  heater: '取暖器',
  humidifier: '加湿器',
  dehumidifier: '除湿器',
  washing_machine: '洗衣机',
  dishwasher: '洗碗机',
  oven: '烤箱',
  vacuum: '扫地机器人',
  gateway: '网关',
  switch: '开关',
  outlet: '插座',
  thermostat: '温控器',
  smoke_detector: '烟雾报警器',
  motion_sensor: '人体传感器',
};

// 设备状态颜色映射
export const STATUS_COLORS: Record<string, string> = {
  online: '#52c41a',
  offline: '#8c8c8c',
  error: '#ff4d4f',
  warning: '#faad14',
};

// 设备图标映射
export const DEVICE_ICONS: Record<DeviceType, string> = {
  light: '💡',
  air_conditioner: '❄️',
  door_lock: '🔒',
  camera: '📷',
  sensor: '📡',
  curtain: '🪟',
  refrigerator: '❄️',
  tv: '📺',
  speaker: '🔊',
  fan: '🌀',
  heater: '🔥',
  humidifier: '💧',
  dehumidifier: '🌬️',
  washing_machine: '🧺',
  dishwasher: '🍽️',
  oven: '🔥',
  vacuum: '🤖',
  gateway: '🌐',
  switch: '🔌',
  outlet: '⚡',
  thermostat: '🌡️',
  smoke_detector: '🚨',
  motion_sensor: '👤',
};

