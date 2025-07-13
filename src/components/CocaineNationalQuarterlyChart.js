import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

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
    prevLabel: prev.quarter,
    last: last.percentage,
    lastLabel: last.quarter,
  };
};

const renderDrugLine = (data, color, xScale, yScale) => (
  <LinePath
    data={data}
    x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
    y={d => yScale(d.percentage)}
    stroke={color}
    strokeWidth={2}
  />
);

const renderDrugPoints = (data, color, xScale, yScale, showLabels) =>
  data.map((d, i) => {
    const n = data.length;
    let showLabel = false;
    showLabel = showLabels || (
      i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
    );
    return (
      <React.Fragment key={i}>
        <Circle
          cx={xScale(d.quarter) + xScale.bandwidth() / 2}
          cy={yScale(d.percentage)}
          r={4}
          fill={color}
          data-tip={`<div style='text-align: left;'>
            <strong>${d.quarter}</strong><br/>
            Positivity: ${d.percentage}%<br/>
            Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
          </div>`}
        />
        {showLabel && (
          <text
            x={xScale(d.quarter) + xScale.bandwidth() / 2}
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
  });

const CocaineNationalQuarterlyChart = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [cocaineNationalQuarterly, setCocaineNationalQuarterly] = useState([]);
  const [amphetamineNationalQuarterly, setAmphetamineNationalQuarterly] = useState([]);
  const [methamphetamineNationalQuarterly, setMethamphetamineNationalQuarterly] = useState([]);
  
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const getPrevValue = (i, offset = 1) => {
    if (i - offset >= 0) {
      return cocaineNationalQuarterly[i - offset].percentage;
    }
    return null;
  };

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return cocaineNationalQuarterly.map((d, i) => {
      if (i === 0) return null;
      const prevPeriod = getPrevValue(i, 1);
      const prevYear = getPrevValue(i, 4);
      const curr = d.percentage;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const x = xScale(d.quarter) + xScale.bandwidth() / 2;
      const y = yScale(curr);
      const showYearly = i >= 4;
      // Arrow color logic
      const getArrowColor = (change) => {
        if (change === null) return '#6a0dad';
        return change > 0 ? '#6a0dad' : '#0073e6';
      };
      return (
        <g key={`indicator-cocaine-${i}`}> 
          <Circle
            cx={x}
            cy={y}
            r={4} 
            fill={'#6a0dad'}
            data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
              ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Yearly Change</strong><br/>
                  ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Cocaine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>` : ''}
              <div style='display: flex; align-items: center;'>
                <svg width='20' height='20' style='margin-right: 10px;'>
                  <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                </svg>
                <div>
                  <strong>Quarterly Change</strong><br/>
                  ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                  Cocaine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                </div>
              </div>
            </div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );
    });
  };

function getGroupedPosSeries(millenialData) {
    const periodKey = 'Quarterly';
    const arr = millenialData?.National?.Cocaine?.Positivity?.[periodKey] || [];
    const drugs = ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'];
    return drugs.map(name => ({
      label: name,
      data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
        quarter: d.period || d.smon_yr, // Use 'period' for x-axis
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
        ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
        periodChange: d.Period || d.periodChange || '',
      }))
    })).filter(line => line.data.length > 0);
}

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

            const jData = getGroupedPosSeries(data);
            setCocaineNationalQuarterly(jData[0].data);
            setAmphetamineNationalQuarterly(jData[1].data);
            setMethamphetamineNationalQuarterly(jData[2].data);
          });
      }, []);

  const xDomain = cocaineNationalQuarterly.map(d => d.quarter);
  const yDomain = [0, Math.max(...cocaineNationalQuarterly.map(d => d.percentage)) + 1];

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yScale = scaleLinear({
    domain: yDomain,
    range: [adjustedHeight, 0],
    nice: true,
  });

  const keyFinding = getKeyFinding(cocaineNationalQuarterly);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#fff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: U.S. Total Q1 2023 - Q4 2024. Millennium Health, U.S. Total Q1 2023 - Q4 2024
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
            % Cocaine Positive
          </text>
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
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
          {/* Cocaine Line */}
          <LinePath
            data={cocaineNationalQuarterly}
            x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke="#6a0dad"
            strokeWidth={2}
          />
          {/* --- New Drug Lines --- */}
          {renderDrugLine(amphetamineNationalQuarterly, "#e07a5f", xScale, yScale)}
          {renderDrugLine(methamphetamineNationalQuarterly, "#3d405b", xScale, yScale)}
          {/* --- New Drug Points/Labels --- */}
          {renderDrugPoints(amphetamineNationalQuarterly, "#e07a5f", xScale, yScale, showLabels)}
          {renderDrugPoints(methamphetamineNationalQuarterly, "#3d405b", xScale, yScale, showLabels)}
          {cocaineNationalQuarterly.map((d, i) => {
            const n = cocaineNationalQuarterly.length;
            let showLabel = false;
            showLabel = showLabels || (
              i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
            );
            return (
              <React.Fragment key={i}>
                <Circle
                  cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                  cy={yScale(d.percentage)}
                  r={4} // Standardized radius to 4 for consistency
                  fill="#6a0dad"
                  data-tip={`<div style='text-align: left;'>
                    <strong>${d.quarter}</strong><br/>
                    Cocaine positivity: ${d.percentage}%<br/>
                    Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                  </div>`}
                />
                {showLabel && (
                  <text
                    x={xScale(d.quarter) + xScale.bandwidth() / 2}
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
          <div style={{ width: '30px', height: '2px', backgroundColor: '#6a0dad', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#e07a5f', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine with Opioids</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#3d405b', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine without Opioids</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip id="percentChangeTooltip" html={true} />
    </div>
  );
};

const getPrevValueGeneric = (data, i, offset = 1) => {
  if (i - offset >= 0) {
    return data[i - offset].percentage;
  }
  return null;
};

const renderChangeIndicatorsWest = (data, color, xScale, yScale, showPercentChange, label) => {
  if (!showPercentChange) return null;
  return data.map((d, i) => {
    if (i === 0) return null;
    const prevPeriod = getPrevValueGeneric(data, i, 1);
    const prevYear = getPrevValueGeneric(data, i, 4);
    const curr = d.percentage;
    const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
    const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
    const x = xScale(d.quarter) + xScale.bandwidth() / 2;
    const y = yScale(curr);
    const showYearly = i >= 4;
    const getArrowColor = (change) => {
      if (change === null) return color;
      return change > 0 ? color : '#0073e6';
    };
    return (
      <g key={`indicator-west-${color}-${i}`}> 
        <Circle
          cx={x}
          cy={y}
          r={6}
          fill={color}
          opacity={0.18}
          style={{ pointerEvents: 'none' }}
        />
        <Circle
          cx={x}
          cy={y}
          r={4}
          fill={color}
          data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
            ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
              <svg width='20' height='20' style='margin-right: 10px;'>
                <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
              </svg>
              <div>
                <strong>Yearly Change</strong><br/>
                ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                ${label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
              </div>
            </div>` : ''}
            <div style='display: flex; align-items: center;'>
              <svg width='20' height='20' style='margin-right: 10px;'>
                <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
              </svg>
              <div>
                <strong>Quarterly Change</strong><br/>
                ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                ${label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
              </div>
            </div>
          </div>`}
          style={{ cursor: 'pointer' }}
        />
      </g>
    );
  });
};

function CocaineWestQuarterlyChart({ width = 1100, height = 450 }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [cocaineWestQuarterly, setCocaineWestQuarterly] = useState([]);
  const [amphetamineWestQuarterly, setAmphetamineWestQuarterly] = useState([]);
  const [methamphetamineWestQuarterly, setMethamphetamineWestQuarterly] = useState([]);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;
  
  function getGroupedPosSeries(millenialData) {
    const periodKey = 'Quarterly';
    const arr = millenialData?.West?.Cocaine?.Positivity?.[periodKey] || [];
    const drugs = ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'];
    return drugs.map(name => ({
      label: name,
      data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
        quarter: d.period || d.smon_yr, // Use 'period' for x-axis
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
        ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
        periodChange: d.Period || d.periodChange || '',
      }))
    })).filter(line => line.data.length > 0);
}

  useEffect(() => { ReactTooltip.rebuild(); }, [showPercentChange]);

  useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

            const jData = getGroupedPosSeries(data);
            setCocaineWestQuarterly(jData[0].data);
            setAmphetamineWestQuarterly(jData[1].data);
            setMethamphetamineWestQuarterly(jData[2].data);
          });
      }, []);

  const xDomain = cocaineWestQuarterly.map(d => d.quarter);
  const yDomain = [0, Math.max(...cocaineWestQuarterly.map(d => d.percentage)) + 1];
  const xScale = scaleBand({ domain: xDomain, range: [0, adjustedWidth], padding: 0.2 });
  const yScale = scaleLinear({ domain: yDomain, range: [adjustedHeight, 0], nice: true });
  const getPrevValue = (i, offset = 1) => (i - offset >= 0 ? cocaineWestQuarterly[i - offset].percentage : null);

  const keyFinding = getKeyFinding(cocaineWestQuarterly);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#fff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: Western Census Region Q1 2023 - Q4 2024. Millennium Health, Western Census Region Q1 2023 - Q4 2024
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
            % Cocaine Positive
          </text>
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
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
          {/* Cocaine Line */}
          <LinePath
            data={cocaineWestQuarterly}
            x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke="#6a0dad"
            strokeWidth={2}
          />
          {/* --- New Drug Lines --- */}
          {renderDrugLine(amphetamineWestQuarterly, "#e07a5f", xScale, yScale)}
          {renderDrugLine(methamphetamineWestQuarterly, "#3d405b", xScale, yScale)}
          {/* --- New Drug Points/Labels --- */}
          {renderDrugPoints(amphetamineWestQuarterly, "#e07a5f", xScale, yScale, showLabels)}
          {renderDrugPoints(methamphetamineWestQuarterly, "#3d405b", xScale, yScale, showLabels)}
          {renderDrugPoints(cocaineWestQuarterly, "#6a0dad", xScale, yScale, showLabels)}
          {/* --- Percent Change Indicators for last 5 quarters, all lines --- */}
          {renderChangeIndicatorsWest(cocaineWestQuarterly, "#6a0dad", xScale, yScale, showPercentChange, "Cocaine")}
          {renderChangeIndicatorsWest(amphetamineWestQuarterly, "#e07a5f", xScale, yScale, showPercentChange, "Cocaine with Opioids")}
          {renderChangeIndicatorsWest(methamphetamineWestQuarterly, "#3d405b", xScale, yScale, showPercentChange, "Cocaine without Opioids")}
        </Group>
      </svg>
      {/* --- Updated Legend --- */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#6a0dad', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#e07a5f', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine with Opioids</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#3d405b', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine without Opioids</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip id="percentChangeTooltip" html={true} />
    </div>
  );
}

function renderChangeIndicatorsMidwest(data, color, xScale, yScale, showPercentChange, label) {
  if (!showPercentChange) return null;
  return data.map((d, i) => {
    if (i === 0) return null;
    const prevPeriod = getPrevValueGeneric(data, i, 1);
    const prevYear = getPrevValueGeneric(data, i, 4);
    const curr = d.percentage;
    const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
    const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
    const x = xScale(d.quarter) + xScale.bandwidth() / 2;
    const y = yScale(curr);
    const showYearly = i >= 4;
    const getArrowColor = (change) => {
      if (change === null) return color;
      return change > 0 ? color : '#0073e6';
    };
    return (
      <g key={`indicator-midwest-${color}-${i}`}> 
        <Circle
          cx={x}
          cy={y}
          r={6}
          fill={color}
          opacity={0.18}
          style={{ pointerEvents: 'none' }}
        />
        <Circle
          cx={x}
          cy={y}
          r={4}
          fill={color}
          data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
            ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
              <svg width='20' height='20' style='margin-right: 10px;'>
                <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
              </svg>
              <div>
                <strong>Yearly Change</strong><br/>
                ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                ${label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
              </div>
            </div>` : ''}
            <div style='display: flex; align-items: center;'>
              <svg width='20' height='20' style='margin-right: 10px;'>
                <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
              </svg>
              <div>
                <strong>Quarterly Change</strong><br/>
                ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                ${label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
              </div>
            </div>
          </div>`}
          style={{ cursor: 'pointer' }}
        />
      </g>
    );
  });
}

function CocaineMidwestQuarterlyChart({ width = 1100, height = 450 }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [cocaineMidwestQuarterly, setCocaineMidwestQuarterly] = useState([]);
  const [amphetamineMidwestQuarterly, setAmphetamineMidwestQuarterly] = useState([]);
  const [methamphetamineMidwestQuarterly, setMethamphetamineMidwestQuarterly] = useState([]);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;
  
  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return cocaineMidwestQuarterly.map((d, i) => {
      if (i === 0) return null;
      const prevPeriod = getPrevValue(i, 1);
      const prevYear = getPrevValue(i, 4);
      const curr = d.percentage;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const x = xScale(d.quarter) + xScale.bandwidth() / 2;
      const y = yScale(curr);
      const showYearly = i >= 4;
      const getArrowColor = (change) => (change === null ? '#6a0dad' : change > 0 ? '#6a0dad' : '#0073e6');
      return (
        <g key={`indicator-cocaine-midwest-${i}`}> 
          <Circle
            cx={x}
            cy={y}
            r={4} // Standardized radius to 4 for consistency
            fill={'#6a0dad'}
            data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'><svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' /></svg><div><strong>Yearly Change</strong><br/>${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>Cocaine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}</div></div>` : ''}<div style='display: flex; align-items: center;'><svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' /></svg><div><strong>Quarterly Change</strong><br/>${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>Cocaine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}</div></div></div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );
    });
  };

  function getGroupedPosSeries(millenialData) {
    const periodKey = 'Quarterly';
    const arr = millenialData?.MidWest?.Cocaine?.Positivity?.[periodKey] || [];
    const drugs = ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'];
    return drugs.map(name => ({
      label: name,
      data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
        quarter: d.period || d.smon_yr, // Use 'period' for x-axis
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
        ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
        periodChange: d.Period || d.periodChange || '',
      }))
    })).filter(line => line.data.length > 0);
  }

  useEffect(() => { ReactTooltip.rebuild(); }, [showPercentChange]);

   useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

            const jData = getGroupedPosSeries(data);
            setCocaineMidwestQuarterly(jData[0].data);
            setAmphetamineMidwestQuarterly(jData[1].data);
            setMethamphetamineMidwestQuarterly(jData[2].data);
          });
      }, []);

  const keyFinding = getKeyFinding(cocaineMidwestQuarterly);

  const xDomain = cocaineMidwestQuarterly.map(d => d.quarter);
  const yDomain = [0, Math.max(...cocaineMidwestQuarterly.map(d => d.percentage)) + 1];
  const xScale = scaleBand({ domain: xDomain, range: [0, adjustedWidth], padding: 0.2 });
  const yScale = scaleLinear({ domain: yDomain, range: [adjustedHeight, 0], nice: true });
  const getPrevValue = (i, offset = 1) => (i - offset >= 0 ? cocaineMidwestQuarterly[i - offset].percentage : null);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#fff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: Midwest Census Region Q1 2023 - Q4 2024. Millennium Health, Midwest Census Region Q1 2023 - Q4 2024
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
            % Cocaine Positive
          </text>
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
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
          {/* Cocaine Line */}
          <LinePath
            data={cocaineMidwestQuarterly}
            x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke="#6a0dad"
            strokeWidth={2}
          />
          {renderDrugLine(amphetamineMidwestQuarterly, "#e07a5f", xScale, yScale)}
          {renderDrugLine(methamphetamineMidwestQuarterly, "#3d405b", xScale, yScale)}
          {renderDrugPoints(amphetamineMidwestQuarterly, "#e07a5f", xScale, yScale, showLabels)}
          {renderDrugPoints(methamphetamineMidwestQuarterly, "#3d405b", xScale, yScale, showLabels)}
          {renderDrugPoints(cocaineMidwestQuarterly, "#6a0dad", xScale, yScale, showLabels)}
          {renderChangeIndicatorsMidwest(cocaineMidwestQuarterly, "#6a0dad", xScale, yScale, showPercentChange, "Cocaine")}
          {renderChangeIndicatorsMidwest(amphetamineMidwestQuarterly, "#e07a5f", xScale, yScale, showPercentChange, "Cocaine with Opioids")}
          {renderChangeIndicatorsMidwest(methamphetamineMidwestQuarterly, "#3d405b", xScale, yScale, showPercentChange, "Cocaine without Opioids")}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#6a0dad', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#e07a5f', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine with Opioids</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#3d405b', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine without Opioids</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip id="percentChangeTooltip" html={true} />
    </div>
  );
}

function CocaineSouthQuarterlyChart({ width = 1100, height = 450 }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [cocaineSouthQuarterly, setCocaineSouthQuarterly] = useState([]);
  const [amphetamineNationalQuarterly, setAmphetamineNationalQuarterly] = useState([]);
  const [methamphetamineNationalQuarterly, setMethamphetamineNationalQuarterly] = useState([]);
  
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;
  
  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return cocaineSouthQuarterly.map((d, i) => {
      if (i === 0) return null;
      const prevPeriod = getPrevValue(i, 1);
      const prevYear = getPrevValue(i, 4);
      const curr = d.percentage;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const x = xScale(d.quarter) + xScale.bandwidth() / 2;
      const y = yScale(curr);
      const showYearly = i >= 4;
      const getArrowColor = (change) => (change === null ? '#6a0dad' : change > 0 ? '#6a0dad' : '#0073e6');
      return (
        <g key={`indicator-cocaine-south-${i}`}> 
          <Circle
            cx={x}
            cy={y}
            r={4} // Standardized radius to 4 for consistency
            fill={'#6a0dad'}
            data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'><svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' /></svg><div><strong>Yearly Change</strong><br/>${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>Cocaine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}</div></div>` : ''}<div style='display: flex; align-items: center;'><svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' /></svg><div><strong>Quarterly Change</strong><br/>${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>Cocaine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}</div></div></div>`}
            style={{ cursor: 'pointer' }}
          />
        </g>
      );
    });
  };

    function getGroupedPosSeries(millenialData) {
    const periodKey = 'Quarterly';
    const arr = millenialData?.National?.Cocaine?.Positivity?.[periodKey] || [];
    const drugs = ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids'];
    return drugs.map(name => ({
      label: name,
      data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
        quarter: d.period || d.smon_yr, // Use 'period' for x-axis
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
        ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
        periodChange: d.Period || d.periodChange || '',
      }))
    })).filter(line => line.data.length > 0);
}

function getGroupedPosSeriesSouth(millenialData) {
    const periodKey = 'Quarterly';
    const arr = millenialData?.South?.Cocaine?.Positivity?.[periodKey] || [];
    const drugs = ['Cocaine'];
    return drugs.map(name => ({
      label: name,
      data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
        quarter: d.period || d.smon_yr, // Use 'period' for x-axis
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
        ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
        periodChange: d.Period || d.periodChange || '',
      }))
    })).filter(line => line.data.length > 0);
}
  useEffect(() => { ReactTooltip.rebuild(); }, [showPercentChange]);

   useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

            const sData = getGroupedPosSeriesSouth(data);
            setCocaineSouthQuarterly(sData[0].data);
            const jData = getGroupedPosSeries(data);
            setAmphetamineNationalQuarterly(jData[1].data);
            setMethamphetamineNationalQuarterly(jData[2].data);
          });
      }, []);
     
      
  const xDomain = cocaineSouthQuarterly.map(d => d.quarter);
  const yDomain = [0, Math.max(...cocaineSouthQuarterly.map(d => d.percentage)) + 1];
  const xScale = scaleBand({ domain: xDomain, range: [0, adjustedWidth], padding: 0.2 });
  const yScale = scaleLinear({ domain: yDomain, range: [adjustedHeight, 0], nice: true });
  const getPrevValue = (i, offset = 1) => (i - offset >= 0 ? cocaineSouthQuarterly[i - offset].percentage : null);

  const keyFinding = getKeyFinding(cocaineSouthQuarterly);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#fff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#fff' }}>
            How often do people with a substance use disorder test positive for cocaine on urine drug tests: South Census Region Q1 2023 - Q4 2024. Millennium Health, South Census Region Q1 2023 - Q4 2024
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
          <text x={-adjustedHeight / 2} y={-margin.left + 15} transform={`rotate(-90)`} textAnchor="middle" fontSize={15} fill="#222" fontFamily="'Segoe UI', 'Arial', 'sans-serif'" fontWeight="600" style={{ letterSpacing: '0.01em' }}>
            % Cocaine Positive
          </text>
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'end', dx: -6, dy: 3, fill: '#222' })} />
          <AxisBottom top={adjustedHeight} scale={xScale} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'middle', dy: 10 })} />
          <LinePath
            data={cocaineSouthQuarterly}
            x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percentage)}
            stroke="#6a0dad"
            strokeWidth={2}
          />
          {renderDrugLine(amphetamineNationalQuarterly, "#e07a5f", xScale, yScale)}
          {renderDrugLine(methamphetamineNationalQuarterly, "#3d405b", xScale, yScale)}
          {renderDrugPoints(amphetamineNationalQuarterly, "#e07a5f", xScale, yScale, showLabels)}
          {renderDrugPoints(methamphetamineNationalQuarterly, "#3d405b", xScale, yScale, showLabels)}
          {cocaineSouthQuarterly.map((d, i) => {
            const n = cocaineSouthQuarterly.length;
            let showLabel = false;
            showLabel = showLabels || (i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2));
            return (
              <React.Fragment key={i}>
                <Circle cx={xScale(d.quarter) + xScale.bandwidth() / 2} cy={yScale(d.percentage)} r={4} // Standardized radius to 4 for consistency
                  fill="#6a0dad" data-tip={`<div style='text-align: left;'><strong>${d.quarter}</strong><br/>Cocaine positivity: ${d.percentage}%<br/>Confidence interval: ${d.ciLower}% - ${d.ciUpper}%</div>`} />
                {showLabel && (
                  <text x={xScale(d.quarter) + xScale.bandwidth() / 2} y={yScale(d.percentage) - 14} fontSize={12} textAnchor="middle" fill="#333">{d.percentage}%</text>
                )}
              </React.Fragment>
            );
          })}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#6a0dad', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Cocaine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#e07a5f', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Amphetamine</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
          <div style={{ width: '30px', height: '2px', backgroundColor: '#3d405b', marginRight: '5px' }}></div>
          <span style={{ fontSize: '16px', color: '#333' }}>Methamphetamine</span>
        </div>
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip id="percentChangeTooltip" html={true} />
    </div>
  );
}

export { CocaineNationalQuarterlyChart, CocaineWestQuarterlyChart, CocaineMidwestQuarterlyChart, CocaineSouthQuarterlyChart };
