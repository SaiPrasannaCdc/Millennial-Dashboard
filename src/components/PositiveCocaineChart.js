import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const sampleDataCocaine = [
  {
    name: 'Fentanyl or heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '52.1' },
      { quarter: 'Q1 2023', percentage: '53.0' },
      { quarter: 'Q2 2023', percentage: '55.1' },
      { quarter: 'Q3 2023', percentage: '55.9' },
      { quarter: 'Q4 2023', percentage: '56.2' },
      { quarter: 'Q1 2024', percentage: '55.8' },
      { quarter: 'Q2 2024', percentage: '56.0' },
      { quarter: 'Q3 2024', percentage: '56.2' },
      { quarter: 'Q4 2024', percentage: '56.1' },
    ],
  },
  {
    name: 'Fentanyl',
    values: [
      { quarter: 'Q4 2022', percentage: '42.0' },
      { quarter: 'Q1 2023', percentage: '43.2' },
      { quarter: 'Q2 2023', percentage: '47.7' },
      { quarter: 'Q3 2023', percentage: '48.1' },
      { quarter: 'Q4 2023', percentage: '48.7' },
      { quarter: 'Q1 2024', percentage: '47.2' },
      { quarter: 'Q2 2024', percentage: '48.6' },
      { quarter: 'Q3 2024', percentage: '47.6' },
      { quarter: 'Q4 2024', percentage: '46.6' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '19.1' },
      { quarter: 'Q1 2023', percentage: '19.5' },
      { quarter: 'Q2 2023', percentage: '19.6' },
      { quarter: 'Q3 2023', percentage: '19.3' },
      { quarter: 'Q4 2023', percentage: '19.4' },
      { quarter: 'Q1 2024', percentage: '19.1' },
      { quarter: 'Q2 2024', percentage: '19.1' },
      { quarter: 'Q3 2024', percentage: '20.2' },
      { quarter: 'Q4 2024', percentage: '20.3' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { quarter: 'Q4 2022', percentage: '7.1' },
      { quarter: 'Q1 2023', percentage: '7.4' },
      { quarter: 'Q2 2023', percentage: '7.0' },
      { quarter: 'Q3 2023', percentage: '7.9' },
      { quarter: 'Q4 2023', percentage: '8.2' },
      { quarter: 'Q1 2024', percentage: '8.4' },
      { quarter: 'Q2 2024', percentage: '8.7' },
      { quarter: 'Q3 2024', percentage: '8.9' },
      { quarter: 'Q4 2024', percentage: '9.3' },
    ],
  },
];

const sampleDataCocaine_6Months = [
  {
    name: 'Fentanyl or heroin',
    values: [
      { period: 'Q4 2022', percentage: '52.1' },
      { period: 'Q2 2023', percentage: '55.1' },
      { period: 'Q4 2023', percentage: '56.2' },
      { period: 'Q2 2024', percentage: '56.0' },
    ],
  },
  {
    name: 'Fentanyl',
    values: [
      { period: 'Q4 2022', percentage: '42.0' },
      { period: 'Q2 2023', percentage: '47.7' },
      { period: 'Q4 2023', percentage: '48.7' },
      { period: 'Q2 2024', percentage: '48.6' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { period: 'Q4 2022', percentage: '19.1' },
      { period: 'Q2 2023', percentage: '19.6' },
      { period: 'Q4 2023', percentage: '19.4' },
      { period: 'Q2 2024', percentage: '19.1' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { period: 'Q4 2022', percentage: '7.1' },
      { period: 'Q2 2023', percentage: '7.0' },
      { period: 'Q4 2023', percentage: '8.2' },
      { period: 'Q2 2024', percentage: '8.7' },
    ],
  },
];

const lineColors = {
  'Fentanyl or heroin': '#0073e6', // Blue
  'Fentanyl': '#ff6600', // Orange
  'Heroin': '#008000', // Green
  'Cocaine': '#6a0dad', // Purple
};

const PositiveCocaineChart = ({ width = 1100, height = 450, period }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));

  const margin = { top: 60, right: 30, bottom: 50, left: 90 }; // Increased left margin for y-axis label
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  // Select data based on period
  const adjustedData = period === 'Quarterly' || !period ? sampleDataCocaine : sampleDataCocaine_6Months;

  // X domain and accessor based on period
  const xDomain = period === 'Quarterly' || !period
    ? adjustedData[0].values.map(d => d.quarter)
    : adjustedData[0].values.map(d => d.period.replace('Q2', 'Jan-Jun').replace('Q4', 'Jul-Dec'));
  const xAccessor = period === 'Quarterly' || !period ? d => d.quarter : d => d.period.replace('Q2', 'Jan-Jun').replace('Q4', 'Jul-Dec');

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...adjustedData.flatMap(d => d.values.map(v => parseFloat(v.percentage))))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  // Helper function to get previous period's value (for both Quarterly and 6 Months)
  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return parseFloat(lineData.values[i - offset].percentage);
    }
    return null;
  };

  // Unified indicator and tooltip rendering for both periods
  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;

    return adjustedData
      .filter(lineData => selectedLines.includes(lineData.name))
      .map((lineData, index) => {
        return lineData.values.map((d, i) => {
          if (i === 0) return null;

          // For both periods, previous period is always i-1
          const prevPeriod = getPrevPeriodValue(lineData, i, 1);
          // For yearly, offset is 2 for 6 Months, 4 for Quarterly
          const yearlyOffset = (period === 'Quarterly' || !period) ? 4 : 2;
          const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
          const curr = parseFloat(d.percentage);

          const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
          const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;

          // X label accessor
          const xLabel = xAccessor(d);
          const xPosition = xScale(xLabel) + xScale.bandwidth() / 2;
          const yPosition = yScale(curr);
          if (isNaN(xPosition) || isNaN(yPosition)) return null;

          // Show yearly indicator for all except first N periods (N = yearlyOffset)
          const showYearlyIndicator = i >= yearlyOffset;

          return (
            <g key={`indicator-${index}-${i}`}> 
              <Circle
                cx={xPosition}
                cy={yPosition}
                r={4}
                fill={lineColors[lineData.name]}
                onMouseEnter={(e) => {
                  ReactTooltip.show(e.target);
                }}
                onMouseLeave={(e) => {
                  ReactTooltip.hide(e.target);
                }}
                data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                  ${showYearlyIndicator ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${lineData.name} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>${(period === 'Quarterly' || !period) ? 'Quarterly' : '6 Months'} Change</strong><br/>
                      ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${lineData.name} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                    </div>
                  </div>
                </div>`}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        });
      });
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, adjustedData]);

  // Add a debug log to print the value of the period prop on each render
  console.log('PositiveCocaineChart period prop:', period);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test who test positive for methamphetamine on urine drug tests also test positive for cocaine, fentanyl, or heroin: United States Q4 2022 - Q4 2024
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-cocaine"
                checked={selectedLines.length === Object.keys(lineColors).length}
                onChange={() => {
                  if (selectedLines.length === Object.keys(lineColors).length) {
                    setSelectedLines([]); // Clear all selections
                  } else {
                    setSelectedLines(Object.keys(lineColors)); // Select all options
                  }
                }}
                style={{ accentColor: selectedLines.length === Object.keys(lineColors).length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px' }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-cocaine"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])} // Clear all selections
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px' }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
          {Object.entries(lineColors).map(([drug, color]) => (
            <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLines.includes(drug)}
                onChange={() => {
                  if (selectedLines.includes(drug)) {
                    setSelectedLines(selectedLines.filter(line => line !== drug));
                  } else {
                    setSelectedLines([...selectedLines, drug]);
                  }
                }}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid #888`,
                  background: '#fff',
                  marginRight: 2,
                  position: 'relative',
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {selectedLines.includes(drug) && (
                  <span
                    style={{
                      display: 'block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: color,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '-90px' }}>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showPercentChange}
              onChange={() => setShowPercentChange(!showPercentChange)}
            />
            <span className="slider percent-toggle"></span>
          </label>
          <span className="toggle-label">% Chg On</span>
        </div>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />
            <span className="slider label-toggle"></span>
          </label>
          <span className="toggle-label">Labels Off</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', fontSize: '8px', color: '#666', lineHeight: '1.4', textAlign: 'right' }}>
        <div style={{ maxWidth: '300px', fontWeight: 'bold' }}>
          <p style={{ margin: 0 }}>When "% Chg" is on, hover over a data point</p>
          <p style={{ margin: 0 }}>on the line chart to view percent change</p>
          <p style={{ margin: 0 }}>for the selected year compared to the previous year.</p>
        </div>
      </div>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Y-axis label: two lines, Segoe UI, semi-bold, fontSize 13, color #222, before AxisLeft */}
          <text
            x={-60}
            y={adjustedHeight / 2}
            textAnchor="middle"
            fontFamily="Segoe UI, Arial, sans-serif"
            fontWeight={600}
            fontSize={13}
            fill="#222"
            letterSpacing="0.01em"
            transform={`rotate(-90, -60, ${adjustedHeight / 2})`}
          >
            <tspan x={-60} dy={-6}>% of people with substance use disorder</tspan>
            <tspan x={-60} dy={16}>with drug(s) detected</tspan>
          </text>
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 10,
              textAnchor: 'middle',
              dy: 10,
            })}
          />

          {adjustedData
            .filter(lineData => selectedLines.includes(lineData.name))
            .map((lineData, index) => (
              <React.Fragment key={index}>
                <LinePath
                  data={lineData.values}
                  x={d => xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                  y={d => yScale(parseFloat(d.percentage))}
                  stroke={lineColors[lineData.name]}
                  strokeWidth={2}
                  curve={null}
                />
                {lineData.values.map((d, i) => {
                  const percentage = parseFloat(d.percentage);
                  const lowerCI = (percentage - 0.5).toFixed(1);
                  const upperCI = (percentage + 0.5).toFixed(1);
                  const n = lineData.values.length;
                  // If showLabels is true, show all labels. If false, show only first, last, quarter before last, and middle.
                  const showLabel = showLabels || (
                    i === 0 || // first
                    i === n - 1 || // last
                    i === n - 2 || // quarter before last
                    i === Math.floor((n - 1) / 2) // middle
                  );
                  return (
                    <React.Fragment key={i}>
                      <Circle
                        cx={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                        cy={yScale(percentage)}
                        r={4}
                        fill={lineColors[lineData.name]}
                        data-tip={`<div style='text-align: left;'>\n  <strong>${xAccessor(d)}</strong><br/>\n  ${lineData.name} positivity: ${percentage}%<br/>\n  Confidence interval: ${lowerCI}% - ${upperCI}%\n</div>`}
                      />
                      {showLabel && (
                        <text
                          x={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                          y={yScale(percentage) - 10}
                          fontSize={10}
                          textAnchor="middle"
                          fill="#333"
                        >
                          {percentage}%
                        </text>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ))}
          {/* {renderChangeIndicators()} */}
          {renderChangeIndicatorsUnified()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Object.entries(lineColors).map(([drug, color]) => (
          <div key={drug} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#333' }}>{drug}</span>
          </div>
        ))}
      </div>
      <ReactTooltip html={true} />
    </div>
  );
};

export default PositiveCocaineChart;