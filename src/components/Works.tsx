import React from 'react';
import { Exhibition } from './Exhibition';
import { PageView, PortfolioItem } from '../types';

export { Exhibition };

interface WorksProps {
  works?: PortfolioItem[];
  onNavigate?: (view: PageView) => void;
  onPlayTrailer?: () => void;
}

export const Works: React.FC<WorksProps> = (props) => {
  return <Exhibition {...props} />;
};

export default Works;
