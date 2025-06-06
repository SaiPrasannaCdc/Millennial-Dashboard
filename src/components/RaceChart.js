import { useState, useEffect } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisLeft } from '@visx/axis';

import Utils from '../shared/Utils';
import { rateCutoff, rateCutoffLabel, countCutoff } from '../constants.json';

import '../css/RaceChart.css';

function RaceChart(params) {
  
  const { data, dataRates, maxes, width, height, metric, state, colorScale, el, toFixed, 
    isFinal, getAdjustedPercent } = params;

  const [ animated, setAnimated ] = useState(false);

  const tooltipLabels = {
    'AI/AN, non-Hispanic': 'American Indian/Alaska Native, non-Hispanic',
    'NH/PI, non-Hispanic': 'Native Hawaiian/Pacific Islander, non-Hispanic'
  };

  const axisLabels = {
    'AI/AN, non-Hispanic': 'AI/AN',
    'Asian, non-Hispanic': 'Asian',
    'Black, non-Hispanic': 'Black',
    'Multi-race, non-Hispanic': 'Multi-race',
    'NH/PI, non-Hispanic': 'NH/PI',
    'White, non-Hispanic': 'White',
    'Other, non-Hispanic': 'Other'
  };

  const sort = (array) => {
    return array.sort((a,b) => {
      const aRace = tooltipLabels[a.race] || a.race;
      const bRace = tooltipLabels[b.race] || b.race;
      if(aRace === 'Hispanic') {
        return -1;
      } else if(bRace === 'Hispanic'){
        return 1;
      }
      return (aRace < bRace) ? 1 : -1;
    })
  };

  const sortedData = sort(data);
  const sortedDataRates = sort(dataRates);

  const currentData = metric === 'rate' ? sortedDataRates : sortedData;
  const otherData = metric === 'rate' ? sortedData : sortedDataRates;

  const margin = {top: 10, bottom: 10, left: 100, right: 10};
  const adjustedHeight = height - margin.top - margin.bottom;
  const adjustedWidth = width - margin.left - margin.right;

  const isSuppressed = (value, otherValue) => {
    if(metric === 'rate' && otherValue.deaths <= rateCutoff) return true;
    return value.deaths < countCutoff ? true : false;
  };

  const getData = (datum, otherDatum, label) => {
    if(metric === 'rate'){
      if(otherDatum.deaths <= rateCutoff) return label === true ? '*' : 0;
      return (label === true ? toFixed(datum.rate) : datum.rate);
    }
    if(datum.deaths < countCutoff) return label === true ? '*' : 0
    return (label === true ? `${toFixed(getAdjustedPercent(datum.percent, datum.deaths))}%` : datum.percent);
  };

  const xScale = scaleLinear({
    domain: [ 0, maxes[metric] ],
    range: [ 5, adjustedWidth - 45 ]
  });
  
  const yScale = scaleBand({
    range: [ adjustedHeight, 0 ],
    domain: currentData.map(d => d.race),
    padding: 0.2
  });

  const onScroll = () => {
    if(el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top + 50){
      window.removeEventListener('scroll', onScroll);
      setAnimated(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    setTimeout(onScroll, 50); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if(animated) {
      setAnimated(false);
      setTimeout(() => {
        setAnimated(true);
      }, 50);
    } // eslint-disable-next-line
  }, [state, metric]);

  return width > 0 && (
    <svg
      id="race-chart" 
      width={width} 
      height={height}>
        <Group top={margin.top} left={margin.left}>
          {currentData.map(d => {
            let datum;
            for(let i = 0; i < otherData.length; i++){
              if(otherData[i].race === d.race){
                datum = otherData[i];
                break;
              }
            }

            let deaths = metric !== 'rate' ? d.deaths : datum.deaths;
            let percent = metric !== 'rate' ? d.percent : datum.percent;

            return (
              <Group key={`bar-container-${d.race}`}>
                {!isSuppressed(d, datum) && (metric === 'rate' || percent !== 0) ? (
                    <path 
                      className={`animated-bar ${animated ? 'animated' : ''}`}
                      style={{
                        'transition': animated ? 'transform 1s ease-in-out' : ''
                      }}
                      key={`bar-${d.race}`}
                      d={Utils.horizontalBarPath(true, 0, yScale(d.race), xScale(getData(d, datum)), yScale.bandwidth(), 0, yScale.bandwidth() * .1)}
                      fill={colorScale.Race}
                      stroke={colorScale.RaceAccent}
                      strokeWidth={2}
                      data-tip={`<strong>${tooltipLabels[d.race] || d.race}</strong><br/>
                      Number of deaths: ${(deaths) < countCutoff ? `< ${countCutoff}` : Number(deaths).toLocaleString()}<br/>
                      Percent${isFinal? '' : ' (95% CI)'}: ${toFixed( getAdjustedPercent( percent || 0, deaths ))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                      ${isFinal ? `Age-adjusted rate: ${(deaths) <= rateCutoff ? rateCutoffLabel : toFixed(d?.rate || datum?.rate)}` : ''} ` }
                    ></path>
                  ) : (
                    <>
                      <Bar
                        className={`animated-bar ${animated ? 'animated' : ''}`}
                        style={{
                          'transition': animated ? 'transform 1s ease-in-out' : ''
                        }}
                        key={`bar-${d.race}`}
                        x={0}
                        y={yScale(d.race)}
                        width={1}
                        height={yScale.bandwidth()}
                        fill="black"
                      />
                      <Bar
                        key={`bar-hover-${d.race}`}
                        x={0}
                        y={yScale(d.race)}
                        width={40}
                        height={yScale.bandwidth()}
                        fill="transparent"
                        data-tip={`<strong>${tooltipLabels[d.race] || d.race}</strong><br/>
                        Number of deaths: ${deaths < countCutoff ? `< ${countCutoff}` : Number(deaths).toLocaleString()}<br/>
                        Percent${isFinal? '' : ' (95% CI)'}: ${toFixed( getAdjustedPercent(percent || 0, deaths))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                        ${isFinal ? `Rate: *Data suppressed` : ''} `}
                      />
                    </>
                  )
                }
                <text
                  key={`bar-label-${d.race}`}
                  x={xScale(getData(d, datum)) + 25}
                  y={yScale(d.race) + (yScale.bandwidth() / 1.75)}
                  textAnchor={'start'}
                  dx={-18}
                >{getData(d, datum, true)}</text>
              </Group>
            )}
          )}
          <AxisLeft 
            scale={yScale}
          >
            {axisLeft => (
              <g className="visx-group visx-axis visx-axis-left" style={{'paddingTop':'20'}}>
                {axisLeft.ticks.map(tick => (
                    <g 
                      key={`tick-${tick.value}`}
                      className="visx-group visx-axis-tick">
                      <text key={`tick-label-${tick.value}`} textAnchor="end" fontSize="medium">
                        <tspan y={tick.to.y + 4} dx="-10">{axisLabels[tick.value] || tick.value}</tspan>
                      </text>
                    </g>
                  )
                )}
              </g>
            )}
          </AxisLeft>
        </Group>
    </svg>
  );
}

export default RaceChart;
