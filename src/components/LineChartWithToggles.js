import React, { useState } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import sampleData2 from './data/sampleData2';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const LineChartWithToggles = ({ width = 1100, height = 450 }) => {
  const [showLabels, setShowLabels] = useState(true);
  const [showPercentChange, setShowPercentChange] = useState(false);

  const margin = { top: 60, right: 30, bottom: 50, left: 50 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: sampleData2[0].values.map(d => d.quarter),
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...sampleData2.flatMap(d => d.values.map(v => parseFloat(v.percentage))))],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const adjustedData = sampleData2; // Removed logic for percentage change adjustment

  const renderYearlyChangeIndicators = () => {
    if (!showPercentChange) return null; // Only render indicators if the toggle is on

    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null; // Skip the first data point

        const prev = parseFloat(lineData.values[i - 1].percentage);
        const curr = parseFloat(d.percentage);
        const yearlyChange = ((curr - prev) / prev) * 100;
        const isIncrease = yearlyChange > 0;

        return (
          <Circle
            key={`indicator-${index}-${i}`}
            cx={xScale(d.quarter) + xScale.bandwidth() / 2}
            cy={yScale(curr)}
            r={4}
            fill={index === 0 ? '#0073e6' : '#ff6600'}
            onMouseEnter={(e) => {
              e.target.setAttribute('data-tip', `<div style='display: flex; align-items: center; border: 1px solid #bdbdbd; border-radius: 4px; padding: 10px; background-color: #fff; max-width: 280px;'>
                <div style='display: flex; flex-direction: column; align-items: center; margin-right: 10px;'>
                  <svg width='40' height='40'>
                    <polygon points='20,${isIncrease ? "0" : "40"} 40,${isIncrease ? "40" : "0"} 0,${isIncrease ? "40" : "0"}' fill='#411B6D'></polygon>
                    <text x='20' y='25' text-anchor='middle' font-size='12' fill='#fff' font-weight='bold'>${yearlyChange.toFixed(1)}%</text>
                  </svg>
                </div>
                <div style='font-size: 14px; color: black; line-height: 1.5;'>
                  <strong>Yearly change</strong><br/>
                  Fentanyl positivity ${isIncrease ? 'increased' : 'decreased'} from ${prev.toFixed(1)}% to ${curr.toFixed(1)}% in ${d.quarter} ${d.year}.
                </div>
              </div>`);
              ReactTooltip.hide();
              ReactTooltip.rebuild();
            }}
            onMouseLeave={(e) => ReactTooltip.hide(e.target)}
          />
        );
      });
    });
  };

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

        if (isNaN(xPosition) || isNaN(yPosition)) return null; // Ensure valid positions

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
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Fentanyl positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='#6a0dad' transform='rotate(${quarterlyChange !== null && quarterlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${quarterlyChange !== null ? quarterlyChange.toFixed(1) : 'N/A'}% (${quarterlyChange !== null && quarterlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Fentanyl positivity ${quarterlyChange !== null && quarterlyChange > 0 ? 'increased' : 'decreased'} from ${prevQuarter !== null ? prevQuarter.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl on urine drug tests:
          </h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>
            Millennium Health, United States Q4 2022 - Q4 2024
          </p>
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

          {adjustedData.map((lineData, index) => (
            <React.Fragment key={index}>
              <LinePath
                data={lineData.values}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => yScale(parseFloat(d.percentage))}
                stroke={index === 0 ? '#0073e6' : '#ff6600'}
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
                      fill={index === 0 ? '#0073e6' : '#ff6600'}
                      data-tip={`<div style='text-align: left;'>
                        <strong>${d.quarter}</strong><br/>
                        Fentanyl positivity: ${percentage}%<br/>
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
          {renderYearlyChangeIndicators()}
          {renderChangeIndicators()}
        </Group>
      </svg>

      {/* Add a legend below the chart to display color labels */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {adjustedData.map((lineData, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: index === 0 ? '#0073e6' : '#ff6600', marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#333' }}>{lineData.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LineChartWithToggles;