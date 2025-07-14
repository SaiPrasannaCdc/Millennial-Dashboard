import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import { UtilityFunctions } from '../utility';
import { allQuarters, allPeriods6M } from '../constants/Constants';

const lineColors = {
  'Heroin': '#8e44ad',
  'Heroin with Stimulants': '#e74c3c',
  'Heroin without Stimulants': '#3498db',
};

// Align each drug's data to allPeriods6M
function alignDataToPeriods(drugData) {
  return drugData.map(ds => ({
    ...ds,
    values: allPeriods6M.map(period => {
      const found = ds.values.find(v => v.period == period);
      return found || { period, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

// Add this function before your component
function normalizeRegionKey(region) {
  const key = (region || '').toUpperCase().trim();
  if (key.includes('NORTH')) return 'NORTH';
  if (key.includes('MIDWEST')) return 'MIDWEST';
  if (key.includes('SOUTH')) return 'SOUTH';
  if (key.includes('WEST')) return 'WEST';
  if (key.includes('National')) return 'National';
  return 'SOUTH'; // fallback
}

const HeroinLineChartRegions6months = ({ region, width, height }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [heroinSouth6MData, setHeroinSouth6MData] = useState([]);
  const [heroinWest6MData, setHeroinWest6MData] = useState([]); // NEW: state for West region
  const [heroinNortheast6MData, setHeroinNortheast6MData] = useState([]); // NEW: state for Northeast region
  const [heroinNational6MData, setHeroinNational6MData] = useState([]); // NEW: state for National region
  const [heroinMidwest6MData, setHeroinMidwest6MData] = useState([]); // NEW: state for Midwest region

  const percentChgTooltip = `
    <div style="
      text-align: center;
      padding: 16px 12px;
      color: #222;
      font-size: 15px;
      max-width: 260px;
      min-width: 220px;
      margin: 0 auto;
      border-radius: 14px;
      background: #ededed;
      box-shadow: 0 2px 12px #bbb3;
    ">
      <div style="margin-top: 8px;">
        When <b>% Chg</b> is on, hover over the data point for the 5 most recent periods to view percent change from the same period in the previous year and the previous period.
      </div>
    </div>
  `;

  // Fix regionKey normalization
  const regionKey = normalizeRegionKey(region);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {

        // SOUTH 
        const sData = UtilityFunctions.getGroupedData(data, 'South', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin','Heroin with Stimulants','Heroin without Stimulants']);
        const heroinSouth = [{name: 'Heroin', values: sData[0].data}, {name: 'Heroin with Stimulants', values: sData[1].data}, {name: 'Heroin without Stimulants', values: sData[2].data}]
        setHeroinSouth6MData(heroinSouth);
        // WEST 
        const wData = UtilityFunctions.getGroupedData(data, 'West', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin','Heroin with Stimulants','Heroin without Stimulants']);
        const heroinWest = [{name: 'Heroin', values: wData[0].data}, {name: 'Heroin with Stimulants', values: wData[1].data}, {name: 'Heroin without Stimulants', values: wData[2].data}]
        setHeroinWest6MData(heroinWest);

        // NORTHEAST
        const neData = UtilityFunctions.getGroupedData(data, 'North', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin','Heroin with Stimulants','Heroin without Stimulants']);
        const heroinNortheast = [{name: 'Heroin', values: neData[0].data}, {name: 'Heroin with Stimulants', values: neData[1].data}, {name: 'Heroin without Stimulants', values: neData[2].data}]
        setHeroinNortheast6MData(heroinNortheast);

        // National
        const nData = UtilityFunctions.getGroupedData(data, 'National', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin','Heroin with Stimulants','Heroin without Stimulants']);
        const heroinNational = [{name: 'Heroin', values: nData[0].data}, {name: 'Heroin with Stimulants', values: nData[1].data}, {name: 'Heroin without Stimulants', values: nData[2].data}]
        setHeroinNational6MData(heroinNational);

        // MIDWEST 
        const mwData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin','Heroin with Stimulants','Heroin without Stimulants']);
        const heroinMidwest = [{name: 'Heroin', values: mwData[0].data}, {name: 'Heroin with Stimulants', values: mwData[1].data}, {name: 'Heroin without Stimulants', values: mwData[2].data}]
        setHeroinMidwest6MData(heroinMidwest);
      });

  }, []);

  var adjustedDataRaw = null;
  
  if (regionKey === 'SOUTH')
     adjustedDataRaw = heroinSouth6MData;
  else if (regionKey === 'WEST')
    adjustedDataRaw = heroinWest6MData;
  else if (regionKey === 'NORTH')
    adjustedDataRaw = heroinNortheast6MData;
  else if (regionKey === 'National')
    adjustedDataRaw = heroinNational6MData;
  else if (regionKey === 'MIDWEST')
    adjustedDataRaw = heroinMidwest6MData;
    
  const adjustedData = alignDataToPeriods(adjustedDataRaw);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, adjustedData]);

  if (!adjustedData || !Array.isArray(adjustedData) || adjustedData.length === 0) {
    return (
      <div style={{ color: 'red', textAlign: 'center', margin: 40 }}>
        No data available for the selected region.
      </div>
    );
  }

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xDomain = allPeriods6M;
  const xAccessor = d => d.period;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.35, // Increase padding for better spread
  });

  const yMax = Math.max(
    5,
    ...adjustedData.flatMap(ds =>
      ds.values.map(v => (typeof v.percentage === 'number' ? v.percentage : 0))
    )
  );

  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const getPrevPeriodValue = (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return lineData.values[i - offset].percentage;
    }
    return null;
  };

  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;
    return adjustedData.map((lineData, index) => {
      return lineData.values.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = getPrevPeriodValue(lineData, i, 1);
        const yearlyOffset = 2;
        const prevYear = getPrevPeriodValue(lineData, i, yearlyOffset);
        const curr = d.percentage;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const xLabel = xAccessor(d);
        const xPosition = xScale(xLabel) + xScale.bandwidth() / 2;
        const yPosition = yScale(curr);
        if (isNaN(xPosition) || isNaN(yPosition)) return null;
        const showYearlyIndicator = i >= yearlyOffset;
        const getArrowColor = (change) => {
          if (change === null) return '#6a0dad';
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-heroin-south-${index}-${i}`}> 
            <Circle
              cx={xPosition}
              cy={yPosition}
              r={4}
              fill={index === 0 ? '#0073e6' : '#ff6600'}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${showYearlyIndicator ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>6-Month Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    Heroin positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${xLabel}
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

  // Helper to get key finding for Heroin line
  function getKeyFinding() {
    const heroinLine = adjustedData.find(ds => ds.name === 'Heroin');
    if (!heroinLine || heroinLine.values.length < 2) {
      return "Key finding: Not enough data to calculate change.";
    }
    // Find last two non-null values
    const vals = heroinLine.values.filter(v => typeof v.percentage === 'number');
    if (vals.length < 2) {
      return "Key finding: Not enough data to calculate change.";
    }
    const prev = vals[vals.length - 2];
    const curr = vals[vals.length - 1];
    const diff = curr.percentage - prev.percentage;
    const pctChange = (diff / prev.percentage) * 100;
    const direction = diff > 0 ? "increased" : diff < 0 ? "decreased" : "did not change";
    return `Key finding: Heroin positivity ${direction} ${Math.abs(pctChange).toFixed(1)}% from ${prev.percentage.toFixed(1)}% in ${prev.period} to ${curr.percentage.toFixed(1)}% in ${curr.period}.`;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for heroin: Southern Census Region Jul 2022 – Dec 2024. Millennium Health, Southern Census Region Jul 2022 – Dec 2024
          </h3>
        </div>
      </div>
      <div style={{
        background: '#4d194d',
        color: '#fff',
        borderRadius: '24px',
        padding: '14px 24px',
        margin: '18px auto 0 auto',
        fontWeight: 700,
        fontSize: '15px',
        maxWidth: '1200px',
        boxShadow: 'none',
        border: 'none',
        lineHeight: 1.2,
        display: 'block',
        fontFamily: 'Barlow, Arial, sans-serif',
        letterSpacing: '0.01em',
      }}>
        <span style={{ fontWeight: 700 }}>
          {getKeyFinding()}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 12px 0', gap: 24, flexWrap: 'wrap' }}>
        
        <div style={{ flex: 1 }} />
        
        {UtilityFunctions.getToggleControls('HeroinLineChartRegions6monthsToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

      </div>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <text
            x={-70}
            y={adjustedHeight / 2}
            textAnchor="middle"
            fontFamily="Segoe UI, Arial, sans-serif"
            fontWeight={600}
            fontSize={15}
            fill="#222"
            letterSpacing="0.01em"
            transform={`rotate(-90, -70, ${adjustedHeight / 2})`}
          >
            <tspan x={-70} dy={-6}>% of people with substance use disorder</tspan>
            <tspan x={-70} dy={16}>with drug(s) detected</tspan>
          </text>
          <AxisLeft
            scale={yScale}
            tickFormat={value => `${value}%`}
            tickLabelProps={() => ({
              fontSize: 16,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              fill: '#222',
              textAnchor: 'end',
              dx: -8,
              dy: 3,
            })}
          />
          <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />
          {adjustedData.map((ds, idx) => (
            
            <React.Fragment key={ds.name}>
              <LinePath
                data={ds.values}
                x={d => xScale(d.period) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={lineColors[ds.name]}
                strokeWidth={3}
                curve={null}
              />
              {ds.values.map((d, i) => {

                if (d.percentage === null) return null;
                const n = ds.values.length;
                let showLabel = false;
                showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.name === 'Heroin and Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.name}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.period) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.name]}
                      data-tip={
                        showPercentChange
                          ? undefined
                          : `<div style='text-align: left;'><strong>${d.period}</strong><br/>${ds.name} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
                      }
                    />
                    {showLabel && (
                      <text
                        x={xScale(d.period) + xScale.bandwidth() / 2}
                        y={yScale(d.percentage) + labelYOffset}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                      >
                        {d.percentage}%
                      </text>
                    )}
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
          {renderChangeIndicatorsUnified()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {Object.entries(lineColors).map(([drug, color]) => (
          <div key={drug} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{drug}</span>
          </div>
        ))}
      </div>
      <ReactTooltip html={true} />
    </div>
  );
};

export default HeroinLineChartRegions6months;
