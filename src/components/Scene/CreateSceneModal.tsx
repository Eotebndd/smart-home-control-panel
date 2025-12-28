import React, { useState } from 'react';
import { Modal, Form, Input, Select, Button, Space, Card, Switch, Slider, Typography, message, InputNumber, Divider, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { DEVICE_TYPE_NAMES, DEVICE_ICONS } from '@/utils/constants';
import type { Device, Scene } from '@/types';
import './CreateSceneModal.css';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

interface CreateSceneModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (scene: Omit<Scene, 'id'>) => void;
}

const CreateSceneModal: React.FC<CreateSceneModalProps> = ({ open, onCancel, onOk }) => {
  const [form] = Form.useForm();
  const { devices } = useStore();
  const [selectedDevices, setSelectedDevices] = useState<Array<{
    deviceId: string;
    actions: Record<string, any>;
  }>>([]);

  const handleAddDevice = () => {
    const deviceId = form.getFieldValue('newDeviceId');
    if (!deviceId) {
      message.warning('请选择设备');
      return;
    }

    if (devices.length === 0) {
      message.error('设备列表为空，请稍后再试');
      return;
    }

    // 检查设备是否已添加
    if (selectedDevices.some((sd) => sd.deviceId === deviceId)) {
      message.warning('该设备已添加');
      return;
    }

    const device = devices.find((d) => d.id === deviceId);
    if (!device) {
      message.error('未找到所选设备');
      return;
    }

    const actions: Record<string, any> = {};
    
    // 根据设备类型设置默认动作
    if (device.type === 'light') {
      actions.power = true;
      actions.brightness = 80;
    } else if (device.type === 'air_conditioner') {
      actions.power = true;
      actions.temperature = 24;
      actions.mode = 'cool';
    } else if (device.type === 'curtain') {
      actions.open = 100;
    } else if (device.type === 'door_lock') {
      actions.locked = false;
    } else {
      actions.power = true;
    }

    setSelectedDevices([
      ...selectedDevices,
      { deviceId, actions },
    ]);

    form.setFieldsValue({ newDeviceId: undefined });
  };

  const handleRemoveDevice = (index: number) => {
    setSelectedDevices(selectedDevices.filter((_, i) => i !== index));
  };

  const handleUpdateAction = (index: number, key: string, value: any) => {
    const updated = [...selectedDevices];
    updated[index].actions[key] = value;
    setSelectedDevices(updated);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (selectedDevices.length === 0) {
        message.warning('请至少添加一个设备');
        return;
      }

      const newScene: Omit<Scene, 'id'> = {
        name: values.name,
        description: values.description || '',
        icon: values.icon || '✨',
        isPreset: false,
        isActive: false,
        devices: selectedDevices,
        trigger: values.triggerType ? {
          type: values.triggerType,
          value: values.triggerValue,
        } : undefined,
      };

      onOk(newScene);
      form.resetFields();
      setSelectedDevices([]);
    });
  };

  const getDeviceActions = (device: Device) => {
    const actions: JSX.Element[] = [];
    const deviceActions = selectedDevices.find((sd) => sd.deviceId === device.id)?.actions || {};

    if (device.properties.power !== undefined) {
      actions.push(
        <div key="power" className="action-item">
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Text strong>开关</Text>
            <Switch
              checked={deviceActions.power}
              onChange={(checked) => handleUpdateAction(
                selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                'power',
                checked
              )}
            />
          </Space>
        </div>
      );
    }

    if (device.properties.brightness !== undefined) {
      actions.push(
        <div key="brightness" className="action-item">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong>亮度</Text>
              <InputNumber
                min={0}
                max={100}
                value={deviceActions.brightness || 80}
                onChange={(value) => handleUpdateAction(
                  selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                  'brightness',
                  value || 0
                )}
                addonAfter="%"
                style={{ width: 100 }}
              />
            </Space>
            <Slider
              min={0}
              max={100}
              value={deviceActions.brightness || 80}
              onChange={(value) => handleUpdateAction(
                selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                'brightness',
                value
              )}
            />
          </Space>
        </div>
      );
    }

    if (device.properties.temperature !== undefined) {
      actions.push(
        <div key="temperature" className="action-item">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong>温度</Text>
              <InputNumber
                min={16}
                max={30}
                value={deviceActions.temperature || 24}
                onChange={(value) => handleUpdateAction(
                  selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                  'temperature',
                  value || 24
                )}
                addonAfter="°C"
                style={{ width: 100 }}
              />
            </Space>
            <Slider
              min={16}
              max={30}
              value={deviceActions.temperature || 24}
              onChange={(value) => handleUpdateAction(
                selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                'temperature',
                value
              )}
            />
          </Space>
        </div>
      );
    }

    if (device.properties.open !== undefined) {
      actions.push(
        <div key="open" className="action-item">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space style={{ width: '100%', justifyContent: 'space-between' }}>
              <Text strong>开合度</Text>
              <InputNumber
                min={0}
                max={100}
                value={deviceActions.open || 100}
                onChange={(value) => handleUpdateAction(
                  selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                  'open',
                  value || 0
                )}
                addonAfter="%"
                style={{ width: 100 }}
              />
            </Space>
            <Slider
              min={0}
              max={100}
              value={deviceActions.open || 100}
              onChange={(value) => handleUpdateAction(
                selectedDevices.findIndex((sd) => sd.deviceId === device.id),
                'open',
                value
              )}
            />
          </Space>
        </div>
      );
    }

    return actions;
  };

  return (
    <Modal
      title={
        <Space>
          <SettingOutlined />
          <span>创建智能场景</span>
        </Space>
      }
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={900}
      className="create-scene-modal"
      okText="创建场景"
      cancelText="取消"
    >
      <Form form={form} layout="vertical" className="scene-form">
        <div className="form-section">
          <h3 className="section-title">基本信息</h3>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="场景名称"
                rules={[{ required: true, message: '请输入场景名称' }]}
              >
                <Input placeholder="例如：回家模式" size="large" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="icon" label="场景图标">
                <Input placeholder="例如：🏠" size="large" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="description" label="场景描述">
            <TextArea rows={2} placeholder="描述场景的功能和使用场景..." />
          </Form.Item>
        </div>

        <Divider />

        <div className="form-section">
          <h3 className="section-title">添加设备</h3>
          <Form.Item name="newDeviceId">
            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder={devices.length === 0 ? '暂无可用设备' : '选择要添加的设备'}
                style={{ flex: 1 }}
                size="large"
                showSearch
                disabled={devices.length === 0}
                filterOption={(input, option) =>
                  (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {devices.length > 0 ? (
                  devices
                    .filter((device) => !selectedDevices.some((sd) => sd.deviceId === device.id))
                    .map((device) => (
                      <Option
                        key={device.id}
                        value={device.id}
                        label={`${device.name} (${DEVICE_TYPE_NAMES[device.type]})`}
                      >
                        <Space>
                          <span>{DEVICE_ICONS[device.type]}</span>
                          <span>{device.name}</span>
                          <span style={{ color: '#718096' }}>({DEVICE_TYPE_NAMES[device.type]})</span>
                        </Space>
                      </Option>
                    ))
                ) : (
                  <Option disabled value="no-devices">
                    暂无可用设备
                  </Option>
                )}
              </Select>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddDevice}
                size="large"
              >
                添加
              </Button>
            </Space.Compact>
          </Form.Item>
        </div>

        {selectedDevices.length > 0 && (
          <>
            <Divider />
            <div className="form-section">
              <h3 className="section-title">设备动作配置</h3>
              <div className="devices-actions">
                {selectedDevices.map((sd, index) => {
                  const device = devices.find((d) => d.id === sd.deviceId);
                  if (!device) return null;

                  return (
                    <Card
                      key={device.id}
                      size="small"
                      className="device-action-card"
                      title={
                        <Space>
                          <span style={{ fontSize: '20px' }}>{DEVICE_ICONS[device.type]}</span>
                          <span>{device.name}</span>
                          <Button
                            type="text"
                            danger
                            size="small"
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveDevice(index)}
                          />
                        </Space>
                      }
                    >
                      {getDeviceActions(device)}
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}

        <Divider />

        <div className="form-section">
          <h3 className="section-title">触发方式（可选）</h3>
          <Form.Item name="triggerType">
            <Select placeholder="选择触发方式" size="large">
              <Option value="manual">手动触发</Option>
              <Option value="time">定时触发</Option>
              <Option value="condition">条件触发</Option>
            </Select>
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default CreateSceneModal;
