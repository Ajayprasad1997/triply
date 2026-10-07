import React from 'react';
import { DashboardPreview } from './DashboardPreview';

interface LaptopDashboardMockupProps {
  onOpenRegister: () => void;
}

export const LaptopDashboardMockup: React.FC<LaptopDashboardMockupProps> = ({ onOpenRegister }) => {
  return <DashboardPreview onOpenRegister={onOpenRegister} />;
};
