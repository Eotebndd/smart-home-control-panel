import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeviceCard from '@/components/Device/DeviceCard';
import type { Device } from '@/types';

const mockDevice: Device = {
  id: 'test-device',
  name: '测试设备',
  type: 'light',
  room: 'living_room',
  status: 'online',
  position: { x: 0, y: 0, z: 0 },
  properties: { power: true, brightness: 50 },
  lastUpdate: Date.now(),
};

describe('DeviceCard', () => {
  it('renders device name', () => {
    render(<DeviceCard device={mockDevice} />);
    expect(screen.getByText('测试设备')).toBeDefined();
  });

  it('displays device status', () => {
    render(<DeviceCard device={mockDevice} />);
    expect(screen.getByText('在线')).toBeDefined();
  });
});

