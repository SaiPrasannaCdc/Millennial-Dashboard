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
  West: {
    "Fentanyl": [
      { period: '2022 Jul-Dec', percentage: 21.7, ciLower: 21.2, ciUpper: 22.3 },
      { period: '2023 Jan-Jun', percentage: 19.0, ciLower: 18.7, ciUpper: 19.3 },
      { period: '2023 Jul-Dec', percentage: 19.4, ciLower: 19.0, ciUpper: 19.7 },
      { period: '2024 Jan-Jun', percentage: 20.0, ciLower: 19.6, ciUpper: 20.3 },
      { period: '2024 Jul-Dec', percentage: 19.6, ciLower: 19.3, ciUpper: 19.9 },
    ],
    "Fentanyl with Stimulants": [
      { period: '2022 Jul-Dec', percentage: 19.5, ciLower: 19.1, ciUpper: 20.0 },
      { period: '2023 Jan-Jun', percentage: 20.4, ciLower: 19.9, ciUpper: 20.8 },
      { period: '2023 Jul-Dec', percentage: 20.0, ciLower: 19.6, ciUpper: 20.5 },
      { period: '2024 Jan-Jun', percentage: 19.1, ciLower: 18.6, ciUpper: 19.5 },
      { period: '2024 Jul-Dec', percentage: 15.2, ciLower: 14.7, ciUpper: 15.7 },
    ],
    "Fentanyl without stimulants": [
      { period: '2022 Jul-Dec', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
      { period: '2023 Jan-Jun', percentage: 5.0, ciLower: 4.8, ciUpper: 5.2 },
      { period: '2023 Jul-Dec', percentage: 4.5, ciLower: 4.3, ciUpper: 4.7 },
      { period: '2024 Jan-Jun', percentage: 4.2, ciLower: 4.1, ciUpper: 4.4 },
      { period: '2024 Jul-Dec', percentage: 2.9, ciLower: 2.8, ciUpper: 3.0 },
    ]
  },
  Midwest: {
    "Fentanyl": [
      { period: '2022 Jul-Dec', percentage: 10.9, ciLower: 10.5, ciUpper: 11.4 },
      { period: '2023 Jan-Jun', percentage: 11.0, ciLower: 10.7, ciUpper: 11.3 },
      { period: '2023 Jul-Dec', percentage: 13.0, ciLower: 12.7, ciUpper: 13.3 },
      { period: '2024 Jan-Jun', percentage: 10.6, ciLower: 10.3, ciUpper: 10.9 },
      { period: '2024 Jul-Dec', percentage: 9.3, ciLower: 9.0, ciUpper: 9.5 },
    ],
    "Fentanyl with Stimulants": [
      { period: '2022 Jul-Dec', percentage: 10.9, ciLower: 10.5, ciUpper: 11.3 },
      { period: '2023 Jan-Jun', percentage: 10.2, ciLower: 9.9, ciUpper: 10.6 },
      { period: '2023 Jul-Dec', percentage: 9.5, ciLower: 9.2, ciUpper: 9.9 },
      { period: '2024 Jan-Jun', percentage: 9.0, ciLower: 8.7, ciUpper: 9.4 },
      { period: '2024 Jul-Dec', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
    ],
    "Fentanyl without stimulants": [
      { period: '2022 Jul-Dec', percentage: 4.4, ciLower: 4.1, ciUpper: 4.7 },
      { period: '2023 Jan-Jun', percentage: 4.1, ciLower: 3.9, ciUpper: 4.3 },
      { period: '2023 Jul-Dec', percentage: 4.8, ciLower: 4.6, ciUpper: 5.0 },
      { period: '2024 Jan-Jun', percentage: 3.5, ciLower: 3.4, ciUpper: 3.7 },
      { period: '2024 Jul-Dec', percentage: 2.8, ciLower: 2.6, ciUpper: 2.9 },
    ]
  },
  Northeast: {
    "Fentanyl": [
      { period: '2022 Jul-Dec', percentage: 4.6, ciLower: 4, ciUpper: 4.7 },
      { period: '2023 Jan-Jun', percentage: 3.9, ciLower: 3.9, ciUpper: 4.6 },
      { period: '2023 Jul-Dec', percentage: 3.3, ciLower: 3.6, ciUpper: 4.8 },
      { period: '2024 Jan-Jun', percentage: 3.4, ciLower: 3.3, ciUpper: 4.4 },
    ],
    "Fentanyl with Stimulants": [
      { period: '2022 Jul-Dec', percentage: 4.6, ciLower: 4.2, ciUpper: 5.0 },
      { period: '2023 Jan-Jun', percentage: 4.1, ciLower: 3.7, ciUpper: 4.5 },
      { period: '2023 Jul-Dec', percentage: 3.8, ciLower: 3.4, ciUpper: 4.2 },
      { period: '2024 Jan-Jun', percentage: 3.2, ciLower: 2.9, ciUpper: 3.6 },
    ],
    "Fentanyl without stimulants": [
      { period: '2022 Jul-Dec', percentage: 2.9, ciLower: 2.6, ciUpper: 3.2 },
      { period: '2023 Jan-Jun', percentage: 2.5, ciLower: 2.3, ciUpper: 2.8 },
      { period: '2023 Jul-Dec', percentage: 2.4, ciLower: 2.2, ciUpper: 2.6 },
      { period: '2024 Jan-Jun', percentage: 2.1, ciLower: 1.9, ciUpper: 2.3 },
    ]
  },
  South: {
    "Fentanyl": [
      { period: '2022 Jul-Dec', percentage: 11.6, ciLower: 11.0, ciUpper: 12.1 },
      { period: '2023 Jan-Jun', percentage: 12.0, ciLower: 11.6, ciUpper: 12.4 },
      { period: '2023 Jul-Dec', percentage: 10.9, ciLower: 10.6, ciUpper: 11.3 },
      { period: '2024 Jan-Jun', percentage: 10.0, ciLower: 9.6, ciUpper: 10.3 },
      { period: '2024 Jul-Dec', percentage: 9.1, ciLower: 8.7, ciUpper: 9.4 },
    ],
    "Fentanyl with Stimulants": [
      { period: '2022 Jul-Dec', percentage: 10.2, ciLower: 9.7, ciUpper: 10.7 },
      { period: '2023 Jan-Jun', percentage: 9.8, ciLower: 9.3, ciUpper: 10.2 },
      { period: '2023 Jul-Dec', percentage: 9.7, ciLower: 9.2, ciUpper: 10.1 },
      { period: '2024 Jan-Jun', percentage: 8.5, ciLower: 8.0, ciUpper: 8.9 },
      { period: '2024 Jul-Dec', percentage: 7.0, ciLower: 6.5, ciUpper: 7.4 },
    ],
    "Fentanyl without stimulants": [
      { period: '2022 Jul-Dec', percentage: 4.6, ciLower: 4.2, ciUpper: 5.2 },
      { period: '2023 Jan-Jun', percentage: 4.9, ciLower: 4.6, ciUpper: 5.2 },
      { period: '2023 Jul-Dec', percentage: 4.3, ciLower: 4.1, ciUpper: 4.6 },
      { period: '2024 Jan-Jun', percentage: 4.1, ciLower: 3.8, ciUpper: 4.4 },
      { period: '2024 Jul-Dec', percentage: 2.9, ciLower: 2.8, ciUpper: 3.1 },
    ]
  },
};

const COLORS = {
  "Fentanyl": "#1f77b4",
  "Fentanyl with Stimulants": "#e15759",
  "Fentanyl without stimulants": "#4daf4a"
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

  // Generalize all logic for multi-drug regions
  const data = fentanylSixMonthsData[regionKey] || [];
  const isMultiDrugRegion = data && !Array.isArray(data);
  const drugKeys = isMultiDrugRegion ? Object.keys(data) : null;
  const xDomain = isMultiDrugRegion
    ? data[drugKeys[0]].map(d => d.period)
    : data.map(d => d.period);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yMax = isMultiDrugRegion
    ? Math.max(...drugKeys.flatMap(drug => data[drug].map(d => d.percentage)))
    : Math.max(...data.map(d => d.percentage));

  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  // Helper for rendering lines and points for multi-drug regions
  const renderMultiDrugLines = () => {
    return drugKeys.map((drug, idx) => (
      <React.Fragment key={drug}>
        <LinePath
          data={data[drug]}
          x={d => xScale(d.period) + xScale.bandwidth() / 2}
          y={d => yScale(d.percentage)}
          stroke={COLORS[drug]}
          strokeWidth={2}
          curve={null}
        />
        {data[drug].map((d, i) => (
          <React.Fragment key={i}>
            <Circle
              cx={xScale(d.period) + xScale.bandwidth() / 2}
              cy={yScale(d.percentage)}
              r={4}
              fill={COLORS[drug]}
              data-tip={`<div style='text-align: left;'>
                <strong>${d.period}</strong><br/>
                ${drug} positivity: ${d.percentage}%<br/>
                Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
              </div>`}
            />
            {showLabels && (
              <text
                x={xScale(d.period) + xScale.bandwidth() / 2}
                y={yScale(d.percentage) - 14 - idx * 14}
                fontSize={12}
                textAnchor="middle"
                fill="#333"
              >
                {d.percentage}%
              </text>
            )}
          </React.Fragment>
        ))}
        {showPercentChange && data[drug].map((d, i) => {
          if (i === 0) return null;
          const prevPeriod = i > 0 ? data[drug][i - 1].percentage : null;
          const prevYear = i >= 2 ? data[drug][i - 2].percentage : null;
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
            <g key={`indicator-${drug}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={6}
                fill={COLORS[drug]}
                data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                  <div style='font-weight:bold; margin-bottom:6px;'>${drug}</div>
                  ${i >= 2 ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${drug} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>6 Months Change</strong><br/>
                      ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${drug} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                    </div>
                  </div>
                </div>`}
              />
            </g>
          );
        })}
      </React.Fragment>
    ));
  };

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    if (isMultiDrugRegion) return null; // <-- Fix: skip for all multi-drug regions
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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, regionKey]);

  if ((regionKey === "West" && !data) || (regionKey !== "West" && data.length === 0)) {
    return (
      <div style={{ textAlign: 'center', color: '#ff0000', marginTop: '20px' }}>
        <p>No data available for the selected region and period.</p>
      </div>
    );
  }

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
          {isMultiDrugRegion ? renderMultiDrugLines() : (
            <>
              <LinePath
                data={data}
                x={d => xScale(d.period) + xScale.bandwidth() / 2}
                y={d => yScale(d.percentage)}
                stroke={COLORS["Fentanyl"]}
                strokeWidth={2}
                curve={null}
              />
              {data.map((d, i) => (
                <React.Fragment key={i}>
                  <Circle
                    cx={xScale(d.period) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={COLORS["Fentanyl"]}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.period}</strong><br/>
                      Fentanyl positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {showLabels && (
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
              ))}
            </>
          )}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {regionKey === "West" ? (
          <div style={{ display: 'flex', gap: '24px' }}>
            {drugKeys.map(drug => (
              <div key={drug} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '30px', height: '2px', backgroundColor: COLORS[drug], marginRight: '5px' }}></div>
                <span style={{ fontSize: '16px', color: '#333' }}>{drug}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: COLORS["Fentanyl"], marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>Fentanyl</span>
          </div>
        )}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip id="main-tooltip" html={true} />
    </div>
  );
};

export default FentanylLineChart6Months;
