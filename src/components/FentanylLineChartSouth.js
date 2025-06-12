import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const fentanylAll = [
  { quarter: 'Q1 2023', percentage: 12.2, ciLower: 11.6, ciUpper: 12.6 },
  { quarter: 'Q2 2023', percentage: 12.0, ciLower: 11.4, ciUpper: 12.5 },
  { quarter: 'Q3 2023', percentage: 10.6, ciLower: 10.1, ciUpper: 11.1 },
  { quarter: 'Q4 2023', percentage: 11.3, ciLower: 10.7, ciUpper: 11.8 },
  { quarter: 'Q1 2024', percentage: 10.2, ciLower: 9.7, ciUpper: 10.7 },
  { quarter: 'Q2 2024', percentage: 9.8, ciLower: 9.3, ciUpper: 10.2 },
  { quarter: 'Q3 2024', percentage: 9.7, ciLower: 9.2, ciUpper: 10.1 },
  { quarter: 'Q4 2024', percentage: 8.5, ciLower: 8.0, ciUpper: 8.9 },
];

const fentanylWithStimulants = [
  { quarter: 'Q1 2023', percentage: 5.7, ciLower: 5.3, ciUpper: 6.1 },
  { quarter: 'Q2 2023', percentage: 5.5, ciLower: 5.1, ciUpper: 5.9 },
  { quarter: 'Q3 2023', percentage: 4.8, ciLower: 4.4, ciUpper: 5.2 },
  { quarter: 'Q4 2023', percentage: 5.1, ciLower: 4.7, ciUpper: 5.5 },
  { quarter: 'Q1 2024', percentage: 4.6, ciLower: 4.2, ciUpper: 5.0 },
  { quarter: 'Q2 2024', percentage: 4.3, ciLower: 3.9, ciUpper: 4.7 },
  { quarter: 'Q3 2024', percentage: 4.2, ciLower: 3.8, ciUpper: 4.6 },
  { quarter: 'Q4 2024', percentage: 3.7, ciLower: 3.3, ciUpper: 4.1 },
];

const fentanylWithoutStimulants = [
  { quarter: 'Q1 2023', percentage: 6.5, ciLower: 6.1, ciUpper: 6.9 },
  { quarter: 'Q2 2023', percentage: 6.4, ciLower: 6.0, ciUpper: 6.8 },
  { quarter: 'Q3 2023', percentage: 5.8, ciLower: 5.4, ciUpper: 6.2 },
  { quarter: 'Q4 2023', percentage: 6.2, ciLower: 5.8, ciUpper: 6.6 },
  { quarter: 'Q1 2024', percentage: 5.5, ciLower: 5.1, ciUpper: 5.9 },
  { quarter: 'Q2 2024', percentage: 5.5, ciLower: 5.1, ciUpper: 5.9 },
  { quarter: 'Q3 2024', percentage: 5.5, ciLower: 5.1, ciUpper: 5.9 },
  { quarter: 'Q4 2024', percentage: 4.8, ciLower: 4.4, ciUpper: 5.2 },
];

const allQuarters = fentanylAll.map(d => d.quarter);

const seriesList = [
  {
    name: 'Fentanyl with Stimulants',
    color: '#e4572e',
    data: fentanylWithStimulants,
  },
  {
    name: 'Fentanyl without Stimulants',
    color: '#2e86ab',
    data: fentanylWithoutStimulants,
  },
  {
    name: 'Fentanyl (All)',
    color: '#0073e6',
    data: fentanylAll,
  },
];

const fentanylSouthNew = [
  { quarter: 'Q4 2022', percentage: 50.4, ciLower: 47.1, ciUpper: 53.8 },
  { quarter: 'Q1 2023', percentage: 58.4, ciLower: 56.1, ciUpper: 60.8 },
  { quarter: 'Q2 2023', percentage: 60.2, ciLower: 57.8, ciUpper: 62.5 },
  { quarter: 'Q3 2023', percentage: 60.3, ciLower: 57.8, ciUpper: 62.7 },
  { quarter: 'Q4 2023', percentage: 58.4, ciLower: 56.1, ciUpper: 60.7 },
  { quarter: 'Q1 2024', percentage: 60.3, ciLower: 57.8, ciUpper: 62.7 },
  { quarter: 'Q2 2024', percentage: 57.7, ciLower: 55.1, ciUpper: 60.5 },
  { quarter: 'Q3 2024', percentage: 65.7, ciLower: 63.3, ciUpper: 68.1 },
  { quarter: 'Q4 2024', percentage: 69.6, ciLower: 67.0, ciUpper: 72.2 },
];

// Heroin data
const heroinSouth = [
  { quarter: 'Q4 2022', percentage: 34.4, ciLower: 31.9, ciUpper: 36.8 },
  { quarter: 'Q1 2023', percentage: 31.1, ciLower: 28.9, ciUpper: 33.3 },
  { quarter: 'Q2 2023', percentage: 32.1, ciLower: 29.7, ciUpper: 34.2 },
  { quarter: 'Q3 2023', percentage: 28.8, ciLower: 26.3, ciUpper: 30.9 },
  { quarter: 'Q4 2023', percentage: 28.9, ciLower: 26.5, ciUpper: 31.1 },
  { quarter: 'Q1 2024', percentage: 30.2, ciLower: 27.8, ciUpper: 32.5 },
  { quarter: 'Q2 2024', percentage: 35.8, ciLower: 33.1, ciUpper: 38.1 },
  { quarter: 'Q3 2024', percentage: 38.0, ciLower: 35.4, ciUpper: 40.4 },
  { quarter: 'Q4 2024', percentage: 41.4, ciLower: 38.6, ciUpper: 44.1 },
];

// Cocaine data
const cocaineSouth = [
  { quarter: 'Q4 2022', percentage: 38.9, ciLower: 36.4, ciUpper: 41.5 },
  { quarter: 'Q1 2023', percentage: 39.9, ciLower: 37.4, ciUpper: 42.1 },
  { quarter: 'Q2 2023', percentage: 43.6, ciLower: 41, ciUpper: 45.9 },
  { quarter: 'Q3 2023', percentage: 42.4, ciLower: 39.5, ciUpper: 44.7 },
  { quarter: 'Q4 2023', percentage: 42.2, ciLower: 39.5, ciUpper: 44.6 },
  { quarter: 'Q1 2024', percentage: 40.9, ciLower: 38.2, ciUpper: 43.2 },
  { quarter: 'Q2 2024', percentage: 43.9, ciLower: 41.3, ciUpper: 46.2 },
  { quarter: 'Q3 2024', percentage: 45.1, ciLower: 42.4, ciUpper: 47.5 },
  { quarter: 'Q4 2024', percentage: 49.9, ciLower: 47, ciUpper: 52.6 },
];

// Methamphetamine data
const methSouth = [
  { quarter: 'Q4 2022', percentage: 31.7, ciLower: 29.3, ciUpper: 34.1 },
  { quarter: 'Q1 2023', percentage: 28.7, ciLower: 26.3, ciUpper: 30.6 },
  { quarter: 'Q2 2023', percentage: 27.1, ciLower: 24.8, ciUpper: 29.2 },
  { quarter: 'Q3 2023', percentage: 27.8, ciLower: 25.3, ciUpper: 29.9 },
  { quarter: 'Q4 2023', percentage: 29.4, ciLower: 27, ciUpper: 31.6 },
  { quarter: 'Q1 2024', percentage: 26.6, ciLower: 24.3, ciUpper: 28.8 },
  { quarter: 'Q2 2024', percentage: 29.7, ciLower: 27.1, ciUpper: 31.9 },
  { quarter: 'Q3 2024', percentage: 34.9, ciLower: 32.3, ciUpper: 38.5 },
  { quarter: 'Q4 2024', percentage: 35.9, ciLower: 33.2, ciUpper: 38.6 },
];

const allQuartersSouthNew = fentanylSouthNew.map(d => d.quarter);

const seriesListSouthNew = [
  {
    name: 'Heroin',
    color: '#e4572e',
    data: heroinSouth,
  },
  {
    name: 'Cocaine',
    color: '#2e86ab',
    data: cocaineSouth,
  },
  {
    name: 'Methamphetamine',
    color: '#0073e6',
    data: methSouth,
  },
  {
    name: 'Fentanyl with Stimulants',
    color: '#6a0dad',
    data: fentanylSouthNew,
  },
];

const FentanylLineChartSouth = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(seriesList.map(s => s.name)); 

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = allQuarters;
  const yMax = Math.max(
    ...seriesList.flatMap(s => s.data.map(d => d.percentage))
  );
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const getPrevValue = (series, i, offset = 1) => {
    if (i - offset >= 0) {
      return series[i - offset].percentage;
    }
    return null;
  };

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return seriesList.flatMap((series, sIdx) =>
      series.data.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = getPrevValue(series.data, i, 1);
        const prevYear = getPrevValue(series.data, i, 4);
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return series.color;
          return change > 0 ? '#6a0dad' : '#0073e6'; 
        };
        return (
          <g key={`indicator-south-${series.name}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={series.color}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
              <div><strong>${series.name}</strong></div>
              ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Yearly Change</strong><br/>
                  ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Quarterly Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>
            </div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
        );
      })
    );
  };

  const getKeyFinding = () => {
    if (!fentanylAll || fentanylAll.length < 2) return null;
    const lastIdx = fentanylAll.length - 1;
    const prevIdx = fentanylAll.length - 2;
    const last = fentanylAll[lastIdx];
    const prev = fentanylAll[prevIdx];
    if (!last || !prev) return null;
    const absChange = (last.percentage - prev.percentage).toFixed(1);
    const direction = absChange > 0 ? 'increased' : 'decreased';
    return {
      direction,
      absChange: Math.abs(absChange),
      prev: prev.percentage,
      prevLabel: prev.quarter,
      last: last.percentage,
      lastLabel: last.quarter,
    };
  };
  const keyFinding = getKeyFinding();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl on urine drug tests: Southern Census Region Q1 2023 - Q4 2024. Millennium Health, Southern Census Region Q1 2023 - Q4 2024
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
            <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to fentanyl among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', marginBottom: '0px' }}>
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
          {seriesList.map((series, sIdx) => (
            selectedLines.includes(series.name) && (
              <React.Fragment key={series.name}>
                <LinePath
                  data={series.data}
                  x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                  y={d => yScale(d.percentage)}
                  stroke={series.color}
                  strokeWidth={2}
                  curve={null}
                />
                {series.data.map((d, i) => {
                  const n = series.data.length;
                  const showLabel = showLabels || (
                    i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                  );
                  let labelYOffset = -22;
                  if (series.name.toLowerCase().includes('heroin')) {
                    labelYOffset = -19;
                  }
                  const labelXOffset = 0;
                  return (
                    <React.Fragment key={i}>
                      <Circle
                        cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                        cy={yScale(d.percentage)}
                        r={4}
                        fill={series.color}
                        data-tip={`<div style='text-align: left;'>
                          <strong>${series.name}</strong><br/>
                          <strong>${d.quarter}</strong><br/>
                          Fentanyl positivity: ${d.percentage}%<br/>
                          Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                        </div>`}
                      />
                      {showLabel && (
                        <text
                          x={xScale(d.quarter) + xScale.bandwidth() / 2 + labelXOffset}
                          y={yScale(d.percentage) + labelYOffset}
                          fontSize={13}
                          textAnchor="middle"
                          fill={series.color}
                          fontWeight={700}
                          style={{
                            paintOrder: 'stroke',
                            stroke: '#fff',
                            strokeWidth: 3,
                            strokeLinejoin: 'round',
                          }}
                        >
                          {d.percentage}%
                        </text>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )
          ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {seriesList.map(series => (
          <div key={series.name} style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: series.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{series.name}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

const FentanylLineChartSouthNew = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(seriesListSouthNew.map(s => s.name)); 

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = allQuartersSouthNew;
  const yMax = Math.max(...seriesListSouthNew.flatMap(s => s.data.map(d => d.percentage)));
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const getPrevValue = (series, i, offset = 1) => {
    if (i - offset >= 0) {
      return series[i - offset].percentage;
    }
    return null;
  };

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return seriesListSouthNew.flatMap((series, sIdx) =>
      series.data.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = getPrevValue(series.data, i, 1);
        const prevYear = getPrevValue(series.data, i, 4);
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return series.color;
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-south-new-${series.name}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={series.color}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
              <div><strong>${series.name}</strong></div>
              ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Yearly Change</strong><br/>
                  ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Quarterly Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Fentanyl positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>
            </div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
        );
      })
    );
  };

  const getKeyFinding = () => {
    if (!fentanylSouthNew || fentanylSouthNew.length < 2) return null;
    const lastIdx = fentanylSouthNew.length - 1;
    const prevIdx = fentanylSouthNew.length - 2;
    const last = fentanylSouthNew[lastIdx];
    const prev = fentanylSouthNew[prevIdx];
    if (!last || !prev) return null;
    const absChange = (last.percentage - prev.percentage).toFixed(1);
    const direction = absChange > 0 ? 'increased' : 'decreased';
    return {
      direction,
      absChange: Math.abs(absChange),
      prev: prev.percentage,
      prevLabel: prev.quarter,
      last: last.percentage,
      lastLabel: last.quarter,
    };
  };
  const keyFinding = getKeyFinding();

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginTop: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for heroin, cocaine, methamphetamine, or fentanyl on urine drug tests: Southern Census Region Q4 2022 - Q4 2024. Millennium Health, Southern Census Region Q4 2022 - Q4 2024
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
            <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', marginBottom: '0px' }}>
        <div className="toggle-wrapper" style={{ position: 'relative' }}>
          <label
            className="toggle-switch"
            data-tip={"Show/hide quarterly and yearly percent change arrows and tooltips."}
            data-for="percentChangeTooltipSouthNew"
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
            data-tip={"Show/hide quarterly and yearly percent change arrows and tooltips."}
            data-for="percentChangeTooltipSouthNew"
          >
            % Chg {showPercentChange ? 'On' : 'Off'}
          </span>
          <ReactTooltip
            id="percentChangeTooltipSouthNew"
            place="top"
            effect="solid"
            backgroundColor="#ededed"
            border={true}
            borderColor="#bbb"
            className="simple-tooltip"
            html={true}
            textColor="#222"
          />
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '18px 0 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-south"
                checked={selectedLines.length === seriesListSouthNew.length && seriesListSouthNew.every(s => selectedLines.includes(s.name))}
                onChange={() => {
                  if (selectedLines.length === seriesListSouthNew.length && seriesListSouthNew.every(s => selectedLines.includes(s.name))) {
                    setSelectedLines([]); 
                  } else {
                    setSelectedLines(seriesListSouthNew.map(s => s.name)); 
                  }
                }}
                style={{ accentColor: selectedLines.length === seriesListSouthNew.length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '15px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-south"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])} 
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '15px', color: '#222', fontWeight: 400 }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px', marginBottom: '10px' }}>
          {seriesListSouthNew.map(series => (
            <label key={series.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLines.includes(series.name)}
                onChange={() => {
                  if (selectedLines.includes(series.name)) {
                    setSelectedLines(selectedLines.filter(line => line !== series.name));
                  } else {
                    setSelectedLines([...selectedLines, series.name]);
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
                  border: `2px solid ${series.color}`,
                  background: '#fff',
                  marginRight: 2,
                  position: 'relative',
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {selectedLines.includes(series.name) && (
                  <span
                    style={{
                      display: 'block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: series.color,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '15px', color: '#222' }}>{series.name}</span>
            </label>
          ))}
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
          {seriesListSouthNew.map((series, sIdx) => (
            selectedLines.includes(series.name) && (
              <React.Fragment key={series.name}>
                <LinePath
                  data={series.data}
                  x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                  y={d => yScale(d.percentage)}
                  stroke={series.color}
                  strokeWidth={2}
                  curve={null}
                />
                {series.data.map((d, i) => {
                  const n = series.data.length;
                  const showLabel = showLabels || (
                    i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                  );
                  let labelYOffset = -22;
                  const labelXOffset = 0;
                  return (
                    <React.Fragment key={i}>
                      <Circle
                        cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                        cy={yScale(d.percentage)}
                        r={4}
                        fill={series.color}
                        data-tip={`<div style='text-align: left;'>
                          <strong>${series.name}</strong><br/>
                          <strong>${d.quarter}</strong><br/>
                          Fentanyl positivity: ${d.percentage}%<br/>
                          Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                        </div>`}
                      />
                      {showLabel && (
                        <text
                          x={xScale(d.quarter) + xScale.bandwidth() / 2 + labelXOffset}
                          y={yScale(d.percentage) + labelYOffset}
                          fontSize={13}
                          textAnchor="middle"
                          fill={series.color}
                          fontWeight={700}
                          style={{
                            paintOrder: 'stroke',
                            stroke: '#fff',
                            strokeWidth: 3,
                            strokeLinejoin: 'round',
                          }}
                        >
                          {d.percentage}%
                        </text>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )
          ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {seriesListSouthNew.map(series => (
          <div key={series.name} style={{ display: 'flex', alignItems: 'center', marginRight: '25px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: series.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{series.name}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default function FentanylLineChartSouthWrapper(props) {
  return (
    <>
      <FentanylLineChartSouth {...props} />
      <FentanylLineChartSouthNew {...props} />
    </>
  );
}
