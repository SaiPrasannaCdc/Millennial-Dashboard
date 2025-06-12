import React, { useMemo, useState, useEffect } from 'react';
import { LinePath, curveMonotoneX } from '@visx/shape';
import { scaleLinear, scaleBand } from '@visx/scale';
import { Group } from '@visx/group';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { TooltipWithBounds, useTooltip } from '@visx/tooltip';
import { fentanylPositivityData } from './data/sampleData';

const margin = { top: 20, right: 20, bottom: 50, left: 50 };
const width = 1090;
const height = 500;
const chartWidth = width - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

const color = '#005b96'; 

function FentanylPositiveChart(params) {
  const { selectedPeriod, selectedRegion } = params; 
  const [filteredData, setFilteredData] = useState(fentanylPositivityData[selectedRegion]);

  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } = useTooltip();

  useEffect(() => {
    setFilteredData(fentanylPositivityData[selectedRegion]);
  }, [selectedRegion]);

  useEffect(() => {
    let data = fentanylPositivityData[selectedRegion];
    if (selectedPeriod === 'Quarterly') {
      setFilteredData(data);
    } else if (selectedPeriod === 'Half Yearly') {
      const halfYearlyData = data.reduce((acc, curr) => {
        const year = curr.quarter.split(' ')[1];
        const half = curr.quarter.includes('Q1') || curr.quarter.includes('Q2') ? 'H1' : 'H2';
        const key = `${year} ${half}`;
        if (!acc[key]) acc[key] = { ...curr, quarter: key, percent: 0 };
        acc[key].percent += curr.percent;
        return acc;
      }, {});
      const formattedData = Object.values(halfYearlyData).map(d => ({
        ...d,
        quarter: d.quarter.includes('H1') ? `JAN-JUN ${d.quarter.split(' ')[0]}` : `JUL-DEC ${d.quarter.split(' ')[0]}`,
      }));
      setFilteredData(formattedData);
    } else if (selectedPeriod === 'Yearly') {
      const yearlyData = data.reduce((acc, curr) => {
        const year = curr.quarter.split(' ')[1];
        const key = year;
        if (!acc[key]) acc[key] = { ...curr, quarter: year, percent: 0 };
        acc[key].percent += curr.percent;
        return acc;
      }, {});
      setFilteredData(Object.values(yearlyData));
    }
  }, [selectedPeriod, selectedRegion]);

  console.log(filteredData)
  const quarters = filteredData?.map(d => d.quarter) || [];

  const xScale = useMemo(() =>
    scaleBand({
      domain: quarters,
      range: [0, chartWidth],
      padding: 0.2,
    }), [quarters]);

  const yScale = useMemo(() =>
    scaleLinear({
      domain: [0, Math.max(...filteredData?.map(d => d.percent)) + 10],
      range: [chartHeight, 0],
      nice: true,
    }), [filteredData]);

  return (
    <div style={{ position: 'relative' }}>
      {/* <select
        value={selectedRegion}
        onChange={(e) => setselectedRegion(e.target.value)}
        style={{ marginBottom: '10px', padding: '5px' }}
      >
        <option value="National">National</option>
        <option value="MIDWEST">Midwest</option>
        <option value="SOUTH">South</option>
        <option value="WEST">West</option>
      </select> */}
      <div style={{ fontFamily: 'Poppins, sans-serif', color: 'black', fontWeight: '550', fontSize: '1.5em', margin: '.5em', backgroundColor: 'rgb(113, 33, 119)', lineHeight: '1.4', padding: '15px', color: 'white' }}>
        Percent of clinical urine drug samples from people with substance use disorder positive for fentanyl: United States Q1 2023 - Q1 2025
      </div>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="gradient-fentanyl" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.8} />
            <stop offset="100%" stopColor={color} stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <Group top={margin.top} left={margin.left}>
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
          <LinePath
            data={filteredData}
            x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
            y={d => yScale(d.percent)}
            stroke="url(#gradient-fentanyl)"
            strokeWidth={3}
            curve={curveMonotoneX}
          />
          {/* Dots */}
          {filteredData.map((d, i) => (
            <circle
              key={`dot-${i}`}
              cx={xScale(d.quarter) + xScale.bandwidth() / 2}
              cy={yScale(d.percent)}
              r={6}
              fill={color}
              style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))', cursor: 'pointer' }}
              onMouseEnter={() => {
                showTooltip({
                  tooltipData: d,
                  tooltipLeft: xScale(d.quarter) + xScale.bandwidth() / 2 + margin.left,
                  tooltipTop: yScale(d.percent) + margin.top,
                });
              }}
              onMouseLeave={hideTooltip}
            />
          ))}
        </Group>
        {tooltipData && (
          <foreignObject
            x={tooltipLeft - 50}
            y={tooltipTop - 40}
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
              <div style={{ color: color }}>
                Fentanyl: <strong>{tooltipData.percent}%</strong>
              </div>
            </div>
          </foreignObject>
        )}
      </svg>
    </div>
  );
}

export default FentanylPositiveChart;
