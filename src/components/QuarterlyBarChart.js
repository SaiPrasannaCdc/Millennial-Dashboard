import { useState, useEffect } from 'react';
import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import Utils from "../shared/Utils";

const rawData = [
  { year: 2020, quarter: "Q1", value: 10000 },
  { year: 2020, quarter: "Q2", value: 14000 },
  { year: 2020, quarter: "Q3", value: 12000 },
  { year: 2020, quarter: "Q4", value: 12500 },
  { year: 2021, quarter: "Q1", value: 13000 },
  { year: 2021, quarter: "Q2", value: 13500 },
  { year: 2021, quarter: "Q3", value: 14000 },
  { year: 2021, quarter: "Q4", value: 14500 },
  { year: 2022, quarter: "Q1", value: 15000 },
  { year: 2022, quarter: "Q2", value: 15500 },
  { year: 2022, quarter: "Q3", value: 16000 },
  { year: 2022, quarter: "Q4", value: 11500 },
  { year: 2023, quarter: "Q1", value: 14000 },
  { year: 2023, quarter: "Q2", value: 12500 },
  { year: 2023, quarter: "Q3", value: 17000 },
  { year: 2023, quarter: "Q4", value: 10500 }
];


const QuarterlyBarChart = (params) => {
  const { width, height, colorScale, el, fromYear, toYear } = params;
  const [animated, setAnimated] = useState(false);

  const margin = { top: 20, right: 20, bottom: 130, left: 100 };
  const adjustedwidth = width - margin.left - margin.right;
  const adjustedheight = height - margin.top - margin.bottom;

  const yearFilter = (y) => {
    return y >= fromYear && y<=toYear;
  }
  
  const data = rawData.filter(d => yearFilter(d.year));
  const distinctYears = Array.from(new Set(data.map((d) => d.year)));

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
    domain: data.map((d) => `${d.year} ${d.quarter}`),
    range: [0, adjustedwidth],
    padding: 0.2
  });

  const yScale = scaleLinear({
    domain: [0, Math.max(...data.map((d) => d.value)) * 1.1],
    range: [adjustedheight, 0]
  });

  


  return (
    <svg width={width} height={height} className='quarterly-bar-chart'>
      <Group left={margin.left} top={margin.top}>
        {data.filter(d => yearFilter(d.year)).map((d) => (
          <path
            key={`quareter-bar-${d.year} ${d.quarter}`}
            className={`animated-bar vertical ${animated ? 'animated' : ''}`}
            style={{
              'transition': animated ? 'transform 1s ease-in-out' : '',
              'transformOrigin': `0px ${adjustedheight}px`
            }}
            d={Utils.verticalBarPath(
              xScale(`${d.year} ${d.quarter}`), 
              yScale(d.value), xScale.bandwidth(), 
              adjustedheight - yScale(d.value), 
              xScale.bandwidth() * .1
              ) 
            }
            fill={colorScale['Month']}
            data-tip={`<strong>${`${d.year} ${d.quarter}`}</strong><br/>Number of deaths: ${Number(d.value).toLocaleString()}`}
          ></path>
        ))}
        <AxisBottom
          className="label-10-axis"
          top={adjustedheight}
          scale={xScale}
          // ticks={16}
          tickValues={xScale.domain()}
          tickFormat={(d) => d.split(" ")[1]}
          hideTicks={true}
          tickLabelProps={(value, index) => ({
            textAnchor: "middle"
          })}
          strokeWidth={0.5}
        />
        <AxisLeft
          scale={yScale}
          hideTicks={true}
          tickLabelProps={() => ({
            fontSize: 10,
            textAnchor: "end",
          })}
          hideAxisLine={true}
        />
        <text 
          x={height / -2 + 75} 
          y={-75} 
          textAnchor="middle" 
          // fontSize={'medium'}
          transform="rotate(-90)">Number of overdose deaths†</text>

        {data.map((d, i) => {
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
        })}

        <line
                key={`line-${data[data.length-1].year}`}
                x1={xScale(`${data[data.length-1].year} ${data[data.length-1].quarter}`) + xScale.bandwidth() + (xScale(`${data[0].year} ${data[0].quarter}`)/2) }
                x2={xScale(`${data[data.length-1].year} ${data[data.length-1].quarter}`) + xScale.bandwidth() + (xScale(`${data[0].year} ${data[0].quarter}`)/2)}
                y1={adjustedheight} // Adjusted position to move it downwards
                y2={adjustedheight + 40}
                stroke="black"
                strokeWidth={0.5}
              />

        {Array.from(new Set(data.map((d) => d.year)))
        .filter(yearFilter).map((year, i) => (
          <text
            key={`year-${year}`}
            x={i * (adjustedwidth / distinctYears.length) + adjustedwidth / (distinctYears.length*2)}
            y={adjustedheight + 40}
            textAnchor="middle"
            fontSize={14}
          // fontWeight="bold"
          >
            {year}
          </text>
        ))}
      </Group>
      <text
        x={0}
        y={height - 40}
        textAnchor="start"
        fontSize={14}
        // fontSize={20}
      >
        Q1: January-March; Q2: April-June; Q3: July-September; Q4: October-December
      </text>
      <text
        x={0}
        y={height - 5}
        textAnchor="start"
         fontSize={14}
      >
        †Scale of the chart may change based on the data presented
      </text>
    </svg>
  );
};

export default QuarterlyBarChart;