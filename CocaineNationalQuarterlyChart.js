
import React from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import HeroinSecondLineChartBelowCocaine from './components/HeroinSecondLineChartBelowCocaine';

const cocaineNationalChartData = [
  // NATIONAL Cocaine data
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 28.7, ciLower: 26.9, ciUpper: 30.5 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 32.7, ciLower: 30.8, ciUpper: 34.6 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 31.2, ciLower: 29.4, ciUpper: 33.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 31.2, ciLower: 29.4, ciUpper: 33.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 32.1, ciLower: 30.4, ciUpper: 33.9 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 32.2, ciLower: 30.4, ciUpper: 34.0 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 33.6, ciLower: 31.8, ciUpper: 35.4 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 34.4, ciLower: 32.8, ciUpper: 36.1 },
  { region: 'NATIONAL', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 33.4, ciLower: 31.8, ciUpper: 35.0 },
];

const lineColors = {
  'Fentanyl': '#e74c3c',
  'Cocaine': '#2980b9',
  'Methamphetamine': '#27ae60',
  'Heroin and Stimulants': '#8e44ad',
};

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

function alignDataToQuarters(data, quarters) {
  const drugs = [...new Set(data.map(d => d.drug))];
  return drugs.map(drug => ({
    label: drug,
    color: lineColors[drug],
    data: quarters.map(q => {
      const found = data.find(d => d.drug === drug && d.quarter === q);
      return found ? found : { quarter: q, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

const CocaineNationalQuarterlyChart = (props) => {
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const width = 1100;
  const height = 450;
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const regionData = cocaineNationalChartData.filter(d => d.region === 'NATIONAL');
  const datasets = alignDataToQuarters(regionData, allQuarters);

  const xDomain = allQuarters;
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...datasets.flatMap(ds => ds.data.map(d => d.percentage || 0)), 100);
  const yScale = scaleLinear({
    domain: [0, yMax > 100 ? yMax : 100],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const region = props.region ? props.region.toUpperCase() : 'NATIONAL';

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            % of people with substance use disorder who test positive for cocaine: NATIONAL Q4 2022 - Q4 2024
          </h3>
        </div>
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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'end', dx: -6, dy: 3, fill: '#222' })} />
          <AxisBottom top={adjustedHeight} scale={xScale} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'middle', dy: 10 })} />
          {datasets.map((ds, idx) => (
            <React.Fragment key={ds.label}>
              <LinePath
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={ds.color}
                strokeWidth={3}
                curve={null}
              />
              {ds.data.map((d, i) => {
                if (d.percentage !== null) {
                  return (
                    <Circle
                      key={`circle-${ds.label}-${i}`}
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={ds.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
            </React.Fragment>
          ))}
        </Group>
      </svg>
      <HeroinSecondLineChartBelowCocaine region={region} width={1100} height={450} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default CocaineNationalQuarterlyChart;