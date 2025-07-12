import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const midwestQuarterlyData = [
  { quarter: 'Q4 2022', percentage: 10.9, ciLower: 10.5, ciUpper: 11.4 },
  { quarter: 'Q1 2023', percentage: 10.7, ciLower: 10.2, ciUpper: 11.1 },
  { quarter: 'Q2 2023', percentage: 11.4, ciLower: 11.0, ciUpper: 11.8 },
  { quarter: 'Q3 2023', percentage: 13.3, ciLower: 12.8, ciUpper: 13.7 },
  { quarter: 'Q4 2023', percentage: 12.8, ciLower: 12.3, ciUpper: 13.2 },
  { quarter: 'Q1 2024', percentage: 10.9, ciLower: 10.5, ciUpper: 11.3 },
  { quarter: 'Q2 2024', percentage: 10.2, ciLower: 9.9, ciUpper: 10.6 },
  { quarter: 'Q3 2024', percentage: 9.5, ciLower: 9.2, ciUpper: 9.9 },
  { quarter: 'Q4 2024', percentage: 9.0, ciLower: 8.7, ciUpper: 9.4 },
];

const midwestWithStimulantsQuarterly = [
  { quarter: 'Q4 2022', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
  { quarter: 'Q1 2023', percentage: 6.7, ciLower: 6.4, ciUpper: 7.0 },
  { quarter: 'Q2 2023', percentage: 7.2, ciLower: 6.8, ciUpper: 7.5 },
  { quarter: 'Q3 2023', percentage: 8.4, ciLower: 8.1, ciUpper: 8.8 },
  { quarter: 'Q4 2023', percentage: 8.0, ciLower: 7.6, ciUpper: 8.4 },
  { quarter: 'Q1 2024', percentage: 7.1, ciLower: 6.7, ciUpper: 7.4 },
  { quarter: 'Q2 2024', percentage: 6.3, ciLower: 6.0, ciUpper: 6.6 },
  { quarter: 'Q3 2024', percentage: 6.3, ciLower: 6.0, ciUpper: 6.6 },
  { quarter: 'Q4 2024', percentage: 6.3, ciLower: 6.0, ciUpper: 6.6 },
];

const midwestWithoutStimulantsQuarterly = [
  { quarter: 'Q4 2022', percentage: 4.4, ciLower: 4.1, ciUpper: 4.7 },
  { quarter: 'Q1 2023', percentage: 4.0, ciLower: 3.7, ciUpper: 4.2 },
  { quarter: 'Q2 2023', percentage: 4.2, ciLower: 4.0, ciUpper: 4.5 },
  { quarter: 'Q3 2023', percentage: 4.8, ciLower: 4.5, ciUpper: 5.1 },
  { quarter: 'Q4 2023', percentage: 4.8, ciLower: 4.5, ciUpper: 5.1 },
  { quarter: 'Q1 2024', percentage: 3.2, ciLower: 3.1, ciUpper: 3.4 },
  { quarter: 'Q2 2024', percentage: 2.9, ciLower: 2.7, ciUpper: 3.1 },
  { quarter: 'Q3 2024', percentage: 2.9, ciLower: 2.7, ciUpper: 3.1 },
  { quarter: 'Q4 2024', percentage: 2.7, ciLower: 2.5, ciUpper: 2.9 },
];

const allQuarters = midwestQuarterlyData.map(d => d.quarter);
function alignDataToQuarters(data, quarters) {
  const map = Object.fromEntries(data.map(d => [d.quarter, d]));
  return quarters.map(q => map[q] || { quarter: q, percentage: null, ciLower: null, ciUpper: null });
}

const datasets = [
  { data: alignDataToQuarters(midwestQuarterlyData, allQuarters), color: '#0073e6', label: 'Fentanyl' },
  { data: alignDataToQuarters(midwestWithStimulantsQuarterly, allQuarters), color: '#6a0dad', label: 'Fentanyl with Stimulants' },
  { data: alignDataToQuarters(midwestWithoutStimulantsQuarterly, allQuarters), color: '#e67e22', label: 'Fentanyl without Stimulants' },
];

const FentanylLineChartMidwest = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = allQuarters;
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(
    ...datasets.flatMap(ds => ds.data.map(d => d.percentage || 0))
  );
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  function getPrevValueForDataset(data, i, offset = 1) {
    let idx = i - 1, found = 0;
    while (idx >= 0 && found < offset) {
      if (data[idx] && data[idx].percentage !== null) found++;
      if (found < offset) idx--;
    }
    return (idx >= 0 && data[idx] && data[idx].percentage !== null) ? data[idx].percentage : null;
  }

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return datasets.map((ds, dsIdx) =>
      ds.data.map((d, i) => {
        if (i === 0 || d.percentage === null) return null;
        const prevPeriod = getPrevValueForDataset(ds.data, i, 1);
        const prevYear = getPrevValueForDataset(ds.data, i, 4);
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return ds.color;
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-midwest-${ds.label}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={ds.color}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  const getKeyFinding = () => {
    if (!midwestQuarterlyData || midwestQuarterlyData.length < 2) return null;
    const lastIdx = midwestQuarterlyData.length - 1;
    const prevIdx = midwestQuarterlyData.length - 2;
    const last = midwestQuarterlyData[lastIdx];
    const prev = midwestQuarterlyData[prevIdx];
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl on urine drug tests: Midwest Census Region Q1 2023 - Q4 2024. Millennium Health, Midwest Census Region Q1 2023 - Q4 2024
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
      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <div className="toggle-wrapper" style={{ position: 'relative' }}>
          {(() => {
            const percentChgTooltip = `
              <div style="
                text-align: left;
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
          {datasets.map((ds, idx) => (
            <LinePath
              key={ds.label}
              data={ds.data}
              x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
              y={d => d.percentage !== null ? yScale(d.percentage) : null}
              stroke={ds.color}
              strokeWidth={2}
              curve={null}
            />
          ))}
          {datasets.map((ds, dsIdx) =>
            ds.data.map((d, i) => {
              if (d.percentage === null) return null;
              const n = ds.data.length;
              const showLabel = showLabels || (
                i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
              );
              let labelYOffset = -14;
              if (dsIdx === 1) labelYOffset = -13;  // purple
              if (dsIdx === 2) labelYOffset = -13;  // orange
              return (
                <React.Fragment key={`${ds.label}-pt-${i}`}>
                  <Circle
                    cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={ds.color}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.quarter}</strong><br/>
                      ${ds.label} positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {showLabel && (
                    <text
                      x={xScale(d.quarter) + xScale.bandwidth() / 2}
                      y={yScale(d.percentage) + labelYOffset}
                      fontSize={13}
                      textAnchor="middle"
                      fill={ds.color}
                      fontWeight={dsIdx === 0 ? 700 : 500}
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.percentage}%
                    </text>
                  )}
                </React.Fragment>
              );
            })
          )}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {datasets.map((ds, idx) => (
          <div key={ds.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < datasets.length - 1 ? '15px' : 0 }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: ds.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{ds.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};


const heroinMidwestData = [
  { quarter: 'Q4 2022', percentage: 14.7, ciLower: 13.7, ciUpper: 15.7 },
  { quarter: 'Q1 2023', percentage: 14, ciLower: 13.1, ciUpper: 15.1 },
  { quarter: 'Q2 2023', percentage: 13.4, ciLower: 12.3, ciUpper: 14.5 },
  { quarter: 'Q3 2023', percentage: 12.3, ciLower: 11.3, ciUpper: 13.2 },
  { quarter: 'Q4 2023', percentage: 11, ciLower: 9.8, ciUpper: 12.1 },
  { quarter: 'Q1 2024', percentage: 10.9, ciLower: 9.8, ciUpper: 11.9 },
  { quarter: 'Q2 2024', percentage: 10.8, ciLower: 9.8, ciUpper: 11.8 },
  { quarter: 'Q3 2024', percentage: 24.1, ciLower: 22.5, ciUpper: 25.8 },
  { quarter: 'Q4 2024', percentage: 30.5, ciLower: 28.1, ciUpper: 32.8 },
];

const cocaineMidwestData = [
  { quarter: 'Q4 2022', percentage: 10.2, ciLower: 9.3, ciUpper: 11.1 },
  { quarter: 'Q1 2023', percentage: 10.3, ciLower: 9.4, ciUpper: 11.2 },
  { quarter: 'Q2 2023', percentage: 11.2, ciLower: 10.2, ciUpper: 12.1 },
  { quarter: 'Q3 2023', percentage: 12.1, ciLower: 11.1, ciUpper: 13.1 },
  { quarter: 'Q4 2023', percentage: 13.5, ciLower: 12.3, ciUpper: 14.7 },
  { quarter: 'Q1 2024', percentage: 14.8, ciLower: 13.6, ciUpper: 16.0 },
  { quarter: 'Q2 2024', percentage: 15.8, ciLower: 14.6, ciUpper: 17.0 },
  { quarter: 'Q3 2024', percentage: 19, ciLower: 17.7, ciUpper: 20.3 },
  { quarter: 'Q4 2024', percentage: 19.5, ciLower: 18.5, ciUpper: 20.6 },
];

const methMidwestData = [
  { quarter: 'Q4 2022', percentage: 66.8, ciLower: 65.0, ciUpper: 68.7 },
  { quarter: 'Q1 2023', percentage: 67.2, ciLower: 65.3, ciUpper: 69.1 },
  { quarter: 'Q2 2023', percentage: 73.4, ciLower: 71.3, ciUpper: 75.5 },
  { quarter: 'Q3 2023', percentage: 77.2, ciLower: 75.1, ciUpper: 79.3 },
  { quarter: 'Q4 2023', percentage: 80.4, ciLower: 78.3, ciUpper: 82.5 },
  { quarter: 'Q1 2024', percentage: 85, ciLower: 83.1, ciUpper: 86.9 },
  { quarter: 'Q2 2024', percentage: 85.8, ciLower: 83.9, ciUpper: 87.8 },
  { quarter: 'Q3 2024', percentage: 85.9, ciLower: 83.9, ciUpper: 87.8 },
  { quarter: 'Q4 2024', percentage: 85.8, ciLower: 83.9, ciUpper: 87.8 },
];

const fentanylAndStimulantsMidwestData = [
  { quarter: 'Q4 2022', percentage: 59.5, ciLower: 57.4, ciUpper: 61.6 },
  { quarter: 'Q1 2023', percentage: 63, ciLower: 61, ciUpper: 65 },
  { quarter: 'Q2 2023', percentage: 62.9, ciLower: 61, ciUpper: 64.8 },
  { quarter: 'Q3 2023', percentage: 63.6, ciLower: 61.9, ciUpper: 65.3 },
  { quarter: 'Q4 2023', percentage: 62.4, ciLower: 60.6, ciUpper: 64.2 },
  { quarter: 'Q1 2024', percentage: 64.5, ciLower: 62.6, ciUpper: 66.4 },
  { quarter: 'Q2 2024', percentage: 68.9, ciLower: 67, ciUpper: 70.7 },
  { quarter: 'Q3 2024', percentage: 70, ciLower: 68.1, ciUpper: 71.9 },
  { quarter: 'Q4 2024', percentage: 70.2, ciLower: 68.2, ciUpper: 72.1 },
];

const allDrugQuarters = heroinMidwestData.map(d => d.quarter);

function alignDrugDataToQuarters(data, quarters) {
  const map = Object.fromEntries(data.map(d => [d.quarter, d]));
  return quarters.map(q => map[q] || { quarter: q, percentage: null, ciLower: null, ciUpper: null });
}

const midwestThreeDrugsDatasets = [
  { data: alignDrugDataToQuarters(methMidwestData, allDrugQuarters), color: '#3e92cc', label: 'Methamphetamine' },
  { data: alignDrugDataToQuarters(cocaineMidwestData, allDrugQuarters), color: '#fbb13c', label: 'Cocaine' },
  { data: alignDrugDataToQuarters(heroinMidwestData, allDrugQuarters), color: '#d7263d', label: 'Heroin' },
  { data: alignDrugDataToQuarters(fentanylAndStimulantsMidwestData, allDrugQuarters), color: '#1b9e77', label: 'Fentanyl and Stimulants' },
];

function getKeyFindingForThreeDrugs() {
  const drug = { data: methMidwestData, label: 'Methamphetamine' };
  if (!drug.data || drug.data.length < 2) return null;
  const lastIdx = drug.data.length - 1;
  const prevIdx = drug.data.length - 2;
  const last = drug.data[lastIdx];
  const prev = drug.data[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return (
    <div>
      <span style={{ fontWeight: 700 }}>Key findings:</span>
      <div style={{ marginTop: 4 }}>
        <span style={{ fontWeight: 700 }}>{drug.label} positivity</span> {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}.
      </div>
    </div>
  );
}

function MidwestThreeDrugsLineChart({ width = 1100, height = 600 }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  // Add radio/checkbox state for this chart only
  const [selectedLines, setSelectedLines] = useState(midwestThreeDrugsDatasets.map(ds => ds.label));

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = allDrugQuarters;
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(
    ...midwestThreeDrugsDatasets.flatMap(ds => ds.data.map(d => d.percentage || 0))
  );
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  function getPrevValueForDataset(data, i, offset = 1) {
    let idx = i - 1, found = 0;
    while (idx >= 0 && found < offset) {
      if (data[idx] && data[idx].percentage !== null) found++;
      if (found < offset) idx--;
    }
    return (idx >= 0 && data[idx] && data[idx].percentage !== null) ? data[idx].percentage : null;
  }

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return midwestThreeDrugsDatasets.map((ds, dsIdx) =>
      ds.data.map((d, i) => {
        if (i === 0 || d.percentage === null) return null;
        const prevPeriod = getPrevValueForDataset(ds.data, i, 1);
        const prevYear = getPrevValueForDataset(ds.data, i, 4);
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return ds.color;
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-midwest3-${ds.label}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={ds.color}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for methamphetamine, cocaine, or heroin on urine drug tests: Midwest Census Region Q1 2023 - Q4 2024
          </h3>
        </div>
      </div>
      {getKeyFindingForThreeDrugs() && (
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
          {getKeyFindingForThreeDrugs()}
        </div>
      )}
      {/* Only one set of selection controls below Key Finding */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px 0 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-midwest3"
                checked={selectedLines.length === midwestThreeDrugsDatasets.length && midwestThreeDrugsDatasets.every(ds => selectedLines.includes(ds.label))}
                onChange={() => {
                  if (selectedLines.length === midwestThreeDrugsDatasets.length && midwestThreeDrugsDatasets.every(ds => selectedLines.includes(ds.label))) {
                    setSelectedLines([]); 
                  } else {
                    setSelectedLines(midwestThreeDrugsDatasets.map(ds => ds.label)); 
                  }
                }}
                style={{ accentColor: selectedLines.length === midwestThreeDrugsDatasets.length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-midwest3"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])} 
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '10px' }}>
          {midwestThreeDrugsDatasets.map(ds => (
            <label key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLines.includes(ds.label)}
                onChange={() => {
                  if (selectedLines.includes(ds.label)) {
                    setSelectedLines(selectedLines.filter(line => line !== ds.label));
                  } else {
                    setSelectedLines([...selectedLines, ds.label]);
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
                {selectedLines.includes(ds.label) && (
                  <span
                    style={{
                      display: 'block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: ds.color,
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '14px', color: '#222' }}>{ds.label}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <div className="toggle-wrapper" style={{ position: 'relative' }}>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showPercentChange}
              onChange={() => setShowPercentChange(!showPercentChange)}
            />
            <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
          </label>
          <span className="toggle-label" style={{ color: showPercentChange ? '#fff' : '#333' }}>
            % Chg {showPercentChange ? 'On' : 'Off'}
          </span>
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
          {midwestThreeDrugsDatasets.map((ds, idx) => (
            selectedLines.includes(ds.label) && (
              <LinePath
                key={ds.label}
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={ds.color}
                strokeWidth={2}
                curve={null}
              />
            )
          ))}
          {midwestThreeDrugsDatasets.map((ds, dsIdx) =>
            ds.data.map((d, i) => {
              if (d.percentage === null || !selectedLines.includes(ds.label)) return null;
              const n = ds.data.length;
              const showLabel = showLabels || (
                i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
              );
              let labelYOffset = -14;
              if (ds.label === 'Cocaine') labelYOffset = -9;
              if (ds.label === 'Heroin') labelYOffset = -9;
              return (
                <React.Fragment key={`${ds.label}-pt-${i}`}>
                  <Circle
                    cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={ds.color}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.quarter}</strong><br/>
                      ${ds.label} positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {showLabel && (
                    <text
                      x={xScale(d.quarter) + xScale.bandwidth() / 2}
                      y={yScale(d.percentage) + labelYOffset}
                      fontSize={13}
                      textAnchor="middle"
                      fill={ds.color}
                      fontWeight={dsIdx === 0 ? 700 : 500}
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.percentage}%
                    </text>
                  )}
                </React.Fragment>
              );
            })
          )}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {midwestThreeDrugsDatasets.filter(ds => selectedLines.includes(ds.label)).map((ds, idx) => (
          <div key={ds.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < midwestThreeDrugsDatasets.length - 1 ? '15px' : 0 }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: ds.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{ds.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
}


function FentanylLineChartMidwestCombined(props) {
  return (
    <div>
      <FentanylLineChartMidwest {...props} />
      <MidwestThreeDrugsLineChart width={1100} height={600} />
    </div>
  );
}

export default FentanylLineChartMidwestCombined;
export { MidwestThreeDrugsLineChart };
