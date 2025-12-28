import React, { useState } from 'react';
import { Row, Col, Card, Button, Space, Typography, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SceneCard from '@/components/Scene/SceneCard';
import CreateSceneModal from '@/components/Scene/CreateSceneModal';
import { useStore } from '@/store/useStore';
import type { Scene } from '@/types';
import './Scenes.css';

const { Title } = Typography;

const Scenes: React.FC = () => {
  const { scenes, addScene } = useStore();
  const [modalOpen, setModalOpen] = useState(false);

  const presetScenes = scenes.filter((s) => s.isPreset);
  const customScenes = scenes.filter((s) => !s.isPreset);

  const handleCreateScene = (sceneData: Omit<Scene, 'id'>) => {
    const newScene: Scene = {
      ...sceneData,
      id: `scene-${Date.now()}`,
    };
    addScene(newScene);
    setModalOpen(false);
    message.success('场景创建成功！');
  };

  return (
    <div className="scenes-page">
      <Card>
        <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={4}>场景中心</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            创建场景
          </Button>
        </Space>
      </Card>

      <CreateSceneModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleCreateScene}
      />

      <Card title="预设场景" style={{ marginTop: 16 }}>
        <Row gutter={[16, 16]}>
          {presetScenes.map((scene) => (
            <Col xs={24} sm={12} md={8} lg={6} key={scene.id}>
              <SceneCard scene={scene} />
            </Col>
          ))}
        </Row>
      </Card>

      {customScenes.length > 0 && (
        <Card title="自定义场景" style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            {customScenes.map((scene) => (
              <Col xs={24} sm={12} md={8} lg={6} key={scene.id}>
                <SceneCard scene={scene} />
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
};

export default Scenes;

