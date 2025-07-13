import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import { UtilityFunctions } from '../utility';

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

function FentanylLineChartBase({
  chartNum,
  title,
  yLabel,
  legendLabels,
  width,
  height, 
  showDrugSelection = true, 
}) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [westQuarterlyData, setWestQuarterlyData] = useState([]);
  const [westWithStimulantsQuarterly, setWestWithStimulantsQuarterly] = useState([]);
  const [westWithoutStimulantsQuarterly, setWestWithoutStimulantsQuarterly] = useState([]);

  const [methamphetamineWestData, setMethamphetamineWestData] = useState([]);
  const [cocaineWestData, setCocaineWestData] = useState([]);
  const [heroinWestData, setHeroinWestData] = useState([]);
  const [fentanylAndStimulantsData, setFentanylAndStimulantsData] = useState([]);
  

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  function getPrevValueForDataset(data, i, offset = 1) {
    let idx = i - 1, found = 0;
    while (idx >= 0 && found < offset) {
      if (data[idx] && data[idx].percentage !== null) found++;
      if (found < offset) idx--;
    }
    return (idx >= 0 && data[idx] && data[idx].percentage !== null) ? data[idx].percentage : null;
  }

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return datasets.map((ds, dsIdx) =>
      ds.data.map((d, i) => {
        if (i === 0 || d.percentage === null) return null;
        const prevPeriod = getPrevValueForDataset(ds.data, i, 1);
        const prevYear = getPrevValueForDataset(ds.data, i, 4);
        const curr = d.percentage;
        const periodChange = d.periodChange !== undefined ? d.periodChange : (
          (prevPeriod !== null && prevPeriod !== 0)
            ? ((curr - prevPeriod) / prevPeriod) * 100
            : null
        );
        const yearlyChange = d.yearlyChange !== undefined ? d.yearlyChange : (
          (prevYear !== null && prevYear !== 0)
            ? ((curr - prevYear) / prevYear) * 100
            : null
        );
        const x = xScale(d.quarter) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const showYearly = i >= 4;
        const getArrowColor = (change) => {
          if (change === null) return ds.color;
          return change > 0 ? '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-${ds.label}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={ds.color}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Quarterly Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                  </div>
                </div>
              </div>`}
              style={{ cursor: 'pointer' }}
            />
          </g>
        );
      })
    );
  };

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  useEffect(() => {
        fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
          .then(res => res.json())
          .then(data => {
  
        const fData =   UtilityFunctions.getGroupedData(data, 'West', 'Fentanyl', 'Positivity', 'Quarterly', ['Fentanyl', 'Fentanyl with Stimulants', 'Fentanyl without Stimulants']);
        const fDataCo = UtilityFunctions.getGroupedData(data, 'West', 'Fentanyl', 'CoPositive', 'Quarterly', ['Fentanyl and Stimulants']);

        const mData = UtilityFunctions.getGroupedData(data, 'West', 'Methamphetamine', 'Positivity', 'Quarterly', ['Methamphetamine']);
        const hData = UtilityFunctions.getGroupedData(data, 'West', 'Heroin', 'Positivity', 'Quarterly', ['Heroin']);
        const cData = UtilityFunctions.getGroupedData(data, 'West', 'Cocaine', 'Positivity', 'Quarterly', ['Cocaine']);

        setWestQuarterlyData(fData[0].data);
        setWestWithStimulantsQuarterly(fData[1].data);
        setWestWithoutStimulantsQuarterly(fData[2].data);

        setFentanylAndStimulantsData(fDataCo[0].data);

        setMethamphetamineWestData(mData[0].data);
        setCocaineWestData(hData[0].data);
        setHeroinWestData(cData[0].data);
 
          });
    }, []); 

  const alignedDatasets = [
  { data: westQuarterlyData, color: '#0073e6', label: 'Fentanyl' },
  { data: westWithStimulantsQuarterly, color: '#6a0dad', label: 'Fentanyl + Stimulants' },
  { data: westWithoutStimulantsQuarterly, color: '#e67e22', label: 'Fentanyl w/o Stimulants' },
];

const westThreeDrugsDatasets = [
  { data: methamphetamineWestData, color: '#3e92cc', label: 'Methamphetamine' },
  { data: cocaineWestData, color: '#fbb13c', label: 'Cocaine' },
  { data: heroinWestData, color: '#d7263d', label: 'Heroin' },
  { data: fentanylAndStimulantsData, color: '#1b9e77', label: 'Fentanyl and Stimulants' },
];

  const datasets = chartNum == 1 ? alignedDatasets : westThreeDrugsDatasets;

  const xDomain = allQuarters;
  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });

  const yMax = Math.max(
    ...datasets.flatMap(ds => ds.data.map(d => d.percentage || 0))
  );
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const [selectedLines, setSelectedLines] = useState(datasets.map(ds => ds.label));

  // Filter datasets based on selected drugs
  const filteredDatasets = datasets.filter(ds => selectedLines.includes(ds.label));

  function getKeyFindingForThreeDrugs() {
    if (!methamphetamineWestData || methamphetamineWestData.length < 2) return null;
    const lastIdx = methamphetamineWestData.length - 1;
    const prevIdx = methamphetamineWestData.length - 2;
    const last = methamphetamineWestData[lastIdx];
    const prev = methamphetamineWestData[prevIdx];
    if (!last || !prev) return null;
    const absChange = (last.percentage - prev.percentage).toFixed(1);
    const direction = absChange > 0 ? 'increased' : 'decreased';
    return (
      <>
        <span style={{ fontWeight: 700 }}>Key finding:</span> Methamphetamine positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}.
      </>
  );
  }

  function getKeyFinding() {
  if (!westQuarterlyData || westQuarterlyData.length < 2) return null;
  const lastIdx = westQuarterlyData.length - 1;
  const prevIdx = westQuarterlyData.length - 2;
  const last = westQuarterlyData[lastIdx];
  const prev = westQuarterlyData[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return (
    <>
      <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {direction} <span style={{fontWeight:800}}>{Math.abs(absChange)}%</span> from <span style={{fontWeight:800}}>{prev.percentage}%</span> in {prev.quarter} to <span style={{fontWeight:800}}>{last.percentage}%</span> in {last.quarter}. This may indicate {direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to fentanyl among people with substance use disorders.
    </>
  );
}

  const keyFinding = chartNum == 1 ? getKeyFinding() : getKeyFindingForThreeDrugs();

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            {title}
          </h3>
        </div>
      </div>
      {keyFinding && (
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
          {keyFinding}
        </div>
      )}
      {showDrugSelection && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '10px 0 0 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="select-clear-west"
                  checked={selectedLines.length === datasets.length && datasets.every(ds => selectedLines.includes(ds.label))}
                  onChange={() => {
                    if (selectedLines.length === datasets.length && datasets.every(ds => selectedLines.includes(ds.label))) {
                      setSelectedLines([]); 
                    } else {
                      setSelectedLines(datasets.map(ds => ds.label)); 
                    }
                  }}
                  style={{ accentColor: selectedLines.length === datasets.length ? '#222' : undefined }}
                />
                <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="radio"
                  name="select-clear-west"
                  checked={selectedLines.length === 0}
                  onChange={() => setSelectedLines([])} // Clear all selections
                  style={{ accentColor: selectedLines.length === 0 ? '#222' : undefined }}
                />
                <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
              </label>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '10px' }}>
            {datasets.map(ds => (
              <label key={ds.label} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedLines.includes(ds.label)}
                  onChange={() => {
                    if (selectedLines.includes(ds.label)) {
                      setSelectedLines(selectedLines.filter(line => line !== ds.label));
                    } else {
                      setSelectedLines([...selectedLines, ds.label]);
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
                  {selectedLines.includes(ds.label) && (
                    <span
                      style={{
                        display: 'block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: ds.color,
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}
                </span>
                <span style={{ fontSize: '14px', color: '#222' }}>{ds.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {UtilityFunctions.getToggleControls('FentanylLineChartWestToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          <text
            x={-adjustedHeight / 2}
            y={-margin.left + 15}
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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} 
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'end',
              dx: -6,
              dy: 3,
              fill: '#222',
            })}
          />    <AxisBottom
            top={adjustedHeight}
            scale={xScale}
            tickLabelProps={() => ({
              fontSize: 16,
              textAnchor: 'middle',
              dy: 10,
            })}
          />
          {datasets.map((ds, idx) => (
            <LinePath
              key={ds.label}
              data={ds.data}
              x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
              y={d => d.percentage !== null ? yScale(d.percentage) : null}
              stroke={ds.color}
              strokeWidth={2}
              curve={null}
            />
          ))}
          {datasets.map((ds, dsIdx) =>
            ds.data.map((d, i) => {
              if (d.percentage === null) return null;
              const n = ds.data.length;
              const showLabel = showLabels || (
                i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
              );
              let labelYOffset = -14;
              if (ds.label === 'Cocaine') labelYOffset = -8;
              if (ds.label === 'Heroin') labelYOffset = -8;
              if (ds.label === 'Fentanyl and Stimulants') labelYOffset = 22;
              return (
                <React.Fragment key={`${ds.label}-pt-${i}`}>
                  <Circle
                    cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                    cy={yScale(d.percentage)}
                    r={4}
                    fill={ds.color}
                    data-tip={`<div style='text-align: left;'>
                      <strong>${d.quarter}</strong><br/>
                      ${ds.label} positivity: ${d.percentage}%<br/>
                      Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                    </div>`}
                  />
                  {showLabel && (
                    <text
                      x={xScale(d.quarter) + xScale.bandwidth() / 2}
                      y={yScale(d.percentage) + labelYOffset}
                      fontSize={13}
                      textAnchor="middle"
                      fill={ds.color}
                      fontWeight={dsIdx === 0 ? 700 : 500}
                      style={{ pointerEvents: 'none' }}
                    >
                      {d.percentage}%
                    </text>
                  )}
                </React.Fragment>
              );
            })
          )}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {legendLabels.map((legend, idx) => (
          <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < legendLabels.length - 1 ? '15px' : 0 }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: legend.color, marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
}

const FentanylLineChartWest = ({width, height}) => {
  return (
    <div>
      <FentanylLineChartBase
        chartNum={1}
        title="How often do people with a substance use disorder test positive for fentanyl on urine drug tests: Western Census Region Q1 2023 - Q4 2024. Millennium Health, Western Census Region Q1 2023 - Q4 2024"
        yLabel="% of people with substance use disorder
with drug(s) detected"
        legendLabels={[
          { color: '#0073e6', label: 'Fentanyl' },
          { color: '#6a0dad', label: 'Fentanyl with Stimulants' },
          { color: '#e67e22', label: 'Fentanyl without Stimulants' },
        ]}
        showDrugSelection={false}
        width={width}
        height={height}
      />
      <FentanylLineChartBase
        chartNum={2}
        title="How often do people with a substance use disorder test positive for methamphetamine, cocaine, Fentanyl and Stimulants or heroin on urine drug tests: Western Census Region Q1 2023 - Q4 2024"
        yLabel="% of people with substance use disorder
with drug detected"
        legendLabels={[
          { color: '#3e92cc', label: 'Methamphetamine' },
          { color: '#fbb13c', label: 'Cocaine' },
          { color: '#d7263d', label: 'Heroin' },
          { color: '#1b9e77', label: 'Fentanyl and Stimulants' }, 
        ]}
        width={width}
        height={height}
        
        showDrugSelection={true}
      />
    </div>
  );
};

export default FentanylLineChartWest;

