import { useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleBand, scaleLinear } from '@visx/scale';

import Utils from '../shared/Utils';
import DataTable from './DataTable';
import DataTableMY from './DataTableMY';
import { countCutoff } from '../constants.json';

import '../css/CauseChart.css';
import { MultiYearAccessFunctions } from '../utility'

function CauseChart(params) {

  const viewportCutoff = 600;

  const [ animated, setAnimated ] = useState(false);

  const { dataMY, data, width, height, el, state, accessible, colorScale, toFixed, isFinal, getAdjustedPercent, years} = params;

  const margin = {top: 20, bottom: width < viewportCutoff ? 180 : 140, left: 70, right: 20};
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const order = {
    'Any opioids': 0,
    'Illegally-made fentanyls': 1,
    'Heroin': 2,
    'Prescription opioids': 3,
    'Any stimulants': 4,
    'Cocaine': 5,
    'Methamphetamine': 6,
    'Any non-opioid sedatives': 7,
    'Benzodiazepines': 8
  };

  data.sort((a,b) => {
    const aOrder = order[a.opioid];
    const bOrder = order[b.opioid];

    if(aOrder < bOrder) return -1;
    if(bOrder < aOrder) return 1;
    return 0;
  });

  const xScale = scaleBand({
    range: [ 0, adjustedWidth ],
    domain: data.map(d => d.opioid),
    padding: 0.2
  });

  const yScale = scaleLinear({
    domain: [0, 100],
    range: [ adjustedHeight, 0 ]
  });

  const onScroll = () => {
    if(el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top + 50){
      window.removeEventListener('scroll', onScroll);
      setAnimated(true);
    }
  };

  useEffect(() => {
    if(!isFinal)
      setAnimated(true);
  }, [isFinal])

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
  }, [state]);

  let labelOverrides = {
    'Any opioids': <>Any opioids{isFinal ? '' : <sup>3</sup>}</>,
    'Any stimulants': <>Any stimulants{isFinal ? '' : <sup>7</sup>}</>,
    'causeCount': 'Number of deaths',
    'causePercent': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
    'Illegally-made fentanyls': <>{width < viewportCutoff? '    IMFs' : '    Illegally-made fentanyls'}{isFinal ? '' : <sup>4</sup>}</>,
    'Prescription opioids': <>    Prescription opioids{isFinal ? '' : <sup>6</sup>}</>,
    'Methamphetamine': '    Methamphetamine',
    'Cocaine': '    Cocaine',
    'Heroin': <>    Heroin{isFinal ? '' : <sup>5</sup>}</>,
    'opioid': 'Drug or drug class',
    'Benzodiazepines':<>Benzodiazepines{isFinal ? '' : <sup>8</sup>}</>,
    'Non-opioid sedatives':<>Non-opioid sedatives{isFinal ? '' : <sup>9</sup>}</>,
    'causeCount1': 'Number of deaths',
    'causePercent1': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
    'causeCount2': 'Number of deaths',
    'causePercent2': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
    'causeCount3': 'Number of deaths',
    'causePercent3': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
    'causeCount4': 'Number of deaths',
    'causePercent4': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
  };

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

  const getDrugsArray = () => {
    let myArray = [];
    let yr = parseInt(years['yearFrom'].yearFrom);
    for (var j=0;j<dataMY[yr][state].length;j++) {
      myArray.push(dataMY[yr][state][j].opioid)
    }
    
    return myArray;
  };

  // let footnoteOverrides = {
  //   'Any Opioids': <sup>3</sup>,
  //   'Illegally-made Fentanyls': <sup>4</sup>,
  //   'Heroin': <sup>5</sup>,
  //   'Any Stimulants': <sup>6</sup>,
  //   'Benzodiazepines': <sup>7</sup>,
  //   'Non-opioid Sedatives': <sup>8</sup>,
  // }

  // if(width < viewportCutoff){
  //   labelOverrides['Illegally-made Fentanyls'] = '    IMFs';
  // }

  return width > 0 && (
    <>
      <div id="cause-chart">
        {accessible ? ((years != undefined && years != null) ? (
        <DataTableMY 
        data={MultiYearAccessFunctions.generateMultiYearCauseData(dataMY, state, getDrugsArray(), getYearsArray(), 2)}
        xAxisKey={'opioid'}
        labelOverrides={labelOverrides}
        suffixes={{
          'causePercent1': isFinal ? '%' : '',
          'causePercent2': isFinal ? '%' : '',
          'causePercent3': isFinal ? '%' : '',
          'causePercent4': isFinal ? '%' : '',
        }}
        transforms={{
          causePercent1: isFinal ? num => toFixed(num) : num => num,
          causePercent2: isFinal ? num => toFixed(num) : num => num,
          causePercent3: isFinal ? num => toFixed(num) : num => num,
          causePercent4: isFinal ? num => toFixed(num) : num => num,
        }}
        caption={'Overdose deaths by drug'}
        customBackground={true}
        years={years}
        extraCols = {[`Percentage change in percent, ${years['yearTo'].yearTo} vs. ${years['yearFrom'].yearFrom}`, `Percent of deaths, ${years['yearFrom'].yearFrom} - ${years['yearTo'].yearTo}`]}
      />        
      ) :
          (<DataTable 
            data={[...data.map(d => (d.opioid.indexOf('Any') !== -1 || d.opioid == 'Benzodiazepines' || d.opioid == 'Non-opioid sedatives') ? 
              {...d, causePercent: isFinal ? toFixed(getAdjustedPercent(d.causePercent, d.causeCount)) : `${toFixed(getAdjustedPercent(d.causePercent, d.causeCount))}% (${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`, background: true} 
              : {...d, causePercent: isFinal ? getAdjustedPercent(d.causePercent, d.causeCount) : `${toFixed(getAdjustedPercent(d.causePercent, d.causeCount))}% (${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`})]}
            xAxisKey={'opioid'}
            orderedKeys={['causeCount', 'causePercent']}
            labelOverrides={labelOverrides}
            suffixes={{'causePercent': isFinal ? '%' : ''}}
            transforms={{
              causePercent: isFinal ? num => toFixed(num) : num => num
            }}
            caption={'Overdose deaths by drug'}
            customBackground={true}
          />
        )) : (
          <><svg id="cause-chart" width={width} height={height}>
            <Group top={margin.top} left={margin.left}>
              <AxisLeft
                scale={yScale}
                tickValues={[0, 25, 50, 75, 100]}
                tickFormat={num => num + '%'}
                tickLabelProps={() => ({
                  fontSize: 'medium',
                  textAnchor: 'end',
                  transform: 'translate(-10, 5)'
                })}
                tickTransform={`translate(${adjustedWidth}, 0)`}
                tickStroke="lightgray"
                tickLength={adjustedWidth}
                hideAxisLine
              />
              {data.map(d => (
                  <Group key={`group-${d.opioid}`}>
                  {
                    d.causePercent < 3 && 
                    <path
                      key={`cause-bar-${d.opioid}`}
                      className={`animated-bar vertical ${animated ? 'animated' : ''}`}
                      style={{
                        'transition': animated ? 'transform 1s ease-in-out' : '',
                        'transformOrigin': `0px ${adjustedHeight}px`
                      }}
                      d={Utils.verticalBarPath(xScale(d.opioid), yScale(d.causePercent), xScale.bandwidth(), adjustedHeight - yScale(d.causePercent) - 20, xScale.bandwidth() * .1, true)}
                      fill={'#fff'}
                      data-tip-id={'1'}
                      data-tip={`<strong>${d.opioid}</strong><br/>
                      Number of deaths: ${d.causeCount < countCutoff ? `< ${countCutoff}` : Number(d.causeCount).toLocaleString()}<br/>
                      Percent${isFinal ? '' : ' (95% CI)'}: ${toFixed(getAdjustedPercent( d.causePercent, d.causeCount))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}`}
                    ></path>
                  }
                  
                    <path
                      key={`cause-bar-${d.opioid}`}
                      className={`animated-bar vertical ${animated ? 'animated' : ''}`}
                      style={{
                        'transition': animated ? 'transform 1s ease-in-out' : '',
                        'transformOrigin': `0px ${adjustedHeight}px`
                      }}
                      d={
                        Utils.verticalBarPath(
                          xScale(d.opioid), 
                          yScale(d.causePercent), 
                          xScale.bandwidth(), 
                          adjustedHeight - yScale(d.causePercent), 
                          xScale.bandwidth() * .1,
                          false,
                          d.causePercent == 0 && d.causeCount > 0 ? true : false)
                        }
                      fill={colorScale[d.opioid]}
                      data-tip={`<strong>${d.opioid}</strong><br/>
                      Number of deaths: ${d.causeCount < countCutoff ? `< ${countCutoff}` : Number(d.causeCount).toLocaleString()}<br/>
                      Percent${isFinal ? '' : ' (95% CI)'}: ${toFixed(getAdjustedPercent( d.causePercent, d.causeCount))}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}`}
                    ></path>
                    {/* <foreignObject 
                      width={300}
                      height={margin.bottom}
                      x={xScale(d.opioid) + (xScale.bandwidth() / 2) - 300} 
                      y={adjustedHeight + 5}
                      fill="transparent">
                        <div style={{textAlign: 'right'}}>
                          <p style={{transform: `rotate(-${width < viewportCutoff ? 65 : 30}deg)`, transformOrigin: 'center right', display: 'inline-block', marginRight: '4px', fontSize: '.9em'}}>
                            { labelOverrides[d.opioid] ? labelOverrides[d.opioid] : d.opioid}
                          </p>
                        </div>
                    </foreignObject> */}
                  </Group>
                )
              )}
              {/* <AxisBottom
                top={adjustedHeight}
                scale={xScale}
                tickStroke="none"
                stroke="none"
                tickFormat={label => width < viewportCutoff && labelOverrides[label] ? labelOverrides[label].trim() : label}
                tickLabelProps={(label, index, props) => ({
                  fontSize: 'medium',
                  textAnchor: 'end',
                  transform: `rotate(-${width < viewportCutoff ? 65 : 30}, ${props[index].to.x}, ${props[index].to.y})`,
                  dy: 5,
                  dominantBaseline: 'end'
                })}
              /> */}
            </Group>
          </svg>
          {data.map(d => (
              <div
                key={`label-dev-${d.opioid}`}
               style={{position: 'absolute', width: '300px', height: '100px', top: `${adjustedHeight + 18}px`, left: `${xScale(d.opioid) + margin.left + (xScale.bandwidth() / 2) - 300}px`, textAlign: 'right'}}>
                <p style={{transform: `rotate(-${width < viewportCutoff ? 65 : 30}deg)`, transformOrigin: 'center right', display: 'inline-block', fontSize: '.9em'}}>
                  {labelOverrides[d.opioid] !== undefined ? labelOverrides[d.opioid] : d.opioid}
                </p>
              </div>
            )
            )}
            </>
          
        )}
      </div>
    </>
  );
}

export default CauseChart;
