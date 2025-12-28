import React, { useState, useEffect } from 'react';
import { Card, Form, Switch, Button, Space, Typography, Divider, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import './Settings.css';

const { Title } = Typography;

const Settings: React.FC = () => {
  const { isLocalMode, setIsLocalMode, settings, updateSettings } = useStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 初始化表单值
    form.setFieldsValue({
      isLocalMode,
      lockControlOnlyFamily: settings.lockControlOnlyFamily,
      disableThirdPartySleepData: settings.disableThirdPartySleepData,
      enableDataMasking: settings.enableDataMasking,
    });
  }, [form, isLocalMode, settings]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 更新状态
      setIsLocalMode(values.isLocalMode);
      updateSettings({
        lockControlOnlyFamily: values.lockControlOnlyFamily,
        disableThirdPartySleepData: values.disableThirdPartySleepData,
        enableDataMasking: values.enableDataMasking,
      });
      
      // 模拟保存延迟
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      message.success('设置保存成功！');
    } catch (error) {
      message.error('保存设置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <Card>
        <Title level={4}>系统设置</Title>
        <Form 
          form={form}
          layout="vertical" 
          onFinish={handleSave}
          initialValues={{
            isLocalMode,
            lockControlOnlyFamily: settings.lockControlOnlyFamily,
            disableThirdPartySleepData: settings.disableThirdPartySleepData,
            enableDataMasking: settings.enableDataMasking,
          }}
        >
          <Form.Item 
            name="isLocalMode"
            label="本地优先模式"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
            <div style={{ marginTop: 8 }}>
              <Typography.Text type="secondary">
                开启后，优先使用本地边缘网关，断网时仍可正常控制设备
              </Typography.Text>
            </div>
          </Form.Item>

          <Divider />

          <Form.Item label="权限管理">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Form.Item 
                name="lockControlOnlyFamily"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="仅家庭组用户控制门锁" />
              </Form.Item>
              <Form.Item 
                name="disableThirdPartySleepData"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="禁止第三方APP获取睡眠数据" />
              </Form.Item>
              <Form.Item 
                name="enableDataMasking"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <Switch checkedChildren="启用数据脱敏" />
              </Form.Item>
            </Space>
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              保存设置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Settings;
