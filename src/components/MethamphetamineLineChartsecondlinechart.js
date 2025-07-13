import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

// Quarterly data for National
const methNationalSecondData = [
  // Fentanyl
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2022', percentage: 48.7, ciLower: 47.7, ciUpper: 49.7 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q1 2023', percentage: 45.3, ciLower: 44.4, ciUpper: 46.3 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q2 2023', percentage: 46.7, ciLower: 45.8, ciUpper: 47.7 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q3 2023', percentage: 48.1, ciLower: 47.2, ciUpper: 49.1 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2023', percentage: 49, ciLower: 48, ciUpper: 49.9 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q1 2024', percentage: 47.7, ciLower: 46.8, ciUpper: 48.6 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q2 2024', percentage: 48.1, ciLower: 47.2, ciUpper: 49 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q3 2024', percentage: 48.1, ciLower: 47.2, ciUpper: 49 },
  { region: 'National', drug: 'Fentanyl', quarter: 'Q4 2024', percentage: 47, ciLower: 46.1, ciUpper: 48 },

  // Heroin
  { region: 'National', drug: 'Heroin', quarter: 'Q4 2022', percentage: 13.9, ciLower: 13.2, ciUpper: 14.6 },
  { region: 'National', drug: 'Heroin', quarter: 'Q1 2023', percentage: 11.8, ciLower: 11.1, ciUpper: 12.4 },
  { region: 'National', drug: 'Heroin', quarter: 'Q2 2023', percentage: 12.1, ciLower: 11.5, ciUpper: 12.8 },
  { region: 'National', drug: 'Heroin', quarter: 'Q3 2023', percentage: 11, ciLower: 10.4, ciUpper: 11.6 },
  { region: 'National', drug: 'Heroin', quarter: 'Q4 2023', percentage: 10.5, ciLower: 9.9, ciUpper: 11.1 },
  { region: 'National', drug: 'Heroin', quarter: 'Q1 2024', percentage: 10.2, ciLower: 9.6, ciUpper: 10.8 },
  { region: 'National', drug: 'Heroin', quarter: 'Q2 2024', percentage: 10.3, ciLower: 9.8, ciUpper: 10.9 },
  { region: 'National', drug: 'Heroin', quarter: 'Q3 2024', percentage: 13.9, ciLower: 13.3, ciUpper: 14.5 },
  { region: 'National', drug: 'Heroin', quarter: 'Q4 2024', percentage: 15.3, ciLower: 14.7, ciUpper: 15.9 },

  // Opioids
  { region: 'National', drug: 'Opioids', quarter: 'Q4 2022', percentage: 51.4, ciLower: 50.4, ciUpper: 52.4 },
  { region: 'National', drug: 'Opioids', quarter: 'Q1 2023', percentage: 47.3, ciLower: 46.3, ciUpper: 48.3 },
  { region: 'National', drug: 'Opioids', quarter: 'Q2 2023', percentage: 48.6, ciLower: 47.7, ciUpper: 49.6 },
  { region: 'National', drug: 'Opioids', quarter: 'Q3 2023', percentage: 49.7, ciLower: 48.7, ciUpper: 50.7 },
  { region: 'National', drug: 'Opioids', quarter: 'Q4 2023', percentage: 50.6, ciLower: 49.7, ciUpper: 51.6 },
  { region: 'National', drug: 'Opioids', quarter: 'Q1 2024', percentage: 49.1, ciLower: 48.2, ciUpper: 50 },
  { region: 'National', drug: 'Opioids', quarter: 'Q2 2024', percentage: 50.5, ciLower: 49.6, ciUpper: 51.4 },
  { region: 'National', drug: 'Opioids', quarter: 'Q3 2024', percentage: 49.6, ciLower: 48.7, ciUpper: 50.5 },
  { region: 'National', drug: 'Opioids', quarter: 'Q4 2024', percentage: 48.7, ciLower: 47.9, ciUpper: 49.6 },

  // Cocaine
  { region: 'National', drug: 'Cocaine', quarter: 'Q4 2022', percentage: 12, ciLower: 11.4, ciUpper: 12.7 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q1 2023', percentage: 12, ciLower: 11.4, ciUpper: 12.7 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q2 2023', percentage: 13.4, ciLower: 12.8, ciUpper: 14.1 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q3 2023', percentage: 13.3, ciLower: 12.8, ciUpper: 13.7 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q4 2023', percentage: 14.7, ciLower: 14, ciUpper: 15.3 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q1 2024', percentage: 16.2, ciLower: 15.6, ciUpper: 16.9 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q2 2024', percentage: 17.8, ciLower: 17.1, ciUpper: 18.4 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q3 2024', percentage: 17.8, ciLower: 17.1, ciUpper: 18.4 },
  { region: 'National', drug: 'Cocaine', quarter: 'Q4 2024', percentage: 16.8, ciLower: 16.2, ciUpper: 17.5 },
];

// 6 Months data for National
const methNationalSecondData6Months = [
  // Fentanyl
  { region: 'National', drug: 'Fentanyl', period: '2022 Jul-Dec', percentage: 48.7, ciLower: 47.7, ciUpper: 49.7 },
  { region: 'National', drug: 'Fentanyl', period: '2023 Jan-Jun', percentage: 46, ciLower: 45.4, ciUpper: 46.7 },
  { region: 'National', drug: 'Fentanyl', period: '2023 Jul-Dec', percentage: 48.5, ciLower: 47.9, ciUpper: 49.2 },
  { region: 'National', drug: 'Fentanyl', period: '2024 Jan-Jun', percentage: 48.4, ciLower: 47.7, ciUpper: 49 },
  { region: 'National', drug: 'Fentanyl', period: '2024 Jul-Dec', percentage: 47.5, ciLower: 46.9, ciUpper: 48.1 },
  // Heroin
  { region: 'National', drug: 'Heroin', period: '2022 Jul-Dec', percentage: 13.9, ciLower: 13.2, ciUpper: 14.6 },
  { region: 'National', drug: 'Heroin', period: '2023 Jan-Jun', percentage: 12, ciLower: 11.5, ciUpper: 12.4 },
  { region: 'National', drug: 'Heroin', period: '2023 Jul-Dec', percentage: 10.8, ciLower: 10.4, ciUpper: 11.2 },
  { region: 'National', drug: 'Heroin', period: '2024 Jan-Jun', percentage: 10.3, ciLower: 9.9, ciUpper: 10.7 },
  { region: 'National', drug: 'Heroin', period: '2024 Jul-Dec', percentage: 14.6, ciLower: 14.2, ciUpper: 15 },
  // Opioids
  { region: 'National', drug: 'Opioids', period: '2022 Jul-Dec', percentage: 51.4, ciLower: 50.4, ciUpper: 52.4 },
  { region: 'National', drug: 'Opioids', period: '2023 Jan-Jun', percentage: 48, ciLower: 47.3, ciUpper: 48.7 },
  { region: 'National', drug: 'Opioids', period: '2023 Jul-Dec', percentage: 50.2, ciLower: 49.5, ciUpper: 50.8 },
  { region: 'National', drug: 'Opioids', period: '2024 Jan-Jun', percentage: 49.8, ciLower: 49.2, ciUpper: 50.5 },
  { region: 'National', drug: 'Opioids', period: '2024 Jul-Dec', percentage: 49.1, ciLower: 48.5, ciUpper: 49.7 },
  // Cocaine
  { region: 'National', drug: 'Cocaine', period: '2022 Jul-Dec', percentage: 11.6, ciLower: 11, ciUpper: 12.3 },
  { region: 'National', drug: 'Cocaine', period: '2023 Jan-Jun', percentage: 12.6, ciLower: 12.1, ciUpper: 13 },
  { region: 'National', drug: 'Cocaine', period: '2023 Jul-Dec', percentage: 13.5, ciLower: 13.1, ciUpper: 14 },
  { region: 'National', drug: 'Cocaine', period: '2024 Jan-Jun', percentage: 15.5, ciLower: 15, ciUpper: 16 },
  { region: 'National', drug: 'Cocaine', period: '2024 Jul-Dec', percentage: 17.3, ciLower: 16.8, ciUpper: 17.8 },
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

const MethamphetamineLineChartsecondLineChart = ({ width, height = 350, period }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));
  const allLineKeys = Object.keys(lineColors);

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  const is6M = period === 'HalfYearly';
  const regionData = is6M
    ? methNationalSecondData6Months.filter(d => d.region === 'National')
    : methNationalSecondData.filter(d => d.region === 'National');
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
              ? 'How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, or cocaine: National Jul 2022 – Dec 2024. Millennium Health, National Jul 2022 – Dec 2024'
              : 'How often do people with a substance use disorder test positive for fentanyl, heroin, opioids, or cocaine: National Q4 2022 – Q4 2024. Millennium Health, National Q4 2022 – Q4 2024'}
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

export default MethamphetamineLineChartsecondLineChart;
