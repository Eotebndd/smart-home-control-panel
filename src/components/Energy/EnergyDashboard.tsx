import React from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { ThunderboltOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { useStore } from '@/store/useStore';
import './EnergyDashboard.css';

const { Text } = Typography;

const EnergyDashboard: React.FC = () => {
  const { energyStats } = useStore();

  if (!energyStats) {
    return <div>加载中...</div>;
  }

  // 能耗趋势图配置
  const trendOption = {
    backgroundColor: 'transparent',
    title: {
      text: '7日用电趋势',
      left: 'center',
      textStyle: {
        color: '#2d3748',
        fontSize: 18,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 33, 65, 0.9)',
      borderColor: '#00d4ff',
      textStyle: {
        color: '#fff',
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: energyStats.trend.map((item) => item.date),
      axisLine: { lineStyle: { color: '#cbd5e0' } },
      axisLabel: { color: '#718096' },
    },
    yAxis: {
      type: 'value',
      name: '用电量 (kWh)',
      nameTextStyle: { color: '#718096' },
      axisLine: { lineStyle: { color: '#cbd5e0' } },
      axisLabel: { color: '#718096' },
      splitLine: { lineStyle: { color: 'rgba(203, 213, 225, 0.3)' } },
    },
    series: [
      {
        name: '日用电量',
        type: 'line',
        data: energyStats.trend.map((item) => item.value),
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(74, 144, 226, 0.3)' },
              { offset: 1, color: 'rgba(74, 144, 226, 0.05)' },
            ],
          },
        },
        lineStyle: { color: '#4a90e2', width: 2 },
        itemStyle: { color: '#4a90e2' },
      },
    ],
  };

  // 设备能耗占比饼图
  const devicePieOption = {
    title: {
      text: '设备能耗占比',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        data: energyStats.byDevice.map((item) => ({
          value: item.value,
          name: item.deviceName,
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  };

  // 房间能耗占比
  const roomPieOption = {
    backgroundColor: 'transparent',
    title: {
      text: '房间能耗占比',
      left: 'center',
      textStyle: {
        color: '#2d3748',
        fontSize: 18,
        fontWeight: 600,
      },
    },
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#cbd5e0',
      textStyle: {
        color: '#2d3748',
      },
    },
    series: [
      {
        type: 'pie',
        radius: '60%',
        itemStyle: {
          borderRadius: 10,
          borderColor: '#0a1929',
          borderWidth: 2,
        },
        label: {
          show: true,
          color: '#718096',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2d3748',
          },
        },
        data: energyStats.byRoom.map((item) => ({
          value: item.value,
          name: item.room === 'living_room' ? '客厅' : 
                item.room === 'bedroom' ? '卧室' : 
                item.room === 'kitchen' ? '厨房' : item.room,
        })),
      },
    ],
  };

  return (
    <div className="energy-dashboard">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="energy-stat-card">
            <Statistic
              title="本月总用电"
              value={energyStats.total}
              precision={1}
              suffix="kWh"
              prefix={<ThunderboltOutlined className="energy-icon" />}
              valueStyle={{ color: '#4a90e2' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="energy-stat-card">
            <Statistic
              title="本周用电"
              value={energyStats.byDevice.reduce((sum, d) => sum + d.value, 0) / 7}
              precision={1}
              suffix="kWh/天"
              prefix={<RiseOutlined className="energy-icon" />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="energy-stat-card">
            <Statistic
              title="节能建议"
              value={15}
              suffix="%"
              prefix={<FallOutlined className="energy-icon" />}
              valueStyle={{ color: '#faad14' }}
            />
            <div style={{ marginTop: 8 }}>
              <Text style={{ color: 'rgba(255, 255, 255, 0.7)' }}>预计可节省</Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="energy-stat-card">
            <div>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)' }}>绿电使用率</Text>
              <Progress
                percent={35}
                status="active"
                strokeColor={{
                  '0%': '#00d4ff',
                  '100%': '#52c41a',
                }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={trendOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={devicePieOption} style={{ height: 300 }} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card>
            <ReactECharts option={roomPieOption} style={{ height: 300 }} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="节能建议">
            <div className="energy-suggestions">
              <div className="suggestion-item">
                <Text strong>空调温度每提高1℃，可节省7%能耗</Text>
                <Text type="secondary">当前建议：26°C</Text>
              </div>
              <div className="suggestion-item">
                <Text strong>当前客厅灯光亮度偏高，建议调低至50%</Text>
                <Text type="secondary">可节省约2W功率</Text>
              </div>
              <div className="suggestion-item">
                <Text strong>检测到低谷电价时段（22:00-06:00）</Text>
                <Text type="secondary">适合启动洗衣机、充电桩等设备</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EnergyDashboard;

