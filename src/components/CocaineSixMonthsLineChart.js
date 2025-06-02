import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const cocaineSixMonthsData = {
  National: [
    { period: 'Jan-Jun 2023', percentage: 16.3, ciLower: 16, ciUpper: 16.4 },
    { period: 'Jul-Dec 2023', percentage: 16.3, ciLower: 16, ciUpper: 16.4 },
    { period: 'Jan-Jun 2024', percentage: 16.6, ciLower: 16.3, ciUpper: 16.7 },
    { period: 'Jul-Dec 2024', percentage: 18.2, ciLower: 17.9, ciUpper: 18.3 },
  ],
  West: [
    { period: 'Jan-Jun 2023', percentage: 25.4, ciLower: 25.2, ciUpper: 25.8 },
    { period: 'Jul-Dec 2023', percentage: 25.3, ciLower: 25.8, ciUpper: 26.4 },
    { period: 'Jan-Jun 2024', percentage: 26.3, ciLower: 26.3, ciUpper: 27.3 },
    { period: 'Jul-Dec 2024', percentage: 28.2, ciLower: 28.1, ciUpper: 29.1 },
  ],
  Midwest: [
    { period: 'Jan-Jun 2023', percentage: 12.7, ciLower: 12.2, ciUpper: 12.7 },
    { period: 'Jul-Dec 2023', percentage: 12.8, ciLower: 12.5, ciUpper: 13 },
    { period: 'Jan-Jun 2024', percentage: 12.3, ciLower: 12, ciUpper: 12.8 },
    { period: 'Jul-Dec 2024', percentage: 12.8, ciLower: 12.5, ciUpper: 13.3 },
  ],
  Northeast: [
    { period: 'Jan-Jun 2023', percentage: 3.2, ciLower: 2.9, ciUpper: 3.5 },
    { period: 'Jul-Dec 2023', percentage: 3.4, ciLower: 3.1, ciUpper: 3.7 },
    { period: 'Jan-Jun 2024', percentage: 3.5, ciLower: 3.1, ciUpper: 4.1 },
    { period: 'Jul-Dec 2024', percentage: 3.7, ciLower: 3, ciUpper: 4.1 },
  ],
  South: [
    { period: 'Jan-Jun 2023', percentage: 9.2, ciLower: 8.9, ciUpper: 9.4 },
    { period: 'Jul-Dec 2023', percentage: 9.5, ciLower: 9.9, ciUpper: 10.4 },
    { period: 'Jan-Jun 2024', percentage: 9.6, ciLower: 9.2, ciUpper: 10.2 },
    { period: 'Jul-Dec 2024', percentage: 11.4, ciLower: 10.7, ciUpper: 11.8 },
  ],
};

const getKeyFinding = (data) => {
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
    prevLabel: prev.period,
    last: last.percentage,
    lastLabel: last.period,
  };
};

const CocaineSixMonthsLineChart = ({ region, width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  const data = cocaineSixMonthsData[region] || [];
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, region]);

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return data.map((d, i) => {
      if (i === 0) return null; // Skip the first data point

      const prevPeriod = i > 0 ? data[i - 1].percentage : null;
      const prevYear = i >= 2 ? data[i - 2].percentage : null;
      const curr = d.percentage;

      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;

      const x = xScale(d.period) + xScale.bandwidth() / 2;
      const y = yScale(curr);

      const getArrowColor = (change) => {
        if (change === null) return '#6a0dad'; // default purple
        return change > 0 ? '#6a0dad' : '#0073e6'; // purple for increase, blue for decrease
      };

      return (
        <g key={`indicator-cocaine-${i}`}>
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
                  Cocaine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>6 Months Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Cocaine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                </div>
              </div>
            </div>`}
          />
        </g>
      );
    });
  };

  const keyFinding = getKeyFinding(data);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: {region} Census Region Jan 2023 - Dec 2024 (6 Months). Millennium Health, {region} Census Region Jan 2023 - Dec 2024
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
            <span style={{ fontWeight: 700 }}>Key finding:</span> Cocaine positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to cocaine among people with substance use disorders.
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
                    Cocaine positivity: ${d.percentage}%<br/>
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
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default CocaineSixMonthsLineChart;
