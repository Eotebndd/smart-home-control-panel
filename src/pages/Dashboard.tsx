import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Statistic, Button, Space } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  ThunderboltOutlined,
  LineChartOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import { useStore } from '@/store/useStore';
import ReactECharts from 'echarts-for-react';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { devices, scenes, energyStats, isOnline } = useStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // 创建粒子背景效果
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    // 创建粒子
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(64, 224, 208, 0.5)';
      ctx.strokeStyle = 'rgba(64, 224, 208, 0.3)';

      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();

        // 连线
        particles.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onlineDevices = devices.filter((d) => d.status === 'online').length;
  const activeScenes = scenes.filter((s) => s.isActive).length;

  // 实时数据趋势图
  const realtimeOption = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#00d4ff' },
    },
    yAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: '#00d4ff' } },
      axisLabel: { color: '#00d4ff' },
      splitLine: { lineStyle: { color: 'rgba(0, 212, 255, 0.1)' } },
    },
    series: [
      {
        name: '设备在线数',
        type: 'line',
        smooth: true,
        data: [8, 9, 9, 10, 9, 8, 7],
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
              { offset: 1, color: 'rgba(0, 212, 255, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#00d4ff', width: 2 },
        itemStyle: { color: '#00d4ff' },
      },
    ],
  };

  // 能耗分布饼图
  const energyPieOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a1929',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#00d4ff',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
        },
        data: energyStats?.byDevice.slice(0, 5).map((item) => ({
          value: item.value,
          name: item.deviceName,
        })) || [],
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <canvas ref={canvasRef} className="particle-canvas" />
      
      <div className="dashboard-content">
        {/* 顶部标题区域 */}
        <div className="dashboard-header">
          <div className="header-title">
            <h1 className="main-title">
              <span className="title-gradient">智能家居</span>
              <span className="title-sub">边缘计算控制中心</span>
            </h1>
            <div className="status-indicator">
              <div className={`status-dot ${isOnline ? 'online' : 'offline'}`} />
              <span>{isOnline ? '系统在线' : '本地模式'}</span>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<RocketOutlined />}
            className="enter-button"
            onClick={() => navigate('/devices')}
          >
            进入智能家居
          </Button>
        </div>

        {/* 核心数据卡片 */}
        <Row gutter={[16, 16]} className="stats-row">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card glow-card">
              <Statistic
                title="设备总数"
                value={devices.length}
                prefix={<AppstoreOutlined className="stat-icon" />}
                valueStyle={{ color: '#00d4ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card glow-card">
              <Statistic
                title="在线设备"
                value={onlineDevices}
                prefix={<HomeOutlined className="stat-icon" />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card glow-card">
              <Statistic
                title="运行场景"
                value={activeScenes}
                prefix={<ThunderboltOutlined className="stat-icon" />}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card glow-card">
              <Statistic
                title="本月能耗"
                value={energyStats?.total || 0}
                precision={1}
                suffix="kWh"
                prefix={<LineChartOutlined className="stat-icon" />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表区域 */}
        <Row gutter={[16, 16]} className="charts-row">
          <Col xs={24} lg={14}>
            <Card className="chart-card glow-card">
              <div className="card-title">实时设备状态趋势</div>
              <ReactECharts option={realtimeOption} style={{ height: '300px' }} />
            </Card>
          </Col>
          <Col xs={24} lg={10}>
            <Card className="chart-card glow-card">
              <div className="card-title">能耗分布</div>
              <ReactECharts option={energyPieOption} style={{ height: '300px' }} />
            </Card>
          </Col>
        </Row>

        {/* 快速入口 */}
        <Row gutter={[16, 16]} className="quick-access-row">
          <Col xs={24} sm={12} md={8}>
            <Card
              className="access-card glow-card hover-card"
              onClick={() => navigate('/devices')}
            >
              <AppstoreOutlined className="access-icon" />
              <h3>设备管理</h3>
              <p>查看和控制所有智能设备，3D可视化</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              className="access-card glow-card hover-card"
              onClick={() => navigate('/scenes')}
            >
              <ThunderboltOutlined className="access-icon" />
              <h3>场景中心</h3>
              <p>一键执行智能场景</p>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card
              className="access-card glow-card hover-card"
              onClick={() => navigate('/energy')}
            >
              <LineChartOutlined className="access-icon" />
              <h3>能源管理</h3>
              <p>监控能耗和节能优化</p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;

