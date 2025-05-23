import { useEffect, useState } from 'react';
import { Bar } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scaleBand } from '@visx/scale';
import { AxisLeft } from '@visx/axis';

import DataTable from './DataTable';
import Utils from '../shared/Utils';
import { countCutoff, rateCutoff, rateCutoffLabel } from '../constants.json';

import '../css/AgeBySexChart.css';

function AgeBySexChart(params) {

  const ageMapping = {
    '0': '< 15',
    '1': '15–24',
    '2': '25–34',
    '3': '35–44',
    '4': '45–54',
    '5': '55–64',
    '6': '65+'
  };
  
  const { data, maxes, width, height, metric, state, colorScale, el, accessible, toFixed,
    isFinal, getAdjustedPercent } = params;

  const [ animated, setAnimated ] = useState(false);

  const margin = {top: 10, bottom: 10, left: 75, right: 10};
  const adjustedHeight = height - margin.top - margin.bottom;
  const adjustedWidth = width - margin.left - margin.right;
  const halfWidth = adjustedWidth / 2;

  const xScale = scaleLinear({
    domain: [0, maxes[metric]],
    range: [ 10, halfWidth - 50 ]
  });

  const yScale = scaleBand({
    range: [ 0, adjustedHeight ],
    domain: (data['Male'] || []).filter(d => d.age !== '' && d.age !== 'null').map(d => ageMapping[d.age]),
    padding: 0.2
  });

  const isSuppressed = (value) => {
    if(metric === 'rate' && value.count < rateCutoff) return true;
    return value.count < countCutoff ? true : false;
  };

  const suppressedValue = (value) => {
    if(metric === 'rate'){
      return value.count < rateCutoff ? '*' : toFixed(value[metric]);
    }
    return value.count < countCutoff ? '*' : (toFixed(getAdjustedPercent( value[metric], value.count)) + '%');
  }

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
      id="age-by-sex-chart" 
      width={width} 
      height={height}>
        <Group top={margin.top} left={margin.left}>
        <AxisLeft
          scale={yScale}
          tickLabelProps={() => ({
            fontSize: 'medium',
            textAnchor: 'end',
            verticalAnchor: 'middle'
          })}
          left={-15}
          hideTicks
          hideAxisLine
        />
          {(data['Male'] || []).map(d => {
            if(d.age === '' || d.age === 'null') return '';

            return (
              <Group key={`group-male-${d.age}`}>
                {!isSuppressed(d) && (metric === 'rate' || d.percent !== 0) ? (
                  <path
                    className={`animated-bar ${animated ? 'animated' : ''}`}
                    style={{
                      'transition': animated ? 'transform 1s ease-in-out' : '',
                      'transformOrigin': `${halfWidth}px 0px`
                    }}
                    key={`bar-male-${d.age}`}
                    d={Utils.horizontalBarPath(false, halfWidth - xScale(d[metric]), yScale(ageMapping[d.age]), xScale(d[metric]), yScale.bandwidth(), 0, yScale.bandwidth() * .1)}
                    fill={colorScale.Male}
                    data-tip={`<strong>Male, ${ageMapping[d.age]}</strong><br/>
                    Number of deaths: ${d.count < countCutoff ? `< ${countCutoff}` : Number(d.count).toLocaleString()}<br/>
                    Percent${isFinal? '' : ' (95% CI)'}: ${toFixed( getAdjustedPercent(d.percent || 0, d.count))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                    ${ isFinal ? `Rate: ${d.count < rateCutoff ? rateCutoffLabel : toFixed(d.rate)}` : ''} `}
                  ></path>
                ) : (
                  <>
                    <Bar 
                      x={halfWidth - 1}
                      y={yScale(ageMapping[d.age])}
                      width={1}
                      height={yScale.bandwidth()}
                      fill="black"
                    />
                    <Bar 
                      x={0}
                      y={yScale(ageMapping[d.age])}
                      width={halfWidth}
                      height={yScale.bandwidth()}
                      fill="transparent"
                      data-tip={`<strong>Male, ${ageMapping[d.age]}</strong><br/>
                      Number of deaths: ${d.count < countCutoff ? `< ${countCutoff}` : Number(d.count).toLocaleString()}<br/>
                      Percent${isFinal? '' : ' (95% CI)'}: ${toFixed(getAdjustedPercent(d.percent || 0, d.count))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                      ${ isFinal ? 'Rate: *Data suppressed' : ''} `}
                    />
                  </>
                )}
                <text
                  x={halfWidth - (isSuppressed(d) ? 10 : xScale(d[metric])) - 5}
                  y={yScale(ageMapping[d.age]) + (yScale.bandwidth() / 1.5)}
                  dx={isSuppressed(d) ? '-15px' : '0'}
                  fill="black"
                  textAnchor="end">
                    {suppressedValue(d, true)}
                </text>
              </Group>
            )}
          )}
          {(data['Female'] || []).map(d => {
            if(d.age === '' || d.age === 'null') return '';
            
            return (
              <Group key={`group-female-${d.age}`}>
                {!isSuppressed(d) && (metric === 'rate' || d.percent !== 0) ? (
                  <path
                    className={`animated-bar ${animated ? 'animated' : ''}`}
                    style={{
                      'transition': animated ? 'transform 1s ease-in-out' : '',
                      'transformOrigin': `${halfWidth}px 0px`
                    }}
                    key={`bar-female-${d.age}`}
                    d={Utils.horizontalBarPath(true, halfWidth, yScale(ageMapping[d.age]), xScale(d[metric]), yScale.bandwidth(), 0, yScale.bandwidth() * .1)}
                    fill={colorScale.Female}
                    data-tip={`<strong>Female, ${ageMapping[d.age]}</strong><br/>
                    Number of deaths: ${d.count < countCutoff ? `< ${countCutoff}` : Number(d.count).toLocaleString()}<br/>
                    Percent${isFinal? '' : ' (95% CI)'}: ${toFixed(getAdjustedPercent(d.percent || 0, d.count))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                    ${isFinal ? `Rate: ${d.count < rateCutoff ? rateCutoffLabel : toFixed(d.rate)}`: ''} `}
                  ></path>
                ) : (
                  <>
                    <Bar 
                      x={halfWidth}
                      y={yScale(ageMapping[d.age])}
                      width={0.5}
                      height={yScale.bandwidth()}
                      fill="black"
                    />
                    <Bar 
                      x={halfWidth}
                      y={yScale(ageMapping[d.age])}
                      width={halfWidth}
                      height={yScale.bandwidth()}
                      fill="transparent"
                      data-tip={`<strong>Female, ${ageMapping[d.age]}</strong><br/>
                      Number of deaths: ${d.count < countCutoff ? `< ${countCutoff}` : Number(d.count).toLocaleString()}<br/>
                      Percent${isFinal? '' : ' (95% CI)'}: ${toFixed(getAdjustedPercent(d.percent || 0,d.count))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}<br/>
                      ${ isFinal? `Rate: *Data suppressed` : ''} `}
                    />
                  </>
                )}
                <text
                  x={halfWidth + (isSuppressed(d) ? 10 : xScale(d[metric])) + 5}
                  y={yScale(ageMapping[d.age]) + (yScale.bandwidth() / 1.5)}
                  dx={isSuppressed(d) ? '15px' : '0'}
                  fill="black">
                    {suppressedValue(d, true)}
                </text>
              </Group>
            )}
          )}
        </Group>
    </svg>
  );
}

export default AgeBySexChart;