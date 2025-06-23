import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

// 6 Months data for all regions
const heroin6MonthsData2 = {
  NORTHEAST: [
    {
      name: 'Fentanyl',
      values: [
        { period: '2022 Jul-Dec', percentage: 75.2, ciLower: 71.9, ciUpper: 78.4 },
        { period: '2023 Jan-Jun', percentage: 74.3, ciLower: 71.1, ciUpper: 77.6 },
        { period: '2023 Jul-Dec', percentage: 76.2, ciLower: 73, ciUpper: 79.4 },
        { period: '2024 Jan-Jun', percentage: 68.8, ciLower: 65, ciUpper: 72.5 },
        { period: '2024 Jul-Dec', percentage: 72, ciLower: 68.4, ciUpper: 75.6 }
      ]
    },
    {
      name: 'Cocaine',
      values: [
        { period: '2022 Jul-Dec', percentage: 15.1, ciLower: 8.3, ciUpper: 21.9 },
        { period: '2023 Jan-Jun', percentage: 12.6, ciLower: 8.9, ciUpper: 16.3 },
        { period: '2023 Jul-Dec', percentage: 15, ciLower: 11.2, ciUpper: 18.9 },
        { period: '2024 Jan-Jun', percentage: 14, ciLower: 10.5, ciUpper: 17.5 },
        { period: '2024 Jul-Dec', percentage: 15.5, ciLower: 11.5, ciUpper: 19.5 }
      ]
    },
    {
      name: 'Methamphetamine',
      values: [
        { period: '2022 Jul-Dec', percentage: 8.5, ciLower: 3.2, ciUpper: 13.8 },
        { period: '2023 Jan-Jun', percentage: 9.4, ciLower: 6.1, ciUpper: 12.6 },
        { period: '2023 Jul-Dec', percentage: 5.1, ciLower: 2.7, ciUpper: 7.5 },
        { period: '2024 Jan-Jun', percentage: 6.5, ciLower: 4, ciUpper: 9 },
        { period: '2024 Jul-Dec', percentage: 6.3, ciLower: 3.6, ciUpper: 9 }
      ]
    },
    {
      name: 'Heroin and Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 16, ciLower: 9.1, ciUpper: 23 },
        { period: '2023 Jan-Jun', percentage: 13.9, ciLower: 10.1, ciUpper: 17.8 },
        { period: '2023 Jul-Dec', percentage: 13.5, ciLower: 9.8, ciUpper: 17.2 },
        { period: '2024 Jan-Jun', percentage: 12.4, ciLower: 9, ciUpper: 15.8 },
        { period: '2024 Jul-Dec', percentage: 13.9, ciLower: 10.1, ciUpper: 17.7 }
      ]
    }
  ],
  MIDWEST: [
    {
      name: 'Fentanyl',
      values: [
        { period: '2022 Jul-Dec', percentage: 84, ciLower: 81, ciUpper: 87 },
        { period: '2023 Jan-Jun', percentage: 85.1, ciLower: 82.4, ciUpper: 87.9 },
        { period: '2023 Jul-Dec', percentage: 82.2, ciLower: 79.6, ciUpper: 84.8 },
        { period: '2024 Jan-Jun', percentage: 86, ciLower: 83.7, ciUpper: 88.2 },
        { period: '2024 Jul-Dec', percentage: 86.8, ciLower: 84.6, ciUpper: 89 }
      ]
    },
    {
      name: 'Cocaine',
      values: [
        { period: '2022 Jul-Dec', percentage: 36.9, ciLower: 32.9, ciUpper: 40.9 },
        { period: '2023 Jan-Jun', percentage: 39.7, ciLower: 37.2, ciUpper: 42.2 },
        { period: '2023 Jul-Dec', percentage: 44.4, ciLower: 42.1, ciUpper: 46.6 },
        { period: '2024 Jan-Jun', percentage: 47.1, ciLower: 44.8, ciUpper: 49.4 },
        { period: '2024 Jul-Dec', percentage: 49.4, ciLower: 47, ciUpper: 51.7 }
      ]
    },
    {
      name: 'Methamphetamine',
      values: [
        { period: '2022 Jul-Dec', percentage: 41.8, ciLower: 37.8, ciUpper: 45.9 },
        { period: '2023 Jan-Jun', percentage: 42.3, ciLower: 39.8, ciUpper: 44.8 },
        { period: '2023 Jul-Dec', percentage: 35.4, ciLower: 33.3, ciUpper: 37.6 },
        { period: '2024 Jan-Jun', percentage: 40.1, ciLower: 37.8, ciUpper: 42.4 },
        { period: '2024 Jul-Dec', percentage: 40.6, ciLower: 38.3, ciUpper: 42.9 }
      ]
    },
    {
      name: 'Heroin and Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 61, ciLower: 57, ciUpper: 65 },
        { period: '2023 Jan-Jun', percentage: 63.4, ciLower: 60.9, ciUpper: 65.9 },
        { period: '2023 Jul-Dec', percentage: 62.4, ciLower: 60.2, ciUpper: 64.6 },
        { period: '2024 Jan-Jun', percentage: 67.8, ciLower: 65.4, ciUpper: 69.7 },
        { period: '2024 Jul-Dec', percentage: 69.7, ciLower: 67.6, ciUpper: 71.8 }
      ]
    }
  ],
  SOUTH: [
    {
      name: 'Fentanyl',
      values: [
        { period: '2022 Jul-Dec', percentage: 75.2, ciLower: 71.9, ciUpper: 78.4 },
        { period: '2023 Jan-Jun', percentage: 74.3, ciLower: 71.1, ciUpper: 77.6 },
        { period: '2023 Jul-Dec', percentage: 76.2, ciLower: 73, ciUpper: 79.4 },
        { period: '2024 Jan-Jun', percentage: 68.8, ciLower: 65, ciUpper: 72.5 },
        { period: '2024 Jul-Dec', percentage: 72, ciLower: 68.4, ciUpper: 75.6 }
      ]
    },
    {
      name: 'Cocaine',
      values: [
        { period: '2022 Jul-Dec', percentage: 37.9, ciLower: 34.2, ciUpper: 41.6 },
        { period: '2023 Jan-Jun', percentage: 41.7, ciLower: 39.1, ciUpper: 44.3 },
        { period: '2023 Jul-Dec', percentage: 38.2, ciLower: 35.5, ciUpper: 41 },
        { period: '2024 Jan-Jun', percentage: 38.9, ciLower: 36.3, ciUpper: 41.6 },
        { period: '2024 Jul-Dec', percentage: 44.3, ciLower: 41.7, ciUpper: 46.8 }
      ]
    },
    {
      name: 'Methamphetamine',
      values: [
        { period: '2022 Jul-Dec', percentage: 30, ciLower: 26.5, ciUpper: 33.5 },
        { period: '2023 Jan-Jun', percentage: 25.1, ciLower: 22.8, ciUpper: 27.4 },
        { period: '2023 Jul-Dec', percentage: 27, ciLower: 24.5, ciUpper: 29.5 },
        { period: '2024 Jan-Jun', percentage: 25.7, ciLower: 23.4, ciUpper: 28 },
        { period: '2024 Jul-Dec', percentage: 29.4, ciLower: 27.1, ciUpper: 31.8 }
      ]
    },
    {
      name: 'Heroin and Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 53.9, ciLower: 50.1, ciUpper: 57.7 },
        { period: '2023 Jan-Jun', percentage: 53.2, ciLower: 50.6, ciUpper: 55.8 },
        { period: '2023 Jul-Dec', percentage: 50, ciLower: 47.2, ciUpper: 52.9 },
        { period: '2024 Jan-Jun', percentage: 49.4, ciLower: 46.7, ciUpper: 52 },
        { period: '2024 Jul-Dec', percentage: 54.3, ciLower: 51.7, ciUpper: 56.9 }
      ]
    }
  ],
  NATIONAL: [
    {
      name: 'Fentanyl',
      values: [
        { period: '2022 Jul-Dec', percentage: 69.3, ciLower: 67.5, ciUpper: 71.1 },
        { period: '2023 Jan-Jun', percentage: 69.4, ciLower: 68.1, ciUpper: 70.6 },
        { period: '2023 Jul-Dec', percentage: 70, ciLower: 68.8, ciUpper: 71.3 },
        { period: '2024 Jan-Jun', percentage: 68.5, ciLower: 66.7, ciUpper: 70.3 },
        { period: '2024 Jul-Dec', percentage: 76, ciLower: 75, ciUpper: 77 }
      ]
    },
    {
      name: 'Cocaine',
      values: [
        { period: '2022 Jul-Dec', percentage: 25, ciLower: 23.3, ciUpper: 26.7 },
        { period: '2023 Jan-Jun', percentage: 28.3, ciLower: 27.1, ciUpper: 29.6 },
        { period: '2023 Jul-Dec', percentage: 31.6, ciLower: 30.3, ciUpper: 32.9 },
        { period: '2024 Jan-Jun', percentage: 32.9, ciLower: 31.7, ciUpper: 34.2 },
        { period: '2024 Jul-Dec', percentage: 33.9, ciLower: 32.8, ciUpper: 35 }
      ]
    },
    {
      name: 'Methamphetamine',
      values: [
        { period: '2022 Jul-Dec', percentage: 52.5, ciLower: 50.5, ciUpper: 54.5 },
        { period: '2023 Jan-Jun', percentage: 47.8, ciLower: 46.5, ciUpper: 49.2 },
        { period: '2023 Jul-Dec', percentage: 43.4, ciLower: 42.1, ciUpper: 44.8 },
        { period: '2024 Jan-Jun', percentage: 44, ciLower: 42.6, ciUpper: 45.3 },
        { period: '2024 Jul-Dec', percentage: 59.5, ciLower: 54.7, ciUpper: 57.1 }
      ]
    },
    {
      name: 'Heroin and Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 55, ciLower: 53, ciUpper: 56.9 },
        { period: '2023 Jan-Jun', percentage: 54.9, ciLower: 53.6, ciUpper: 56.3 },
        { period: '2023 Jul-Dec', percentage: 54.6, ciLower: 53.7, ciUpper: 56.4 },
        { period: '2024 Jan-Jun', percentage: 55.1, ciLower: 53.7, ciUpper: 56.4 },
        { period: '2024 Jul-Dec', percentage: 64.5, ciLower: 63.3, ciUpper: 65.6 }
      ]
    }
  ],
  WEST: [
    {
      name: 'Fentanyl',
      values: [
        { period: '2022 Jul-Dec', percentage: 62.5, ciLower: 59.7, ciUpper: 65.3 },
        { period: '2023 Jan-Jun', percentage: 61.9, ciLower: 59, ciUpper: 64.9 },
        { period: '2023 Jul-Dec', percentage: 63.5, ciLower: 60.6, ciUpper: 66.4 },
        { period: '2024 Jan-Jun', percentage: 64.4, ciLower: 61.3, ciUpper: 67.6 },
        { period: '2024 Jul-Dec', percentage: 58.8, ciLower: 55.5, ciUpper: 62 }
      ]
    },
    {
      name: 'Cocaine',
      values: [
        { period: '2022 Jul-Dec', percentage: 12.7, ciLower: 10.8, ciUpper: 14.7 },
        { period: '2023 Jan-Jun', percentage: 14, ciLower: 12.6, ciUpper: 15.5 },
        { period: '2023 Jul-Dec', percentage: 17.1, ciLower: 15.3, ciUpper: 18.8 },
        { period: '2024 Jan-Jun', percentage: 18.8, ciLower: 17, ciUpper: 20.5 },
        { period: '2024 Jul-Dec', percentage: 22.7, ciLower: 21.3, ciUpper: 24.1 }
      ]
    },
    {
      name: 'Methamphetamine',
      values: [
        { period: '2022 Jul-Dec', percentage: 74.5, ciLower: 72, ciUpper: 77 },
        { period: '2023 Jan-Jun', percentage: 72.2, ciLower: 70.3, ciUpper: 74.1 },
        { period: '2023 Jul-Dec', percentage: 69.7, ciLower: 67.5, ciUpper: 71.8 },
        { period: '2024 Jan-Jun', percentage: 68.4, ciLower: 66.3, ciUpper: 70.5 },
        { period: '2024 Jul-Dec', percentage: 80.6, ciLower: 79.2, ciUpper: 81.9 }
      ]
    },
    {
      name: 'Heroin and Stimulants',
      values: [
        { period: '2022 Jul-Dec', percentage: 56.2, ciLower: 53.3, ciUpper: 59 },
        { period: '2023 Jan-Jun', percentage: 56.2, ciLower: 54.1, ciUpper: 58.3 },
        { period: '2023 Jul-Dec', percentage: 57.1, ciLower: 54.8, ciUpper: 59.4 },
        { period: '2024 Jan-Jun', percentage: 55.8, ciLower: 53.5, ciUpper: 58.1 },
        { period: '2024 Jul-Dec', percentage: 71, ciLower: 69.4, ciUpper: 72.5 }
      ]
    }
  ]
};

const lineColors = {
  'Fentanyl': '#8e44ad',
  'Cocaine': '#e74c3c',
  'Methamphetamine': '#3498db',
  'Heroin and Stimulants': '#f39c12',
};

const allPeriods6M = [
  '2022 Jul-Dec', '2023 Jan-Jun', '2023 Jul-Dec', '2024 Jan-Jun', '2024 Jul-Dec'
];

// Align each drug's data to allPeriods6M
function alignDataToPeriods(drugData) {
  return drugData.map(ds => ({
    ...ds,
    values: allPeriods6M.map(period => {
      const found = ds.values.find(v => v.period === period);
      return found || { period, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

// Add this function before your component
function normalizeRegionKey(region) {
  const key = (region || '').toUpperCase().trim();
  if (key.includes('NORTHEAST')) return 'NORTHEAST';
  if (key.includes('MIDWEST')) return 'MIDWEST';
  if (key.includes('SOUTH')) return 'SOUTH';
  if (key.includes('WEST')) return 'WEST';
  if (key.includes('NATIONAL')) return 'NATIONAL';
  return 'SOUTH'; // fallback
}

const drugsToShow = [
  { key: 'Fentanyl', label: 'Fentanyl' },
  { key: 'Cocaine', label: 'Cocaine' },
  { key: 'Methamphetamine', label: 'Methamphetamine' },
  { key: 'Heroin and Stimulants', label: 'Heroin and Stimulants' },
];

const newNationalLineColors = lineColors; // for compatibility with your prompt

const Heroin6Monthssecondlinechart = ({ region = 'SOUTH', width = 1100, height = 350, period = '6 Months' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
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

  // Use the correct data object for this chart
  const adjustedDataRaw = heroin6MonthsData2[regionKey] || heroin6MonthsData2['SOUTH'];
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

  // Force y-axis to always be [0, 80]
  const yScale = scaleLinear({
    domain: [0, 80],
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
        <div className="toggle-container" style={{ display: 'flex', gap: '10px' }}>
          <div className="toggle-wrapper" style={{ position: 'relative' }}>
            <label
              className="toggle-switch"
              data-tip={percentChgTooltip}
              data-for="percentChangeTooltip"
              style={{ cursor: 'pointer' }}
            >
              <input
                type="checkbox"
                checked={showPercentChange}
                onChange={() => setShowPercentChange(!showPercentChange)}
              />
              <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
            </label>
            <span
              className="toggle-label"
              style={{ color: showPercentChange ? '#fff' : '#333', cursor: 'pointer' }}
              data-tip={percentChgTooltip}
              data-for="percentChangeTooltip"
            >
              % Chg {showPercentChange ? 'On' : 'Off'}
            </span>
            <ReactTooltip
              id="percentChangeTooltip"
              place="top"
              effect="solid"
              backgroundColor="#ededed"
              border={true}
              borderColor="#bbb"
              className="simple-tooltip"
              html={true}
              textColor="#222"
            />
          </div>
          <div className="toggle-wrapper">
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
              />
              <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
            </label>
            <span className="toggle-label" style={{ color: showLabels ? '#fff' : '#333' }}>Labels {showLabels ? 'On' : 'Off'}</span>
          </div>
        </div>
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
