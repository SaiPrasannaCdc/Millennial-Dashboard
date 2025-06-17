import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const fentanylSixMonthsData = {
  National: [
    { period: 'Jan-Jun 2023', percentage: 13.9, ciLower: 13.8, ciUpper: 14.1 },
    { period: 'Jul-Dec 2023', percentage: 14.4, ciLower: 14.2, ciUpper: 14.6 },
    { period: 'Jan-Jun 2024', percentage: 13.6, ciLower: 13.4, ciUpper: 13.8 },
    { period: 'Jul-Dec 2024', percentage: 13.1, ciLower: 12.9, ciUpper: 13.3 },
  ],
  West: [
    { period: '2022 Jul-Dec', percentage: 21.7, ciLower: 21.2, ciUpper: 22.3 },
    { period: '2023 Jan-Jun', percentage: 19.0, ciLower: 18.7, ciUpper: 19.3 },
    { period: '2023 Jul-Dec', percentage: 19.4, ciLower: 19.0, ciUpper: 19.7 },
    { period: '2024 Jan-Jun', percentage: 20.0, ciLower: 19.6, ciUpper: 20.3 },
    { period: '2024 Jul-Dec', percentage: 19.9, ciLower: 19.3, ciUpper: 19.9 },
  ],
  Midwest: [
    { period: 'Jan-Jun 2023', percentage: 11.0, ciLower: 10.8, ciUpper: 11.2 },
    { period: 'Jul-Dec 2023', percentage: 13.0, ciLower: 11.6, ciUpper: 12.1 },
    { period: 'Jan-Jun 2024', percentage: 10.6, ciLower: 9.9, ciUpper: 10.6 },
    { period: 'Jul-Dec 2024', percentage: 9.3, ciLower: 8.7, ciUpper: 9.4 },
  ],
  Northeast: [
    { period: 'Jan-Jun 2023', percentage: 4.6, ciLower: 4, ciUpper: 4.7 },
    { period: 'Jul-Dec 2023', percentage: 3.9, ciLower: 3.9, ciUpper: 4.6 },
    { period: 'Jan-Jun 2024', percentage: 3.3, ciLower: 3.6, ciUpper: 4.8 },
    { period: 'Jul-Dec 2024', percentage: 3.4, ciLower: 3.3, ciUpper: 4.4 },
  ],
  South: [
    { period: 'Jan-Jun 2023', percentage: 12.1, ciLower: 11.1, ciUpper: 11.7 },
    { period: 'Jul-Dec 2023', percentage: 11.0, ciLower: 10.2, ciUpper: 10.8 },
    { period: 'Jan-Jun 2024', percentage: 10.0, ciLower: 9.3, ciUpper: 10.2 },
    { period: 'Jul-Dec 2024', percentage: 9.1, ciLower: 8, ciUpper: 9.2 },
  ],
};

const FentanylLineChart6Months = ({ region = 'National', width = 1100, height = 450 }) => {
  console.log('FentanylLineChart6Months received region prop:', region);
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  // Improved normalization to handle more cases
  const normalizeRegion = (r) => {
    if (!r) return 'National';
    const trimmed = r.trim().toLowerCase();
    if (trimmed.includes('northeast')) return 'Northeast';
    if (trimmed.includes('midwest')) return 'Midwest';
    if (trimmed.includes('south')) return 'South';
    if (trimmed.includes('west')) return 'West';
    if (trimmed.includes('national')) return 'National';
    return 'National';
  };
  const regionKey = normalizeRegion(region);
  console.log('Normalized regionKey:', regionKey);
  const data = fentanylSixMonthsData[regionKey] || [];

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, regionKey]);

  if (data.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#ff0000', marginTop: '20px' }}>
        <p>No data available for the selected region and period.</p>
      </div>
    );
  }

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = data.map(d => d.period);
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

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return data.map((d, i) => {
      if (i === 0) return null;
      const prevPeriod = i > 0 ? data[i - 1].percentage : null;
      const prevYear = i >= 2 ? data[i - 2].percentage : null;
      const curr = d.percentage;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const x = xScale(d.period) + xScale.bandwidth() / 2;
      const y = yScale(curr);
      const getArrowColor = (change) => {
        if (change === null) return '#6a0dad';
        return change > 0 ? '#6a0dad' : '#0073e6';
      };
      return (
        <g key={`indicator-fentanyl-${i}`}>
          <Circle
            cx={x}
            cy={y}
            r={4}
            fill={'#0073e6'}
            data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
              ${i >= 2 ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Yearly Change</strong><br/>
                  ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>6 Months Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                </div>
              </div>
            </div>`}
          />
        </g>
      );
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl on urine drug tests: {region} Census Region Jan 2023 - Dec 2024 (6 Months). Millennium Health, {region} Census Region Jan 2023 - Dec 2024
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
        {(() => {
          if (!data || data.length < 2) {
            return (
              <>
                <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
              </>
            );
          }
          const lastIdx = data.length - 1;
          const prevIdx = data.length - 2;
          const last = data[lastIdx];
          const prev = data[prevIdx];
          if (!last || !prev) {
            return (
              <>
                <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
              </>
            );
          }
          const absChange = (last.percentage - prev.percentage).toFixed(1);
          const direction = absChange > 0 ? 'increased' : 'decreased';
          return (
            <>
              <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.period} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.period}. This may indicate {direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to fentanyl among people with substance use disorders.
            </>
          );
        })()}
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
                  When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
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
              checked={showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />
            <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
          </label>
          <span className="toggle-label" style={{ color: showLabels ? '#fff' : '#333' }}>Labels {showLabels ? 'On' : 'Off'}</span>
        </div>
      </div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
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
            x={d => xScale(d.period) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke={'#1f77b4'}
            strokeWidth={2}
            curve={null}
          />
          {data.map((d, i) => {
            let showLabelNow = showLabels;
            return (
              <React.Fragment key={i}>
                <Circle
                  cx={xScale(d.period) + xScale.bandwidth() / 2}
                  cy={yScale(d.percentage)}
                  r={4}
                  fill={'#1f77b4'}
                  data-tip={`<div style='text-align: left;'>
                    <strong>${d.period}</strong><br/>
                    Fentanyl positivity: ${d.percentage}%<br/>
                    Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                  </div>`}
                />
                {showLabelNow && (
                  <text
                    x={xScale(d.period) + xScale.bandwidth() / 2}
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
          <div style={{ width: '30px', height: '2px', backgroundColor: '#1f77b4', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Fentanyl</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default FentanylLineChart6Months;
