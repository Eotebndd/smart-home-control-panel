import React from 'react';
import EnergyDashboard from '@/components/Energy/EnergyDashboard';
import './Energy.css';

const Energy: React.FC = () => {
  return (
    <div className="energy-page">
      <EnergyDashboard />
    </div>
  );
};

export default Energy;

