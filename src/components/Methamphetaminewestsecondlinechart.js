import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

// Quarterly data for WEST
const methWestSecondData = [
  // Fentanyl
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 56.3, ciLower: 55.1, ciUpper: 57.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 52.1, ciLower: 50.9, ciUpper: 53.4 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 54.1, ciLower: 52.8, ciUpper: 55.5 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 56.8, ciLower: 55.2, ciUpper: 57.7 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 56.3, ciLower: 55.1, ciUpper: 57.6 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 58.6, ciLower: 57.5, ciUpper: 59.7 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 58.6, ciLower: 57.5, ciUpper: 59.7 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 56.8, ciLower: 55.7, ciUpper: 57.9 },
  { region: 'WEST', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 56.6, ciLower: 55.5, ciUpper: 57.7 },
  // Heroin
  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2022', percentage: 14.8, ciLower: 11.2, ciUpper: 18.2 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q1 2023', percentage: 12, ciLower: 11.2, ciUpper: 12.8 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q2 2023', percentage: 11.9, ciLower: 11.1, ciUpper: 12.7 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q3 2023', percentage: 11.1, ciLower: 10.4, ciUpper: 11.8 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2023', percentage: 9.8, ciLower: 8.4, ciUpper: 9.8 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q1 2024', percentage: 8.8, ciLower: 8.1, ciUpper: 9.8 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q2 2024', percentage: 8.8, ciLower: 8.1, ciUpper: 9.8 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q3 2024', percentage: 15.3, ciLower: 14.4, ciUpper: 16.4 },
  { region: 'WEST', drug: 'Heroin', quarter: 'Q4 2024', percentage: 17.2, ciLower: 16.4, ciUpper: 18.1 },
  // Opioids
  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2022', percentage: 60.2, ciLower: 58.9, ciUpper: 61.4 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q1 2023', percentage: 55.3, ciLower: 53.8, ciUpper: 56.8 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q2 2023', percentage: 56.9, ciLower: 55.7, ciUpper: 58.1 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q3 2023', percentage: 58.3, ciLower: 57.0, ciUpper: 59.6 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2023', percentage: 59, ciLower: 57.8, ciUpper: 60.2 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q1 2024', percentage: 58.4, ciLower: 57.2, ciUpper: 59.6 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q2 2024', percentage: 60.5, ciLower: 59.4, ciUpper: 61.6 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q3 2024', percentage: 63, ciLower: 59.2, ciUpper: 64.1 },
  { region: 'WEST', drug: 'Opioids', quarter: 'Q4 2024', percentage: 59, ciLower: 58.1, ciUpper: 60.1 },
  // Cocaine
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 8.2, ciLower: 7.5, ciUpper: 8.9 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 8.8, ciLower: 8.1, ciUpper: 9.5 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 9.8, ciLower: 9.1, ciUpper: 10.5 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 9.2, ciLower: 8.5, ciUpper: 9.9 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 9.8, ciLower: 9.1, ciUpper: 10.5 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 12.4, ciLower: 11.6, ciUpper: 13.1 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 12.4, ciLower: 11.6, ciUpper: 13.1 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 14.4, ciLower: 13.7, ciUpper: 15.2 },
  { region: 'WEST', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 14.5, ciLower: 13.7, ciUpper: 15.2 },
];

// 6 Months data for WEST 
const methWestSecondData6Months = [
  // Fentanyl
  { region: 'WEST', drug: 'Fentanyl', period: '2022 Jul-Dec', percentage: 56.3, ciLower: 55, ciUpper: 57.6 },
  { region: 'WEST', drug: 'Fentanyl', period: '2023 Jan-Jun', percentage: 53.2, ciLower: 52.3, ciUpper: 54 },
  { region: 'WEST', drug: 'Fentanyl', period: '2023 Jul-Dec', percentage: 56.6, ciLower: 55.7, ciUpper: 57.5 },
  { region: 'WEST', drug: 'Fentanyl', period: '2024 Jan-Jun', percentage: 57.6, ciLower: 56.8, ciUpper: 58.5 },
  { region: 'WEST', drug: 'Fentanyl', period: '2024 Jul-Dec', percentage: 57.4, ciLower: 56.7, ciUpper: 58.2 },
  // Heroin
  { region: 'WEST', drug: 'Heroin', period: '2022 Jul-Dec', percentage: 14.8, ciLower: 13.9, ciUpper: 15.7 },
  { region: 'WEST', drug: 'Heroin', period: '2023 Jan-Jun', percentage: 12, ciLower: 11.4, ciUpper: 12.5 },
  { region: 'WEST', drug: 'Heroin', period: '2023 Jul-Dec', percentage: 10.1, ciLower: 9.6, ciUpper: 10.6 },
  { region: 'WEST', drug: 'Heroin', period: '2024 Jan-Jun', percentage: 9, ciLower: 8.5, ciUpper: 9.4 },
  { region: 'WEST', drug: 'Heroin', period: '2024 Jul-Dec', percentage: 16.2, ciLower: 15.6, ciUpper: 16.7 },
  // Opioids
  { region: 'WEST', drug: 'Opioids', period: '2022 Jul-Dec', percentage: 60.2, ciLower: 58.9, ciUpper: 61.4 },
  { region: 'WEST', drug: 'Opioids', period: '2023 Jan-Jun', percentage: 56, ciLower: 55.2, ciUpper: 56.9 },
  { region: 'WEST', drug: 'Opioids', period: '2023 Jul-Dec', percentage: 58.7, ciLower: 57.8, ciUpper: 59.5 },
  { region: 'WEST', drug: 'Opioids', period: '2024 Jan-Jun', percentage: 59.5, ciLower: 58.7, ciUpper: 60.4 },
  { region: 'WEST', drug: 'Opioids', period: '2024 Jul-Dec', percentage: 59.7, ciLower: 58.9, ciUpper: 60.4 },
  // Cocaine
  { region: 'WEST', drug: 'Cocaine', period: '2022 Jul-Dec', percentage: 8.2, ciLower: 7.5, ciUpper: 8.9 },
  { region: 'WEST', drug: 'Cocaine', period: '2023 Jan-Jun', percentage: 8.5, ciLower: 8.1, ciUpper: 9 },
  { region: 'WEST', drug: 'Cocaine', period: '2023 Jul-Dec', percentage: 9.7, ciLower: 9.1, ciUpper: 10.2 },
  { region: 'WEST', drug: 'Cocaine', period: '2024 Jan-Jun', percentage: 12, ciLower: 11.4, ciUpper: 12.5 },
  { region: 'WEST', drug: 'Cocaine', period: '2024 Jul-Dec', percentage: 14.8, ciLower: 14.3, ciUpper: 15.4 },
];

const lineColors = {
  'Fentanyl': '#27ae60',
  'Heroin': '#8e44ad',
  'Opioids': '#2980b9',
  'Cocaine': '#d35400',
};

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];
const allPeriods6M = [
  '2022 Jul-Dec', '2023 Jan-Jun', '2023 Jul-Dec', '2024 Jan-Jun', '2024 Jul-Dec'
];

function alignDataToQuarters(data, quarters, labelField = 'quarter') {
  const drugs = [...new Set(data.map(d => d.drug))];
  return drugs.map(drug => ({
    label: drug,
    color: lineColors[drug] || '#0073e6',
    data: quarters.map(q => {
      const found = data.find(d => d.drug === drug && d[labelField] === q);
      return found ? found : { [labelField]: q, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

const Methamphetaminewestsecondlinechart = ({ width = 1100, height = 350, period = 'Quarterly' }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));
  const allLineKeys = Object.keys(lineColors);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const is6M = period === '6 Months' || period === 'Half Yearly';
  const regionData = is6M
    ? methWestSecondData6Months.filter(d => d.region === 'WEST')
    : methWestSecondData.filter(d => d.region === 'WEST');
  const xDomain = is6M ? allPeriods6M : allQuarters;
  const xLabelField = is6M ? 'period' : 'quarter';
  const datasets = alignDataToQuarters(regionData, xDomain, xLabelField);

  const xScale = scaleBand({
    domain: xDomain,
    range: [0, adjustedWidth],
    padding: 0.2,
  });
  const yMax = Math.max(...datasets.flatMap(ds => ds.data.map(d => d.percentage || 0)), 100);
  const yScale = scaleLinear({
    domain: [0, yMax > 100 ? yMax : 100],
    range: [adjustedHeight, 0],
    nice: true,
  });

  const mainLineLabel = "Fentanyl";
  const mainLine = datasets.find(line => line.label === mainLineLabel);
  let keyFinding = null;
  if (mainLine) {
    const validPoints = mainLine.data.filter(
      d => typeof d.percentage === 'number' && !isNaN(d.percentage)
    );
    if (validPoints.length >= 2) {
      const n = validPoints.length;
      const last = parseFloat(validPoints[n - 1].percentage);
      const prev = parseFloat(validPoints[n - 2].percentage);
      const percentChange = prev !== 0 ? ((last - prev) / prev) * 100 : 0;
      keyFinding = {
        last: last.toFixed(1),
        prev: prev.toFixed(1),
        absChange: Math.abs(percentChange).toFixed(1),
        direction: percentChange > 0 ? 'increased' : 'decreased',
        lastLabel: validPoints[n - 1][xLabelField],
        prevLabel: validPoints[n - 2][xLabelField],
      };
    }
  }

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedLines, showPercentChange, showLabels]);

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
        When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
      </div>
    </div>
  `;

  const renderChangeIndicatorsUnified = () => {
    if (!showPercentChange) return null;
    return datasets
      .filter(ds => selectedLines.includes(ds.label))
      .map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i === 0) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = xScale(d[xLabelField]) + xScale.bandwidth() / 2;
          const y = yScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#2077b4';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          if (d.percentage === null) return null;
          return (
            <g key={`indicator-second-${ds.label}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={ds.color}
                data-tip={`<div style='text-align: left; border: 1px solid #ccc; border-radius: 5px; padding: 10px; background-color: #fff;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d[xLabelField]}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
                    <div>
                      <strong>Quarterly Change</strong><br/>
                      ${periodChange !== null ? periodChange.toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${periodChange !== null && periodChange > 0 ? 'increased' : 'decreased'} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d[xLabelField]}
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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            {is6M
              ? 'How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, or cocaine: Western Census Region Jul 2022 – Dec 2024. Millennium Health, Western Census Region Jul 2022 – Dec 2024'
              : 'How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, or cocaine: Western Census Region Q4 2022 – Q4 2024. Millennium Health, Western Census Region Q4 2022 – Q4 2024'}
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
            <span style={{ fontWeight: 700 }}>Key finding:</span> Fentanyl positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to fentanyl among people with substance use disorders.
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
          </>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0 12px 0', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ fontWeight: 700, fontSize: 16, marginRight: 12 }}>
          Make a selection to change the line graph
        </div>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            checked={selectedLines.length === allLineKeys.length}
            onChange={() => setSelectedLines(allLineKeys)}
            style={{ marginRight: 6 }}
          />
          Select All
        </label>
        <label style={{ display: 'flex', alignItems: 'center', fontWeight: 400, fontSize: 15, marginRight: 10, cursor: 'pointer' }}>
          <input
            type="radio"
            name="selectAll"
            checked={selectedLines.length === 0}
            onChange={() => setSelectedLines([])}
            style={{ marginRight: 6 }}
          />
          Clear All
        </label>
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
            <span style={{
              display: 'inline-block',
              width: 16,
              height: 16,
              borderRadius: '50%',
              border: `2px solid #888`,
              background: '#fff',
              marginRight: 2,
              position: 'relative',
              transition: 'background 0.2s, border 0.2s',
            }}>
              {selectedLines.includes(drug) && (
                <span style={{
                  display: 'block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: color,
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }} />
              )}
            </span>
            <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
          </label>
        ))}
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
          {datasets
            .filter(ds => selectedLines.includes(ds.label))
            .map((ds, idx) => (
              <React.Fragment key={ds.label}>
                <LinePath
                  data={ds.data}
                  x={d => xScale(d[xLabelField]) + xScale.bandwidth() / 2}
                  y={d => d.percentage !== null ? yScale(d.percentage) : null}
                  stroke={ds.color}
                  strokeWidth={3}
                  curve={null}
                />
                {ds.data.map((d, i) => {
                  if (d.percentage === null) return null;
                  const n = ds.data.length;
                  let showLabel = false;
                  showLabel = showLabels || (
                    i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                  );
                  let labelYOffset = -14;
                  if (ds.label === 'Heroin and Stimulants') labelYOffset = 22;
                  return (
                    <React.Fragment key={`${ds.label}-pt-${i}`}>
                      <Circle
                        cx={xScale(d[xLabelField]) + xScale.bandwidth() / 2}
                        cy={yScale(d.percentage)}
                        r={4}
                        fill={ds.color}
                        data-tip={
                          showPercentChange
                            ? undefined
                            : `<div style='text-align: left;'><strong>${d[xLabelField]}</strong><br/>${ds.label} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
                        }
                      />
                      {showLabel && (
                        <text
                          x={xScale(d[xLabelField]) + xScale.bandwidth() / 2}
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

export default Methamphetaminewestsecondlinechart;
