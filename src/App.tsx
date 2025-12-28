import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import MainLayout from '@/components/Layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Devices from '@/pages/Devices';
import Scenes from '@/pages/Scenes';
import Energy from '@/pages/Energy';
import Settings from '@/pages/Settings';
import { useStore } from '@/store/useStore';
import { mockDevices, mockScenes, mockEnergyStats } from '@/services/mockData';
import { wsService } from '@/services/websocket';
import '@/styles/global.css';

const App: React.FC = () => {
  const { setDevices, setScenes, setEnergyStats } = useStore();

  useEffect(() => {
    // 初始化模拟数据
    setDevices(mockDevices);
    
    // 恢复设备状态（从localStorage）
    const storage = localStorage.getItem('smart-home-storage');
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        if (parsed.state?.deviceStates) {
          // 合并保存的设备状态到当前设备
          const deviceStates = parsed.state.deviceStates;
          mockDevices.forEach((device) => {
            const savedState = deviceStates[device.id];
            if (savedState) {
              useStore.getState().updateDevice(device.id, savedState);
            }
          });
        }
      } catch (e) {
        console.warn('Failed to restore device states from localStorage:', e);
      }
    }
    
    // 只初始化预设场景，自定义场景从localStorage恢复
    const { scenes } = useStore.getState();
    if (scenes.length === 0) {
      setScenes(mockScenes);
    } else {
      // 合并预设场景和已保存的自定义场景
      const customScenes = scenes.filter((s) => !s.isPreset);
      setScenes([...mockScenes, ...customScenes]);
    }
    setEnergyStats(mockEnergyStats);

    // 连接WebSocket（模拟边缘网关）
    // 实际项目中应连接真实的边缘网关地址
    // wsService.connect('ws://your-edge-gateway-url');

    // 模拟连接（本地模式）
    setTimeout(() => {
      wsService.connect();
    }, 1000);

    return () => {
      wsService.disconnect();
    };
  }, [setDevices, setScenes, setEnergyStats]);

  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/devices" element={<Devices />} />
                <Route path="/scenes" element={<Scenes />} />
                <Route path="/energy" element={<Energy />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;

