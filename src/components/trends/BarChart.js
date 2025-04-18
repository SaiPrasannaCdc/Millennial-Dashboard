import React, { useState, useEffect } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand } from '@visx/scale';
import Utils from '../../shared/Utils';

function BarChart(params) {
  const { width, height, colorScale, valueProp, el, fromYear, toYear, data, selectedMetric } = params;
  const [animated, setAnimated] = useState(false);
  const margin = { top: 20, right: 20, bottom: 60, left: 100 };
  const adjustedwidth = width - margin.left - margin.right;
  const adjustedheight = height - margin.top - margin.bottom;

  // console.log(data)
  const yearFilter = (y) => {
    return y >= fromYear && y<=toYear;
  }
  
  // const distinctYears = Array.from(new Set(data.map((d) => d.year)));

  const onScroll = () => {
    if (el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top) {
      window.removeEventListener('scroll', onScroll);
      setAnimated(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    setTimeout(onScroll, 50); // eslint-disable-next-line
  }, []);

  // Scales
  const xScale = scaleBand({
    domain: data.filter(d=> d.year>=fromYear && d.year <=toYear).map((d) => d.year),
    range: [0, adjustedwidth],
    padding: 0.2
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.filter(d=> d.year>=fromYear && d.year <=toYear).map((d) => d[valueProp])) * 1.1],
    range: [adjustedheight, 0]
  });

  return (
    <svg width={width} height={height} className='yearly-bar-chart'>
      <Group left={margin.left} top={margin.top}>
        {data.filter(d => yearFilter(d.year)).map((d) => (
          <path
            key={`yearly-bar-${d.year}`}
            className={`animated-bar vertical ${animated ? 'animated' : ''}`}
            style={{
              'transition': animated ? 'transform 1s ease-in-out' : '',
              'transformOrigin': `0px ${adjustedheight}px`
            }}
            d={Utils.verticalBarPath(
              xScale(d.year), 
              yScale(d[valueProp]), xScale.bandwidth(), 
              adjustedheight - yScale(d[valueProp]), 
              xScale.bandwidth() * .1
              ) 
            }
            fill={colorScale['Month']}
            data-tip={ selectedMetric == 'percent' ?`<strong>${`${d.year}`}</strong><br/>Percent: ${d[valueProp].toFixed(1)}%` :`<strong>${`${d.year}`}</strong><br/>Number of deaths: ${Number(d[valueProp]).toLocaleString()}`}
          ></path>
        ))}
        <AxisBottom
          className="label-10-axis"
          top={adjustedheight}
          scale={xScale}
          // ticks={16}
          tickValues={xScale.domain()}
          //tickFormat={(d) => d.split(" ")[1]}
          hideTicks={true}
          tickLabelProps={(value, index) => ({
            textAnchor: "middle"
          })}
          strokeWidth={0.5}
        />
        <text 
          x={width / 2 - 75} 
          y={adjustedheight + 46} 
          textAnchor="middle" 
          >Year of death</text>
        <AxisLeft
          scale={yScale}
          hideTicks={true}
          tickLabelProps={() => ({
            fontSize: 10,
            textAnchor: "end",
          })}
          hideAxisLine={true}
          tickFormat={(value) => 
            valueProp === 'percent' ? `${value}%` : value
          }
        />
        <text 
          x={height / -2 + 75} 
          y={-75} 
          textAnchor="middle" 
          // fontSize={'medium'}
          transform="rotate(-90)">{selectedMetric =='percent'? 'Percent': 'Number' } of overdose deaths†</text>

        {/* {data.map((d, i) => {
          if (i % 4 === 0) {
            return (
              <line
                key={`line-${d.year}`}
                x1={xScale(`${d.year} ${d.quarter}`) - (xScale(`${data[0].year} ${data[0].quarter}`)/2)}
                x2={xScale(`${d.year} ${d.quarter}`) - (xScale(`${data[0].year} ${data[0].quarter}`)/2)}
                y1={adjustedheight} // Adjusted position to move it downwards
                y2={adjustedheight + 40}
                stroke="black"
                strokeWidth={0.5}
              />
            );
          }
          return null;
        })} */}

        {/* <line
                key={`line-${data[data.length-1].year}`}
                x1={xScale(`${data[data.length-1].year} ${data[data.length-1].quarter}`) + xScale.bandwidth() + (xScale(`${data[0].year} ${data[0].quarter}`)/2) }
                x2={xScale(`${data[data.length-1].year} ${data[data.length-1].quarter}`) + xScale.bandwidth() + (xScale(`${data[0].year} ${data[0].quarter}`)/2)}
                y1={adjustedheight} // Adjusted position to move it downwards
                y2={adjustedheight + 40}
                stroke="black"
                strokeWidth={0.5}
              /> */}

       
      </Group>
      
    </svg>
  );
}

export default BarChart;
