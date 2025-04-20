import React, { useMemo } from 'react';
import { Bar } from '@visx/shape';
import { scaleBand, scaleLinear } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Positivity1Data } from './data/sampleData'; // Import the correct data

const margin = { top: 20, right: 20, bottom: 30, left: 40 }; // Reduced bottom margin for better alignment
const width = 370; // Width for each chart
const height = 250; // Height for each chart
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const colorScale = [
  '#D6EAF6', '#BFDFF1', '#A3D2EC', '#A3D2EC',
  '#88C5E7', '#6EB8E1', '#379FD7', '#0F6DB4'
];

function BarChart({ data, title, hideXAxis, hideYAxis }) {
  const xScale = useMemo(() =>
    scaleBand({
      domain: data?.map(d => d.quarter) || [],
      padding: 0.2, // Adjusted padding for better spacing
      range: [0, chartWidth],
    }), [data]);

  const yScale = useMemo(() =>
    scaleLinear({
      domain: [0, Math.max(...data.map(d => d.percent)) + 10], // Add padding to the domain
      nice: true,
      range: [chartHeight, 10], // Add padding at the bottom of the range
    }), [data]);

  return (
    <div style={{ width: `${width - 10}px`, margin: '0px' }}> {/* Reduced width and removed margin */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '14px', marginBottom: '0px' }}>{title.toUpperCase()}</div> {/* Removed marginBottom */}
      <svg width={width - 10} height={height}> {/* Reduced width */}
        <Group top={margin.top} left={hideYAxis ? 0 : margin.left}>
          {data.map((d, i) => {
            const barHeight = chartHeight - yScale(d.percent);
            const x = xScale(d.quarter);
            const y = yScale(d.percent);
            const barWidth = xScale.bandwidth();
            return (
              <React.Fragment key={`bar-${i}`}>
                <Bar
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight - 10} // Reduce height slightly to lift bars
                  fill={colorScale[i % colorScale.length]}
                  stroke="#333"
                  strokeWidth={0.5}
                />
                <text
                  x={x + barWidth / 2}
                  y={y + barHeight / 2} // Position text inside the bar
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight="bold"
                  fill="black" // Change text color to white for visibility
                >
                  {`${d.percent}%`}
                </text>
              </React.Fragment>
            );
          })}
          {!hideYAxis && (
            <AxisLeft
              scale={yScale}
              left={0} // Ensure the y-axis starts at the left edge
              
              tickFormat={(value) => `${Math.round(value)}%`} // Format labels as percentages
              tickLabelProps={() => ({
                fontSize: 10,
                fontWeight: "bold",
                fill: "black",
                textAnchor: "end",
                dx: -5,
                dy: 4,
              })}
              stroke="#333"
              tickStroke="#333"
              tickLength={5}
            />
          )}
          {!hideXAxis && (
            <AxisBottom
              top={chartHeight} // Ensure the x-axis is positioned at the bottom of the chart
              scale={xScale}
              tickLabelProps={() => ({
                fontSize: 10,
                fontWeight: "bold",
                fill: "black",
                textAnchor: "end", // Align text to the end for better rotation
                dy: 10,
                transform: "rotate(0)" // Rotate labels by -45 degrees
              })}
              stroke="#333"
              tickStroke="#333"
              tickLength={5}
            />
          )}
        </Group>
      </svg>
    </div>
  );
}

function Positivefentanyl() {
  const heroinData = Positivity1Data.filter(d => d.drug_name === 'Heroin');
  const cocaineData = Positivity1Data.filter(d => d.drug_name === 'Cocaine');
  const methData = Positivity1Data.filter(d => d.drug_name === 'Methamphetamine');

  const xScale = useMemo(() =>
    scaleBand({
      
    }), [heroinData]);

  return (
    <div style={{ width: '100%' }}> {/* Set the container to full width */}
      <div style={{ display: 'flex', fontFamily: 'Poppins, sans-serif', color: 'white', fontWeight: '550', fontSize: '1.5em', margin: '.5em', backgroundColor: 'rgb(113, 33, 119)', lineHeight: '1.4', borderBottom: '0px', letterSpacing: '-.03px', padding: '15px' }}>
        <div>Percent of positive fentanyl samples from people with substance use <br /> disorder that were also positive for heroin, cocaine, or methamphetamine: United States Q1 2023 – Q1 2025
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-evenly', gap: '20px', marginBottom: '20px' }}> {/* Adjusted layout */}
        <div style={{ flex: 1, textAlign: 'center' }}> {/* Centered each chart */}
          <BarChart data={heroinData} title="Heroin" hideXAxis={false} hideYAxis={false} />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}> {/* Centered each chart */}
          <BarChart data={cocaineData} title="Cocaine" hideXAxis={false} hideYAxis={true} />
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}> {/* Centered each chart */}
          <BarChart data={methData} title="Methamphetamine" hideXAxis={false} hideYAxis={true} />
        </div>
      </div>
      <svg width={width * 3 + margin.left + margin.right} height={60} style={{ marginTop: '10px' }}> {/* Adjusted marginTop */}
        <Group top={10} left={margin.left}> {/* Centered shared x-axis */}
          <AxisBottom
            top={0}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 10,
              fontWeight: "bold",
              fill: "black",
              textAnchor: "middle",
              dy: 10,
              transform: "rotate(-40)" // Rotate labels for better visibility
            })}
            stroke="#333"
            tickStroke="#333"
            tickLength={5}
          />
        </Group>
      </svg>
    </div>
  );
}

export default Positivefentanyl;

