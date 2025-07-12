import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const westQuarterlyData = [
  { quarter: 'Q4 2022', percentage: 21.7, ciLower: 21.2, ciUpper: 22.3, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 18.6, ciLower: 18.2, ciUpper: 19.1, periodChange: -14.3, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 19.4, ciLower: 18.9, ciUpper: 19.8, periodChange: 4.3, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 19.4, ciLower: 19.0, ciUpper: 19.9, periodChange: 0.0, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 19.4, ciLower: 18.9, ciUpper: 19.9, periodChange: 0.0, yearlyChange: -10.6 },
  { quarter: 'Q1 2024', percentage: 19.5, ciLower: 19.1, ciUpper: 20.0, periodChange: 0.5, yearlyChange: 4.8 },
  { quarter: 'Q2 2024', percentage: 20.4, ciLower: 19.9, ciUpper: 20.8, periodChange: 4.6, yearlyChange: 5.2 },
  { quarter: 'Q3 2024', percentage: 20.1, ciLower: 19.6, ciUpper: 20.5, periodChange: -1.5, yearlyChange: 3.6 },
  { quarter: 'Q4 2024', percentage: 19.1, ciLower: 18.6, ciUpper: 19.5, periodChange: -5.0, yearlyChange: -1.5 },
];

const westWithStimulantsQuarterly = [
  { quarter: 'Q4 2022', percentage: 15.2, ciLower: 14.7, ciUpper: 15.7, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 13.5, ciLower: 13.1, ciUpper: 14.0, periodChange: -11.2, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 14.5, ciLower: 14.1, ciUpper: 14.9, periodChange: 7.4, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 14.9, ciLower: 14.4, ciUpper: 15.3, periodChange: 2.8, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 14.9, ciLower: 14.5, ciUpper: 15.3, periodChange: 0.0, yearlyChange: -2.0 },
  { quarter: 'Q1 2024', percentage: 15.2, ciLower: 14.7, ciUpper: 15.6, periodChange: 2.0, yearlyChange: 12.6 },
  { quarter: 'Q2 2024', percentage: 16.3, ciLower: 15.8, ciUpper: 16.7, periodChange: 7.2, yearlyChange: 12.4 },
  { quarter: 'Q3 2024', percentage: 16.7, ciLower: 16.3, ciUpper: 17.1, periodChange: 2.5, yearlyChange: 12.1 },
  { quarter: 'Q4 2024', percentage: 16.7, ciLower: 16.3, ciUpper: 17.1, periodChange: 0.0, yearlyChange: 12.1 },
];

const westWithoutStimulantsQuarterly = [
  { quarter: 'Q4 2022', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 5.1, ciLower: 4.8, ciUpper: 5.4, periodChange: -21.5, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 4.9, ciLower: 4.6, ciUpper: 5.1, periodChange: -3.9, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 4.5, ciLower: 4.2, ciUpper: 4.7, periodChange: -8.2, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 4.5, ciLower: 4.2, ciUpper: 4.8, periodChange: 0.0, yearlyChange: -30.8 },
  { quarter: 'Q1 2024', percentage: 4.4, ciLower: 4.1, ciUpper: 4.6, periodChange: -2.2, yearlyChange: -13.7 },
  { quarter: 'Q2 2024', percentage: 4.1, ciLower: 3.9, ciUpper: 4.3, periodChange: -6.8, yearlyChange: -16.3 },
  { quarter: 'Q3 2024', percentage: 3.4, ciLower: 3.2, ciUpper: 3.6, periodChange: -17.1, yearlyChange: -24.4 },
  { quarter: 'Q4 2024', percentage: 2.4, ciLower: 2.2, ciUpper: 2.6, periodChange: -29.4, yearlyChange: -46.7 },
];

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

function alignDataToQuarters(data, quarters) {
  const map = Object.fromEntries(data.map(d => [d.quarter, d]));
  return quarters.map(q => map[q] || { quarter: q, percentage: null, ciLower: null, ciUpper: null });
}

function FentanylLineChartBase({
  datasets,
  title,
  keyFinding,
  yLabel,
  legendLabels,
  width = 1100,
  height = 450, 
  showDrugSelection = true, 
}) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(datasets.map(ds => ds.label));

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
        const periodChange = d.periodChange !== undefined ? d.periodChange : (
          (prevPeriod !== null && prevPeriod !== 0)
            ? ((curr - prevPeriod) / prevPeriod) * 100
            : null
        );
        const yearlyChange = d.yearlyChange !== undefined ? d.yearlyChange : (
          (prevYear !== null && prevYear !== 0)
            ? ((curr - prevYear) / prevYear) * 100
            : null
        );
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return ds.color;
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-${ds.label}-${i}`}>
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

  // Drug selection options
  const drugOptions = [
    { label: 'Fentanyl', value: 'fentanyl', color: '#0073e6' },
    { label: 'Fentanyl + Stimulants', value: 'fentanyl_stimulants', color: '#6a0dad' },
    { label: 'Fentanyl w/o Stimulants', value: 'fentanyl_no_stimulants', color: '#e67e22' },
    { label: 'Methamphetamine', value: 'methamphetamine', color: '#3e92cc' },
    { label: 'Cocaine', value: 'cocaine', color: '#fbb13c' },
    { label: 'Heroin', value: 'heroin', color: '#d7263d' },
  ];

  // Filter datasets based on selected drugs
  const filteredDatasets = datasets.filter(ds => selectedLines.includes(ds.label));

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            {title}
          </h3>
        </div>
      </div>
      {keyFinding && (
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
          {keyFinding}
        </div>
      )}
      {showDrugSelection && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px 0 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="select-clear-west"
                  checked={selectedLines.length === datasets.length && datasets.every(ds => selectedLines.includes(ds.label))}
                  onChange={() => {
                    if (selectedLines.length === datasets.length && datasets.every(ds => selectedLines.includes(ds.label))) {
                      setSelectedLines([]); 
                    } else {
                      setSelectedLines(datasets.map(ds => ds.label)); 
                    }
                  }}
                  style={{ accentColor: selectedLines.length === datasets.length ? '#222' : undefined }}
                />
                <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="select-clear-west"
                  checked={selectedLines.length === 0}
                  onChange={() => setSelectedLines([])} // Clear all selections
                  style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
                />
                <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '10px' }}>
            {datasets.map(ds => (
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
      )}
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
          />    <AxisBottom
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
              if (ds.label === 'Cocaine') labelYOffset = -8;
              if (ds.label === 'Heroin') labelYOffset = -8;
              if (ds.label === 'Fentanyl and Stimulants') labelYOffset = 22;
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
        {legendLabels.map((legend, idx) => (
          <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < legendLabels.length - 1 ? '15px' : 0 }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: legend.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
}

const alignedDatasets = [
  { data: alignDataToQuarters(westQuarterlyData, allQuarters), color: '#0073e6', label: 'Fentanyl' },
  { data: alignDataToQuarters(westWithStimulantsQuarterly, allQuarters), color: '#6a0dad', label: 'Fentanyl + Stimulants' },
  { data: alignDataToQuarters(westWithoutStimulantsQuarterly, allQuarters), color: '#e67e22', label: 'Fentanyl w/o Stimulants' },
];

const heroinWestData = [
  { quarter: 'Q4 2022', percentage: 14.7, ciLower: 13.7, ciUpper: 15.7, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 14.1, ciLower: 13.1, ciUpper: 15.1, periodChange: -4.8, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 13.4, ciLower: 12.3, ciUpper: 14.5, periodChange: -5.0, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 12.3, ciLower: 11.3, ciUpper: 13.2, periodChange: -10.9, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 11.0, ciLower: 9.8, ciUpper: 12.1, periodChange: -10.6, yearlyChange: -25.2 },
  { quarter: 'Q1 2024', percentage: 10.9, ciLower: 9.8, ciUpper: 11.9, periodChange: -0.9, yearlyChange: -22.6 },
  { quarter: 'Q2 2024', percentage: 10.8, ciLower: 9.8, ciUpper: 11.8, periodChange: -0.9, yearlyChange: -19.4 },
  { quarter: 'Q3 2024', percentage: 24.1, ciLower: 22.5, ciUpper: 25.8, periodChange: 123.1, yearlyChange: 96.0 },
  { quarter: 'Q4 2024', percentage: 30.5, ciLower: 28.1, ciUpper: 32.8, periodChange: 21.7, yearlyChange: 119.1 },
];

const cocaineWestData = [
  { quarter: 'Q4 2022', percentage: 10.2, ciLower: 9.3, ciUpper: 11.1, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 10.3, ciLower: 9.4, ciUpper: 11.2, periodChange: 1.0, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 11.2, ciLower: 10.2, ciUpper: 12.1, periodChange: 8.7, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 12.1, ciLower: 11.1, ciUpper: 13.1, periodChange: 8.0, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 13.5, ciLower: 12.3, ciUpper: 14.7, periodChange: 11.6, yearlyChange: 32.6 },
  { quarter: 'Q1 2024', percentage: 14.8, ciLower: 13.6, ciUpper: 16.0, periodChange: 9.6, yearlyChange: 43.7 },
  { quarter: 'Q2 2024', percentage: 15.8, ciLower: 14.6, ciUpper: 17.0, periodChange: 6.8, yearlyChange: 46.1 },
  { quarter: 'Q3 2024', percentage: 19.0, ciLower: 17.7, ciUpper: 20.3, periodChange: 20.3, yearlyChange: 57.9 },
  { quarter: 'Q4 2024', percentage: 19.5, ciLower: 18.5, ciUpper: 20.6, periodChange: 2.6, yearlyChange: 62.0 },
];

const methamphetamineWestData = [
  { quarter: 'Q4 2022', percentage: 66.8, ciLower: 65.0, ciUpper: 68.7, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 67.2, ciLower: 65.3, ciUpper: 69.1, periodChange: 0.6, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 73.4, ciLower: 71.3, ciUpper: 75.5, periodChange: 9.3, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 77.2, ciLower: 75.1, ciUpper: 79.3, periodChange: 5.2, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 80.4, ciLower: 78.3, ciUpper: 82.5, periodChange: 4.1, yearlyChange: 20.4 },
  { quarter: 'Q1 2024', percentage: 85.0, ciLower: 83.1, ciUpper: 86.9, periodChange: 5.7, yearlyChange: 26.4 },
  { quarter: 'Q2 2024', percentage: 85.8, ciLower: 83.9, ciUpper: 87.8, periodChange: 0.9, yearlyChange: 17.0 },
  { quarter: 'Q3 2024', percentage: 85.9, ciLower: 83.9, ciUpper: 87.8, periodChange: 0.1, yearlyChange: 11.3 },
  { quarter: 'Q4 2024', percentage: 85.8, ciLower: 83.9, ciUpper: 87.8, periodChange: -0.1, yearlyChange: 15.8 },
];

const fentanylAndStimulantsData = [
  { quarter: 'Q4 2022', percentage: 10.1, ciLower: 9.6, ciUpper: 10.7, periodChange: null, yearlyChange: null },
  { quarter: 'Q1 2023', percentage: 7.6, ciLower: 7.2, ciUpper: 8.1, periodChange: -24.8, yearlyChange: null },
  { quarter: 'Q2 2023', percentage: 7.6, ciLower: 7.2, ciUpper: 8.1, periodChange: 0.0, yearlyChange: null },
  { quarter: 'Q3 2023', percentage: 7.8, ciLower: 7.3, ciUpper: 8.2, periodChange: 2.6, yearlyChange: null },
  { quarter: 'Q4 2023', percentage: 7.8, ciLower: 7.3, ciUpper: 8.2, periodChange: 0.0, yearlyChange: -22.8 },
  { quarter: 'Q1 2024', percentage: 8.0, ciLower: 7.6, ciUpper: 8.4, periodChange: 2.6, yearlyChange: 5.3 },
  { quarter: 'Q2 2024', percentage: 8.2, ciLower: 7.8, ciUpper: 8.6, periodChange: 2.5, yearlyChange: 7.9 },
  { quarter: 'Q3 2024', percentage: 8.3, ciLower: 7.9, ciUpper: 8.7, periodChange: 1.2, yearlyChange: 6.4 },
  { quarter: 'Q4 2024', percentage: 8.9, ciLower: 8.3, ciUpper: 9.5, periodChange: 7.7, yearlyChange: 14.1 },
];

const westThreeDrugsDatasets = [
  { data: alignDataToQuarters(methamphetamineWestData, allQuarters), color: '#3e92cc', label: 'Methamphetamine' },
  { data: alignDataToQuarters(cocaineWestData, allQuarters), color: '#fbb13c', label: 'Cocaine' },
  { data: alignDataToQuarters(heroinWestData, allQuarters), color: '#d7263d', label: 'Heroin' },
  { data: alignDataToQuarters(fentanylAndStimulantsData, allQuarters), color: '#1b9e77', label: 'Fentanyl and Stimulants' },
];

function getKeyFinding() {
  if (!westQuarterlyData || westQuarterlyData.length < 2) return null;
  const lastIdx = westQuarterlyData.length - 1;
  const prevIdx = westQuarterlyData.length - 2;
  const last = westQuarterlyData[lastIdx];
  const prev = westQuarterlyData[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return (
    <>
      <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}. This may indicate {direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to fentanyl among people with substance use disorders.
    </>
  );
}

function getKeyFindingForThreeDrugs() {
  if (!methamphetamineWestData || methamphetamineWestData.length < 2) return null;
  const lastIdx = methamphetamineWestData.length - 1;
  const prevIdx = methamphetamineWestData.length - 2;
  const last = methamphetamineWestData[lastIdx];
  const prev = methamphetamineWestData[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return (
    <>
      <span style={{ fontWeight: 700 }}>Key finding:</span> Methamphetamine positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}.
    </>
  );
}

const FentanylLineChartWest = () => {
  return (
    <div>
      <FentanylLineChartBase
        datasets={alignedDatasets}
        title="How often do people with a substance use disorder test positive for fentanyl on urine drug tests: Western Census Region Q1 2023 - Q4 2024. Millennium Health, Western Census Region Q1 2023 - Q4 2024"
        keyFinding={getKeyFinding()}
        yLabel="% of people with substance use disorder
with drug(s) detected"
        legendLabels={[
          { color: '#0073e6', label: 'Fentanyl' },
          { color: '#6a0dad', label: 'Fentanyl with Stimulants' },
          { color: '#e67e22', label: 'Fentanyl without Stimulants' },
        ]}
        showDrugSelection={false}
      />
      <FentanylLineChartBase
        datasets={westThreeDrugsDatasets}
        title="How often do people with a substance use disorder test positive for methamphetamine, cocaine, Fentanyl and Stimulants or heroin on urine drug tests: Western Census Region Q1 2023 - Q4 2024"
        keyFinding={getKeyFindingForThreeDrugs()}
        yLabel="% of people with substance use disorder
with drug detected"
        legendLabels={[
          { color: '#3e92cc', label: 'Methamphetamine' },
          { color: '#fbb13c', label: 'Cocaine' },
          { color: '#d7263d', label: 'Heroin' },
          { color: '#1b9e77', label: 'Fentanyl and Stimulants' }, 
        ]}
        height={450}
        width={1100}
        
        showDrugSelection={true}
      />
    </div>
  );
};

export default FentanylLineChartWest;

