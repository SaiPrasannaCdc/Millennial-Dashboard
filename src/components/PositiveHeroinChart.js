import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const sampleDataHeroin = [
  {
    name: 'Cocaine or methamphetamine',
    values: [
      { quarter: 'Q4 2022', percentage: '63.2' },
      { quarter: 'Q1 2023', percentage: '67.0' },
      { quarter: 'Q2 2023', percentage: '67.2' },
      { quarter: 'Q3 2023', percentage: '69.1' },
      { quarter: 'Q4 2023', percentage: '72.1' },
      { quarter: 'Q1 2024', percentage: '74.0' },
      { quarter: 'Q2 2024', percentage: '80.0' },
      { quarter: 'Q3 2024', percentage: '85.4' },
      { quarter: 'Q4 2024', percentage: '90.0' },
    ],
  },
  {
    name: 'Methamphetamine',
    values: [
      { quarter: 'Q4 2022', percentage: '52.1' },
      { quarter: 'Q1 2023', percentage: '53.0' },
      { quarter: 'Q2 2023', percentage: '54.7' },
      { quarter: 'Q3 2023', percentage: '54.5' },
      { quarter: 'Q4 2023', percentage: '54.8' },
      { quarter: 'Q1 2024', percentage: '57.1' },
      { quarter: 'Q2 2024', percentage: '60.8' },
      { quarter: 'Q3 2024', percentage: '64.1' },
      { quarter: 'Q4 2024', percentage: '68.4' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { quarter: 'Q4 2022', percentage: '40.5' },
      { quarter: 'Q1 2023', percentage: '39.0' },
      { quarter: 'Q2 2023', percentage: '39.6' },
      { quarter: 'Q3 2023', percentage: '40.1' },
      { quarter: 'Q4 2023', percentage: '39.1' },
      { quarter: 'Q1 2024', percentage: '42.1' },
      { quarter: 'Q2 2024', percentage: '40.0' },
      { quarter: 'Q3 2024', percentage: '43.1' },
      { quarter: 'Q4 2024', percentage: '44.7' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '25.3' },
      { quarter: 'Q1 2023', percentage: '23.1' },
      { quarter: 'Q2 2023', percentage: '21.7' },
      { quarter: 'Q3 2023', percentage: '19.4' },
      { quarter: 'Q4 2023', percentage: '18.3' },
      { quarter: 'Q1 2024', percentage: '16.4' },
      { quarter: 'Q2 2024', percentage: '15.8' },
      { quarter: 'Q3 2024', percentage: '16.9' },
      { quarter: 'Q4 2024', percentage: '18.0' },
    ],
  },
];

const sampleDataHeroin_6Months = [
  {
    name: 'Cocaine or methamphetamine',
    values: [
      { period: 'Q4 2022', percentage: '63.2' },
      { period: 'Q2 2023', percentage: '67.2' },
      { period: 'Q4 2023', percentage: '72.1' },
      { period: 'Q2 2024', percentage: '80.0' },
    ],
  },
  {
    name: 'Methamphetamine',
    values: [
      { period: 'Q4 2022', percentage: '52.1' },
      { period: 'Q2 2023', percentage: '54.7' },
      { period: 'Q4 2023', percentage: '54.8' },
      { period: 'Q2 2024', percentage: '60.8' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { period: 'Q4 2022', percentage: '40.5' },
      { period: 'Q2 2023', percentage: '39.6' },
      { period: 'Q4 2023', percentage: '39.1' },
      { period: 'Q2 2024', percentage: '40.0' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { period: 'Q4 2022', percentage: '25.3' },
      { period: 'Q2 2023', percentage: '21.7' },
      { period: 'Q4 2023', percentage: '18.3' },
      { period: 'Q2 2024', percentage: '15.8' },
    ],
  },
];

const lineColors = {
  'Cocaine or methamphetamine': '#003f5c', // Dark Blue
  'Methamphetamine': '#ffa600', // Orange
  'Cocaine': '#2f4b7c', // Blue
  'Heroin': '#665191', // Purple
};

const PositiveHeroinChart = ({ width = 1100, height = 450, period }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));

  const margin = { top: 60, right: 30, bottom: 50, left: 90 }; // Increased left margin for y-axis label
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  // Select data based on period
  const adjustedData = period === 'Quarterly' || !period ? sampleDataHeroin : sampleDataHeroin_6Months;

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
  console.log('PositiveHeroinChart period prop:', period);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test who test positive for fentanyl on urine drug tests also test positive for cocaine, methamphetamine, or heroin: United States Q4 2022 - Q4 2024
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
                name="select-clear-heroin"
                checked={selectedLines.length === Object.keys(lineColors).length && Object.keys(lineColors).every(line => selectedLines.includes(line))}
                onChange={() => {
                  if (selectedLines.length === Object.keys(lineColors).length && Object.keys(lineColors).every(line => selectedLines.includes(line))) {
                    setSelectedLines([]); // Clear all selections
                  } else {
                    setSelectedLines(Object.keys(lineColors)); // Select all options
                  }
                }}
                style={{ accentColor: selectedLines.length === Object.keys(lineColors).length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-heroin"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])} // Clear all selections
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
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
            <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
          </label>
          <span className="toggle-label" style={{ color: showPercentChange ? '#fff' : '#333' }}>% Chg {showPercentChange ? 'On' : 'Off'}</span>
        </div>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />
            <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
          </label>
          <span className="toggle-label" style={{ color: showLabels ? '#fff' : '#333' }}>Labels {showLabels ? 'On' : 'Off'}</span>
        </div>
      </div>
      <label className="subLabel" style={{ display: 'block', textAlign: 'right', fontSize: '15px', color: '#111', lineHeight: 1.5, fontWeight: 600, fontFamily: 'Arial, sans-serif', margin: '10px 0 0 0', maxWidth: '420px', float: 'right' }}>
        When "% Chg" is on, hover over the data point for<br />
        the 5 most recent quarters to view percent change<br />
        from the same quarter in the previous year and the<br />
        previous quarter.
      </label>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Y-axis label: two lines, Segoe UI, semi-bold, fontSize 13, color #222, before AxisLeft */}
          <text
            x={-60}
            y={adjustedHeight / 2}
            textAnchor="middle"
            fontFamily="Segoe UI, Arial, sans-serif"
            fontWeight={600}
            fontSize={15}
            fill="#222"
            letterSpacing="0.01em"
            transform={`rotate(-90, -60, ${adjustedHeight / 2})`}
          >
            <tspan x={-60} dy={-6}>% of people with substance use disorder</tspan>
            <tspan x={-60} dy={16}>with drug(s) detected</tspan>
          </text>
          <AxisLeft 
            scale={yScale} 
            tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({ fontSize: 16, textAnchor: 'end', dx: -4, dy: 4, fontFamily: 'Segoe UI, Arial, sans-serif' })} 
          />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 16,
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
                          y={yScale(percentage) - 14}
                          fontSize={12}
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
            <span style={{ fontSize: '16px', color: '#333' }}>{drug}</span>
          </div>
        ))}
      </div>
      <ReactTooltip html={true} />
    </div>
  );
};

export default PositiveHeroinChart;