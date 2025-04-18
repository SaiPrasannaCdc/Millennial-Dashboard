import { useState, useEffect } from 'react';
import { BarStackHorizontal } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear, scaleOrdinal } from '@visx/scale';

import { countCutoff } from '../constants.json';

import DataTable from './DataTable';
import DataTableMY from './DataTableMY';
import '../css/OpioidStimulantChart.css';
import { MultiYearAccessFunctions } from '../utility'

function OpioidStimulantChart(params) {

  const [ animated, setAnimated ] = useState(false);

  const { dataMY, data, width, height, el, accessible, colorScale, toFixed, isFinal, getAdjustedPercent, state, years } = params;

  const order = {'osPercent': 0, 'oPercent': 1, 'sPercent': 2, 'nPercent': 3};
  const keys = Object.keys(data[0]).filter(key => key.indexOf('Percent') !== -1);
  const margin = {top: 10, bottom: 40, left: 15, right: 20};
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleLinear({
    domain: [0, 100],
    range: [0, adjustedWidth]
  });

  const yScale = scaleBand({
    domain: [1,1],
    range: [1,1]
  });

  const onScroll = () => {
    if(el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top + 50){
      setAnimated(true);
    }
  };

  useEffect(() => {
    setAnimated(false);
  }, [isFinal])

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    setTimeout(onScroll, 50); // eslint-disable-next-line
  }, []);

  keys.sort((a, b) => {
    if(order[a] < order[b]) return -1;
    if(order[a] > order[b]) return 1;
    return 0;
  });

  const getYearsArray = () => {

    let myArray = [];
    
    let yr = parseInt(years['yearFrom'].yearFrom);
    myArray.push(yr);
    while (yr < parseInt(years['yearTo'].yearTo))
    {
      yr = yr + 1;
      myArray.push(yr);
    }
    return myArray;
  };

  const getCombinationsArray = () => {
    let myArray = [];
    let yr = parseInt(years['yearFrom'].yearFrom);
 
    myArray.push(dataMY[yr][state].horizontalBarData[0].osName);
    myArray.push(dataMY[yr][state].horizontalBarData[0].oName);
    myArray.push(dataMY[yr][state].horizontalBarData[0].sName);
    myArray.push(dataMY[yr][state].horizontalBarData[0].nName);
    
    return myArray;
  };

  return width > 0 && (
    <>
      <div id="opioid-stimulant-chart">
        {accessible ? ((years != undefined && years != null) ? (
          <DataTableMY
            data={MultiYearAccessFunctions.generateMultiYearCombData(dataMY, state, getYearsArray(), getCombinationsArray(), 2)}
            xAxisKey={'name'}
            labelOverrides={{'name': 'Overdose deaths involving', 
              'deaths': 'Number of deaths', 
              'percent': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
              'deaths1': 'Number of deaths',
              'percent1': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
              'deaths2': 'Number of deaths',
              'percent2': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
              'deaths3': 'Number of deaths',
              'percent3': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
              'deaths4': 'Number of deaths',
              'percent4': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
            }}
            suffixes={{
              'percent1': isFinal ? '%' : '',
              'percent2': isFinal ? '%' : '',
              'percent3': isFinal ? '%' : '',
              'percent4': isFinal ? '%' : '',
            }}
            transforms={{
              percent1: isFinal ? num => toFixed(num) : num => num,
              percent2: isFinal ? num => toFixed(num) : num => num,
              percent3: isFinal ? num => toFixed(num) : num => num,
              percent4: isFinal ? num => toFixed(num) : num => num,
            }}
            caption={'Opioid and stimulant breakdown in overdose deaths'}
            years={years}
            extraCols = {[`Percentage change in percent, ${years['yearTo'].yearTo} vs. ${years['yearFrom'].yearFrom}`, `Percent of deaths, ${years['yearFrom'].yearFrom} - ${years['yearTo'].yearTo}`]}
          />
        ) : <DataTable
        data={['os', 'o', 's', 'n'].map(key => ({
          deaths: data[0][`${key}Count`],
          percent: isFinal ? toFixed(getAdjustedPercent( data[0][`${key}Percent`], data[0][`${key}Count`])) : `${toFixed(getAdjustedPercent(data[0][`${key}Percent`], data[0][`${key}Count`]))}% (${toFixed(data[0][`${key}low_ci`])}%, ${toFixed(data[0][`${key}high_ci`])}%)`,
          name: data[0][`${key}Name`]
        }))}
        xAxisKey={'name'}
        labelOverrides={{'name': 'Overdose deaths involving:', 'deaths': 'Number of deaths', 'percent': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)'}}
        suffixes={{'percent': isFinal ? '%' : ''}}
        transforms={{
          percent: isFinal ? num => toFixed(num) : num => num
        }}
        caption={'Opioid and stimulant breakdown in overdose deaths'}
      />) : (
          <svg width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
              <BarStackHorizontal
                data={data}
                keys={keys}
                yScale={yScale}
                xScale={xScale}
                color={() => {}}
                y={() => 1}>
                {barStacks =>
                  barStacks.map(barStack =>
                    barStack.bars.map(bar => {
                      const name = bar.bar.data[bar.key.replace('Percent', 'Name')];
                      const rawCount = bar.bar.data[bar.key.replace('Percent', 'Count')];
                      const rawPercent = bar.bar.data[bar.key];
                      const percent = toFixed(getAdjustedPercent(rawPercent,rawCount));
                      const cornerRadius = adjustedHeight * .1;
                      const xEnd = bar.x + bar.width;
                      const yEnd = bar.y + adjustedHeight;

                      let count;
                      if(rawCount < countCutoff){
                        count = '< ' + countCutoff;
                      } else {
                        count = rawCount;
                      }

                      return (
                        <Group key={`barstack-horizontal-${barStack.index}-${bar.index}`}>
                          <path 
                            className={`animated-bar ${animated ? 'animated' : ''}`}
                            style={{
                              'transition': animated ? 'transform 1s ease-in-out' : '',
                              'transformOrigin': `${adjustedWidth / 2}px 0px`
                            }}
                            d={barStack.index === 0 ? 
                              `M${bar.x + cornerRadius} ${bar.y}
                                L${xEnd} ${bar.y}
                                L${xEnd} ${yEnd}
                                L${bar.x + cornerRadius} ${yEnd}
                                Q${bar.x} ${yEnd}, ${bar.x} ${yEnd - cornerRadius}
                                L${bar.x} ${bar.y + cornerRadius}
                                Q${bar.x} ${bar.y}, ${bar.x + cornerRadius} ${bar.y}` : 
                            (barStack.index === (barStacks.length - 1) ? 
                              `M${bar.x} ${bar.y}
                                L${xEnd - cornerRadius} ${bar.y}
                                Q${xEnd} ${bar.y}, ${xEnd} ${bar.y + cornerRadius}
                                L${xEnd} ${yEnd - cornerRadius}
                                Q${xEnd} ${yEnd}, ${xEnd - cornerRadius} ${yEnd}
                                L${bar.x} ${yEnd}
                                L${bar.x} ${bar.y}` : 
                              `M${bar.x} ${bar.y} 
                                L${xEnd} ${bar.y} 
                                L${xEnd} ${yEnd}
                                L${bar.x} ${yEnd}
                                L${bar.x} ${bar.y}`)
                            }
                            fill={colorScale[name]}
                            data-tip={`<strong>${name}</strong><br/>
                            Number of deaths: ${Number(count).toLocaleString()}<br/>
                            Percent${isFinal ? '' : ' (95% CI)'}: ${percent}% ${isFinal ? '' : `(${toFixed(bar.bar.data[`${bar.key.replace('Percent', '')}low_ci`])}%, ${toFixed(bar.bar.data[`${bar.key.replace('Percent', '')}high_ci`])}%)`}`}
                          />
                          {bar.width > 50 && (
                            <text
                              x={bar.x + (bar.width / 2)}
                              y={bar.y + (adjustedHeight / 2) + 5}
                              textAnchor="middle"
                              fill={bar.key === 'nPercent' ? 'black' : 'white'}
                              pointerEvents="none"
                            >{percent}%</text>
                          )}
                        </Group>
                    )}),
                  )
                }
              </BarStackHorizontal>
              <AxisBottom
                top={adjustedHeight + 10}
                scale={xScale}
                tickStroke="none"
                tickValues={[0, 50, 100]}
                tickFormat={val => val + '%'}
                tickLabelProps={() => ({
                  fontSize: 'medium',
                  textAnchor: 'middle',
                  transform: 'translate(0, 10)'
                })}
              />
            </Group>
          </svg>
        )}
      </div>
    </>
  );
}

export default OpioidStimulantChart;