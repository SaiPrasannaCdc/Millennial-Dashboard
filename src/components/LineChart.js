import {React, Fragment, useState, useEffect} from 'react';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { Circle } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import { UtilityFunctions } from '../utility'
import ReactDOMServer from 'react-dom/server';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';


function LineChart(params) {

  const { data, region, currentDrug, period, width, height, selectedDrugs, showLabels, showPercentChange, lineColors, onData, chartNum } = params;

  const dataSet = data;
 
  const margin = { top: 60, right: 30, bottom: 50, left: 95 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const specs = [];

  const formatHalfYearLabel = (periodStr) => {
    if (periodStr == null || periodStr == undefined || periodStr == '')
      return '';

    let year, half;
    let match = periodStr.match(/H([12])\s*([0-9]{4})/);
    if (match) {
      half = match[1];
      year = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})\s*H([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    match = periodStr.match(/([0-9]{4})[- ]([12])/);
    if (match) {
      year = match[1];
      half = match[2];
      return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
    }
    return periodStr;
  };

  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return parseFloat(lineData.values[i - offset].percentage);
    }
    return null;
  };

  const renderChangeIndicators = () => {

      return dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => {
        return lineData.values.map((d, i) => {
          if (i === 0) return null;
  
          const prevPeriod = getPrevPeriodValue(lineData, i, 1);
          const yearlyOffset = period === 'Quarterly' ? 4 : 2;
          const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
          const curr = parseFloat(d.percentage);
  
          const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
          const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
  
          const xLabel = xAccessor(d);
          const xPosition = xScale(xLabel) + xScale.bandwidth() / 2;
          const yPosition = yScale(curr);
          if (isNaN(xPosition) || isNaN(yPosition)) return null;
  
          const showYearlyIndicator = i >= yearlyOffset;
  
          return (
            <g key={`indicator-${index}-${i}`}> 
              <Circle
                cx={xPosition}
                cy={yPosition}
                r={4}
                fill={lineColors[d.drug]}
                onMouseEnter={(e) => {
                  ReactTooltip.show(e.target);
                }}
                onMouseLeave={(e) => {
                  ReactTooltip.hide(e.target);
                }}
                data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearlyIndicator ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${yearlyChange !== null && yearlyChange > 0 ? '#6a0dad' : '#0073e6'}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? Number(yearlyChange).toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})<br/>
                      ${UtilityFunctions.getPositivityLabel(d.drug)} ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    <svg width='20' height='20' style='margin-right: 10px;'>
                      <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${periodChange !== null && periodChange > 0 ? '#6a0dad' : '#0073e6'}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>${period === 'Quarterly' ? 'Quarterly' : '6 Month'} Change</strong><br/>
                      ${periodChange !== null ? Number(periodChange).toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})<br/>
                      ${UtilityFunctions.getPositivityLabel(d.drug)} ${periodChange !== null && periodChange > 0 ? 'increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                    </div>
                  </div>
                </div>`}
                style={{ cursor: 'pointer' }}
              />
            </g>
          );
        });
      });
    };

    const allPeriodsSet = new Set();
    dataSet.forEach(line => line.values.forEach(d => allPeriodsSet.add(period === 'Quarterly' ? d.quarter : formatHalfYearLabel(d.period))));
    const allPeriodsArr = Array.from(allPeriodsSet);

    const xDomain = allPeriodsArr;
    const xAccessor = period === 'Quarterly'
      ? d => d.quarter
      : d => formatHalfYearLabel(d.period);
  
    const xScale = scaleBand({
      domain: xDomain,
      range: [0, adjustedWidth],
      padding: 0.2,
    });
  
    const yScale = scaleLinear({
      domain: [0, Math.max(...dataSet.flatMap(d => d.values.map(v => parseFloat(v.percentage))))],
      range: [adjustedHeight, 0],
      nice: true,
  });

  const adjustCrowdedLabels = () => {

    var positionsVar = [];
    const allLabels = document?.getElementsByClassName("adjustCrowded");
    if (selectedDrugs !== undefined && selectedDrugs != null) {
      for (var i=0; i<selectedDrugs?.length; i++) {
        let recs = dataSet.find(rec => rec.name === selectedDrugs[i]).values;
        var pos = yScale(recs[recs.length - 1].percentage);
        if (pos !== undefined) {
          positionsVar.push({
              label: selectedDrugs[i],
              val: String(recs[recs.length - 1].percentage) + '%',
              xpos: adjustedWidth + 18,
              ypos:  yScale(recs[recs.length - 1].percentage),
              yposNew: yScale(recs[recs.length - 1].percentage),
              adjusted: false,
              id: 'lbl_' + {chartNum} + '_' + {i}
            })
        }
      }
    }
    
    var avg = 0; var order = 'topdown'; var upcnt = 0; var downcnt = 0;

    for (var i=0; i<positionsVar?.length; i++) 
      avg = avg + positionsVar[i].ypos;
    
    avg = avg/positionsVar?.length;

    for (var i=0; i<positionsVar?.length; i++) {
      if (positionsVar[i].ypos > avg)
        downcnt++;
      else
        upcnt++;
    }

    if (downcnt > upcnt)
      order = 'bottomup';

    if (order == 'bottomup') {
      
      positionsVar.sort((a, b) => b.ypos - a.ypos);

      if (positionsVar !== undefined && positionsVar != null) {
        for (var i=0; i<positionsVar?.length; i++) {
          if (i == 0) {
            positionsVar[i].yposNew = Number(positionsVar[i].ypos);
          }
          else{
            positionsVar[i].yposNew = ((Number(positionsVar[i-1].yposNew) - Number(positionsVar[i].ypos)) < 20) ? (Number(positionsVar[i-1].yposNew) - 16) : Number(positionsVar[i].ypos);
            positionsVar[i].adjusted = ((Number(positionsVar[i-1].yposNew) - Number(positionsVar[i].ypos)) < 20) ? true : false;
          }
        }
      }
    }
    else
    {
      positionsVar.sort((a, b) => a.ypos - b.ypos);

      if (positionsVar !== undefined && positionsVar != null) {
        for (var i=0; i<positionsVar?.length; i++) {
          if (i == 0) {
            positionsVar[i].yposNew = Number(positionsVar[i].ypos);
          }
          else{
              positionsVar[i].yposNew = ((Number(positionsVar[i].ypos) - Number(positionsVar[i-1].yposNew)) < 20) ? (Number(positionsVar[i-1].yposNew) + 24) : Number(positionsVar[i].ypos);
              positionsVar[i].adjusted = ((Number(positionsVar[i].ypos) - Number(positionsVar[i-1].yposNew)) < 20) ? true : false;
          }
        }
      }
    }
    
    specs['positionsVar'] = positionsVar;

      if (selectedDrugs !== undefined && selectedDrugs != null) {
      for (var i=0; i<selectedDrugs?.length; i++) {
        var labelElm = document?.getElementById(`adjustCrowded-${chartNum}-${i}`);

          if (labelElm?.id.includes(chartNum + '-' + i)) {
            var rec = specs['positionsVar'].find(rec => rec.label === selectedDrugs[i]);
            if (rec.adjusted === true) {
              labelElm.setAttribute("y", String(rec.yposNew))
            }
            else {
              labelElm.setAttribute("y", String(rec.ypos))
            }
          }
       }
    }
  }

  const adjustLinesForLabels = () => {

    if (selectedDrugs !== undefined && selectedDrugs != null) {
      for (var i=0; i<selectedDrugs?.length; i++) {
        var lineElm = document?.getElementById(`line-leading-${chartNum}-${i}`);

          if (lineElm?.id.includes(chartNum + '-' + i)) {
            lineElm.style.visibility = "visible";
            var rec = specs['positionsVar'].find(rec => rec.label === selectedDrugs[i]);
            if (rec.adjusted === true) {
              lineElm.setAttribute("y2", String(rec.yposNew - 2));
            }
            else
            {
              lineElm.style.visibility = "hidden";
            }
          }
       }
    }
  }

    useEffect(() => {
      adjustCrowdedLabels();
      adjustLinesForLabels();
      ReactTooltip.rebuild();
    }, [showPercentChange, selectedDrugs, data, period, showLabels]);

  const mainLine = data[0];
  const n = mainLine.values.length;
  let keyFinding = null;
  if (n >= 2) {
    const last = parseFloat(mainLine.values[n - 1].percentage);
    const prev = parseFloat(mainLine.values[n - 2].percentage);
    const percentChange = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
    keyFinding = {
      last: last.toFixed(1),
      prev: prev.toFixed(1),
      percentChange: percentChange.toFixed(1),
      direction: percentChange > 0 ? 'increased' : 'decreased',
      absChange: Math.abs(percentChange).toFixed(1),
      lastLabel: xAccessor(mainLine.values[n - 1]),
      prevLabel: xAccessor(mainLine.values[n - 2]),
    };
  }

  onData(keyFinding);

 return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <text
            x={-adjustedHeight / 2}
            y={-margin.left + 25}
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
          <AxisLeft 
            scale={yScale} 
            tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({ 
              fontSize: 16, 
              fontWeight: 500, 
              textAnchor: 'end', 
              dy: 4, 
              dx: -6,
              fill: '#222', 
              fontFamily: 'Barlow, Arial, sans-serif',
              letterSpacing: '0.01em',
            })} 
          />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickFormat={value => value}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />

          {dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => (
            <Fragment key={index}>
              {lineData.values.map((d, i) => {
                const percentage = parseFloat(d.percentage);
                const lowerCI = (percentage - 0.5).toFixed(1);
                const upperCI = (percentage + 0.5).toFixed(1);
                const n = lineData.values.length;
                const dNext = i === n - 1 ? {} :  lineData.values[i+1] || {}
                const percentageN = parseFloat(dNext.percentage);
                const showLabel = showLabels;

                const drugIdx = selectedDrugs.findIndex(rec => rec === d.drug);
                return (
                  <Fragment key={i}>
                     <Group key={`line-path-${d.drug.substring(0,4)}-point-${i}`}>
                        { i < n - 1 &&
                        <line 
                          x1={xScale(xAccessor(d)) + xScale.bandwidth() / 2} 
                          y1={yScale(percentage)} 
                          x2={xScale(xAccessor(dNext)) + xScale.bandwidth() / 2} 
                          y2={yScale(percentageN)} 
                          stroke={lineColors[d.drug]}
                          strokeWidth={2} />
                        }
                        <Circle
                          cx={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                          cy={yScale(percentage)}
                          r={4}
                          fill={lineColors[d.drug]}
                          data-tip={`<div style='text-align: left;'>
                            <strong>${xAccessor(d)}</strong><br/>
                            ${UtilityFunctions.getPositivityLabel(d.drug)}: ${percentage}%<br/>
                            Confidence interval: ${lowerCI}% - ${upperCI}%
                          </div>`}
                        />
                        {(!showLabel && (i == n -1)) && (
                          <Group>
                            <line
                                id={`line-leading-${chartNum}-${drugIdx}`}
                                x1={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 4}
                                y1={yScale(percentage.toFixed(1))}
                                x2={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 22} 
                                y2={yScale(percentage.toFixed(1))}
                                stroke={lineColors[d.drug]}
                                strokeWidth={1.5}/>
                            <text
                              id={`adjustCrowded-${chartNum}-${drugIdx}`}
                              class='adjustCrowded'
                              x={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 42}
                              y={yScale(percentage.toFixed(1))}
                              fontSize={12}
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              fill="#333"
                            >
                              {percentage.toFixed(1)}%
                            </text>
                          </Group>
                        )}
                        {showLabel && (
                        <text
                        x={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                        y={yScale(percentage.toFixed(1)) - 14}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                      >
                        {percentage}%
                      </text>
                      )}
                    </Group>
                  </Fragment>
                );
              })}
            </Fragment>
          ))}
          {showPercentChange && renderChangeIndicators()}          
        </Group>
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '20px' }}>
        {dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[lineData.name] }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{UtilityFunctions.getLegend(lineData.name)}</span> 
          </div>
        ))}
      </div>
      
      <ReactTooltip
          effect="solid"
          backgroundColor="#ededed"
          border={true}
          borderColor="#bbb"
          html={true}
          textColor="#222"
        />
    </div>
  );

}

export default LineChart