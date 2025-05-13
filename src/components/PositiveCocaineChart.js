import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const sampleDataCocaine = [
  {
    name: 'Fentanyl or heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '52.1' },
      { quarter: 'Q1 2023', percentage: '53.0' },
      { quarter: 'Q2 2023', percentage: '55.1' },
      { quarter: 'Q3 2023', percentage: '55.9' },
      { quarter: 'Q4 2023', percentage: '56.2' },
      { quarter: 'Q1 2024', percentage: '55.8' },
      { quarter: 'Q2 2024', percentage: '56.0' },
      { quarter: 'Q3 2024', percentage: '56.2' },
      { quarter: 'Q4 2024', percentage: '56.1' },
    ],
  },
  {
    name: 'Fentanyl',
    values: [
      { quarter: 'Q4 2022', percentage: '42.0' },
      { quarter: 'Q1 2023', percentage: '43.2' },
      { quarter: 'Q2 2023', percentage: '47.7' },
      { quarter: 'Q3 2023', percentage: '48.1' },
      { quarter: 'Q4 2023', percentage: '48.7' },
      { quarter: 'Q1 2024', percentage: '47.2' },
      { quarter: 'Q2 2024', percentage: '48.6' },
      { quarter: 'Q3 2024', percentage: '47.6' },
      { quarter: 'Q4 2024', percentage: '46.6' },
    ],
  },
  {
    name: 'Heroin',
    values: [
      { quarter: 'Q4 2022', percentage: '19.1' },
      { quarter: 'Q1 2023', percentage: '19.5' },
      { quarter: 'Q2 2023', percentage: '19.6' },
      { quarter: 'Q3 2023', percentage: '19.3' },
      { quarter: 'Q4 2023', percentage: '19.4' },
      { quarter: 'Q1 2024', percentage: '19.1' },
      { quarter: 'Q2 2024', percentage: '19.1' },
      { quarter: 'Q3 2024', percentage: '20.2' },
      { quarter: 'Q4 2024', percentage: '20.3' },
    ],
  },
  {
    name: 'Cocaine',
    values: [
      { quarter: 'Q4 2022', percentage: '7.1' },
      { quarter: 'Q1 2023', percentage: '7.4' },
      { quarter: 'Q2 2023', percentage: '7.0' },
      { quarter: 'Q3 2023', percentage: '7.9' },
      { quarter: 'Q4 2023', percentage: '8.2' },
      { quarter: 'Q1 2024', percentage: '8.4' },
      { quarter: 'Q2 2024', percentage: '8.7' },
      { quarter: 'Q3 2024', percentage: '8.9' },
      { quarter: 'Q4 2024', percentage: '9.3' },
    ],
  },
];

const lineColors = {
  'Fentanyl or heroin': '#0073e6', // Blue
  'Fentanyl': '#ff6600', // Orange
  'Heroin': '#008000', // Green
  'Cocaine': '#6a0dad', // Purple
};

const PositiveCocaineChart = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));

  const margin = { top: 60, right: 30, bottom: 50, left: 50 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: sampleDataCocaine[0].values.map(d => d.quarter),
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...sampleDataCocaine.flatMap(d => d.values.map(v => parseFloat(v.percentage))))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const adjustedData = sampleDataCocaine;

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
              fill={index === 0 ? '#0073e6' : '#ff6600'}
              onMouseEnter={(e) => {
                ReactTooltip.show(e.target);
              }}
              onMouseLeave={(e) => {
                ReactTooltip.hide(e.target);
              }}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                <div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Cocaine positivity ${yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear?.toFixed(1)}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,20 20,10 15,10 15,0 5,0 5,10 0,10' fill='#6a0dad' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${quarterlyChange !== null ? quarterlyChange.toFixed(1) : 'N/A'}% (${quarterlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Cocaine positivity ${quarterlyChange > 0 ? 'increased' : 'decreased'} from ${prevQuarter?.toFixed(1)}% to ${curr.toFixed(1)}% in ${d.quarter}
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
            How often do people with a substance use disorder test who test positive for methamphetamine on urine drug tests also test positive for cocaine, fentanyl, or heroin: United States Q4 2022 - Q4 2024
          </h3>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '20px' }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Make a selection to change the line graph</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={selectedLines.length === Object.keys(lineColors).length}
              onChange={() => {
                if (selectedLines.length === Object.keys(lineColors).length) {
                  setSelectedLines([]); // Clear all selections
                } else {
                  setSelectedLines(Object.keys(lineColors)); // Select all options
                }
              }}
            />
            <span style={{ fontSize: '14px' }}>Select All</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <input
              type="checkbox"
              checked={selectedLines.length === 0}
              onChange={() => setSelectedLines([])} // Clear all selections
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
                    setSelectedLines(selectedLines.filter(line => line !== drug)); // Remove the drug from the selection
                  } else {
                    setSelectedLines([...selectedLines, drug]); // Add the drug to the selection
                  }
                }}
              />
              <span style={{ fontSize: '14px', color }}>{drug}</span>
            </label>
          ))}
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
                          ${lineData.name} positivity: ${percentage}%<br/>
                          Confidence interval: ${lowerCI}% - ${upperCI}%
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

export default PositiveCocaineChart;