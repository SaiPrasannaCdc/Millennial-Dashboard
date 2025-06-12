import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const southQuarterlyData = [
  { quarter: 'Q1 2023', percentage: 9.0, ciLower: 8.4, ciUpper: 9.3 },
  { quarter: 'Q2 2023', percentage: 9.4, ciLower: 8.8, ciUpper: 9.8 },
  { quarter: 'Q3 2023', percentage: 9.3, ciLower: 8.7, ciUpper: 9.7 },
  { quarter: 'Q4 2023', percentage: 9.7, ciLower: 9.2, ciUpper: 10.2 },
  { quarter: 'Q1 2024', percentage: 9.4, ciLower: 8.9, ciUpper: 9.8 },
  { quarter: 'Q2 2024', percentage: 9.8, ciLower: 9.2, ciUpper: 10.2 },
  { quarter: 'Q3 2024', percentage: 11.5, ciLower: 10.9, ciUpper: 11.9 },
  { quarter: 'Q4 2024', percentage: 11.3, ciLower: 10.7, ciUpper: 11.8 },
];

// 6 Months data for Southern Census Region
const south6MonthsData = [
  { period: 'Jan - Jun 2023', percentage: 9.2, ciLower: 8.9, ciUpper: 9.4 },
  { period: 'Jul - Dec 2023', percentage: 9.5, ciLower: 9.0, ciUpper: 10.4 },
  { period: 'Jan - Jun 2024', percentage: 9.6, ciLower: 9.2, ciUpper: 10.2 },
  { period: 'Jul - Dec 2024', percentage: 11.4, ciLower: 10.7, ciUpper: 11.8 },
];

const MethamphetamineLineChartSouth = ({ width = 1100, height = 450, period = 'Quarterly' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  const is6Months = period === '6 Months' || period === 'Half Yearly';
  const data = is6Months ? south6MonthsData : southQuarterlyData;

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = data.map(d => is6Months ? d.period : d.quarter);
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map(d => d.percentage))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const getPrevValue = (i, offset = 1) => {
    if (i - offset >= 0) {
      return data[i - offset].percentage;
    }
    return null;
  };

  const getKeyFinding = () => {
    if (!data || data.length < 2) return null;
    const lastIdx = data.length - 1;
    const prevIdx = data.length - 2;
    const last = data[lastIdx];
    const prev = data[prevIdx];
    if (!last || !prev) return null;
    const absChange = (last.percentage - prev.percentage).toFixed(1);
    const direction = absChange > 0 ? 'increased' : 'decreased';
    return {
      direction,
      absChange: Math.abs(absChange),
      prev: prev.percentage,
      prevLabel: is6Months ? prev.period : prev.quarter,
      last: last.percentage,
      lastLabel: is6Months ? last.period : last.quarter,
    };
  };
  const keyFinding = getKeyFinding();

  
  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return data.map((d, i) => {
      if (i === 0) return null;
      const prevPeriod = getPrevValue(i, 1);
      const prevYear = getPrevValue(i, is6Months ? 2 : 4);
      const curr = d.percentage;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const x = xScale(is6Months ? d.period : d.quarter) + xScale.bandwidth() / 2;
      const y = yScale(curr);
      const showYearly = is6Months ? i >= 2 : i >= 4;
      
      const getArrowColor = (change) => {
        if (change === null) return '#6a0dad';
        return change > 0 ? '#6a0dad' : '#0073e6';
      };
      return (
        <g key={`indicator-south-${i}`}> 
          <Circle
            cx={x}
            cy={y}
            r={4}
            fill={'#0073e6'}
            data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
              ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Yearly Change</strong><br/>
                  ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Methamphetamine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${is6Months ? d.period : d.quarter}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>${is6Months ? '6-Month' : 'Quarterly'} Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Methamphetamine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${is6Months ? d.period : d.quarter}
                </div>
              </div>
            </div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );
    });
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, period]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for methamphetamine on urine drug tests: Southern Census Region {is6Months ? 'Jan 2023 - Dec 2024 (6 Months)' : 'Q1 2023 - Q4 2024'}. Millennium Health, Southern Census Region {is6Months ? 'Jan 2023 - Dec 2024' : 'Q1 2023 - Q4 2024'}
          </h3>
        </div>
      </div>
      <div style={{
        background: '#4d194d',
        color: '#fff',
        borderRadius: '24px',
        padding: '14px 24px',
        margin: '18px auto 0 auto',
        fontWeight: 700,
        fontSize: '15px',
        maxWidth: '1200px',
        boxShadow: 'none',
        border: 'none',
        lineHeight: 1.2,
        display: 'block',
        fontFamily: 'Barlow, Arial, sans-serif',
        letterSpacing: '0.01em',
      }}>
        {keyFinding ? (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Methamphetamine positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to methamphetamine among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <div className="toggle-wrapper" style={{ position: 'relative' }}>
          {(() => {
            const percentChgTooltip = `
              <div style="
                text-align: center;
                padding: 16px 12px;
                color: #222;
                font-size: 15px;
                max-width: 260px;
                min-width: 220px;
                margin: 0 auto;
                border-radius: 14px;
                background: #ededed;
                box-shadow: 0 2px 12px #bbb3;
              ">
                <div style="margin-top: 8px;">
                  When <b>% Chg</b> is on, hover over the data point for the ${is6Months ? '3 most recent periods' : '5 most recent quarters'} to view percent change from the same period in the previous year and the previous ${is6Months ? '6 months' : 'quarter'}.
                </div>
              </div>
            `;
            return (
              <>
                <label
                  className="toggle-switch"
                  data-tip={percentChgTooltip}
                  data-for="percentChangeTooltip"
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={showPercentChange}
                    onChange={() => setShowPercentChange(!showPercentChange)}
                  />
                  <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
                </label>
                <span
                  className="toggle-label"
                  style={{ color: showPercentChange ? '#fff' : '#333', cursor: 'pointer' }}
                  data-tip={percentChgTooltip}
                  data-for="percentChangeTooltip"
                >
                  % Chg {showPercentChange ? 'On' : 'Off'}
                </span>
                <ReactTooltip
                  id="percentChangeTooltip"
                  place="top"
                  effect="solid"
                  backgroundColor="#ededed"
                  border={true}
                  borderColor="#bbb"
                  className="simple-tooltip"
                  html={true}
                  textColor="#222"
                />
              </>
            );
          })()}
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
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Y-axis label */}
          <text
            x={-adjustedHeight / 2}
            y={-margin.left + 15}
            transform={`rotate(-90)`}
            textAnchor="middle"
            fontSize={15}
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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'end',
              dx: -6,
              dy: 3,
              fill: '#222',
            })}
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
          <LinePath
            data={data}
            x={d => xScale(is6Months ? d.period : d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke={'#0073e6'}
            strokeWidth={2}
            curve={null}
          />
          {data.map((d, i) => {
            const n = data.length;
            let showLabel = false;
            if (is6Months) {
              showLabel = showLabels; // Only show if labels ON for 6 Months
            } else {
              showLabel = showLabels || (
                i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
              );
            }
            return (
              <React.Fragment key={i}>
                <Circle
                  cx={xScale(is6Months ? d.period : d.quarter) + xScale.bandwidth() / 2}
                  cy={yScale(d.percentage)}
                  r={4}
                  fill={'#0073e6'}
                  data-tip={`<div style='text-align: left;'>
                    <strong>${is6Months ? d.period : d.quarter}</strong><br/>
                    Methamphetamine positivity: ${d.percentage}%<br/>
                    Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                  </div>`}
                />
                {showLabel && (
                  <text
                    x={xScale(is6Months ? d.period : d.quarter) + xScale.bandwidth() / 2}
                    y={yScale(d.percentage) - 14}
                    fontSize={12}
                    textAnchor="middle"
                    fill="#333"
                  >
                    {d.percentage}%
                  </text>
                )}
              </React.Fragment>
            );
          })}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#0073e6', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Methamphetamine</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default MethamphetamineLineChartSouth;
