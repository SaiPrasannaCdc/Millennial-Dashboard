import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

// 6 Months data for all regions
const heroin6MonthsData = {
  NORTH: [
    {
      name: 'Heroin',
      values: [
        { period: '2022 Jul-Dec', percentage: 11.6, ciLower: 11, ciUpper: 12.1 },
        { period: '2023 Jan-Jun', percentage: 12.2, ciLower: 11.6, ciUpper: 12.6 },
        { period: '2023 Jul-Dec', percentage: 12.0, ciLower: 11.4, ciUpper: 12.5 },
        { period: '2024 Jan-Jun', percentage: 10.6, ciLower: 10.1, ciUpper: 11.1 },
        { period: '2024 Jul-Dec', percentage: 11.3, ciLower: 10.7, ciUpper: 11.8 },
      ]
    },
    {
      name: 'Heroin with Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 10.2, ciLower: 9.7, ciUpper: 10.7 },
        { period: '2023 Jan-Jun', percentage: 9.8, ciLower: 9.3, ciUpper: 10.2 },
        { period: '2023 Jul-Dec', percentage: 9.7, ciLower: 9.2, ciUpper: 10.1 },
        { period: '2024 Jan-Jun', percentage: 8.5, ciLower: 8, ciUpper: 8.9 },
        { period: '2024 Jul-Dec', percentage: 7.0, ciLower: 6.5, ciUpper: 7.4 },
      ]
    },
    {
      name: 'Heroin without Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 2.6, ciLower: 2.1, ciUpper: 3.1 },
        { period: '2023 Jan-Jun', percentage: 2.4, ciLower: 2.1, ciUpper: 2.7 },
        { period: '2023 Jul-Dec', percentage: 2.3, ciLower: 2, ciUpper: 2.6 },
        { period: '2024 Jan-Jun', percentage: 1.7, ciLower: 1.4, ciUpper: 1.9 },
        { period: '2024 Jul-Dec', percentage: 1.7, ciLower: 1.5, ciUpper: 2.0 },
      ]
    }
  ],
  NORTHEAST: [
    {
      name: 'Heroin',
      values: [
        { period: '2022 Jul-Dec', percentage: 4.6, ciLower: 4.2, ciUpper: 5.0 },
        { period: '2023 Jan-Jun', percentage: 4.3, ciLower: 4.0, ciUpper: 4.6 },
        { period: '2023 Jul-Dec', percentage: 4.1, ciLower: 3.8, ciUpper: 4.4 },
        { period: '2024 Jan-Jun', percentage: 3.9, ciLower: 3.6, ciUpper: 4.2 },
        { period: '2024 Jul-Dec', percentage: 3.7, ciLower: 3.4, ciUpper: 4.0 },
      ]
    },
    {
      name: 'Heroin with Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 3.8, ciLower: 3.5, ciUpper: 4.1 },
        { period: '2023 Jan-Jun', percentage: 3.6, ciLower: 3.3, ciUpper: 3.9 },
        { period: '2023 Jul-Dec', percentage: 3.5, ciLower: 3.2, ciUpper: 3.8 },
        { period: '2024 Jan-Jun', percentage: 3.3, ciLower: 3.0, ciUpper: 3.6 },
        { period: '2024 Jul-Dec', percentage: 3.1, ciLower: 2.8, ciUpper: 3.4 },
      ]
    },
    {
      name: 'Heroin without Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 0.8, ciLower: 0.6, ciUpper: 1.0 },
        { period: '2023 Jan-Jun', percentage: 0.7, ciLower: 0.5, ciUpper: 0.9 },
        { period: '2023 Jul-Dec', percentage: 0.6, ciLower: 0.4, ciUpper: 0.8 },
        { period: '2024 Jan-Jun', percentage: 0.6, ciLower: 0.4, ciUpper: 0.8 },
        { period: '2024 Jul-Dec', percentage: 0.6, ciLower: 0.4, ciUpper: 0.8 },
      ]
    }
  ],
  MIDWEST: [
    {
      name: 'Heroin',
      values: [
        { period: '2022 Jul-Dec', percentage: 10.9, ciLower: 10.5, ciUpper: 11.4 },
        { period: '2023 Jan-Jun', percentage: 11.0, ciLower: 10.7, ciUpper: 11.3 },
        { period: '2023 Jul-Dec', percentage: 13.0, ciLower: 12.7, ciUpper: 13.3 },
        { period: '2024 Jan-Jun', percentage: 10.6, ciLower: 10.3, ciUpper: 10.9 },
        { period: '2024 Jul-Dec', percentage: 9.3, ciLower: 9.0, ciUpper: 9.5 },
      ]
    },
    {
      name: 'Heroin with Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 10.9, ciLower: 10.5, ciUpper: 11.3 },
        { period: '2023 Jan-Jun', percentage: 10.2, ciLower: 9.9, ciUpper: 10.6 },
        { period: '2023 Jul-Dec', percentage: 9.5, ciLower: 9.2, ciUpper: 9.9 },
        { period: '2024 Jan-Jun', percentage: 8.7, ciLower: 8.4, ciUpper: 9.4 },
        { period: '2024 Jul-Dec', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
      ]
    },
    {
      name: 'Heroin without Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 4.4, ciLower: 4.1, ciUpper: 4.7 },
        { period: '2023 Jan-Jun', percentage: 4.1, ciLower: 3.9, ciUpper: 4.3 },
        { period: '2023 Jul-Dec', percentage: 4.8, ciLower: 4.6, ciUpper: 5.0 },
        { period: '2024 Jan-Jun', percentage: 3.5, ciLower: 3.4, ciUpper: 3.7 },
        { period: '2024 Jul-Dec', percentage: 2.8, ciLower: 2.6, ciUpper: 2.9 },
      ]
    }
  ],
  SOUTH: [
    {
      name: 'Heroin',
      values: [
        { period: '2022 Jul-Dec', percentage: 11.6, ciLower: 11, ciUpper: 12.1 },
        { period: '2023 Jan-Jun', percentage: 12, ciLower: 11.6, ciUpper: 12.4 },
        { period: '2023 Jul-Dec', percentage: 10.9, ciLower: 10.6, ciUpper: 11.3 },
        { period: '2024 Jan-Jun', percentage: 10, ciLower: 9.6, ciUpper: 10.4 },
        { period: '2024 Jul-Dec', percentage: 9.1, ciLower: 8.7, ciUpper: 9.4 },
      ]
    },
    {
      name: 'Heroin with Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 10.2, ciLower: 9.7, ciUpper: 10.7 },
        { period: '2023 Jan-Jun', percentage: 9.8, ciLower: 9.3, ciUpper: 10.2 },
        { period: '2023 Jul-Dec', percentage: 9.7, ciLower: 9.2, ciUpper: 10.1 },
        { period: '2024 Jan-Jun', percentage: 8.5, ciLower: 8.0, ciUpper: 8.9 },
        { period: '2024 Jul-Dec', percentage: 7.0, ciLower: 6.5, ciUpper: 7.4 },
      ]
    },
    {
      name: 'Heroin without Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 4.6, ciLower: 4.2, ciUpper: 5.2 },
        { period: '2023 Jan-Jun', percentage: 4.3, ciLower: 4.1, ciUpper: 4.6 },
        { period: '2023 Jul-Dec', percentage: 4.1, ciLower: 3.8, ciUpper: 4.3 },
        { period: '2024 Jan-Jun', percentage: 2.9, ciLower: 2.8, ciUpper: 3.1 },
        { period: '2024 Jul-Dec', percentage: 2.9, ciLower: 2.8, ciUpper: 3.1 },
      ]
    }
  ],
  WEST: [
    {
      name: 'Heroin',
      values: [
        { period: '2022 Jul-Dec', percentage: 21.7, ciLower: 21.2, ciUpper: 22.3 },
        { period: '2023 Jan-Jun', percentage: 19.0, ciLower: 18.7, ciUpper: 19.3 },
        { period: '2023 Jul-Dec', percentage: 19.4, ciLower: 19.0, ciUpper: 19.7 },
        { period: '2024 Jan-Jun', percentage: 20.0, ciLower: 19.6, ciUpper: 20.3 },
        { period: '2024 Jul-Dec', percentage: 19.9, ciLower: 19.3, ciUpper: 19.9 },
      ]
    },
    {
      name: 'Heroin with Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 19.5, ciLower: 19.1, ciUpper: 20.0 },
        { period: '2023 Jan-Jun', percentage: 20.4, ciLower: 19.9, ciUpper: 20.8 },
        { period: '2023 Jul-Dec', percentage: 20.1, ciLower: 19.6, ciUpper: 20.5 },
        { period: '2024 Jan-Jun', percentage: 15.2, ciLower: 14.7, ciUpper: 15.7 },
        { period: '2024 Jul-Dec', percentage: 15.4, ciLower: 14.7, ciUpper: 15.7 },
      ]
    },
    {
      name: 'Heroin without Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
        { period: '2023 Jan-Jun', percentage: 5.0, ciLower: 4.8, ciUpper: 5.2 },
        { period: '2023 Jul-Dec', percentage: 4.5, ciLower: 4.3, ciUpper: 4.7 },
        { period: '2024 Jan-Jun', percentage: 4.2, ciLower: 4.1, ciUpper: 4.4 },
        { period: '2024 Jul-Dec', percentage: 2.9, ciLower: 2.8, ciUpper: 3.0 },
      ]
    }
  ]
};

const lineColors = {
  'Heroin': '#8e44ad',
  'Heroin with Stimulants': '#e74c3c',
  'Heroin without Stimulants': '#3498db',
};

const allPeriods6M = [
  '2022 Jul-Dec', '2023 Jan-Jun', '2023 Jul-Dec', '2024 Jan-Jun', '2024 Jul-Dec'
];

function alignDataToQuarters(data, quarters, labelField = 'quarter') {
  const drugs = [...new Set(data.map(d => d.drug))];
  return drugs.map(drug => ({
    label: drug,
    color: lineColors[drug] || '#0073e6',
    data: quarters.map(q => {
      const found = data.find(d => d.drug === drug && d[labelField] === q);
      return found ? found : { [labelField]: q, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

const HeroinLineChartRegions6months = ({ region = 'SOUTH', width = 1100, height = 350, period = '6 Months' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);

  let regionKey = (region || 'SOUTH').toUpperCase().replace(/\s+/g, '');
  if (regionKey.includes('NORTHEAST') || regionKey === 'NORTH' || regionKey === 'NORTHEASTCENSUSREGION') {
    regionKey = 'NORTHEAST';
  } else if (regionKey.includes('MIDWEST')) {
    regionKey = 'MIDWEST';
  } else if (regionKey.includes('SOUTH')) {
    regionKey = 'SOUTH';
  } else if (regionKey.includes('WEST')) {
    regionKey = 'WEST';
  } else if (regionKey.includes('NATIONAL')) {
    regionKey = 'NATIONAL';
  }

  const adjustedData = heroin6MonthsData[regionKey] || heroin6MonthsData['SOUTH'];

  if (!adjustedData || !Array.isArray(adjustedData) || adjustedData.length === 0) {
    return (
      <div style={{ color: 'red', textAlign: 'center', margin: 40 }}>
        No data available for the selected region.
      </div>
    );
  }

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = adjustedData[0].values.map(d => d.period);
  const xAccessor = d => d.period;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...adjustedData.flatMap(d => d.values.map(v => v.percentage)))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return lineData.values[i - offset].percentage;
    }
    return null;
  };

  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;
    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = getPrevPeriodValue(lineData, i, 1);
        const yearlyOffset = 2;
        const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
        const curr = d.percentage;
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
          <g key={`indicator-heroin-south-${index}-${i}`}> 
            <Circle
              cx={xPosition}
              cy={yPosition}
              r={4}
              fill={index === 0 ? '#0073e6' : '#ff6600'}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${showYearlyIndicator ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>6-Month Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for heroin: Southern Census Region Jul 2022 – Dec 2024. Millennium Health, Southern Census Region Jul 2022 – Dec 2024
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
        Not enough data to calculate change.
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 12px 0', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>
          Make a selection to change the line graph
        </div>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            // checked={selectedLines.length === allLineKeys.length}
            // onChange={() => setSelectedLines(allLineKeys)}
            style={{ marginRight: 6 }}
          />
          Select All
        </label>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            // checked={selectedLines.length === 0}
            // onChange={() => setSelectedLines([])}
            style={{ marginRight: 6 }}
          />
          Clear All
        </label>
        <div style={{ flex: 1 }} />
        <div className="toggle-container" style={{ display: 'flex', gap: '10px' }}>
          <div className="toggle-wrapper" style={{ position: 'relative' }}>
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
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
        {Object.entries(lineColors).map(([drug, color]) => (
          <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              // checked={selectedLines.includes(drug)}
              // onChange={() => {
              //   if (selectedLines.includes(drug)) {
              //     setSelectedLines(selectedLines.filter(line => line !== drug));
              //   } else {
              //     setSelectedLines([...selectedLines, drug]);
              //   }
              // }}
              style={{ display: 'none' }}
            />
            <span style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: `2px solid #888`,
              background: '#fff',
              marginRight: 2,
              position: 'relative',
              transition: 'background 0.2s, border 0.2s',
            }}>
              {/* {selectedLines.includes(drug) && (
                <span style={{
                  display: 'block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: color,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }} />
              )} */}
            </span>
            <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
          </label>
        ))}
      </div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <text
            x={-70}
            y={adjustedHeight / 2}
            textAnchor="middle"
            fontFamily="Segoe UI, Arial, sans-serif"
            fontWeight={600}
            fontSize={15}
            fill="#222"
            letterSpacing="0.01em"
            transform={`rotate(-90, -70, ${adjustedHeight / 2})`}
          >
            <tspan x={-70} dy={-6}>% of people with substance use disorder</tspan>
            <tspan x={-70} dy={16}>with drug(s) detected</tspan>
          </text>
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
            tickLabelProps={() => ({
              fontSize: 16,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              fill: '#222',
              textAnchor: 'end',
              dx: -8,
              dy: 3,
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
          {adjustedData.map((ds, idx) => (
            <React.Fragment key={ds.name}>
              <LinePath
                data={ds.values}
                x={d => xScale(d[xAccessor]) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={lineColors[ds.name]}
                strokeWidth={3}
                curve={null}
              />
              {ds.values.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.values.length;
                let showLabel = false;
                showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.name === 'Heroin and Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.name}-pt-${i}`}>
                    <Circle
                      cx={xScale(d[xAccessor]) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.name]}
                      data-tip={
                        showPercentChange
                          ? undefined
                          : `<div style='text-align: left;'><strong>${d[xAccessor]}</strong><br/>${ds.name} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
                      }
                    />
                    {showLabel && (
                      <text
                        x={xScale(d[xAccessor]) + xScale.bandwidth() / 2}
                        y={yScale(d.percentage) + labelYOffset}
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

export default HeroinLineChartRegions6months;
