import React, { useMemo, useState, useEffect } from 'react';
import { LinePath, curveMonotoneX } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { Positivity1Data } from './data/sampleData';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
 
const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 1090;
const height = 500;
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;
 
const colors = {
  Heroin: '#FF5733',
  Cocaine: '#33FF57',
  Methamphetamine: '#3357FF',
};
 
function LineChart({ selectedPeriod, selectedRegion }) {
  const [aggregatedData, setAggregatedData] = useState([]);
 
  useEffect(() => {
    const regionFilteredData = Positivity1Data.filter(d => d.USregion === selectedRegion);
    if (selectedPeriod === 'Quarterly') {
      setAggregatedData(regionFilteredData);
    } else if (selectedPeriod === 'HalfYearly') {
      const halfYearlyData = regionFilteredData.reduce((acc, curr) => {
        const year = curr.quarter.split(' ')[1];
        const half = curr.quarter.includes('Q1') || curr.quarter.includes('Q2') ? 'H1' : 'H2';
        const key = `${curr.drug_name} ${year} ${half}`;
        if (!acc[key]) acc[key] = { ...curr, quarter: `${year} ${half}`, percent_pos: 0 };
        acc[key].percent_pos += curr.percent_pos; // Fix field name
        return acc;
      }, {});
      const formattedData = Object.values(halfYearlyData).map(d => ({
        ...d,
        quarter: d.quarter.includes('H1') ? `JAN-JUN ${d.quarter.split(' ')[0]}` : `JUL-DEC ${d.quarter.split(' ')[0]}`,
      }));
      setAggregatedData(formattedData);
    } else if (selectedPeriod === 'Yearly') {
      const yearlyData = regionFilteredData.reduce((acc, curr) => {
        const year = curr.quarter.split(' ')[1];
        const key = `${curr.drug_name} ${year}`;
        if (!acc[key]) acc[key] = { ...curr, quarter: year, percent_pos: 0 };
        acc[key].percent_pos += curr.percent_pos; // Fix field name
        return acc;
      }, {});
      setAggregatedData(Object.values(yearlyData));
    }
  }, [selectedPeriod, selectedRegion]);
 
  const heroinData = aggregatedData.filter(d => d.drug_name === 'Heroin');
  const cocaineData = aggregatedData.filter(d => d.drug_name === 'Cocaine');
  const methData = aggregatedData.filter(d => d.drug_name === 'Methamphetamine');
 
  const allData = [...heroinData, ...cocaineData, ...methData];
  const quarters = [...new Set(allData.map(d => d.quarter))];
 
  const xScale = useMemo(() =>
    scaleBand({
      domain: quarters,
      range: [0, chartWidth],
      padding: 0.2,
    }), [quarters]);
 
  const yScale = useMemo(() =>
    scaleLinear({
      domain: [0, Math.max(...allData.map(d => d.percent_pos)) + 10],
      range: [chartHeight, 0],
      nice: true,
    }), [allData]);
 
  const lineData = [
    { name: 'Heroin', data: heroinData },
    { name: 'Cocaine', data: cocaineData },
    { name: 'Methamphetamine', data: methData },
  ];
 
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip();
 
  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <defs>
          {Object.keys(colors).map((drug, index) => (
            <linearGradient id={`gradient-${drug}`} key={index} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={colors[drug]} stopOpacity={0.8} />
              <stop offset="100%" stopColor={colors[drug]} stopOpacity={0.2} />
            </linearGradient>
          ))}
        </defs>
        <Group top={margin.top} left={margin.left}>
          {/* Y-Axis */}
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
            tickLabelProps={() => ({
              fontSize: 10,
              fill: 'black',
              textAnchor: 'end',
              dx: -5,
              dy: 4,
            })}
            stroke="#333"
            tickStroke="#333"
          />
          {/* X-Axis */}
          <AxisBottom
            top={chartHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 10,
              fill: 'black',
              textAnchor: 'middle',
              dy: 10,
            })}
            stroke="#333"
            tickStroke="#333"
          />
          {/* Lines */}
          {lineData.map((line, index) => (
            <React.Fragment key={index}>
              <LinePath
                data={line.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => yScale(d.percent_pos)}
                stroke={`url(#gradient-${line.name})`}
                strokeWidth={3}
                curve={curveMonotoneX}
              />
              {/* Dots */}
              {line.data.map((d, i) => (
                <circle
                  key={`dot-${index}-${i}`}
                  cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                  cy={yScale(d.percent_pos)}
                  r={6}
                  fill={colors[line.name]}
                  style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', cursor: 'pointer' }}
                  onMouseEnter={() => {
                    showTooltip({
                      tooltipData: { quarter: d.quarter, drug: line.name, percent_pos: d.percent_pos },
                      tooltipLeft: xScale(d.quarter) + xScale.bandwidth() / 2 + margin.left,
                      tooltipTop: yScale(d.percent_pos) + margin.top - 20,
                    });
                  }}
                  onMouseLeave={hideTooltip}
                />
              ))}
            </React.Fragment>
          ))}
        </Group>
        {/* Tooltip */}
        {tooltipData && (
          <g>
            <foreignObject
              x={tooltipLeft - 50} // Center tooltip horizontally
              y={tooltipTop - 40} // Adjusted to position tooltip higher than the dot
              width={100}
              height={50}
              style={{ pointerEvents: 'none' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '5px',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
                  fontSize: '10px',
                  lineHeight: '1.2',
                  textAlign: 'center',
                }}
              >
                <div><strong>{tooltipData.quarter}</strong></div>
                <div style={{ color: colors[tooltipData.drug] }}>
                  {tooltipData.drug}: <strong>{tooltipData.percent_pos}%</strong>
                </div>
              </div>
            </foreignObject>
          </g>
        )}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        {lineData.map((line, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '12px', height: '12px', backgroundColor: colors[line.name], marginRight: '5px' }}></div>
            <span style={{ fontSize: '12px', color: '#333' }}>{line.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
 
function Positivefentanyl({ selectedPeriod, selectedRegion }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ fontFamily: 'Poppins, sans-serif', color: 'black', fontWeight: '550', fontSize: '1.5em', margin: '.5em', backgroundColor: 'rgb(113, 33, 119)', lineHeight: '1.4', padding: '15px', color: 'white' }}>
        Percent of positive fentanyl samples from people with substance use disorder that were also positive for heroin, cocaine, or methamphetamine: United States Q1 2023 – Q1 2025
      </div>
      <LineChart selectedPeriod={selectedPeriod} selectedRegion={selectedRegion} />
    </div>
  );
}

export default Positivefentanyl;


