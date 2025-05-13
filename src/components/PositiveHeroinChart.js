import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const sampleDataHeroin = [
  {
    name: 'Cocaine or methamphetamine',
    values: [
      { quarter: 'Q4 2022', percentage: '63.2' },
      { quarter: 'Q1 2023', percentage: '67.0' },
      { quarter: 'Q2 2023', percentage: '67.2' },
      { quarter: 'Q3 2023', percentage: '69.1' },
      { quarter: 'Q4 2023', percentage: '72.1' },
      { quarter: 'Q1 2024', percentage: '74.0' },
      { quarter: 'Q2 2024', percentage: '80.0' },
      { quarter: 'Q3 2024', percentage: '85.4' },
      { quarter: 'Q4 2024', percentage: '90.0' },
    ],
  },
  {
    name: 'Methamphetamine',
    values: [
      { quarter: 'Q4 2022', percentage: '52.1' },
      { quarter: 'Q1 2023', percentage: '53.0' },
      { quarter: 'Q2 2023', percentage: '54.7' },
      { quarter: 'Q3 2023', percentage: '54.5' },
      { quarter: 'Q4 2023', percentage: '54.8' },
      { quarter: 'Q1 2024', percentage: '57.1' },
      { quarter: 'Q2 2024', percentage: '60.8' },
      { quarter: 'Q3 2024', percentage: '64.1' },
      { quarter: 'Q4 2024', percentage: '68.4' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { quarter: 'Q4 2022', percentage: '40.5' },
      { quarter: 'Q1 2023', percentage: '39.0' },
      { quarter: 'Q2 2023', percentage: '39.6' },
      { quarter: 'Q3 2023', percentage: '40.1' },
      { quarter: 'Q4 2023', percentage: '39.1' },
      { quarter: 'Q1 2024', percentage: '42.1' },
      { quarter: 'Q2 2024', percentage: '40.0' },
      { quarter: 'Q3 2024', percentage: '43.1' },
      { quarter: 'Q4 2024', percentage: '44.7' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '25.3' },
      { quarter: 'Q1 2023', percentage: '23.1' },
      { quarter: 'Q2 2023', percentage: '21.7' },
      { quarter: 'Q3 2023', percentage: '19.4' },
      { quarter: 'Q4 2023', percentage: '18.3' },
      { quarter: 'Q1 2024', percentage: '16.4' },
      { quarter: 'Q2 2024', percentage: '15.8' },
      { quarter: 'Q3 2024', percentage: '16.9' },
      { quarter: 'Q4 2024', percentage: '18.0' },
    ],
  },
];

const lineColors = {
  'Cocaine or methamphetamine': '#003f5c', // Dark Blue
  'Methamphetamine': '#ffa600', // Orange
  'Cocaine': '#2f4b7c', // Blue
  'Heroin': '#665191', // Purple
};

const PositiveHeroinChart = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));

  const margin = { top: 60, right: 30, bottom: 50, left: 50 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: sampleDataHeroin[0].values.map(d => d.quarter),
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...sampleDataHeroin.flatMap(d => d.values.map(v => parseFloat(v.percentage))))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const adjustedData = sampleDataHeroin;

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;

    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;

        const prevYear = i >= 4 ? parseFloat(lineData.values[i - 4].percentage) : null;
        const prevQuarter = i > 0 ? parseFloat(lineData.values[i - 1].percentage) : null;
        const curr = parseFloat(d.percentage);

        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const quarterlyChange = prevQuarter !== null ? ((curr - prevQuarter) / prevQuarter) * 100 : null;

        const xPosition = xScale(d.quarter) + xScale.bandwidth() / 2;
        const yPosition = yScale(curr);

        if (isNaN(xPosition) || isNaN(yPosition)) return null;

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
                <div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${quarterlyChange !== null && quarterlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${quarterlyChange !== null ? quarterlyChange.toFixed(1) : 'N/A'}% (${quarterlyChange !== null && quarterlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${quarterlyChange !== null && quarterlyChange > 0 ? 'increased' : 'decreased'} from ${prevQuarter !== null ? prevQuarter.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
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
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test who test positive for fentanyl on urine drug tests also test positive for cocaine, methamphetamine, or heroin: United States Q4 2022 - Q4 2024
          </h3>
        </div>
      </div>

      <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={showPercentChange}
              onChange={() => setShowPercentChange(!showPercentChange)}
            />
            <span className="slider percent-toggle"></span>
          </label>
          <span className="toggle-label">% Chg On</span>
        </div>
        <div className="toggle-wrapper">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={!showLabels}
              onChange={() => setShowLabels(!showLabels)}
            />
            <span className="slider label-toggle"></span>
          </label>
          <span className="toggle-label">Labels Off</span>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px', fontSize: '6px', color: '#666', lineHeight: '1.4', textAlign: 'right' }}>
        <div style={{ maxWidth: '300px' }}>
          <p style={{ margin: 0 }}>When "% Chg" is on, hover over a data point</p>
          <p style={{ margin: 0 }}>on the line chart to view percent change</p>
          <p style={{ margin: 0 }}>for the selected year compared to the previous year.</p>
        </div>
      </div>

      {/* Update the button structure and style to match the provided image */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Make a selection to change the line graph</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={selectedLines.length === Object.keys(lineColors).length}
              onChange={() => {
                if (selectedLines.length === Object.keys(lineColors).length) {
                  setSelectedLines([]);
                } else {
                  setSelectedLines(Object.keys(lineColors));
                }
              }}
            />
            <span style={{ fontSize: '14px' }}>Select All</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={selectedLines.length === 0}
              onChange={() => setSelectedLines([])}
            />
            <span style={{ fontSize: '14px' }}>Clear All</span>
          </label>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
          {Object.entries(lineColors).map(([drug, color]) => (
            <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
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
              />
              <span style={{ fontSize: '14px', color }}>{drug}</span>
            </label>
          ))}
        </div>
      </div>

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 10,
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
                  x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                  y={d => yScale(parseFloat(d.percentage))}
                  stroke={lineColors[lineData.name]}
                  strokeWidth={2}
                  curve={null}
                />
                {lineData.values.map((d, i) => {
                  const percentage = parseFloat(d.percentage);
                  const lowerCI = (percentage - 0.5).toFixed(1);
                  const upperCI = (percentage + 0.5).toFixed(1);

                  return (
                    <React.Fragment key={i}>
                      <Circle
                        cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                        cy={yScale(percentage)}
                        r={4}
                        fill={lineColors[lineData.name]}
                        data-tip={`<div style='text-align: left;'>
                          <strong>${d.quarter}</strong><br/>
                          ${lineData.name} positivity: ${percentage}%
                        </div>`}
                      />
                      {showLabels && (
                        <text
                          x={xScale(d.quarter) + xScale.bandwidth() / 2}
                          y={yScale(percentage) - 10}
                          fontSize={10}
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
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Object.entries(lineColors).map(([drug, color]) => (
          <div key={drug} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#333' }}>{drug}</span>
          </div>
        ))}
      </div>
      <ReactTooltip html={true} />
    </div>
  );
};

export default PositiveHeroinChart;