import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import MethamphetamineLineChartsecondLineChart from './MethamphetamineLineChartsecondlinechart';

const sampleData2 = [

  
];

const sampleData2_6Months = [
  
 
];

// Helper to group by drug_name for multi-line chart (Positivity)
function getGroupedMethSeries(millenialData, periodType) {
  const periodKey = periodType === 'Quarterly' ? 'Quarterly' : 'HalfYearly';
  const arr = millenialData?.South?.Methamphetamine?.Positivity?.[periodKey] || [];
  const drugs = ['Methamphetamine', 'Methamphetamine with Opioids', 'Methamphetamine without Opioids'];
  return drugs.map(name => ({
    name,
    values: arr.filter(d => d.drug_name === name).map(d => ({
      quarter: periodKey === 'Quarterly' ? d.quarter || d.period : undefined,
      period: periodKey === 'HalfYearly' ? d.smon_yr : undefined, // <-- FIXED: use smon_yr for HalfYearly
      percentage: parseFloat(d.percentage),
      ciLower: parseFloat(d.ciLower),
      ciUpper: parseFloat(d.ciUpper),
      yr_change: d.yr_change || d['Yr_change'] || d['Yr change'] || '',
    }))
  })).filter(line => line.values.length > 0);
}

const MethamphetamineLineChart = ({ width = 1100, height = 450, period = 'Quarterly' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [millenialData, setMillenialData] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [loading, setLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    setLoading(true); // <-- Set loading true on period change
    fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {
        setMillenialData(data);
        const grouped = getGroupedMethSeries(data, period === 'Quarterly' ? 'Quarterly' : 'HalfYearly');
        setSeriesList(grouped);
        setLoading(false); // <-- Set loading false after data is set
      });
  }, [period]);

  // Select data based on period
  const adjustedData = seriesList.length > 0 ? seriesList : (period === 'Quarterly' ? sampleData2 : sampleData2_6Months);
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const formatHalfYearLabel = (periodStr) => {
    if (!periodStr || typeof periodStr !== 'string') return '';
    let year, half;
    let match = periodStr.match(/H([12])\s*([0-9]{4})/);
    if (match) {
      half = match[1];
      year = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})\s*H([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})[- ]([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    return periodStr;
  };

  const hasData = adjustedData.length > 0 && adjustedData[0].values && adjustedData[0].values.length > 0;

  const xDomain = hasData
    ? (period === 'Quarterly'
        ? adjustedData[0].values.map(d => d.quarter)
        : adjustedData[0].values.map(d => formatHalfYearLabel(d.period))) // d.period is now d.smon_yr for HalfYearly
    : [];

  const xAccessor = period === 'Quarterly'
    ? d => d.quarter
    : d => formatHalfYearLabel(d.period); // d.period is now d.smon_yr for HalfYearly

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

    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;

        const prevPeriod = getPrevPeriodValue(lineData, i, 1);
        const yearlyOffset = period === 'Quarterly' ? 4 : 2;
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
          if (change === null) return '#6a0dad';
          return change > 0 ? '#6a0dad' : '#0073e6';
        };

        return (
          <g key={`indicator-${index}-${i}`}> 
            <Circle
              cx={xPosition}
              cy={yPosition}
              r={4}
              fill={index === 0 ? '#0073e6' : '#ff6600'}
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
                    Methamphetamine positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>${period === 'Quarterly' ? 'Quarterly' : '6 Months'} Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Methamphetamine positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
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

  console.log('MethamphetamineLineChart period prop:', period); 

  const getKeyFinding = (data) => {
    if (!data || data.length === 0) return null;
    const line = data[0];
    if (!line || !line.values || line.values.length < 2) return null;
    const lastIdx = line.values.length - 1;
    const prevIdx = line.values.length - 2;
    const last = line.values[lastIdx];
    const prev = line.values[prevIdx];
    if (!last || !prev) return null;
    const lastVal = parseFloat(last.percentage);
    const prevVal = parseFloat(prev.percentage);
    const absChange = (lastVal - prevVal).toFixed(1);
    const direction = absChange > 0 ? 'increased' : 'decreased';
    return {
      direction,
      absChange: Math.abs(absChange),
      prev: prevVal,
      prevLabel: period === 'Quarterly' ? prev.quarter : prev.period,
      last: lastVal,
      lastLabel: period === 'Quarterly' ? last.quarter : last.period,
    };
  };

  const keyFinding = getKeyFinding(adjustedData);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading...</div>;
  }

  if (!hasData) {
    return <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No data available for this chart.</div>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for methamphetamine on urine drug tests: United States Q4 2022 - Q4 2024. Millennium Health, United States Q4 2022 - Q4 2024
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

          {adjustedData.map((lineData, index) => (
            <React.Fragment key={index}>
              <LinePath
                data={lineData.values}
                x={d => xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                y={d => yScale(parseFloat(d.percentage))}
                stroke={
                  index === 0
                    ? '#0073e6'
                    : index === 1
                    ? '#ff6600'
                    : '#2457a7'
                }
                strokeWidth={2}
                curve={null}
              />
              {lineData.values.map((d, i) => {
                const percentage = parseFloat(d.percentage);
                let lowerCI = d.ciLower !== undefined ? d.ciLower : (percentage - 0.5).toFixed(1);
                let upperCI = d.ciUpper !== undefined ? d.ciUpper : (percentage + 0.5).toFixed(1);
                const n = lineData.values.length;
                let showLabel = false;
                if (period === 'Quarterly') {
                  showLabel = showLabels || (
                    i === 0 || // first
                    i === n - 1 || // last
                    i === n - 2 || // quarter before last
                    i === Math.floor((n - 1) / 2) // middle
                  );
                } else {
                  showLabel = showLabels; 
                }
                return (
                  <React.Fragment key={i}>
                    <Circle
                      cx={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                      cy={yScale(percentage)}
                      r={4}
                      fill={
                        index === 0
                          ? '#0073e6'
                          : index === 1
                          ? '#ff6600'
                          : '#2457a7'
                      }
                      data-tip={`<div style='text-align: left;'>
                        <strong>${xAccessor(d)}</strong><br/>
                        Methamphetamine positivity: ${percentage}%<br/>
                        Confidence interval: ${lowerCI}% - ${upperCI}%
                      </div>`}
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
        {adjustedData.map((lineData, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div
              style={{
                width: '30px',
                height: '2px',
                backgroundColor:
                  index === 0
                    ? '#0073e6'
                    : index === 1
                    ? '#ff6600'
                    : '#2457a7',
                marginRight: '5px'
              }}
            ></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{lineData.name}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />

      <MethamphetamineLineChartsecondLineChart width={width} height={350} period={period} />
    </div>
  );
};

export default MethamphetamineLineChart;