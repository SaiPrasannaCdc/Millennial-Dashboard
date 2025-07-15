import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import { UtilityFunctions } from '../utility';

const lineColors = {
  'Methamphetamine': '#ffa600', // Orange
  'Cocaine': '#2f4b7c', // Blue
  'Heroin': '#665191', // Purple
  'Fentanyl and Stimulants': '#00bfae', // Teal
};

const PositiveHeroinChart = ({ width, height, period }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));
  const [periodType, setPeriodType] = useState('Quarterly');
  const [heroinData, setHeroinData] = useState([]);

  useEffect(() => {
      setPeriodType(period === 'HalfYearly' ? 'HalfYearly' : 'Quarterly');
    }, [period]);

    useEffect(() => {
      ReactTooltip.rebuild();
    }, [showPercentChange]);

    useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

          const nhData = UtilityFunctions.getGroupedData(data, 'National', 'Heroin', 'Positivity', periodType, ['Heroin']);
          const ncData = UtilityFunctions.getGroupedData(data, 'National', 'Cocaine', 'Positivity', periodType, ['Cocaine']);
          const nmData = UtilityFunctions.getGroupedData(data, 'National', 'Methamphetamine', 'Positivity', periodType, ['Methamphetamine']);
          const nfData = UtilityFunctions.getGroupedData(data, 'National', 'Fentanyl', 'CoPositive', periodType, ['Fentanyl and Stimulants']);

          var heroinData = {};

          heroinData = [{name: 'Heroin', values: nhData[0].data}, {name: 'Cocaine', values: ncData[0].data}, {name: 'Methamphetamine', values: nmData[0].data}, {name: 'Fentanyl and Stimulants', values: nfData[0].data}];

          setHeroinData(heroinData);

          });
      }, []); 

  const margin = { top: 60, right: 30, bottom: 50, left: 90 }; 
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

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
                      <strong>${(period === 'Quarterly' || !period) ? 'Quarterly' : '6 Month'} Change</strong><br/>
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

  const adjustedData = heroinData;

  if (!adjustedData || adjustedData.length == 0) {
    return (
      <div style={{ color: 'red', textAlign: 'center', margin: 40 }}>
        No data available for the selected region.
      </div>
    );
  }

  const xDomain = period === 'Quarterly'  ? adjustedData[0].values.map(d => d.quarter)  : adjustedData[0].values.map(d => d.period);
  const xAccessor = period === 'Quarterly' ? d => d.quarter : d => d.period;

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

      {UtilityFunctions.getToggleControls('PositiveHeroinChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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