import { useState, useEffect } from 'react';
import { Bar, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { scaleBand, scaleLinear } from '@visx/scale';

import { countCutoff } from '../constants.json';

import '../css/DrugCombinationChart.css';
import DataTable from './DataTable';

function DrugCombinationChart(params) {

  const { data, width, height, accessible, colorScale, allStatesMax, toFixed, isFinal,getAdjustedPercent } = params;

  const margin = {top: 10, bottom: 10, left: 0, right: 0, bar: 20};
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;
  const barThickness = 6;
  const barThicknessHalf = barThickness / 2;

  const xScale = scaleLinear({
    domain: [0, allStatesMax * 1.1],
    range: [ 0, adjustedWidth - 95 ]
  });

  const yScale = scaleBand({
    range: [ adjustedHeight, 0 ],
    domain: data.sort((a, b) => {if(a.deaths > b.deaths) return 1; if(a.deaths < b.deaths) return -1; return 0;}).map(d => d.drugCombination),
    padding: 0.2
  });

  let labelOverrides = {'drugCombination': 'Overdose deaths involving:', 'deaths': 'Number of deaths', 'percent': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)'};

  return width > 0 && (
    <>
      <div id="drug-combination-chart">
        {accessible ? (
            <DataTable 
              data={data.reverse().map(d => ({...d, percent: isFinal ? toFixed(getAdjustedPercent(d.percent,d.deaths)) : `${toFixed(getAdjustedPercent(d.percent,d.deaths))}% (${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}))}
              xAxisKey={'drugCombination'}
              orderedKeys={['deaths', 'percent']}
              labelOverrides={labelOverrides}
              suffixes={{'percent': isFinal ? '%' : ''}}
              transforms={{
                percent: isFinal ? num => toFixed(num) : num => num
              }}
              caption={'Drug combinations involved in overdose deaths'}
            />
          ) : (
            <svg width={width} height={height}>
              <Group top={margin.top} left={margin.left}>
                {data.map(d => (
                    <Group key={`group-${d.drugCombination}`}>
                      <Bar 
                        key={`bar-${d.drugCombination}`}
                        x={0}
                        y={yScale(d.drugCombination)}
                        width={xScale(d.percent)}
                        height={barThickness}
                        fill={colorScale.Combination}
                      />
                      <Circle
                        key={`point-${d.drugCombination}`}
                        r={11}
                        cx={xScale(d.percent)}
                        cy={yScale(d.drugCombination) + barThicknessHalf}
                        fill={colorScale.Combination}
                        data-tip={`<strong>${d.drugCombination}</strong><br/>
                        Number of deaths: ${d.deaths < countCutoff ? `< ${countCutoff}` : Number(d.deaths).toLocaleString()}<br/>
                        Percent${isFinal ? '' : ' (95% CI)'}: ${toFixed(d.percent)}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}`}
                      />
                      <text x={(xScale(d.percent) || 0) + 15} y={yScale(d.drugCombination) + barThickness + 2} fontWeight="bold" fontSize="medium" fill={colorScale.Combination}>{toFixed(getAdjustedPercent(d.percent,d.deaths))}%</text>
                      <Text width={adjustedWidth} x={0}  y={yScale(d.drugCombination) + barThickness + margin.bar} verticalAnchor="start">{d.drugCombination}</Text>
                    </Group>
                  )
                )}
              </Group>
            </svg>
          )
        }
      </div>
    </>
  );
}

export default DrugCombinationChart;