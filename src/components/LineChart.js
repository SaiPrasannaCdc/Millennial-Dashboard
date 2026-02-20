import { React, Fragment, useState, useEffect } from 'react';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { Circle } from '@visx/shape';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import { UtilityFunctions } from '../utility';
import { AccessibilityFunctions } from '../accessibility';
import ReactDOMServer from 'react-dom/server';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import DataTable508 from './DataTable508';


function LineChart(params) {

  const { data, region, currentDrug, period, width, height, selectedDrugs, showLabels, showPercentChange, lineColors, onData, chartNum, isSmallViewPort, accessible } = params;

  const dataSet = data?.map(d => ({
    ...d,
    values: d.values
  }));

  const margin = { top: 60, right: !isSmallViewPort ? 30 : 50, bottom: !isSmallViewPort ? 60 : 105, left: 105 };
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

  const getPrevPeriodPeriod = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return period == 'Quarterly' ? lineData.values[i - offset].quarter : lineData.values[i - offset].period;
    }
    return null;
  };

  const renderChangeIndicators = () => {

    return dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;

        const prevPeriod = getPrevPeriodValue(lineData, i, 1);
        const prevPeriodPeriod = getPrevPeriodPeriod(lineData, i, 1);
        const yearlyOffset = period === 'Quarterly' ? 4 : 2;
        const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
        const prevYearPeriod = getPrevPeriodPeriod(lineData, i, yearlyOffset);
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
              style={{ cursor: 'pointer' }}
            />
            <Circle
              cx={xPosition}
              cy={yPosition}
              r={10}
              fill='transparent'
              onMouseEnter={(e) => {
                ReactTooltip.show(e.target);
              }}
              onMouseLeave={(e) => {
                ReactTooltip.hide(e.target);
              }}
              data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearlyIndicator ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    <svg width='${!isSmallViewPort ? 20 : 50}' height='20' style='margin-right: 10px;'>
                      <polygon points='${Number(yearlyChange).toFixed(1) == 0.0 ? '' : '10,0 20,10 15,10 15,20 5,20 5,10 0,10'}' fill='${yearlyChange !== null && yearlyChange > 0 ? '#6a0dad' : '#0073e6'}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? Number(yearlyChange).toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})<br/>
                      ${UtilityFunctions.getPositivityLabel(d.drug)} ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% in ${prevYearPeriod} to ${curr.toFixed(1)}% in ${xLabel} 
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    <svg width='${!isSmallViewPort ? 20 : 50}' height='20' style='margin-right: 10px;'>
                      <polygon points='${Number(periodChange).toFixed(1) == 0.0 ? '' : '10,0 20,10 15,10 15,20 5,20 5,10 0,10'}' '' fill='${periodChange !== null && periodChange > 0 ? '#6a0dad' : '#0073e6'}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                    </svg>
                    <div>
                      <strong>${period === 'Quarterly' ? 'Quarterly' : '6 Month'} Change</strong><br/>
                      ${periodChange !== null ? Number(periodChange).toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})<br/>
                      ${UtilityFunctions.getPositivityLabel(d.drug)} ${periodChange !== null && periodChange > 0 ? 'increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% in ${prevPeriodPeriod} to ${curr.toFixed(1)}% in ${xLabel} 
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

  const tmpyScaleDomainPeriod = UtilityFunctions.calculateYScaleDomain(dataSet, selectedDrugs);
  const yScaleDomainPeriod = (tmpyScaleDomainPeriod == -1 ? 1 : (tmpyScaleDomainPeriod * 1.2));

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
    domain: [0, yScaleDomainPeriod == 0 ? 0.8 : yScaleDomainPeriod],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const adjustCrowdedLabels = () => {

    var positionsVar = [];
    const allLabels = document?.getElementsByClassName("adjustCrowded");
    if (selectedDrugs !== undefined && selectedDrugs != null) {
      for (var i = 0; i < selectedDrugs?.length; i++) {
        let recs = dataSet.find(rec => rec.name === selectedDrugs[i]).values;
        var pos = yScale(recs[recs.length - 1].percentage);
        if (pos !== undefined) {
          positionsVar.push({
            label: selectedDrugs[i],
            val: String(recs[recs.length - 1].percentage) + '%',
            xpos: adjustedWidth + 18,
            ypos: yScale(recs[recs.length - 1].percentage),
            yposNew: yScale(recs[recs.length - 1].percentage),
            adjusted: false,
            id: 'lbl_' + { chartNum } + '_' + { i }
          })
        }
      }
    }

    var avg = 0; var order = 'topdown'; var upcnt = 0; var downcnt = 0;

    for (var i = 0; i < positionsVar?.length; i++)
      avg = avg + positionsVar[i].ypos;

    avg = avg / positionsVar?.length;

    for (var i = 0; i < positionsVar?.length; i++) {
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
        for (var i = 0; i < positionsVar?.length; i++) {
          if (i == 0) {
            positionsVar[i].yposNew = Number(positionsVar[i].ypos);
          }
          else {
            positionsVar[i].yposNew = ((Number(positionsVar[i - 1].yposNew) - Number(positionsVar[i].ypos)) < 20) ? (Number(positionsVar[i - 1].yposNew) - 16) : Number(positionsVar[i].ypos);
            positionsVar[i].adjusted = ((Number(positionsVar[i - 1].yposNew) - Number(positionsVar[i].ypos)) < 20) ? true : false;
          }
        }
      }
    }
    else {
      positionsVar.sort((a, b) => a.ypos - b.ypos);

      if (positionsVar !== undefined && positionsVar != null) {
        for (var i = 0; i < positionsVar?.length; i++) {
          if (i == 0) {
            positionsVar[i].yposNew = Number(positionsVar[i].ypos);
          }
          else {
            positionsVar[i].yposNew = ((Number(positionsVar[i].ypos) - Number(positionsVar[i - 1].yposNew)) < 20) ? (Number(positionsVar[i - 1].yposNew) + 24) : Number(positionsVar[i].ypos);
            positionsVar[i].adjusted = ((Number(positionsVar[i].ypos) - Number(positionsVar[i - 1].yposNew)) < 20) ? true : false;
          }
        }
      }
    }

    specs['positionsVar'] = positionsVar;

    if (selectedDrugs !== undefined && selectedDrugs != null) {
      for (var i = 0; i < selectedDrugs?.length; i++) {
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
      for (var i = 0; i < selectedDrugs?.length; i++) {
        var lineElm = document?.getElementById(`line-leading-${chartNum}-${i}`);

        if (lineElm?.id.includes(chartNum + '-' + i)) {
          lineElm.style.visibility = "visible";
          var rec = specs['positionsVar'].find(rec => rec.label === selectedDrugs[i]);
          if (rec.adjusted === true) {
            lineElm.setAttribute("y2", String(rec.yposNew - 2));
          }
          else {
            lineElm.style.visibility = "hidden";
          }
        }
      }
    }
  }

  const CustomTickComponent = ({ x, y, formattedValue }) => {
    const [line1, line2] = formattedValue.split(' ');
    return (
      <text x={x} y={y} fontSize={16} textAnchor="middle">
        <tspan x={x} dy="0.5em">{line1}</tspan>
        <tspan x={x} dy="1.3em">{line2}</tspan>
      </text>
    );
};

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
<>
{accessible ? (
        <>
        <DataTable508
          data={AccessibilityFunctions.generateLineChartData(dataSet, selectedDrugs, period)}
          dataTip1={AccessibilityFunctions.generateToolTipData(dataSet, selectedDrugs, period, 1)}
          dataTip2={AccessibilityFunctions.generateToolTipData(dataSet, selectedDrugs, period, 2)}
          labelOverrides={{
            'Fentanyl with cocaine or methamphetamine': 'Cocaine or methamphetamine',
            'Fentanyl without cocaine or methamphetamine': 'Fentanyl without cocaine or methamphetamine',
            'Heroin with cocaine or methamphetamine': 'Cocaine or methamphetamine',
            'Heroin without cocaine or methamphetamine': 'Heroin without cocaine or methamphetamine',
            'Heroin': 'Any Heroin',
            'Cocaine with fentanyl or heroin': 'Cocaine with heroin or fentanyl',
            'Cocaine without fentanyl or heroin': 'Cocaine without heroin or fentanyl',
            'Cocaine': 'Any Cocaine',
            'Methamphetamine with fentanyl or heroin': 'Methamphetamine with heroin or fentanyl',
            'Methamphetamine without fentanyl or heroin': 'Methamphetamine without heroin or fentanyl',
            'Methamphetamine': 'Any Methamphetamine',
            'Fentanyl': 'Any Fentanyl'
          }}
          xAxisKey={period}
          transforms={{
            rate: num => UtilityFunctions.toFixed(num)
          }}
          width={width}
          colSpan={selectedDrugs.length}
          isSmallViewport={specs['isSmallViewport']}
          noSort={true}
          chartNum={chartNum}
          currentDrug={currentDrug}
          showPercentChange={showPercentChange}
          suppressed={region == 'NORTH' && chartNum == 2 && period == 'Quarterly' ? true : false}
        />
        </>        
      ) : (
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
            {chartNum == 1 ? '% of urine specimens testing positive for ' +  currentDrug.toLowerCase() : '% of urine specimens with drug(s) detected among '}
            <tspan x={-adjustedHeight / 2} dy={15}>
             {chartNum == 1 ? 'or ' + currentDrug.toLowerCase() + ' drug combinations'  : currentDrug.toLowerCase() + ' positive urine specimens'}
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
          {!isSmallViewPort && 
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickComponent={CustomTickComponent}
          />
          }
          {isSmallViewPort && 
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={(value) => ({
              fontSize: !isSmallViewPort ? 16 : 12,
              angle: (isSmallViewPort ? 90 : 0),
            })}
          />
          }

          {dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => (
            <Fragment key={index}>
              {lineData.values.map((d, i) => {
                const percentage = parseFloat(d.percentage);
                const lowerCI = (d.ciLower).toFixed(1);
                const upperCI = (d.ciUpper).toFixed(1);
                const n = lineData.values.length;
                const dNext = i === n - 1 ? {} : lineData.values[i + 1] || {}
                const percentageN = parseFloat(dNext.percentage);
                const showLabel = showLabels;

                const drugIdx = selectedDrugs.findIndex(rec => rec === d.drug);
                return (
                  <Fragment key={i}>
                    <Group key={`line-path-${d.drug.substring(0, 4)}-point-${i}`}>
                      {i < n - 1 &&
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
                      />
                      <Circle 
                        cx={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                        cy={yScale(percentage)}
                        r={10} 
                        fill="transparent"
                        data-tip={`<div style='text-align: left;'>
                            <strong>${xAccessor(d)}</strong><br/>
                            ${UtilityFunctions.getPositivityLabel(d.drug)}: ${percentage}%<br/>
                            95% confidence interval: ${lowerCI}% - ${upperCI}%
                          </div>`}
                        />
                      {(!showLabel && (i == n - 1)) && (
                        <Group>
                          <line
                            id={`line-leading-${chartNum}-${drugIdx}`}
                            x1={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 4}
                            y1={yScale(percentage.toFixed(1))}
                            x2={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 22}
                            y2={yScale(percentage.toFixed(1))}
                            stroke={lineColors[d.drug]}
                            strokeWidth={1.5} />
                          <text
                            id={`adjustCrowded-${chartNum}-${drugIdx}`}
                            class='adjustCrowded'
                            x={xScale(xAccessor(d)) + xScale.bandwidth() / 2 + 42}
                            y={yScale(percentage.toFixed(1))}
                            fontSize={12}
                            fontWeight="600"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill="#333"
                          >
                            {percentage.toFixed(1)}%
                          </text>
                        </Group>
                      )}
                      {/* {showLabel && (
                        <text
                        x={xScale(xAccessor(d)) + xScale.bandwidth() / 2}
                        y={yScale(percentage.toFixed(1)) - 14}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                      >
                        {percentage}%
                      </text>
                      )} */}
                    </Group>
                  </Fragment>
                );
              })}
            </Fragment>
          ))}

          {(!isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/2.2} y={height/4} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Data suppressed due to low number of positive tests.'}</text>}
          {(!isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/2.2} y={height/4 + 20} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Data not reported due to low number of positive tests.'}</text>}
          {(!isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/2.2} y={height/4 + 40} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Select “6 Months” Time Frame to view available data.'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={height/5} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Data suppressed'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={(height/5) + 20} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'due to low number'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={(height/5) + 40} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'of positive tests.'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={height/5 + 60} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Data not reported'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={(height/5) + 80} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'due to low number'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={(height/5) + 100} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'of positive tests.'}</text>}
           {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={height/5 + 120} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Select “6 Months”'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={height/5 + 140} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'Time Frame to view'}</text>}
          {(isSmallViewPort && period == 'Quarterly' && region == 'NORTH' && chartNum == 2) && <text width={width} x={width/3} y={(height/5) + 160} textAnchor="middle" style={{fill: '#000000', fontWeight: 'bold'}}>{'available data.'}</text>}

          {/* Render labels separately to avoid overlapping */}
          {showLabels && (() => {
            // Collect all data points for each x position to calculate optimal label positions
            const labelsByPosition = {};

            dataSet.filter(ds => selectedDrugs?.includes(ds.name)).forEach((lineData) => {
              lineData.values.forEach((d) => {
                const xPos = xAccessor(d);
                const percentage = parseFloat(d.percentage);
                const xPixel = xScale(xPos) + xScale.bandwidth() / 2;

                if (!labelsByPosition[xPos]) {
                  labelsByPosition[xPos] = [];
                }

                labelsByPosition[xPos].push({
                  x: xPixel,
                  percentage: percentage,
                  drug: d.drug,
                  color: lineColors[d.drug]
                });
              });
            });

            // Render labels with overlap prevention for each x position
            return Object.keys(labelsByPosition).map(xPos => {
              const pointsAtPosition = labelsByPosition[xPos];

              if (pointsAtPosition.length === 0) return null;

              // Sort points by percentage value (ascending - lowest to highest)
              const sortedPoints = pointsAtPosition
                .sort((a, b) => a.percentage - b.percentage);

              const adjustedPositions = [];
              const labelHeight = 16;
              const horizontalSpacing = 30; // Distance between horizontally offset labels

              // Define chart bounds
              const chartTop = 15;
              const chartBottom = adjustedHeight - 15;

              // Calculate positions with horizontal and vertical offsets
              sortedPoints.forEach((point, idx) => {
                const dataPointY = yScale(point.percentage);
                let labelX = point.x;
                let labelY;

                // Position labels based on clear rules:
                // 1. Highest - always above
                // 2. Lowest - always below  
                // 3. 2nd highest - below if closer to highest, above if closer to 3rd
                // 4. 3rd highest - below if it's the lowest, otherwise depends on distances

                const totalPoints = sortedPoints.length;
                const rankFromHighest = totalPoints - idx; // 1 = highest, 2 = second highest, etc.

                // Check if top 3 points are too close together (skip 2nd highest label if so)
                let skipSecondHighest = false;
                if (totalPoints >= 3 && rankFromHighest === 2) {
                  const highestValue = sortedPoints[totalPoints - 1].percentage;
                  const secondHighestValue = sortedPoints[totalPoints - 2].percentage;
                  const thirdHighestValue = sortedPoints[totalPoints - 3].percentage;

                  const distanceHighestToSecond = highestValue - secondHighestValue;
                  const distanceSecondToThird = secondHighestValue - thirdHighestValue;

                  // Skip 2nd highest label only if both distances are very small (less than 0.5% each)
                  skipSecondHighest = distanceHighestToSecond < 0.5 && distanceSecondToThird < 0.5;
                }

                // Skip rendering this label if it's the 2nd highest and points are too close
                if (skipSecondHighest) {
                  return; // Don't add this label to adjustedPositions
                }

                let shouldPositionBelow = false;

                if (rankFromHighest === 1) {
                  // Highest point - always above
                  shouldPositionBelow = false;
                } else if (idx === 0) {
                  // Lowest point - always below
                  shouldPositionBelow = true;
                } else if (rankFromHighest === 2 && totalPoints >= 3) {
                  // 2nd highest - compare distances
                  const highestValue = sortedPoints[totalPoints - 1].percentage;
                  const secondHighestValue = sortedPoints[totalPoints - 2].percentage;
                  const thirdHighestValue = sortedPoints[totalPoints - 3].percentage;

                  const distanceToHighest = highestValue - secondHighestValue;
                  const distanceToThird = secondHighestValue - thirdHighestValue;

                  // If closer to highest, go below; if closer to 3rd, go above
                  shouldPositionBelow = distanceToHighest < distanceToThird;
                } else if (rankFromHighest === 3) {
                  // 3rd highest
                  if (idx === 0) {
                    // If 3rd is also lowest, always below
                    shouldPositionBelow = true;
                  } else if (totalPoints >= 4) {
                    // Compare distances to 2nd and 4th (if exists)
                    const secondHighestValue = sortedPoints[totalPoints - 2].percentage;
                    const thirdHighestValue = sortedPoints[totalPoints - 3].percentage;
                    const fourthHighestValue = sortedPoints[totalPoints - 4].percentage;

                    const distanceToSecond = secondHighestValue - thirdHighestValue;
                    const distanceToFourth = thirdHighestValue - fourthHighestValue;

                    // If distance to 2nd is GREATER than distance to 4th, go above; if SMALLER, go below
                    shouldPositionBelow = distanceToSecond < distanceToFourth;
                  } else {
                    // Only 3 points total, go above
                    shouldPositionBelow = false;
                  }
                } else {
                  // 4th and beyond - always below
                  shouldPositionBelow = true;
                }

                if (shouldPositionBelow) {
                  // Position labels below data points
                  let belowOffset = 12;

                  // For multiple points going below, stack them with very minimal offsets
                  if (rankFromHighest === 2 && shouldPositionBelow) {
                    belowOffset = 12; // 2nd highest gets first below position when below
                  } else if (rankFromHighest === 3 && shouldPositionBelow) {
                    belowOffset = 12 + 10; // 3rd highest gets second below position when below
                  } else {
                    belowOffset = 12 + 18; // 4th and beyond get further below positions - small gap
                  }

                  labelY = dataPointY + belowOffset;

                  // Ensure we don't go below chart bounds
                  if (labelY > chartBottom) {
                    labelY = chartBottom;
                  }
                } else {
                  // Position labels above data points
                  let aboveOffset = 12;

                  // For multiple points going above, stack them with very minimal offsets
                  if (rankFromHighest === 1) {
                    aboveOffset = 12; // Highest gets first above position - very close to point
                  } else if (rankFromHighest === 2 && !shouldPositionBelow) {
                    aboveOffset = 12 + 10; // 2nd highest gets second above position when close to 3rd
                  } else if (rankFromHighest === 3) {
                    aboveOffset = 12 + 10; // 3rd highest gets second above position - very small gap
                  }

                  labelY = dataPointY - aboveOffset;

                  // Ensure we don't go above chart bounds
                  if (labelY < chartTop) {
                    labelY = chartTop;
                  }
                }

                // Horizontal spacing for points that might need it
                if (totalPoints > 2) {
                  // Apply horizontal spacing only when we have multiple points at similar vertical levels
                  const needsHorizontalSpacing =
                    (!shouldPositionBelow && (rankFromHighest === 2 || rankFromHighest === 3)) || // 2nd or 3rd highest above
                    (shouldPositionBelow && (rankFromHighest === 2 || (rankFromHighest === 3 && idx === 0))); // 2nd highest or 3rd-as-lowest below

                  if (needsHorizontalSpacing) {
                    // Slight horizontal offset to avoid crowding
                    if (rankFromHighest === 2) {
                      labelX = point.x - 15; // 2nd highest slightly left
                    } else if (rankFromHighest === 3) {
                      labelX = point.x + 15; // 3rd highest slightly right
                    }
                  }
                }

                // Ensure label doesn't go outside horizontal chart bounds
                const maxX = adjustedWidth - 25;
                const minX = 25;
                labelX = Math.max(minX, Math.min(maxX, labelX));

                adjustedPositions.push({
                  x: labelX,
                  y: labelY,
                  value: point.percentage.toFixed(1),
                  color: point.color,
                  originalX: point.x,
                  originalY: dataPointY,
                  rankFromHighest: rankFromHighest,
                  positionedBelow: shouldPositionBelow
                });
              });

              return (
                <Group key={`labels-${xPos}`}>
                  {adjustedPositions.map((pos, idx) => (
                    <Fragment key={`label-${xPos}-${idx}`}>
                      {/* Add connecting line from data point to label when moved significantly */}
                      {(Math.abs(pos.x - pos.originalX) > 10 || Math.abs(pos.y - pos.originalY) > 30) && pos.value != -1.0 && (
                        <line
                          x1={pos.originalX}
                          y1={pos.originalY}
                          x2={pos.x}
                          y2={pos.y}
                          stroke="#666"
                          strokeWidth={0.7}
                          strokeDasharray="2,2"
                          opacity={0.6}
                        />
                      )}
                      <text
                        x={pos.x}
                        y={pos.y + 4}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                        fontWeight="600"
                      >
                        {pos.value}%
                      </text>
                    </Fragment>
                  ))}
                </Group>
              );
            });
          })()}

          {showPercentChange && renderChangeIndicators()}
        </Group>
      </svg>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px', marginBottom: '20px' }}>
        {!isSmallViewPort && dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[lineData.name] }}></div>
            <span style={{ fontSize: '1rem', fontWeight: '400', color: '#333' }}>{UtilityFunctions.getLegend(lineData.name)}</span>
          </div>
        ))}
        {isSmallViewPort && 
        <table>
          {
            dataSet.filter(ds => selectedDrugs?.includes(ds.name)).map((lineData, index) => (
              <tr>
                <td>
                    <div key={index} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
                    <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[lineData.name] }}></div>
                    <span style={{ fontSize: '1rem', fontWeight: '400', color: '#333' }}>{UtilityFunctions.getLegend(lineData.name)}</span>
                    </div>
                </td>
              </tr>
            ))
          }
        </table>
        }
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
  )}
</>
)
}

export default LineChart