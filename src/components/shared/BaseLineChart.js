import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import '../ToggleSwitch.css';

const BaseLineChart = ({
  data,
  width = 1100,
  height = 450,
  title = '',
  subtitle = '',
  keyFinding = '',
  lineColors = {},
  period = 'Quarterly',
  showMultiDrug = false,
  formatPeriodLabel = null,
  xAccessor = null,
  onToggleChange = null
}) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  useEffect(() => {
    ReactTooltip.rebuild();
    if (onToggleChange) {
      onToggleChange({ showLabels, showPercentChange });
    }
  }, [showLabels, showPercentChange, onToggleChange]);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  // Default formatters if not provided
  const defaultFormatHalfYearLabel = (periodStr) => {
    let year, half;
    let match = periodStr.match(/H([12])\s*([0-9]{4})/);
    if (match) {
      half = match[1];
      year = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})\s*H([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})[- ]([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    return periodStr;
  };

  const formatLabel = formatPeriodLabel || (period.includes('6') || period.includes('Half') ? defaultFormatHalfYearLabel : (x) => x);
  
  const defaultXAccessor = xAccessor || (period.includes('6') || period.includes('Half')
    ? d => formatLabel(d.period || d.smon_yr)
    : d => d.quarter || d.period);

  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }

  // Determine x-domain from first series
  const firstSeries = data[0];
  const xDomain = firstSeries.values.map(defaultXAccessor);

  const allPercentages = data.flatMap(series => 
    series.values.map(d => d.percentage).filter(p => p !== null && p !== undefined)
  );
  
  const yMin = Math.min(...allPercentages);
  const yMax = Math.max(...allPercentages);
  const yPadding = (yMax - yMin) * 0.1;

  const xScale = scaleBand({
    range: [0, adjustedWidth],
    domain: xDomain,
    padding: 0.1,
  });

  const yScale = scaleLinear({
    range: [adjustedHeight, 0],
    domain: [Math.max(0, yMin - yPadding), yMax + yPadding],
  });

  const renderTooltipContent = (point, seriesName) => {
    const period = defaultXAccessor(point);
    let content = `<strong>${seriesName}</strong><br/>`;
    content += `Period: ${period}<br/>`;
    content += `Percentage: ${point.percentage}%`;
    
    if (point.ciLower !== undefined && point.ciUpper !== undefined) {
      content += `<br/>95% CI: ${point.ciLower}% - ${point.ciUpper}%`;
    }
    
    if (showPercentChange) {
      if (point.periodChange !== undefined && point.periodChange !== null && point.periodChange !== '') {
        content += `<br/>Period Change: ${point.periodChange}%`;
      }
      if (point.yearlyChange !== undefined && point.yearlyChange !== null && point.yearlyChange !== '') {
        content += `<br/>Yearly Change: ${point.yearlyChange}%`;
      }
      if (point.annual !== undefined && point.annual !== null && point.annual !== '') {
        content += `<br/>Annual: ${point.annual}%`;
      }
    }
    
    return content;
  };

  return (
    <div style={{ margin: '20px 0' }}>
      {title && <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h2>}
      {subtitle && <h3 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '16px', color: '#666' }}>{subtitle}</h3>}
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', gap: '20px' }}>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
          />
          <span className="slider"></span>
          Show Labels
        </label>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={showPercentChange}
            onChange={(e) => setShowPercentChange(e.target.checked)}
          />
          <span className="slider"></span>
          Show % Change
        </label>
      </div>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <AxisLeft scale={yScale} />
          <AxisBottom scale={xScale} top={adjustedHeight} />
          
          {data.map((series, seriesIndex) => {
            const color = lineColors[series.name] || `hsl(${seriesIndex * 137.5}, 70%, 50%)`;
            
            return (
              <Group key={series.name}>
                <LinePath
                  data={series.values.filter(d => d.percentage !== null)}
                  x={d => xScale(defaultXAccessor(d)) + xScale.bandwidth() / 2}
                  y={d => yScale(d.percentage)}
                  stroke={color}
                  strokeWidth={2}
                  fill="none"
                />
                
                {series.values.map((point, pointIndex) => {
                  if (point.percentage === null) return null;
                  
                  const x = xScale(defaultXAccessor(point)) + xScale.bandwidth() / 2;
                  const y = yScale(point.percentage);
                  
                  return (
                    <Group key={pointIndex}>
                      <Circle
                        cx={x}
                        cy={y}
                        r={4}
                        fill={color}
                        data-tip={renderTooltipContent(point, series.name)}
                        data-html={true}
                      />
                      
                      {showLabels && (
                        <text
                          x={x}
                          y={y - 10}
                          textAnchor="middle"
                          fontSize="12"
                          fill="#333"
                        >
                          {point.percentage}%
                        </text>
                      )}
                      
                      {showPercentChange && (point.periodChange !== undefined && point.periodChange !== null && point.periodChange !== '') && (
                        <text
                          x={x}
                          y={y + 20}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#666"
                        >
                          {point.periodChange > 0 ? '+' : ''}{point.periodChange}%
                        </text>
                      )}
                    </Group>
                  );
                })}
              </Group>
            );
          })}
        </Group>
      </svg>
      
      {keyFinding && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <strong>Key Finding:</strong> {keyFinding}
        </div>
      )}
    </div>
  );
};

export default BaseLineChart;
