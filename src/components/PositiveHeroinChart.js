import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const sampleDataHeroin = [
  {
    name: 'Heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '19.8', ciLower: '19.0', ciUpper: '20.7' },
      { quarter: 'Q1 2023', percentage: '20.0', ciLower: '19.1', ciUpper: '20.8' },
      { quarter: 'Q2 2023', percentage: '19.5', ciLower: '19.1', ciUpper: '21.3' },
      { quarter: 'Q3 2023', percentage: '19.3', ciLower: '18.4', ciUpper: '20.6' },
      { quarter: 'Q4 2023', percentage: '18.4', ciLower: '18.0', ciUpper: '20.6' },
      { quarter: 'Q1 2024', percentage: '19.4', ciLower: '18.6', ciUpper: '20.7' },
      { quarter: 'Q2 2024', percentage: '19.8', ciLower: '18.6', ciUpper: '26.7' },
      { quarter: 'Q3 2024', percentage: '28.4', ciLower: '23.3', ciUpper: '35.9' },
      { quarter: 'Q4 2024', percentage: '30.5', ciLower: '19.6', ciUpper: '52.3' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { quarter: 'Q4 2022', percentage: '21.1', ciLower: '20.3', ciUpper: '22.0' },
      { quarter: 'Q1 2023', percentage: '22.5', ciLower: '21.5', ciUpper: '24.2' },
      { quarter: 'Q2 2023', percentage: '24.2', ciLower: '23.2', ciUpper: '25.0' },
      { quarter: 'Q3 2023', percentage: '25.2', ciLower: '24.3', ciUpper: '25.5' },
      { quarter: 'Q4 2023', percentage: '24.7', ciLower: '23.8', ciUpper: '25.5' },
      { quarter: 'Q1 2024', percentage: '25.8', ciLower: '24.8', ciUpper: '26.6' },
      { quarter: 'Q2 2024', percentage: '25.8', ciLower: '24.8', ciUpper: '26.6' },
      { quarter: 'Q3 2024', percentage: '29.3', ciLower: '28.2', ciUpper: '30.0' },
      { quarter: 'Q4 2024', percentage: '29.2', ciLower: '28.1', ciUpper: '30.0' },
    ],
  },
  {
    name: 'Methamphetamine',
    values: [
      { quarter: 'Q4 2022', percentage: '52.5', ciLower: '51.5', ciUpper: '53.6' },
      { quarter: 'Q1 2023', percentage: '53.3', ciLower: '51.6', ciUpper: '53.7' },
      { quarter: 'Q2 2023', percentage: '54.7', ciLower: '53.3', ciUpper: '55.3' },
      { quarter: 'Q3 2023', percentage: '54.5', ciLower: '53.3', ciUpper: '55.3' },
      { quarter: 'Q4 2023', percentage: '54.8', ciLower: '53.3', ciUpper: '55.7' },
      { quarter: 'Q1 2024', percentage: '57.1', ciLower: '55.8', ciUpper: '57.9' },
      { quarter: 'Q2 2024', percentage: '60.8', ciLower: '59.4', ciUpper: '61.4' },
      { quarter: 'Q3 2024', percentage: '64.1', ciLower: '62.8', ciUpper: '64.9' },
      { quarter: 'Q4 2024', percentage: '68.4', ciLower: '67.1', ciUpper: '69.1' },
    ],
  },
  {
    name: 'Fentanyl and Stimulants',
    values: [
      { quarter: 'Q4 2022', percentage: '67.0', ciLower: '66.0', ciUpper: '67.9' },
      { quarter: 'Q1 2023', percentage: '67.0', ciLower: '66.0', ciUpper: '67.9' },
      { quarter: 'Q2 2023', percentage: '68.4', ciLower: '67.5', ciUpper: '69.4' },
      { quarter: 'Q3 2023', percentage: '69.5', ciLower: '68.4', ciUpper: '70.3' },
      { quarter: 'Q4 2023', percentage: '70.3', ciLower: '69.4', ciUpper: '71.0' },
      { quarter: 'Q1 2024', percentage: '70.9', ciLower: '69.8', ciUpper: '71.5' },
      { quarter: 'Q2 2024', percentage: '73.8', ciLower: '68.4', ciUpper: '74.7' },
      { quarter: 'Q3 2024', percentage: '76.8', ciLower: '75.9', ciUpper: '77.6' },
      { quarter: 'Q4 2024', percentage: '80.5', ciLower: '79.7', ciUpper: '81.3' },
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
  'Methamphetamine': '#ffa600', // Orange
  'Cocaine': '#2f4b7c', // Blue
  'Heroin': '#665191', // Purple
  'Fentanyl and Stimulants': '#00bfae', // Teal
};

const PositiveHeroinChart = ({ width = 1100, height = 450, period }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));

  const margin = { top: 60, right: 30, bottom: 50, left: 90 }; 
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const adjustedData = period === 'Quarterly' || !period ? sampleDataHeroin : sampleDataHeroin_6Months;

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

  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return parseFloat(lineData.values[i - offset].percentage);
    }
    return null;
  };

  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;

    return adjustedData
      .filter(lineData => selectedLines.includes(lineData.name))
      .map((lineData, index) => {
        return lineData.values.map((d, i) => {
          if (i === 0) return null;

          const prevPeriod = getPrevPeriodValue(lineData, i, 1);
          const yearlyOffset = (period === 'Quarterly' || !period) ? 4 : 2;
          const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
          const curr = parseFloat(d.percentage);

          const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
          const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;

          
          const xLabel = xAccessor(d);
          const xPosition = xScale(xLabel) + xScale.bandwidth() / 2;
          const yPosition = yScale(curr);
          if (isNaN(xPosition) || isNaN(yPosition)) return null;

          const showYearlyIndicator = i >= yearlyOffset;

          
          const getArrowColor = (change) => {
            if (change === null) return '#6a0dad'; // default purple
            return change > 0 ? '#6a0dad' : '#2196f3';
          };

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
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${lineData.name} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
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

  console.log('PositiveHeroinChart period prop:', period);

  const mainLine = adjustedData.find(line => line.name === "Methamphetamine");
  let keyFinding = null;
  if (mainLine && mainLine.values.length >= 2) {
    const n = mainLine.values.length;
    const last = parseFloat(mainLine.values[n - 1].percentage);
    const prev = parseFloat(mainLine.values[n - 2].percentage);
    const percentChange = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
    keyFinding = {
      last: last.toFixed(1),
      prev: prev.toFixed(1),
      absChange: Math.abs(percentChange).toFixed(1),
      direction: percentChange > 0 ? 'increased' : 'decreased',
      lastLabel: xAccessor(mainLine.values[n - 1]),
      prevLabel: xAccessor(mainLine.values[n - 2]),
    };
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test who test positive for fentanyl on urine drug tests also test positive for cocaine, methamphetamine, or heroin: United States Q4 2022 - Q4 2024
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
                    setSelectedLines([]); 
                  } else {
                    setSelectedLines(Object.keys(lineColors)); 
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
                onChange={() => setSelectedLines([])} 
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