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

const getNationalDrugs = () => [
  { key: 'National', label: 'Cocaine' },
  { key: 'Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getWestDrugs = () => [
  { key: 'West', label: 'Cocaine' },
  { key: 'West Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'West Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getMidwestDrugs = () => [
  { key: 'Midwest', label: 'Cocaine' },
  { key: 'Midwest Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Midwest Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getSouthDrugs = () => [
  { key: 'South', label: 'Cocaine' },
  { key: 'South Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'South Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

const getNortheastDrugs = () => [
  { key: 'Northeast', label: 'Cocaine' },
  { key: 'Northeast Cocaine with Opioids', label: 'Cocaine with Opioids' },
  { key: 'Northeast Cocaine without Opioids', label: 'Cocaine without Opioids' },
];

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

const newNationalDrugsData = {
  Heroin: [
    { period: 'Jul-Dec 2022', percentage: 19.8, ciLower: 19, ciUpper: 20.7 },
    { period: 'Jan-Jun 2023', percentage: 20.2, ciLower: 19.6, ciUpper: 20.8 },
    { period: 'Jul-Dec 2023', percentage: 19.5, ciLower: 18.9, ciUpper: 20.1 },
    { period: 'Jan-Jun 2024', percentage: 19.4, ciLower: 18.8, ciUpper: 20 },
    { period: 'Jul-Dec 2024', percentage: 27.5, ciLower: 26.9, ciUpper: 28.2 },
  ],
  Cocaine: [
    { period: 'Jul-Dec 2022', percentage: 21.1, ciLower: 20.3, ciUpper: 22 },
    { period: 'Jan-Jun 2023', percentage: 23.7, ciLower: 23.1, ciUpper: 24.4 },
    { period: 'Jul-Dec 2023', percentage: 24.8, ciLower: 24.2, ciUpper: 25.5 },
    { period: 'Jan-Jun 2024', percentage: 26.3, ciLower: 25.7, ciUpper: 27 },
    { period: 'Jul-Dec 2024', percentage: 29.1, ciLower: 28.4, ciUpper: 29.7 },
  ],
  Methamphetamine: [
    { period: 'Jul-Dec 2022', percentage: 52.5, ciLower: 51.5, ciUpper: 53.6 },
    { period: 'Jan-Jun 2023', percentage: 53.6, ciLower: 52.9, ciUpper: 54.3 },
    { period: 'Jul-Dec 2023', percentage: 54.5, ciLower: 53.8, ciUpper: 55.2 },
    { period: 'Jan-Jun 2024', percentage: 58.7, ciLower: 57.8, ciUpper: 59.4 },
    { period: 'Jul-Dec 2024', percentage: 65.9, ciLower: 65.2, ciUpper: 66.5 },
  ],
  "Fentanyl and Stimulants": [
    { period: 'Jul-Dec 2022', percentage: 65.4, ciLower: 64.4, ciUpper: 66.4 },
    { period: 'Jan-Jun 2023', percentage: 67.7, ciLower: 67.1, ciUpper: 68.4 },
    { period: 'Jul-Dec 2023', percentage: 69.3, ciLower: 68.7, ciUpper: 70 },
    { period: 'Jan-Jun 2024', percentage: 72.2, ciLower: 71.6, ciUpper: 72.8 },
    { period: 'Jul-Dec 2024', percentage: 78.6, ciLower: 78, ciUpper: 79.2 },
  ],
  // --- WEST DATA ---
  "West Heroin": [
    { period: 'Jul-Dec 2022', percentage: 14.7, ciLower: 13.7, ciUpper: 15.7 },
    { period: 'Jan-Jun 2023', percentage: 13.9, ciLower: 13.2, ciUpper: 14.6 },
    { period: 'Jul-Dec 2023', percentage: 11.6, ciLower: 11.0, ciUpper: 12.3 },
    { period: 'Jan-Jun 2024', percentage: 10.3, ciLower: 9.7, ciUpper: 10.9 },
    { period: 'Jul-Dec 2024', percentage: 21.8, ciLower: 21.1, ciUpper: 22.6 },
  ],
  "West Cocaine": [
    { period: 'Jul-Dec 2022', percentage: 9.5, ciLower: 8.7, ciUpper: 10.3 },
    { period: 'Jan-Jun 2023', percentage: 10.7, ciLower: 10.1, ciUpper: 11.3 },
    { period: 'Jul-Dec 2023', percentage: 12.3, ciLower: 11.7, ciUpper: 13.0 },
    { period: 'Jan-Jun 2024', percentage: 15.2, ciLower: 14.5, ciUpper: 15.9 },
    { period: 'Jul-Dec 2024', percentage: 19.7, ciLower: 19.0, ciUpper: 20.4 },
  ],
  "West Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 66.8, ciLower: 65.5, ciUpper: 68.1 },
    { period: 'Jan-Jun 2023', percentage: 71.0, ciLower: 70.1, ciUpper: 71.9 },
    { period: 'Jul-Dec 2023', percentage: 73.6, ciLower: 72.7, ciUpper: 74.5 },
    { period: 'Jan-Jun 2024', percentage: 75.8, ciLower: 75.0, ciUpper: 76.6 },
    { period: 'Jul-Dec 2024', percentage: 82.5, ciLower: 81.8, ciUpper: 83.2 },
  ],
  "West Fentanyl and Stimulants": [
    { period: 'Jul-Dec 2022', percentage: 70.0, ciLower: 68.7, ciUpper: 71.3 },
    { period: 'Jan-Jun 2023', percentage: 73.7, ciLower: 72.8, ciUpper: 74.6 },
    { period: 'Jul-Dec 2023', percentage: 76.8, ciLower: 75.9, ciUpper: 77.6 },
    { period: 'Jan-Jun 2024', percentage: 78.8, ciLower: 78.0, ciUpper: 79.6 },
    { period: 'Jul-Dec 2024', percentage: 85.2, ciLower: 84.5, ciUpper: 85.8 },
  ],


  // --- MIDWEST DATA ---

  "Midwest Heroin": [
    { period: 'Jul-Dec 2022', percentage: 22.3, ciLower: 20.5, ciUpper: 24.0 },
    { period: 'Jan-Jun 2023', percentage: 25.2, ciLower: 24.0, ciUpper: 26.8 },
    { period: 'Jul-Dec 2023', percentage: 27.8, ciLower: 26.6, ciUpper: 28.9 },
    { period: 'Jan-Jun 2024', percentage: 31.7, ciLower: 30.4, ciUpper: 33.0 },
    { period: 'Jul-Dec 2024', percentage: 35.5, ciLower: 34.1, ciUpper: 36.9 },
  ],
  "Midwest Cocaine": [
    { period: 'Jul-Dec 2022', percentage: 34.7, ciLower: 32.6, ciUpper: 36.7 },
    { period: 'Jan-Jun 2023', percentage: 35.7, ciLower: 34.7, ciUpper: 37.1 },
    { period: 'Jul-Dec 2023', percentage: 35.9, ciLower: 34.7, ciUpper: 37.1 },
    { period: 'Jan-Jun 2024', percentage: 40.4, ciLower: 39.0, ciUpper: 41.7 },
    { period: 'Jul-Dec 2024', percentage: 41.0, ciLower: 39.6, ciUpper: 42.5 },
  ],
  "Midwest Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 36.1, ciLower: 34.0, ciUpper: 38.1 },
    { period: 'Jan-Jun 2023', percentage: 39.6, ciLower: 38.2, ciUpper: 40.9 },
    { period: 'Jul-Dec 2023', percentage: 38.5, ciLower: 37.3, ciUpper: 39.8 },
    { period: 'Jan-Jun 2024', percentage: 41.2, ciLower: 39.8, ciUpper: 42.6 },
    { period: 'Jul-Dec 2024', percentage: 44.3, ciLower: 42.8, ciUpper: 45.7 },
  ],
  "Midwest Fentanyl and Stimulants": [
    { period: 'Jul-Dec 2022', percentage: 59.5, ciLower: 57.4, ciUpper: 61.6 },
    { period: 'Jan-Jun 2023', percentage: 62.9, ciLower: 61.6, ciUpper: 64.2 },
    { period: 'Jul-Dec 2023', percentage: 63.0, ciLower: 61.8, ciUpper: 64.2 },
    { period: 'Jan-Jun 2024', percentage: 66.6, ciLower: 65.3, ciUpper: 67.9 },
    { period: 'Jul-Dec 2024', percentage: 70.1, ciLower: 68.7, ciUpper: 71.4 },
  ],
  // --- SOUTH DATA ---
  "South Heroin": [
    { period: 'Jul-Dec 2022', percentage: 34.4, ciLower: 31.9, ciUpper: 36.8 },
    { period: 'Jan-Jun 2023', percentage: 31.5, ciLower: 30.0, ciUpper: 33.1 },
    { period: 'Jul-Dec 2023', percentage: 28.7, ciLower: 27.0, ciUpper: 30.3 },
    { period: 'Jan-Jun 2024', percentage: 32.8, ciLower: 31.1, ciUpper: 34.5 },
    { period: 'Jul-Dec 2024', percentage: 39.5, ciLower: 37.6, ciUpper: 41.3 },
  ],
  "South Cocaine": [
    { period: 'Jul-Dec 2022', percentage: 38.9, ciLower: 36.4, ciUpper: 41.5 },
    { period: 'Jan-Jun 2023', percentage: 41.6, ciLower: 39.9, ciUpper: 43.2 },
    { period: 'Jul-Dec 2023', percentage: 42.1, ciLower: 40.3, ciUpper: 43.9 },
    { period: 'Jan-Jun 2024', percentage: 42.1, ciLower: 40.3, ciUpper: 44.0 },
    { period: 'Jul-Dec 2024', percentage: 47.1, ciLower: 45.2, ciUpper: 49.0 },
  ],
  "South Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 31.7, ciLower: 29.3, ciUpper: 34.1 },
    { period: 'Jan-Jun 2023', percentage: 27.8, ciLower: 26.2, ciUpper: 29.3 },
    { period: 'Jul-Dec 2023', percentage: 28.5, ciLower: 26.8, ciUpper: 30.1 },
    { period: 'Jan-Jun 2024', percentage: 28.0, ciLower: 26.3, ciUpper: 29.6 },
    { period: 'Jul-Dec 2024', percentage: 35.9, ciLower: 34.1, ciUpper: 37.8 },
  ],
  "South Fentanyl and Stimulants": [
    { period: 'Jul-Dec 2022', percentage: 60.4, ciLower: 57.8, ciUpper: 62.9 },
    { period: 'Jan-Jun 2023', percentage: 59.3, ciLower: 57.6, ciUpper: 60.9 },
    { period: 'Jul-Dec 2023', percentage: 60.5, ciLower: 58.8, ciUpper: 62.1 },
    { period: 'Jan-Jun 2024', percentage: 59.1, ciLower: 57.3, ciUpper: 60.9 },
    { period: 'Jul-Dec 2024', percentage: 67.5, ciLower: 65.7, ciUpper: 69.2 },
  ],

  // --- NORTHEAST DATA ---
  "Northeast Heroin": [
    { period: 'Jul-Dec 2022', percentage: 14.9, ciLower: 10, ciUpper: 19.9 },
    { period: 'Jan-Jun 2023', percentage: 16.7, ciLower: 13.1, ciUpper: 20.4 },
    { period: 'Jul-Dec 2023', percentage: 20.7, ciLower: 16.5, ciUpper: 24.9 },
    { period: 'Jan-Jun 2024', percentage: 19.0, ciLower: 15, ciUpper: 23 },
    { period: 'Jul-Dec 2024', percentage: 19.4, ciLower: 15.2, ciUpper: 23.6 },
  ],
  "Northeast Cocaine": [
    { period: 'Jul-Dec 2022', percentage: 35.3, ciLower: 28.7, ciUpper: 41.9 },
    { period: 'Jan-Jun 2023', percentage: 41.3, ciLower: 36.5, ciUpper: 46.0 },
    { period: 'Jul-Dec 2023', percentage: 38.4, ciLower: 33.4, ciUpper: 43.4 },
    { period: 'Jan-Jun 2024', percentage: 43.2, ciLower: 38.1, ciUpper: 48.3 },
    { period: 'Jul-Dec 2024', percentage: 46.8, ciLower: 41.5, ciUpper: 52.1 },
  ],
  "Northeast Methamphetamine": [
    { period: 'Jul-Dec 2022', percentage: 25.9, ciLower: 19.8, ciUpper: 31.9 },
    { period: 'Jan-Jun 2023', percentage: 22.8, ciLower: 18.8, ciUpper: 26.9 },
    { period: 'Jul-Dec 2023', percentage: 16.9, ciLower: 13, ciUpper: 20.7 },
    { period: 'Jan-Jun 2024', percentage: 26.1, ciLower: 21.6, ciUpper: 30.6 },
    { period: 'Jul-Dec 2024', percentage: 26.2, ciLower: 21.5, ciUpper: 30.8 },
  ],
  "Northeast Fentanyl and Stimulants": [
    { period: 'Jul-Dec 2022', percentage: 51.7, ciLower: 44.8, ciUpper: 58.6 },
    { period: 'Jan-Jun 2023', percentage: 51.7, ciLower: 46.9, ciUpper: 56.5 },
    { period: 'Jul-Dec 2023', percentage: 46.4, ciLower: 41.3, ciUpper: 51.5 },
    { period: 'Jan-Jun 2024', percentage: 55.4, ciLower: 50.4, ciUpper: 60.5 },
    { period: 'Jul-Dec 2024', percentage: 56.2, ciLower: 50.9, ciUpper: 61.5 },
  ],
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

  const drugsToShow = getNewNationalDrugs(region);
  const dataSets = drugsToShow.map(drug => ({
    key: drug.key,
    label: drug.label,
    data: newNationalDrugsData[drug.key] || [],
  }));

  // --- Add state for selected lines ---
  const regionLineKeys = drugsToShow.map(d => d.key);
  const [selectedLines, setSelectedLines] = useState(regionLineKeys);

  // --- Radio button logic for single/multi line selection (like PositiveHeroinChart.js) ---
  const [radioValue, setRadioValue] = useState('all');
  useEffect(() => {
    if (radioValue === 'all') {
      setSelectedLines(regionLineKeys);
    } else {
      setSelectedLines([radioValue]);
    }
    // eslint-disable-next-line
  }, [radioValue, region]);

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

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange]);

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
                    <strong>6 Months Change</strong><br/>
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
