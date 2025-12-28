import React from 'react';
import { Card, Button, Space, Typography, Tag } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import { wsService } from '@/services/websocket';
import type { Scene } from '@/types';
import './SceneCard.css';

const { Text, Title } = Typography;

interface SceneCardProps {
  scene: Scene;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene }) => {
  const { deactivateScene } = useStore();

  const handleTrigger = () => {
    if (scene.isActive) {
      deactivateScene(scene.id);
    } else {
      wsService.triggerScene(scene.id);
    }
  };

  return (
    <Card
      className={`scene-card ${scene.isActive ? 'active' : ''}`}
      hoverable
    >
      <div className="scene-header">
        <div className="scene-icon">{scene.icon}</div>
        <div className="scene-info">
          <Title level={5}>{scene.name}</Title>
          <Text type="secondary">{scene.description}</Text>
        </div>
      </div>
      <div className="scene-footer">
        <Space>
          {scene.isPreset && <Tag color="blue">预设</Tag>}
          {scene.isActive && <Tag color="green">运行中</Tag>}
          <Button
            type={scene.isActive ? 'default' : 'primary'}
            icon={<PlayCircleOutlined />}
            onClick={handleTrigger}
          >
            {scene.isActive ? '停止' : '执行'}
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default SceneCard;

