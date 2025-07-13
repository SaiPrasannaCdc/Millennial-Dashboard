import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import { UtilityFunctions } from '../utility';
import MethamphetamineLineChartsecondLineChart from './MethamphetamineLineChartsecondlinechart';

const MethamphetamineLineChart = ({ width, height, period}) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [millenialData, setMillenialData] = useState(null);
  const [seriesList, setSeriesList] = useState([]);
  const [allPeriods, setAllPeriods] = useState([]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {
            let grouped;
            
            if (period === 'HalfYearly') {
              grouped = UtilityFunctions.getGroupedData(data, 'South', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine', 'Methamphetamine with Opioids', 'Methamphetamine without Opioids']);
              setAllPeriods(grouped[0] ? grouped[0].data.map(d => d.period) : []);
            } else {
              grouped = UtilityFunctions.getGroupedData(data, 'South', 'Methamphetamine', 'Positivity', 'Quarterly', ['Methamphetamine', 'Methamphetamine with Opioids', 'Methamphetamine without Opioids']);
              setAllPeriods(grouped[0] ? grouped[0].data.map(d => d.quarter) : []);
            }
            setSeriesList(grouped);
           });
    }, [period]); 

  const adjustedData = seriesList;
  
    // Guard clause to prevent errors if data is not loaded yet
    if (!adjustedData || adjustedData.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Loading chart data...
        </div>
      );
    }
  
    const is6Months = period === 'HalfYearly';
    const margin = { top: 60, right: 30, bottom: 50, left: 90 };
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
  
    const xDomain = is6Months ? allPeriods : allPeriods;
    const xAccessor = is6Months ? d => d.period : d => d.quarter;
  
    const xScale = scaleBand({
      domain: xDomain,
      range: [0, adjustedWidth],
      padding: 0.2,
    });
  
    const yScale = scaleLinear({
      domain: [0, Math.max(...adjustedData[0].data.map(v => parseFloat(v.percentage)))],
      range: [adjustedHeight, 0],
      nice: true,
    });

  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return parseFloat(lineData.data[i - offset].percentage);
    }
    return null;
  };

  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;

    return adjustedData.map((lineData, index) => {
      return lineData.data.map((d, i) => {
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

  const getKeyFinding = (data) => {
    if (!data || data.length === 0) return null;
    const line = data[0];
    if (!line || !line.data || line.data.length < 2) return null;
    const lastIdx = line.data.length - 1;
    const prevIdx = line.data.length - 2;
    const last = line.data[lastIdx];
    const prev = line.data[prevIdx];
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

      {UtilityFunctions.getToggleControls('MethamphetamineLineChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
                data={lineData.data}
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
              {lineData.data.map((d, i) => {
                const percentage = parseFloat(d.percentage);
                let lowerCI = d.ciLower !== undefined ? d.ciLower : (percentage - 0.5).toFixed(1);
                let upperCI = d.ciUpper !== undefined ? d.ciUpper : (percentage + 0.5).toFixed(1);
                const n = lineData.data.length;
                let showLabel = false;
                showLabel = showLabels || (
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