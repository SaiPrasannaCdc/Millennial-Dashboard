import React from 'react';
import BaseLineChart from './BaseLineChart';
import { LINE_COLORS } from './chartUtils';

const StaticDataChart = ({
  data,
  width = 1100,
  height = 450,
  title = '',
  subtitle = '',
  keyFinding = '',
  period = 'Quarterly',
  lineColors = LINE_COLORS
}) => {
  if (!data || data.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No data available</div>;
  }

  return (
    <BaseLineChart
      data={data}
      width={width}
      height={height}
      title={title}
      subtitle={subtitle}
      keyFinding={keyFinding}
      lineColors={lineColors}
      period={period}
    />
  );
};

export default StaticDataChart;
