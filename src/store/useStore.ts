import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Device, Scene, Alert, EnergyStats } from '@/types';

interface AppState {
  // 设备相关
  devices: Device[];
  selectedDevice: Device | null;
  
  // 场景相关
  scenes: Scene[];
  activeScenes: string[];
  
  // 告警相关
  alerts: Alert[];
  
  // 能源相关
  energyStats: EnergyStats | null;
  
  // UI状态
  isOnline: boolean;
  isLocalMode: boolean;
  
  // 设置相关
  settings: {
    lockControlOnlyFamily: boolean;
    disableThirdPartySleepData: boolean;
    enableDataMasking: boolean;
  };
  
  // Actions
  setDevices: (devices: Device[]) => void;
  updateDevice: (deviceId: string, updates: Partial<Device>) => void;
  setSelectedDevice: (device: Device | null) => void;
  
  setScenes: (scenes: Scene[]) => void;
  addScene: (scene: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  activateScene: (sceneId: string) => void;
  deactivateScene: (sceneId: string) => void;
  
  addAlert: (alert: Alert) => void;
  removeAlert: (alertId: string) => void;
  clearAlerts: () => void;
  
  setEnergyStats: (stats: EnergyStats) => void;
  
  setIsOnline: (online: boolean) => void;
  setIsLocalMode: (local: boolean) => void;
  updateSettings: (settings: Partial<AppState['settings']>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      // 初始状态
      devices: [],
      selectedDevice: null,
      scenes: [],
      activeScenes: [],
      alerts: [],
      energyStats: null,
      isOnline: true,
      isLocalMode: false,
      settings: {
        lockControlOnlyFamily: true,
        disableThirdPartySleepData: true,
        enableDataMasking: false,
      },
  
  // 设备操作
  setDevices: (devices: Device[]) => set({ devices }),
  
  updateDevice: (deviceId: string, updates: Partial<Device>) =>
    set((state: AppState) => ({
      devices: state.devices.map((d: Device) =>
        d.id === deviceId ? { ...d, ...updates, lastUpdate: Date.now() } : d
      ),
    })),
  
  setSelectedDevice: (device: Device | null) => set({ selectedDevice: device }),
  
  // 场景操作
  setScenes: (scenes: Scene[]) => set({ scenes }),
  
  addScene: (scene: Scene) =>
    set((state: AppState) => ({
      scenes: [...state.scenes, scene],
    })),
  
  updateScene: (sceneId: string, updates: Partial<Scene>) =>
    set((state: AppState) => ({
      scenes: state.scenes.map((s: Scene) =>
        s.id === sceneId ? { ...s, ...updates } : s
      ),
    })),
  
  activateScene: (sceneId: string) =>
    set((state: AppState) => ({
      activeScenes: [...state.activeScenes, sceneId],
      scenes: state.scenes.map((s: Scene) =>
        s.id === sceneId ? { ...s, isActive: true } : s
      ),
    })),
  
  deactivateScene: (sceneId: string) =>
    set((state: AppState) => ({
      activeScenes: state.activeScenes.filter((id: string) => id !== sceneId),
      scenes: state.scenes.map((s: Scene) =>
        s.id === sceneId ? { ...s, isActive: false } : s
      ),
    })),
  
  // 告警操作
  addAlert: (alert: Alert) =>
    set((state: AppState) => ({
      alerts: [alert, ...state.alerts].slice(0, 50), // 最多保留50条
    })),
  
  removeAlert: (alertId: string) =>
    set((state: AppState) => ({
      alerts: state.alerts.filter((a: Alert) => a.id !== alertId),
    })),
  
  clearAlerts: () => set({ alerts: [] }),
  
  // 能源操作
  setEnergyStats: (stats: EnergyStats) => set({ energyStats: stats }),
  
      // 网络状态
      setIsOnline: (online: boolean) => set({ isOnline: online }),
      setIsLocalMode: (local: boolean) => set({ isLocalMode: local }),
      
      // 设置操作
      updateSettings: (newSettings: Partial<AppState['settings']>) =>
        set((state: AppState) => ({
          settings: { ...state.settings, ...newSettings },
        })),
    }),
    {
      name: 'smart-home-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isLocalMode: state.isLocalMode,
        settings: state.settings,
        scenes: state.scenes.filter((s: Scene) => !s.isPreset), // 只持久化自定义场景
        // 保存设备状态（只保存关键属性，设备列表从mockData初始化）
        deviceStates: state.devices.reduce((acc: Record<string, any>, device: Device) => {
          acc[device.id] = {
            properties: device.properties,
            status: device.status,
            lastUpdate: device.lastUpdate,
          };
          return acc;
        }, {} as Record<string, any>),
      }),
      // 从localStorage恢复状态时的合并逻辑
      merge: (persistedState: any, currentState: any) => {
        const merged = {
          ...currentState,
          ...persistedState,
        };
        // 如果有保存的设备状态，合并到当前设备列表中
        if (persistedState?.deviceStates && Array.isArray(currentState.devices)) {
          merged.devices = currentState.devices.map((device: any) => {
            const savedState = persistedState.deviceStates[device.id];
            return savedState ? { ...device, ...savedState } : device;
          });
        }
        return merged;
      },
    }
  )
);

