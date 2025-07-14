import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import { UtilityFunctions } from '../utility';
import { allQuarters, allPeriods6M } from '../constants/Constants';

const lineColors = {
  'Fentanyl': '#8e44ad',
  'Cocaine': '#e74c3c',
  'Methamphetamine': '#3498db',
  'Heroin and Stimulants': '#f39c12',
};

// Align each drug's data to allPeriods6M
function alignDataToPeriods(drugData) {
  return drugData.map(ds => ({
    ...ds,
    values: allPeriods6M.map(period => {
      var found = ds.values.find(v => v.period == period);
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

const drugsToShow = [
  { key: 'Fentanyl', label: 'Fentanyl' },
  { key: 'Cocaine', label: 'Cocaine' },
  { key: 'Methamphetamine', label: 'Methamphetamine' },
  { key: 'Heroin and Stimulants', label: 'Heroin and Stimulants' },
];

const newNationalLineColors = lineColors; // for compatibility with your prompt

const Heroin6Monthssecondlinechart = ({ region = 'SOUTH', width, height = 350}) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [heroin6MonthsData2, setHeroin6MonthsData2] = useState([]);
  const [selectedLines, setSelectedLines] = useState(drugsToShow.map(line => line.key));

  // Tooltip HTML for percent change toggle
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
          ReactTooltip.rebuild();
        }, [showPercentChange]);

  useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {

          const nefData = UtilityFunctions.getGroupedData(data, 'North', 'Fentanyl', 'Positivity', 'HalfYearly', ['Fentanyl']);
          const necData = UtilityFunctions.getGroupedData(data, 'North', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const nemData = UtilityFunctions.getGroupedData(data, 'North', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const nehData = UtilityFunctions.getGroupedData(data, 'North', 'Heroin', 'CoPositive', 'HalfYearly', ['Heroin and Stimulants']);

          const mwfData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Fentanyl', 'Positivity', 'HalfYearly', ['Fentanyl']);
          const mwcData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const mwmData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const mwhData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Heroin', 'CoPositive', 'HalfYearly', ['Heroin and Stimulants']);

          const sfData = UtilityFunctions.getGroupedData(data, 'South', 'Fentanyl', 'Positivity', 'HalfYearly', ['Fentanyl']);
          const scData = UtilityFunctions.getGroupedData(data, 'South', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const smData = UtilityFunctions.getGroupedData(data, 'South', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const shData = UtilityFunctions.getGroupedData(data, 'South', 'Heroin', 'CoPositive', 'HalfYearly', ['Heroin and Stimulants']);

          const nfData = UtilityFunctions.getGroupedData(data, 'National', 'Fentanyl', 'Positivity', 'HalfYearly', ['Fentanyl']);
          const ncData = UtilityFunctions.getGroupedData(data, 'National', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const nmData = UtilityFunctions.getGroupedData(data, 'National', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const nhData = UtilityFunctions.getGroupedData(data, 'National', 'Heroin', 'CoPositive', 'HalfYearly', ['Heroin and Stimulants']);

          const wfData = UtilityFunctions.getGroupedData(data, 'South', 'Fentanyl', 'Positivity', 'HalfYearly', ['Fentanyl']);
          const wcData = UtilityFunctions.getGroupedData(data, 'South', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const wmData = UtilityFunctions.getGroupedData(data, 'South', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const whData = UtilityFunctions.getGroupedData(data, 'South', 'Heroin', 'CoPositive', 'HalfYearly', ['Heroin and Stimulants']);

        var sixMData = {};

        sixMData['NORTH'] = [{name: 'Fentanyl', values: nefData[0].data}, {name: 'Cocaine', values: necData[0].data}, {name: 'Methamphetamine', values: nemData[0].data}, {name: 'Heroin and Stimulants', values: nehData[0].data}];
        sixMData['MIDWEST'] = [{name: 'Fentanyl', values: mwfData[0].data}, {name: 'Cocaine', values: mwcData[0].data}, {name: 'Methamphetamine', values: mwmData[0].data}, {name: 'Heroin and Stimulants', values: mwhData[0].data}];
        sixMData['SOUTH'] = [{name: 'Fentanyl', values: sfData[0].data}, {name: 'Cocaine', values: scData[0].data}, {name: 'Methamphetamine', values: smData[0].data}, {name: 'Heroin and Stimulants', values: shData[0].data}];
        sixMData['National'] = [{name: 'Fentanyl', values: nfData[0].data}, {name: 'Cocaine', values: ncData[0].data}, {name: 'Methamphetamine', values: nmData[0].data}, {name: 'Heroin and Stimulants', values: nhData[0].data}];
        sixMData['WEST'] = [{name: 'Fentanyl', values: wfData[0].data}, {name: 'Cocaine', values: wcData[0].data}, {name: 'Methamphetamine', values: wmData[0].data}, {name: 'Heroin and Stimulants', values: whData[0].data}];
        
        setHeroin6MonthsData2(sixMData);

          });
      }, []); 

        // Use the correct data object for this chart
  const adjustedDataRaw = (heroin6MonthsData2 != null && Object.keys(heroin6MonthsData2).length > 0) ? (heroin6MonthsData2[regionKey] || heroin6MonthsData2['SOUTH']) : null;
  const adjustedData = (heroin6MonthsData2 != null && Object.keys(heroin6MonthsData2).length > 0) ? alignDataToPeriods(adjustedDataRaw) : null;

  if (!adjustedData || !Array.isArray(adjustedData)) {
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

  // Helper to get key finding for the drug with the largest change
  function getKeyFindingMajorChange() {
    // Only consider selected lines that exist in the region's data
    const findings = adjustedData
      .filter(ds => selectedLines.includes(ds.name))
      .map(ds => {
        // Find last two non-null values
        const vals = ds.values.filter(v => typeof v.percentage === 'number');
        if (vals.length < 2) {
          return null;
        }
        const prev = vals[vals.length - 2];
        const curr = vals[vals.length - 1];
        const diff = curr.percentage - prev.percentage;
        const pctChange = (diff / prev.percentage) * 100;
        return {
          name: ds.name,
          prev,
          curr,
          diff,
          pctChange,
        };
      })
      .filter(Boolean);

    if (findings.length === 0) {
      return "Key finding: No line selected.";
    }

    // Find the drug with the largest absolute percent change
    const major = findings.reduce((a, b) =>
      Math.abs(a.pctChange) >= Math.abs(b.pctChange) ? a : b
    );

    const direction = major.diff > 0 ? "increased" : major.diff < 0 ? "decreased" : "did not change";
    return `Key finding: <b>${major.name}</b> positivity ${direction} ${Math.abs(major.pctChange).toFixed(1)}% from ${major.prev.percentage.toFixed(1)}% in ${major.prev.period} to ${major.curr.percentage.toFixed(1)}% in ${major.curr.period}.`;
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
        <span style={{ fontWeight: 700 }} dangerouslySetInnerHTML={{ __html: getKeyFindingMajorChange() }} />
      </div>

      {/* --- Insert new selection controls here --- */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-heroin"
                checked={selectedLines.length === drugsToShow.length && drugsToShow.every(line => selectedLines.includes(line.key))}
                onChange={() => {
                  if (selectedLines.length === drugsToShow.length && drugsToShow.every(line => selectedLines.includes(line.key))) {
                    setSelectedLines([]);
                  } else {
                    setSelectedLines(drugsToShow.map(line => line.key));
                  }
                }}
                style={{ accentColor: selectedLines.length === drugsToShow.length ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="radio"
                name="select-clear-heroin"
                checked={selectedLines.length === 0}
                onChange={() => setSelectedLines([])}
                style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
              />
              <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
            </label>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
          {drugsToShow.map(drug => (
            <label key={drug.key} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={selectedLines.includes(drug.key)}
                onChange={() => {
                  if (selectedLines.includes(drug.key)) {
                    setSelectedLines(selectedLines.filter(line => line !== drug.key));
                  } else {
                    setSelectedLines([...selectedLines, drug.key]);
                  }
                }}
                style={{ display: 'none' }}
              />
              <span
                style={{
                  display: 'inline-block',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  border: `2px solid #888`,
                  background: '#fff',
                  marginRight: 2,
                  position: 'relative',
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                {selectedLines.includes(drug.key) && (
                  <span
                    style={{
                      display: 'block',
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: newNationalLineColors[drug.key] || lineColors[drug.key] || '#1f77b4',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
              </span>
              <span style={{ fontSize: '14px', color: '#222' }}>{drug.label}</span>
            </label>
          ))}
        </div>
      </div>
      {/* --- End selection controls --- */}

      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 12px 0', gap: 24, flexWrap: 'wrap' }}>
        
        <div style={{ flex: 1 }} />

       {UtilityFunctions.getToggleControls('Heroin6MonthssecondlinechartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
          {adjustedData
            .filter(ds => selectedLines.includes(ds.name))
            .map((ds, idx) => (
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

export default Heroin6Monthssecondlinechart;
