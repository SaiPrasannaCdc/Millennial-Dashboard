import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { fentanylPositivityData } from './data/sampleData';

const margin = { top: 10, right: 30, bottom: 40, left: 50 }; // { for reducing top margin }
const width = 500; // {Reducing width}
const height = 180; // ( reducing height)
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const colorScale = [
  '#D6EAF6', '#BFDFF1', '#A3D2EC', '#A3D2EC',
  '#88C5E7', '#6EB8E1', '#379FD7', '#0F6DB4'
];

function FentanylPositiveChart() {
  const xScale = useMemo(() => 
    scaleBand({
      domain: fentanylPositivityData?.map(d => d.quarter) || [],
      padding: 0.2,
      range: [0, chartWidth], // Uses chartWidth
    }), [fentanylPositivityData, chartWidth]);

  const yScale = useMemo(() =>
    scaleLinear({
      domain: [0, 15],
      nice: true,
      range: [chartHeight, 0],
    }), []);

  if (!fentanylPositivityData || !Array.isArray(fentanylPositivityData)) {
    return <div>Error: Data is unavailable.</div>;
  }

  return (
    <div>
      <div style={{ textAlign: 'left', color: 'black', fontWeight: 'bold', fontSize: '16px', marginBottom: '5px', marginLeft: '0px' }}>
        <div>Percent of clinical urine drug samples from people with</div>
        <div style={{ marginLeft: '30px' }}>substance use disorder positive for fentanyl:</div>
        <div style={{ marginLeft: '70px' }}>United States Q1 2023 - Q1 2025</div>
      </div>
      <svg width={width} height={height}>
        <Group top={margin.top} left={margin.left}>
          {fentanylPositivityData.map((d, i) => {
            const barHeight = chartHeight - yScale(d.percent) - 5; // Reduce space between bars and x-axis
            const x = xScale(d.quarter);
            const y = yScale(d.percent) - 5; // Move bars slightly closer to the x-axis
            const barWidth = xScale.bandwidth();
            return (
              <React.Fragment key={`bar-${i}`}>
                <Bar
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colorScale[i % colorScale.length]}
                  stroke="#333"        // dark gray/black border
                  strokeWidth={0.5}    // thin, just like the wireframe
                />
                <text
                  x={x + barWidth / 2}
                  y={y + barHeight / 2 - 30} // Adjusted position for text
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight="bold"
                  fill="black"
                >
                  {`${d.percent}%`}
                </text>
              </React.Fragment>
            );
          })}
          <AxisLeft
            scale={yScale}
            tickValues={[0, 2, 4, 6, 8, 10, 12, 14]} // Static tick values
            tickFormat={(value) => `${value}%`} // Add % sign beside each number
            tickLabelProps={() => ({
              fontSize: 12,
              fontWeight: "bold", // Make y-axis labels bold
              fill: "black",
              textAnchor: "end",
              dx: -5,
              dy: 4,
            })}
            stroke="#333"
            tickStroke="#333"
            tickLength={5} // Shorten the tick strokes
          />
          <text
            x={-margin.left + 10} // Move closer to the Y-axis
            y={chartHeight / 2 + 10} // Ensure proper vertical alignment
            textAnchor="middle"
            fontSize={12}
            fontWeight="bold"
            fill="black"
            transform={`rotate(-90, ${-margin.left + 10}, ${chartHeight / 2 + 10})`} // Rotate the text vertically
          >
            % Positive
          </text>
          <AxisBottom
            top={chartHeight}
            scale={xScale}
            tickFormat={() => ''}
            tickLabelProps={() => ({
              fontSize: 12,
              fontWeight: "bold",
              fill: "black",
              textAnchor: "end", // Align labels to the end
              transform: "rotate(-40)", // Rotate labels to prevent overlap
              dx: -5, // Adjust horizontal position
              dy: 10, // Increase vertical position to prevent cutting
            })}
            stroke="#333"
            tickStroke="#333"
            tickLength={5} // Shorten the tick strokes
          />
          {xScale.domain().map((label) => (
            <text
              key={label}
              x={xScale(label) + xScale.bandwidth() / 2}
              y={chartHeight + margin.bottom / 1.5} // Adjusted to move titles further down
              textAnchor="middle"
              transform={`rotate(-40, ${xScale(label) + xScale.bandwidth() / 2}, ${chartHeight + margin.bottom / 1.5})`}
              fontSize={12}
              fontWeight="bold" // Make custom x-axis labels bold
              fill="black"
            >
              {label}
            </text>
          ))}
        </Group>
      </svg>
    </div>
  );
}

export default FentanylPositiveChart;