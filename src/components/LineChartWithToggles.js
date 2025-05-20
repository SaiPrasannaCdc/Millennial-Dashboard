import React, { useState } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import sampleData2, { sampleData2_6Months } from './data/sampleData2';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const LineChartWithToggles = ({ width = 1100, height = 450, period = 'Quarterly' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  // Use period prop from parent
  const adjustedData = period === 'Quarterly' ? sampleData2 : sampleData2_6Months;

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  // Helper function to format half-year labels
  const formatHalfYearLabel = (periodStr) => {
    // Accepts formats like 'H1 2023', 'H2 2023', '2023 H1', '2023 H2', '2023-1', '2023-2', etc.
    let year, half;
    // Try to match 'H1 2023' or 'H2 2023'
    let match = periodStr.match(/H([12])\s*([0-9]{4})/);
    if (match) {
      half = match[1];
      year = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    // Try to match '2023 H1' or '2023 H2'
    match = periodStr.match(/([0-9]{4})\s*H([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    // Try to match '2023-1' or '2023-2'
    match = periodStr.match(/([0-9]{4})[- ]([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    // Fallback: return as is
    return periodStr;
  };

  // X domain and accessor based on period
  const xDomain = period === 'Quarterly'
    ? adjustedData[0].values.map(d => d.quarter)
    : adjustedData[0].values.map(d => formatHalfYearLabel(d.period));
  const xAccessor = period === 'Quarterly'
    ? d => d.quarter
    : d => formatHalfYearLabel(d.period);

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

    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;

        // For both periods, previous period is always i-1
        const prevPeriod = getPrevPeriodValue(lineData, i, 1);
        // For yearly, offset is 2 for 6 Months, 4 for Quarterly
        const yearlyOffset = period === 'Quarterly' ? 4 : 2;
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
              fill={index === 0 ? '#0073e6' : index === 1 ? '#17632a' : '#e87722'}
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
                    Fentanyl positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>${period === 'Quarterly' ? 'Quarterly' : '6 Months'} Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Fentanyl positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl on urine drug tests:
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>
            Millennium Health, United States Q4 2022 - Q4 2024
          </p>
        </div>
      </div>

      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', fontSize: '6px', color: '#666', lineHeight: '1.4', textAlign: 'right' }}>
        <div style={{ maxWidth: '300px' }}>
          <p style={{ margin: 0 }}>When "% Chg" is on, hover over a data point</p>
          <p style={{ margin: 0 }}>on the line chart to view percent change</p>
          <p style={{ margin: 0 }}>for the selected year compared to the previous year.</p>
        </div>
      </div>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Y-axis label, two lines, smaller font */}
          <text
            x={-adjustedHeight / 2}
            y={-margin.left + 25}
            transform={`rotate(-90)`}
            textAnchor="middle"
            fontSize={13}
            fill="#222"
            fontFamily="'Segoe UI', 'Arial', 'sans-serif'"
            fontWeight="600"
            style={{ letterSpacing: '0.01em' }}
          >
            % of people with substance use disorder
            <tspan x={-adjustedHeight / 2} dy={15}>
              with drug(s) detected
            </tspan>
          </text>
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickFormat={value => value}
            tickLabelProps={() => ({
              fontSize: 10,
              textAnchor: 'middle',
              dy: 10,
            })}
          />

          {adjustedData.map((lineData, index) => (
            <React.Fragment key={index}>
              <LinePath
                data={lineData.values}
                x={d => xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                y={d => yScale(parseFloat(d.percentage))}
                stroke={index === 0 ? '#0073e6' : index === 1 ? '#17632a' : '#e87722'}
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
                      fill={index === 0 ? '#0073e6' : index === 1 ? '#17632a' : '#e87722'}
                      data-tip={`<div style='text-align: left;'>
                        <strong>${xAccessor(d)}</strong><br/>
                        Fentanyl positivity: ${percentage}%<br/>
                        Confidence interval: ${lowerCI}% - ${upperCI}%
                      </div>`}
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
          {/* {renderYearlyChangeIndicators()} */}
          {/* {renderChangeIndicators()} */}
          {renderChangeIndicatorsUnified()}
        </Group>
      </svg>

      {/* Add a legend below the chart to display color labels */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {adjustedData.map((lineData, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: index === 0 ? '#0073e6' : index === 1 ? '#17632a' : '#e87722', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#333' }}>{lineData.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChartWithToggles;