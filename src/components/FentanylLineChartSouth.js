import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

// Helper to normalize keys for both Quarterly and HalfYearly
function getSouthFentanylData(millenialData, metric, period) {
  let data = [];
  if (
    millenialData?.South?.Fentanyl?.[metric]?.[period] &&
    Array.isArray(millenialData.South.Fentanyl[metric][period])
  ) {
    data = millenialData.South.Fentanyl[metric][period].map(d => ({
      quarter: d.qrt_year || d.smon_yr || d.quarter || d.period,
      percentage: parseFloat(d.rcent_pos || d.percent_pos || d.percentage),
      ciLower: parseFloat(d['CI lower'] || d['CI_lower'] || d.ciLower),
      ciUpper: parseFloat(d['CI upper'] || d['CI_upper'] || d.ciUpper),
      period: d.Period || d.period,
      annual: d.Annual || d['Yr_change'] || d.yr_change || '',
    })).filter(d => !isNaN(d.percentage));
  }
  return data;
}

// Helper to group by drug_name for multi-line chart (Positivity or CoPositive)
function getGroupedSeries(millenialData, periodType, metric) {
  const periodKey = periodType === 'Quarterly' ? 'Quarterly' : 'HalfYearly';
  let arr;
  if (metric === 'CoPositive') {
    // Use South.Fentanyl.CoPositive for this dashboard
    arr = millenialData?.South?.Fentanyl?.CoPositive?.[periodKey] || [];
  } else {
    arr = millenialData?.South?.Fentanyl?.[metric]?.[periodKey] || [];
  }
  // Group by drug_name
  const groups = {};
  arr.forEach(d => {
    const name = d.drug_name;
    if (!groups[name]) groups[name] = [];
    groups[name].push({
      quarter: d.qrt_year || d.smon_yr || d.quarter || d.period,
      percentage: parseFloat(d.percentage),
      ciLower: parseFloat(d['CI lower'] || d['CI_lower'] || d.ciLower),
      ciUpper: parseFloat(d['CI upper'] || d['CI_upper'] || d.ciUpper),
      period: d.Period || d.period,
      annual: d.Annual || d['Yr_change'] || d.yr_change || '',
    });
  });
  // Assign colors and legend names
  const colorMap = {
    'Fentanyl': '#0073e6',
    'Fentanyl with Stimulants': '#e4572e',
    'Fentanyl without stimulants': '#2e86ab',
    'Heroin': '#8e44ad',
    'Cocaine': '#d35400',
    'Methamphetamine': '#2980b9',
    'Fentanyl and Stimulants': '#6a0dad',
  };
  const legendMap = {
    'Fentanyl': 'Fentanyl (All)',
    'Fentanyl with Stimulants': 'Fentanyl with Stimulants',
    'Fentanyl without stimulants': 'Fentanyl without Stimulants',
    'Heroin': 'Heroin',
    'Cocaine': 'Cocaine',
    'Methamphetamine': 'Methamphetamine',
    'Fentanyl and Stimulants': 'Fentanyl and Stimulants',
  };
  return Object.entries(groups).map(([name, data]) => ({
    name: legendMap[name] || name,
    color: colorMap[name] || '#888',
    data: data.filter(d => !isNaN(d.percentage)),
  }));
}

const FentanylLineChartSouth = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState([]); 
  const [millenialData, setMillenialData] = useState(null);
  const [periodType, setPeriodType] = useState('Quarterly'); // 'Quarterly' or 'HalfYearly'
  const [seriesList, setSeriesList] = useState([]);
  const [allQuarters, setAllQuarters] = useState([]);
  const [coPosSeries, setCoPosSeries] = useState([]);
  const [coPosQuarters, setCoPosQuarters] = useState([]);
  const [selectedCoPosLines, setSelectedCoPosLines] = useState([]);
  const [showCoPosLabels, setShowCoPosLabels] = useState(false);
  const [showCoPosPercentChange, setShowCoPosPercentChange] = useState(false);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {
        setMillenialData(data);
        const grouped = getGroupedSeries(data, periodType, 'Positivity');
        setSeriesList(grouped);
        setAllQuarters(grouped[0] ? grouped[0].data.map(d => d.quarter) : []);
        setSelectedLines(grouped.map(g => g.name));
        // For second chart (CoPositive)
        const coGrouped = getGroupedSeries(data, periodType, 'CoPositive');
        setCoPosSeries(coGrouped);
        setCoPosQuarters(coGrouped[0] ? coGrouped[0].data.map(d => d.quarter) : []);
      });
  }, [periodType]);

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

  // For the second chart, use coPosSeries and coPosQuarters
  // Find the yMax for the second chart
  const coPosYMax = Math.max(
    ...coPosSeries.flatMap(s => s.data.map(d => d.percentage))
  );
  const coPosYScale = scaleLinear({
    domain: [0, coPosYMax],
    range: [adjustedHeight, 0],
    nice: true,
  });
  const coPosXScale = scaleBand({
    domain: coPosQuarters,
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
    if (!seriesList[0]?.data || seriesList[0].data.length < 2) return null;
    const lastIdx = seriesList[0].data.length - 1;
    const prevIdx = seriesList[0].data.length - 2;
    const last = seriesList[0].data[lastIdx];
    const prev = seriesList[0].data[prevIdx];
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
      {/* --- Second Chart Heading and Key Finding (match West style) --- */}
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0', marginTop: 48, marginBottom: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for heroin, cocaine, methamphetamine, or fentanyl on urine drug tests: Southern Census Region Q4 2022 – Q4 2024. Millennium Health, Southern Census Region Q4 2022 – Q4 2024
          </h3>
        </div>
      </div>
      {(() => {
        // Find Fentanyl and Stimulants series for key finding
        const fentStims = coPosSeries.find(s => s.name.toLowerCase().includes('fentanyl') && s.name.toLowerCase().includes('stimulant'));
        if (fentStims && fentStims.data.length >= 2) {
          const last = fentStims.data[fentStims.data.length - 1];
          const prev = fentStims.data[fentStims.data.length - 2];
          const absChange = (last.percentage - prev.percentage).toFixed(1);
          const direction = absChange > 0 ? 'increased' : 'decreased';
          return (
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
              <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}.
            </div>
          );
        }
        return (
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
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </div>
        );
      })()}
      <div style={{ height: '32px' }} />
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
          <AxisLeft scale={coPosYScale} tickFormat={value => `${value}%`} 
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
            scale={coPosXScale}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />
          {coPosSeries.map((series, sIdx) => (
            <React.Fragment key={series.name}>
              <LinePath
                data={series.data}
                x={d => coPosXScale(d.quarter) + coPosXScale.bandwidth() / 2}
                y={d => coPosYScale(d.percentage)}
                stroke={series.color}
                strokeWidth={2}
                curve={null}
              />
              {series.data.map((d, i) => {
                const n = series.data.length;
                const showLabel = showCoPosLabels || (
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
                      cx={coPosXScale(d.quarter) + coPosXScale.bandwidth() / 2}
                      cy={coPosYScale(d.percentage)}
                      r={4}
                      fill={series.color}
                      data-tip={`<div style='text-align: left;'>
                        <strong>${series.name}</strong><br/>
                        <strong>${d.quarter}</strong><br/>
                        Positivity: ${d.percentage}%<br/>
                        Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                      </div>`}
                    />
                    {showLabel && (
                      <text
                        x={coPosXScale(d.quarter) + coPosXScale.bandwidth() / 2 + labelXOffset}
                        y={coPosYScale(d.percentage) + labelYOffset}
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
          ))}
        </Group>
      </svg>
      {/* --- Second Chart Drug Selection and Toggles (match West style) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px 0 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-south-copos"
                checked={selectedCoPosLines && selectedCoPosLines.length === coPosSeries.length && coPosSeries.every(ds => selectedCoPosLines.includes(ds.name))}
                onChange={() => {
                  if (selectedCoPosLines.length === coPosSeries.length && coPosSeries.every(ds => selectedCoPosLines.includes(ds.name))) {
                    setSelectedCoPosLines([]);
                  } else {
                    setSelectedCoPosLines(coPosSeries.map(ds => ds.name));
                  }
                }}
                style={{ accentColor: selectedCoPosLines.length === coPosSeries.length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-south-copos"
                checked={selectedCoPosLines.length === 0}
                onChange={() => setSelectedCoPosLines([])}
                style={{ accentColor: selectedCoPosLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '10px' }}>
          {coPosSeries.map(ds => (
            <label key={ds.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedCoPosLines.includes(ds.name)}
                onChange={() => {
                  if (selectedCoPosLines.includes(ds.name)) {
                    setSelectedCoPosLines(selectedCoPosLines.filter(line => line !== ds.name));
                  } else {
                    setSelectedCoPosLines([...selectedCoPosLines, ds.name]);
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
                {selectedCoPosLines.includes(ds.name) && (
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
              <span style={{ fontSize: '14px', color: '#222' }}>{ds.name}</span>
            </label>
          ))}
        </div>
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
                <div style="margin-top: 8px; text-align: left;">
                  When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
                </div>
              </div>
            `;
            return (
              <>
                <label
                  className="toggle-switch"
                  data-tip={percentChgTooltip}
                  data-for="percentChangeTooltipCoPos"
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={showCoPosPercentChange}
                    onChange={() => setShowCoPosPercentChange(!showCoPosPercentChange)}
                  />
                  <span className="slider percent-toggle" style={{ backgroundColor: showCoPosPercentChange ? '#002b36' : '#ccc' }}></span>
                </label>
                <span
                  className="toggle-label"
                  style={{ color: showCoPosPercentChange ? '#fff' : '#333', cursor: 'pointer' }}
                  data-tip={percentChgTooltip}
                  data-for="percentChangeTooltipCoPos"
                >
                  % Chg {showCoPosPercentChange ? 'On' : 'Off'}
                </span>
                <ReactTooltip
                  id="percentChangeTooltipCoPos"
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
              checked={!showCoPosLabels}
              onChange={() => setShowCoPosLabels(!showCoPosLabels)}
            />
            <span className="slider label-toggle" style={{ backgroundColor: showCoPosLabels ? '#002b36' : '#ccc' }}></span>
          </label>
          <span className="toggle-label" style={{ color: showCoPosLabels ? '#fff' : '#333' }}>Labels {showCoPosLabels ? 'On' : 'Off'}</span>
        </div>
      </div>
    </div>
  );
};

export default FentanylLineChartSouth;
