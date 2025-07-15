import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';
import { UtilityFunctions } from '../utility';

const lineColors = {
  National: '#1f77b4',
  "Cocaine with Opioids": '#e377c2',
  "Cocaine without Opioids": '#ff7f0e',
  West: '#1f77b4',
  "West Cocaine with Opioids": '#e377c2',
  "West Cocaine without Opioids": '#ff7f0e',
  Midwest: '#1f77b4',
  "Midwest Cocaine with Opioids": '#e377c2',
  "Midwest Cocaine without Opioids": '#ff7f0e',
  South: '#1f77b4',
  "South Cocaine with Opioids": '#e377c2',
  "South Cocaine without Opioids": '#ff7f0e',
  Northeast: '#1f77b4',
  "Northeast Cocaine with Opioids": '#e377c2',
  "Northeast Cocaine without Opioids": '#ff7f0e',
};

const newNationalLineColors = {
  // National
  Fentanyl: '#1f77b4',
  Heroin: '#d62728',
  Opioids: '#ff7f0e',
  Methamphetamine: '#2ca02c',
  // West
  "West Fentanyl": '#9467bd',
  "West Heroin": '#8c564b',
  "West Opioids": '#e377c2',
  "West Methamphetamine": '#17becf',
  // Midwest
  "Midwest Fentanyl": '#bcbd22',
  "Midwest Heroin": '#7f7f7f',
  "Midwest Opioids": '#aec7e8',
  "Midwest Methamphetamine": '#ffbb78',
  // South
  "South Fentanyl": '#e41a1c',
  "South Heroin": '#377eb8',
  "South Opioids": '#4daf4a',
  "South Methamphetamine": '#984ea3',
  // Northeast
  "Northeast Fentanyl": '#ff7f00',
  "Northeast Heroin": '#a65628',
  "Northeast Opioids": '#f781bf',
  "Northeast Methamphetamine": '#999999',
};

const getNewNationalDrugs = (region = "National") => {
  if (region === "West") {
    return [
      { key: "West Heroin", label: "Heroin" },
      { key: "West Cocaine", label: "Cocaine" },

      { key: "West Methamphetamine", label: "Methamphetamine" },
      { key: "West Fentanyl and Stimulants", label: "Fentanyl and Stimulants" },
    ];
  }
  if (region === "Midwest") {
    return [
      { key: "Midwest Heroin", label: "Heroin" },
            { key: "Midwest Cocaine", label: "Cocaine" },
      { key: "Midwest Fentanyl and Stimulants", label: "Fentanyl and Stimulants" },

      { key: "Midwest Methamphetamine", label: "Methamphetamine" },
    ];
  }
  if (region === "South") {
    return [
      { key: "South Heroin", label: "Heroin" },
      { key: "South Methamphetamine", label: "Methamphetamine" },
                  { key: "South Cocaine", label: "Cocaine" },
                        { key: "South Fentanyl and Stimulants", label: "Fentanyl and Stimulants" },


    ];
  }
  if (region === "Northeast") {
    return [
      { key: "Northeast Heroin", label: "Heroin" },
                        { key: "Northeast Cocaine", label: "Cocaine" },
                                                { key: "Northeast Fentanyl and Stimulants", label: "Fentanyl and Stimulants" },


      { key: "Northeast Methamphetamine", label: "Methamphetamine" },
    ];
  }
  // Default to National
  return [
    { key: 'Fentanyl and Stimulants', label: 'Fentanyl and Stimulants' },
    { key: 'Heroin', label: 'Heroin' },
    { key: 'Cocaine', label: 'Cocaine' },
    { key: 'Methamphetamine', label: 'Methamphetamine' },
  ];
};

const getKeyFindingNew = (data) => {
  if (!data || data.length < 2) return null;
  const lastIdx = data.length - 1;
  const prevIdx = data.length - 2;
  const last = data[lastIdx];
  const prev = data[prevIdx];
  if (!last || !prev) return null;
  const absChange = (last.percentage - prev.percentage).toFixed(1);
  const direction = absChange > 0 ? 'increased' : 'decreased';
  return {
    direction,
    absChange: Math.abs(absChange),
    prev: prev.percentage,
    prevLabel: prev.period,
    last: last.percentage,
    lastLabel: last.period,
  };
};

const NationalMultiDrugLineChart = ({ region = "National", width, height }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [newNationalDrugsData, setNewNationalDrugsData] = useState([]);
  
  const drugsToShow = getNewNationalDrugs(region);
  const dataSets = drugsToShow.map(drug => ({
    key: drug.key,
    label: drug.label,
    data: newNationalDrugsData[drug.key] || [],
  }));

  const regionLineKeys = drugsToShow.map(d => d.key);
  const [selectedLines, setSelectedLines] = useState(regionLineKeys);

  const [radioValue, setRadioValue] = useState('all');
  useEffect(() => {
    if (radioValue === 'all') {
      setSelectedLines(regionLineKeys);
    } else {
      setSelectedLines([radioValue]);
    }
    // eslint-disable-next-line
  }, [radioValue, region]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

  useEffect(() => {
      fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
        .then(res => res.json())
        .then(data => {

          const nhData = UtilityFunctions.getGroupedData(data, 'National', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin']);
          const ncData = UtilityFunctions.getGroupedData(data, 'National', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const nmData = UtilityFunctions.getGroupedData(data, 'National', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const nfData = UtilityFunctions.getGroupedData(data, 'National', 'Fentanyl', 'CoPositive', 'HalfYearly', ['Fentanyl and Stimulants']);

          const whData = UtilityFunctions.getGroupedData(data, 'West', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin']);
          const wcData = UtilityFunctions.getGroupedData(data, 'West', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const wmData = UtilityFunctions.getGroupedData(data, 'West', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const wfData = UtilityFunctions.getGroupedData(data, 'West', 'Fentanyl', 'CoPositive', 'HalfYearly', ['Fentanyl and Stimulants']);

          const mwhData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin']);
          const mwcData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const mwmData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const mwfData = UtilityFunctions.getGroupedData(data, 'MidWest', 'Fentanyl', 'CoPositive', 'HalfYearly', ['Fentanyl and Stimulants']);

          const shData = UtilityFunctions.getGroupedData(data, 'South', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin']);
          const scData = UtilityFunctions.getGroupedData(data, 'South', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const smData = UtilityFunctions.getGroupedData(data, 'South', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const sfData = UtilityFunctions.getGroupedData(data, 'South', 'Fentanyl', 'CoPositive', 'HalfYearly', ['Fentanyl and Stimulants']);

          const nehData = UtilityFunctions.getGroupedData(data, 'North', 'Heroin', 'Positivity', 'HalfYearly', ['Heroin']);
          const necData = UtilityFunctions.getGroupedData(data, 'North', 'Cocaine', 'Positivity', 'HalfYearly', ['Cocaine']);
          const nemData = UtilityFunctions.getGroupedData(data, 'North', 'Methamphetamine', 'Positivity', 'HalfYearly', ['Methamphetamine']);
          const nefData = UtilityFunctions.getGroupedData(data, 'North', 'Fentanyl', 'CoPositive', 'HalfYearly', ['Fentanyl and Stimulants']);

          var newNationalDrugsData = {};
          newNationalDrugsData['Heroin'] = nhData[0].data;
          newNationalDrugsData['Cocaine'] = ncData[0].data;
          newNationalDrugsData['Methamphetamine'] = nmData[0].data;
          newNationalDrugsData['Fentanyl and Stimulants'] = nfData[0].data;

          newNationalDrugsData['West Heroin'] = whData[0].data;
          newNationalDrugsData['West Cocaine'] = wcData[0].data;
          newNationalDrugsData['West Methamphetamine'] = wmData[0].data;
          newNationalDrugsData['West Fentanyl and Stimulants'] = wfData[0].data;

          newNationalDrugsData['Midwest Heroin'] = mwhData[0].data;
          newNationalDrugsData['Midwest Cocaine'] = mwcData[0].data;
          newNationalDrugsData['Midwest Methamphetamine'] = mwmData[0].data;
          newNationalDrugsData['Midwest Fentanyl and Stimulants'] = mwfData[0].data;

          newNationalDrugsData['South Heroin'] = shData[0].data;
          newNationalDrugsData['South Cocaine'] = scData[0].data;
          newNationalDrugsData['South Methamphetamine'] = smData[0].data;
          newNationalDrugsData['South Fentanyl and Stimulants'] = sfData[0].data;

          newNationalDrugsData['Northeast Heroin'] = nehData[0].data;
          newNationalDrugsData['Northeast Cocaine'] = necData[0].data;
          newNationalDrugsData['Northeast Methamphetamine'] = nemData[0].data;
          newNationalDrugsData['Northeast Fentanyl and Stimulants'] = nefData[0].data;

          setNewNationalDrugsData(newNationalDrugsData);
        });
  
    }, []);

    const xDomain = Array.from(
    new Set(dataSets.flatMap(ds => ds.data.map(d => d.period)))
  );
  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...dataSets.flatMap(ds => ds.data.map(d => d.percentage)));
  const yScale = scaleLinear({
    domain: [0, yMax],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return dataSets.map(ds =>
      ds.data.map((d, i) => {
        if (i === 0) return null;
        const prevPeriod = i > 0 ? ds.data[i - 1].percentage : null;
        const prevYear = i >= 2 ? ds.data[i - 2].percentage : null;
        const curr = d.percentage;
        const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
        const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
        const x = xScale(d.period) + xScale.bandwidth() / 2;
        const y = yScale(curr);
        const getArrowColor = (change) => {
          if (change === null) return newNationalLineColors[ds.key] || '#6a0dad';
          return change > 0 ? newNationalLineColors[ds.key] || '#6a0dad' : '#0073e6';
        };
        return (
          <g key={`indicator-new-${ds.key}-${i}`}>
            <Circle
              cx={x}
              cy={y}
              r={4}
              fill={newNationalLineColors[ds.key] || '#0073e6'}
              data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                ${i >= 2 ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(yearlyChange)}' transform='rotate(${yearlyChange !== null && yearlyChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>Yearly Change</strong><br/>
                    ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>` : ''}
                <div style='display: flex; align-items: center;'>
                  <svg width='20' height='20' style='margin-right: 10px;'>
                    <polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${getArrowColor(periodChange)}' transform='rotate(${periodChange !== null && periodChange > 0 ? 0 : 180}, 10, 10)' />
                  </svg>
                  <div>
                    <strong>6 Month Change</strong><br/>
                    ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                    ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.period}
                  </div>
                </div>
              </div>`}
            />
          </g>
        );
      })
    );
  };

  const keyFinding = getKeyFindingNew(dataSets[0].data);

  const getshowLabels = (len, i) =>
  {
    let showLabel = false;
    showLabel = showLabels || (
      i === 0 || i === len - 1 || i === len - 2 || i === Math.floor((len - 1) / 2)
    );
    return showLabel;
  }
  
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, and methamphetamine on urine drug tests: National Jan 2023 - Dec 2024 (6 Months). Millennium Health, National Jan 2023 - Dec 2024
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
        {keyFinding ? (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> {keyFinding.absChange}% {keyFinding.direction} from {keyFinding.prev}% in {keyFinding.prevLabel} to {keyFinding.last}% in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to {keyFinding.lastLabel} among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      <div style={{ margin: '18px 0 0 0' }}>
        {/* Replace the old radio button group with the new selection controls */}
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
      </div>

      {UtilityFunctions.getToggleControls('NationalMultiDrugLineChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
          {dataSets
            .filter(ds => selectedLines.includes(ds.key))
            .map(ds => (
              <React.Fragment key={ds.key}>
                <LinePath
                  data={ds.data}
                  x={d => xScale(d.period) + xScale.bandwidth() / 2}
                  y={d => yScale(d.percentage)}
                  stroke={lineColors[ds.key] || newNationalLineColors[ds.key] || '#1f77b4'}
                  strokeWidth={2}
                  curve={null}
                />
                {ds.data.map((d, i) => (
                  <React.Fragment key={i}>
                    <Circle
                      cx={xScale(d.period) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.key] || newNationalLineColors[ds.key] || '#1f77b4'}
                      data-tip={`<div style='text-align: left;'>
                        <strong>${d.period}</strong><br/>
                        ${ds.label} positivity: ${d.percentage}%<br/>
                        Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                      </div>`}
                    />
                    {getshowLabels(ds.data.length, i) && (
                      <text
                        x={xScale(d.period) + xScale.bandwidth() / 2}
                        y={yScale(d.percentage) - 14}
                        fontSize={12}
                        textAnchor="middle"
                        fill="#333"
                      >
                        {d.percentage}%
                      </text>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {drugsToShow.map(drug => (
          <div key={drug.key} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[drug.key] || newNationalLineColors[drug.key] || '#1f77b4', marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{drug.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};



const LineSelector = ({ lineColors, selectedLines, setSelectedLines }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input
            type="radio"
            name="select-clear-heroin"
            checked={selectedLines.length === Object.keys(lineColors).length && Object.keys(lineColors).every(line => selectedLines.includes(line))}
            onChange={() => {
              if (selectedLines.length === Object.keys(lineColors).length && Object.keys(lineColors).every(line => selectedLines.includes(line))) {
                setSelectedLines([]);
              } else {
                setSelectedLines(Object.keys(lineColors));
              }
            }}
            style={{ accentColor: selectedLines.length === Object.keys(lineColors).length ? '#222' : undefined }}
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
      {Object.entries(lineColors).map(([drug, color]) => (
        <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={selectedLines.includes(drug)}
            onChange={() => {
              if (selectedLines.includes(drug)) {
                setSelectedLines(selectedLines.filter(line => line !== drug));
              } else {
                setSelectedLines([...selectedLines, drug]);
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
            {selectedLines.includes(drug) && (
              <span
                style={{
                  display: 'block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: color,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            )}
          </span>
          <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
        </label>
      ))}
    </div>
  </div>
);

export { NationalMultiDrugLineChart };

export default NationalMultiDrugLineChart;
