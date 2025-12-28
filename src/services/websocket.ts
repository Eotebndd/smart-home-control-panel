import { io, Socket } from 'socket.io-client';
import type { WSMessage, Device, Alert } from '@/types';
import { useStore } from '@/store/useStore';

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  connect(url?: string) {
    if (this.socket?.connected) {
      return;
    }

    // 模拟WebSocket连接（实际项目中应连接真实边缘网关）
    // 在演示模式下，我们直接模拟连接成功
    // 实际部署时，取消注释下面的代码并配置真实的边缘网关URL
    /*
    this.socket = io(url || 'ws://your-edge-gateway-url', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      useStore.getState().setIsOnline(true);
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      useStore.getState().setIsOnline(false);
      useStore.getState().setIsLocalMode(true);
    });

    this.socket.on('message', (message: WSMessage) => {
      this.handleMessage(message);
    });
    */

    // 演示模式：直接设置为在线状态
    console.log('WebSocket connected (demo mode)');
    useStore.getState().setIsOnline(true);
    useStore.getState().setIsLocalMode(false);

    // 模拟消息（实际项目中由边缘网关推送）
    this.startMockMessages();
  }

  private handleMessage(message: WSMessage) {
    const { type, data } = message;

    switch (type) {
      case 'device_update':
        useStore.getState().updateDevice(data.deviceId, data.updates);
        break;

      case 'alert':
        useStore.getState().addAlert(data as Alert);
        break;

      case 'scene_triggered':
        useStore.getState().activateScene(data.sceneId);
        break;

      case 'energy_update':
        useStore.getState().setEnergyStats(data);
        break;

      case 'status':
        useStore.getState().setIsOnline(data.online);
        useStore.getState().setIsLocalMode(data.localMode);
        break;
    }
  }

  // 模拟边缘网关消息推送
  private startMockMessages() {
    // 模拟设备状态更新
    setInterval(() => {
      const devices = useStore.getState().devices;
      if (devices.length > 0) {
        const randomDevice = devices[Math.floor(Math.random() * devices.length)];
        const updates: Partial<Device> = {};

        if (randomDevice.type === 'sensor') {
          updates.properties = {
            ...randomDevice.properties,
            temperature: 20 + Math.random() * 8,
            humidity: 40 + Math.random() * 30,
            pm25: 20 + Math.random() * 40,
          };
        } else if (randomDevice.type === 'air_conditioner') {
          updates.properties = {
            ...randomDevice.properties,
            temperature: 22 + Math.random() * 4,
          };
        }

        if (Object.keys(updates).length > 0) {
          // 直接更新状态（模拟边缘网关推送）
          this.handleMessage({
            type: 'device_update',
            data: {
              deviceId: randomDevice.id,
              updates,
            },
            timestamp: Date.now(),
          });
        }
      }
    }, 5000); // 每5秒更新一次

    // 模拟告警（低概率）
    setInterval(() => {
      if (Math.random() < 0.1) {
        const devices = useStore.getState().devices;
        if (devices.length > 0) {
          const randomDevice = devices[Math.floor(Math.random() * devices.length)];
          this.handleMessage({
            type: 'alert',
            data: {
              id: `alert-${Date.now()}`,
              type: 'warning',
              deviceId: randomDevice.id,
              deviceName: randomDevice.name,
              message: `${randomDevice.name}状态异常，请检查`,
              timestamp: Date.now(),
              position: randomDevice.position,
            },
            timestamp: Date.now(),
          });
        }
      }
    }, 30000); // 每30秒可能触发一次告警
  }

  sendCommand(deviceId: string, command: Record<string, any>) {
    // 实际项目中，这里应该发送到边缘网关
    // if (this.socket?.connected) {
    //   this.socket.emit('command', {
    //     deviceId,
    //     command,
    //     timestamp: Date.now(),
    //   });
    // }
    
    // 立即更新本地状态（模拟边缘网关响应，延迟<30ms）
    setTimeout(() => {
      useStore.getState().updateDevice(deviceId, {
        properties: command,
      });
    }, 20); // 模拟20ms延迟
  }

  triggerScene(sceneId: string) {
    // 实际项目中，这里应该发送到边缘网关
    // if (this.socket?.connected) {
    //   this.socket.emit('trigger_scene', {
    //     sceneId,
    //     timestamp: Date.now(),
    //   });
    // }
    
    // 执行场景动作
    const scene = useStore.getState().scenes.find((s) => s.id === sceneId);
    if (scene) {
      scene.devices.forEach((sceneDevice) => {
        this.sendCommand(sceneDevice.deviceId, sceneDevice.actions);
      });
      useStore.getState().activateScene(sceneId);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const wsService = new WebSocketService();

