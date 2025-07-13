import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import './ToggleSwitch.css';

const lineColors = {
  'Heroin': '#6a0dad',
  'Heroin with Stimulants': '#2077b4',
  'Heroin without Stimulants': '#e67e22',
};

const allQuarters = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

function alignDataToQuarters(data, quarters) {
  const map = Object.fromEntries(data.map(d => [d.quarter, d]));
  return quarters.map(q => map[q] || { quarter: q, percentage: null, ciLower: null, ciUpper: null });
}

const regionKeyFindings = {
  WEST: "Key finding: Heroin positivity decreased 1.0% from 5.2% in Q3 2024 to 4.2% in Q4 2024. This may indicate decreased exposure to heroin among people with substance use disorders.",
  MIDWEST: "Key finding: Heroin positivity increased 0.2% from 3.6% in Q3 2024 to 3.8% in Q4 2024. This may indicate increased exposure to heroin among people with substance use disorders.",
  SOUTH: "Key finding: Heroin positivity remained stable at 5.0% in Q3 2024 and Q4 2024. This may indicate stable exposure to heroin among people with substance use disorders.",
  National: "Key finding: Heroin positivity increased 0.3% from 4.6% in Q3 2024 to 4.9% in Q4 2024. This may indicate increased exposure to heroin among people with substance use disorders."
};

function HeroinLineChartRegions({ width, height, region = 'MIDWEST', period }) {
  const [showLabels, setShowLabels] = useState(false);
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [heroinSouthData, setHeroinSouthData] = useState([]);
  const [heroinWestData, setHeroinWestData] = useState([]);
  const [heroinNationalData, setHeroinNationalData] = useState([]);
  const [heroinMidwestData, setHeroinMidwestData] = useState([]);

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [showPercentChange, region]);

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
      .then(res => res.json())
      .then(data => {
        // Flatten and map the JSON for SOUTH region Heroin

        const southHeroin = mapHeroinSouthData(
          [].concat(
            data?.South?.Heroin?.Positivity?.Quarterly || [],
            data?.South?.Heroin?.Positivity?.HalfYearly || [],
            data?.South?.Heroin?.CoPositive?.Quarterly || [],
            data?.South?.Heroin?.CoPositive?.HalfYearly || []
          )
        );
        setHeroinSouthData(southHeroin);
        // Flatten and map the JSON for WEST region Heroin
        const westHeroin = mapHeroinWestData(
          [].concat(
            data?.West?.Heroin?.Positivity?.Quarterly || [],
            data?.West?.Heroin?.Positivity?.HalfYearly || [],
            data?.West?.Heroin?.CoPositive?.Quarterly || [],
            data?.West?.Heroin?.CoPositive?.HalfYearly || []
          )
        );
        setHeroinWestData(westHeroin);
        // Flatten and map the JSON for National region Heroin
        const nationalHeroin = mapHeroinNationalData(
          [].concat(
            data?.National?.Heroin?.Positivity?.Quarterly || [],
            data?.National?.Heroin?.Positivity?.HalfYearly || [],
            data?.National?.Heroin?.CoPositive?.Quarterly || [],
            data?.National?.Heroin?.CoPositive?.HalfYearly || []
          )
        );
        setHeroinNationalData(nationalHeroin);
        // Fix: Use correct parent key and field names for Midwest
        const midwestHeroin = mapHeroinMidwestData(
          [].concat(
            data?.MidWest?.Heroin?.Positivity?.Quarterly || [],
            data?.MidWest?.Heroin?.Positivity?.HalfYearly || [],
            data?.MidWest?.Heroin?.CoPositive?.Quarterly || [],
            data?.MidWest?.Heroin?.CoPositive?.HalfYearly || []
          )
        );
        setHeroinMidwestData(midwestHeroin);
      });
  }, []);

  const regionKey = region !== 'National' ? region.toUpperCase() : region;
  const keyFinding = regionKeyFindings[regionKey];

  if (regionKey === 'National') {
    const nationalDrugs = [
      'Heroin',
      'Heroin with Stimulants',
      'Heroin without Stimulants',
    ];
    const natDatasets = nationalDrugs.map(drug => ({
      label: drug,
      color: lineColors[drug],
      data: alignDataToQuarters(
        heroinNationalData.filter(d => {
          const isDrug = (d.drug === drug);
          // Only allow Heroin data with percentage in the expected range (e.g., 3-6%)
          if (drug === 'Heroin') {
            const pct = parseFloat(d.percentage);
            return isDrug && pct < 10; // Only render if percentage is less than 10
          }
          return isDrug;
        }).map(d => ({
          ...d,
          percentage: parseFloat(d.percentage),
          ciLower: parseFloat(d.ciLower),
          ciUpper: parseFloat(d.ciUpper)
        })),
        allQuarters
      )
    }));
    const natMargin = { top: 60, right: 30, bottom: 50, left: 90 };
    const natAdjustedWidth = width - natMargin.left - natMargin.right;
    const natAdjustedHeight = height - natMargin.top - natMargin.bottom;
    const natXDomain = allQuarters;
    const natXScale = scaleBand({
      domain: natXDomain,
      range: [0, natAdjustedWidth],
      padding: 0.2,
    });
    const natYMax = Math.max(...natDatasets.flatMap(ds => ds.data.map(d => d.percentage || 0)));
    const natYScale = scaleLinear({
      domain: [0, natYMax],
      range: [natAdjustedHeight, 0],
      nice: true,
    });
    
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

    const renderNatChangeIndicators = () => {
      if (!showPercentChange) return null;
      return natDatasets.map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i < n - 5 || d.percentage === null) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = natXScale(d.quarter) + natXScale.bandwidth() / 2;
          const y = natYScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#0073e6';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          const getChangeText = (change) => {
            if (change === null) return 'N/A';
            const dir = change > 0 ? 'Increased' : 'Decreased';
            return `${change.toFixed(1)}% (${dir})`;
          };
          return (
            <g key={`indicator-nat-${ds.label}-${i}`}> 
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={lineColors[ds.label]}
                data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
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
        });
      });
    };
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
        <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
              How often do people with a substance use disorder test positive for heroin on urine drug tests: National Census Region Q1 2023 - Q4 2024. Millennium Health, National Census Region Q1 2023 - Q4 2024
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
        <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
        <svg width={width} height={height}>
          <Group left={natMargin.left} top={natMargin.top}>
            <text
              x={-natAdjustedHeight / 2}
              y={-natMargin.left + 15}
              transform={`rotate(-90)`}
              textAnchor="middle"
              fontSize={15}
              fill="#222"
              fontFamily="'Segoe UI', 'Arial', 'sans-serif'"
              fontWeight="600"
              style={{ letterSpacing: '0.01em' }}
            >
              % of people with substance use disorder
              <tspan x={-natAdjustedHeight / 2} dy={15}>
                with drug(s) detected
              </tspan>
            </text>
            <AxisLeft scale={natYScale} tickFormat={value => `${value}%`} 
              tickLabelProps={() => ({
                fontSize: 16,
                textAnchor: 'end',
                dx: -6,
                dy: 3,
                fill: '#222',
              })}
            />
            <AxisBottom
              top={natAdjustedHeight}
              scale={natXScale}
              tickLabelProps={() => ({
                fontSize: 16,
                textAnchor: 'middle',
                dy: 10,
              })}
            />
            {natDatasets.map((ds, idx) => (
              <LinePath
                key={ds.label}
                data={ds.data}
                x={d => natXScale(d.quarter) + natXScale.bandwidth() / 2}
                y={d => d.percentage !== null ? natYScale(d.percentage) : null}
                stroke={lineColors[ds.label]}
                strokeWidth={2}
                curve={null}
              />
            ))}
            {natDatasets.map((ds, dsIdx) =>
              ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Heroin without Stimulants') labelYOffset = -8;
                if (ds.label === 'Heroin with Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={natXScale(d.quarter) + natXScale.bandwidth() / 2}
                      cy={natYScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.label]}
                      data-tip={`<div style='text-align: left;'>
                        <strong>${d.quarter}</strong><br/>
                        ${ds.label} positivity: ${d.percentage}%<br/>
                        Confidence interval: ${d.ciLower}% - ${d.ciUpper}%
                      </div>`}
                    />
                    {showLabel && (
                      <text
                        x={natXScale(d.quarter) + natXScale.bandwidth() / 2}
                        y={natYScale(d.percentage) + labelYOffset}
                        fontSize={13}
                        textAnchor="middle"
                        fill={lineColors[ds.label]}
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
            {renderNatChangeIndicators()}
          </Group>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {natDatasets.map((legend, idx) => (
            <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < natDatasets.length - 1 ? '15px' : 0 }}>
              <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[legend.label], marginRight: '5px' }}></div>
              <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '32px' }} />
        <ReactTooltip html={true} />
      </div>
    );
  }

  if (regionKey === 'WEST') {
    const westDrugs = [
      'Heroin',
      'Heroin with Stimulants',
      'Heroin without Stimulants',
    ];
    const westDatasets = westDrugs.map(drug => ({
      label: drug,
      color: lineColors[drug],
      data: alignDataToQuarters(
        heroinWestData.filter(d => d.drug === drug),
        allQuarters
      )
    }));
    const margin = { top: 60, right: 30, bottom: 50, left: 90 };
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
    const xDomain = allQuarters;
    const xScale = scaleBand({
      domain: xDomain,
      range: [0, adjustedWidth],
      padding: 0.2,
    });
    const yMax = Math.max(...westDatasets.flatMap(ds => ds.data.map(d => d.percentage || 0)));
    const yScale = scaleLinear({
      domain: [0, yMax],
      range: [adjustedHeight, 0],
      nice: true,
    });
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
    const renderWestChangeIndicators = () => {
      if (!showPercentChange) return null;
      return westDatasets.map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i < n - 5 || d.percentage === null) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = xScale(d.quarter) + xScale.bandwidth() / 2;
          const y = yScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#0073e6';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          const getChangeText = (change) => {
            if (change === null) return 'N/A';
            const dir = change > 0 ? 'Increased' : 'Decreased';
            return `${change.toFixed(1)}% (${dir})`;
          };
          return (
            <g key={`indicator-west-${ds.label}-${i}`}> 
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={lineColors[ds.label]}
                data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
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
        });
      });
    };
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
        <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
              How often do people with a substance use disorder test positive for heroin on urine drug tests: West Region Q1 2023 - Q4 2024. Millennium Health, West Region Q1 2023 - Q4 2024
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
        <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
            {westDatasets.map((ds, idx) => (
              <LinePath
                key={ds.label}
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={lineColors[ds.label]}
                strokeWidth={2}
                curve={null}
              />
            ))}
            {westDatasets.map((ds, dsIdx) =>
              ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Heroin without Stimulants') labelYOffset = -8;
                if (ds.label === 'Heroin with Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.label]}
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
                        fill={lineColors[ds.label]}
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
            {renderWestChangeIndicators()}
          </Group>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {westDatasets.map((legend, idx) => (
            <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < westDatasets.length - 1 ? '15px' : 0 }}>
              <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[legend.label], marginRight: '5px' }}></div>
              <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '32px' }} />
        <ReactTooltip html={true} />
      </div>
    );
  }

  if (regionKey === 'MIDWEST') {
    const midwestDrugs = [
      'Heroin',
      'Heroin with Stimulants',
      'Heroin without Stimulants',
    ];
    const midwestDatasets = midwestDrugs.map(drug => ({
      label: drug,
      color: lineColors[drug],
      data: alignDataToQuarters(
        heroinMidwestData.filter(d => d.drug === drug),
        allQuarters
      )
    }));
    const margin = { top: 60, right: 30, bottom: 50, left: 90 };
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
    const xDomain = allQuarters;
    const xScale = scaleBand({
      domain: xDomain,
      range: [0, adjustedWidth],
      padding: 0.2,
    });
    const yMax = Math.max(...midwestDatasets.flatMap(ds => ds.data.map(d => d.percentage || 0)));
    const yScale = scaleLinear({
      domain: [0, yMax],
      range: [adjustedHeight, 0],
      nice: true,
    });
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
    const renderMidwestChangeIndicators = () => {
      if (!showPercentChange) return null;
      return midwestDatasets.map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i < n - 5 || d.percentage === null) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = xScale(d.quarter) + xScale.bandwidth() / 2;
          const y = yScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#0073e6';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          return (
            <g key={`indicator-midwest-${ds.label}-${i}`}> 
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={lineColors[ds.label]}
                data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
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
        });
      });
    };
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
        <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
              How often do people with a substance use disorder test positive for heroin on urine drug tests: Midwest U.S. Q1 2023 - Q4 2024. Millennium Health, National Census Region Q1 2023 - Q4 2024
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
        <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
            {midwestDatasets.map((ds, idx) => (
              <LinePath
                key={ds.label}
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={lineColors[ds.label]}
                strokeWidth={2}
                curve={null}
              />
            ))}
            {midwestDatasets.map((ds, dsIdx) =>
              ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Heroin without Stimulants') labelYOffset = -8;
                if (ds.label === 'Heroin with Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.label]}
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
                        fill={lineColors[ds.label]}
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
            {renderMidwestChangeIndicators()}
          </Group>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {midwestDatasets.map((legend, idx) => (
            <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < midwestDatasets.length - 1 ? '15px' : 0 }}>
              <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[legend.label], marginRight: '5px' }}></div>
              <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '32px' }} />
        <ReactTooltip html={true} />
      </div>
    );
  }

  if (regionKey === 'SOUTH') {
    const southDrugs = [
      'Heroin',
      'Heroin with Stimulants',
      'Heroin without Stimulants',
    ];
    const southDatasets = southDrugs.map(drug => ({
      label: drug,
      color: lineColors[drug],
      data: alignDataToQuarters(
        heroinSouthData.filter(d => d.drug === drug),
        allQuarters
      )
    }));
    const margin = { top: 60, right: 30, bottom: 50, left: 90 };
    const adjustedWidth = width - margin.left - margin.right;
    const adjustedHeight = height - margin.top - margin.bottom;
    const xDomain = allQuarters;
    const xScale = scaleBand({
      domain: xDomain,
      range: [0, adjustedWidth],
      padding: 0.2,
    });
    const yMax = Math.max(...southDatasets.flatMap(ds => ds.data.map(d => d.percentage || 0)));
    const yScale = scaleLinear({
      domain: [0, yMax],
      range: [adjustedHeight, 0],
      nice: true,
    });
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
    const renderSouthChangeIndicators = () => {
      if (!showPercentChange) return null;
      return southDatasets.map((ds, dsIdx) => {
        const lineData = ds.data;
        const n = lineData.length;
        return lineData.map((d, i) => {
          if (i < n - 5 || d.percentage === null) return null;
          const prevPeriod = i - 1 >= 0 ? lineData[i - 1].percentage : null;
          const prevYear = i - 4 >= 0 ? lineData[i - 4].percentage : null;
          const curr = d.percentage;
          const periodChange = prevPeriod !== null && prevPeriod !== 0 ? ((curr - prevPeriod) / prevPeriod) * 100 : null;
          const yearlyChange = prevYear !== null && prevYear !== 0 ? ((curr - prevYear) / prevYear) * 100 : null;
          const x = xScale(d.quarter) + xScale.bandwidth() / 2;
          const y = yScale(curr);
          const showYearly = i >= 4;
          const getArrow = (change) => {
            if (change === null) return '';
            const color = change > 0 ? '#6a0dad' : '#0073e6';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          return (
            <g key={`indicator-south-${ds.label}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={lineColors[ds.label]}
                data-tip={`<div style='text-align: left; padding: 0;'>
                  ${showYearly ? `<div style='display: flex; align-items: center; margin-bottom: 10px;'>
                    ${getArrow(yearlyChange)}
                    <div>
                      <strong>Yearly Change</strong><br/>
                      ${yearlyChange !== null ? yearlyChange.toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : 'Decreased'})<br/>
                      ${ds.label} positivity ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : 'decreased'} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% to ${curr.toFixed(1)}% in ${d.quarter}
                    </div>
                  </div>` : ''}
                  <div style='display: flex; align-items: center;'>
                    ${getArrow(periodChange)}
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
        });
      });
    };
    return (
      <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
        <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
              How often do people with a substance use disorder test positive for heroin on urine drug tests: South Region Q1 2023 - Q4 2024. Millennium Health, South Region Q1 2023 - Q4 2024
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
        <div className="toggle-container" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
            {southDatasets.map((ds, idx) => (
              <LinePath
                key={ds.label}
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={lineColors[ds.label]}
                strokeWidth={2}
                curve={null}
              />
            ))}
            {southDatasets.map((ds, dsIdx) =>
              ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Heroin without Stimulants') labelYOffset = -8;
                if (ds.label === 'Heroin with Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={lineColors[ds.label]}
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
                        fill={lineColors[ds.label]}
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
            {renderSouthChangeIndicators()}
          </Group>
        </svg>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {southDatasets.map((legend, idx) => (
            <div key={legend.label} style={{ display: 'flex', alignItems: 'center', marginRight: idx < southDatasets.length - 1 ? '15px' : 0 }}>
              <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[legend.label], marginRight: '5px' }}></div>
              <span style={{ fontSize: '16px', color: '#333' }}>{legend.label}</span>
            </div>
          ))}
        </div>
        <div style={{ height: '32px' }} />
        <ReactTooltip html={true} />
      </div>
    );
  }

  return null;
}

export default HeroinLineChartRegions;

// Utility to map JSON fields to chart fields
function mapHeroinSouthData(jsonData) {
  return jsonData
    .filter(d => (
      (d.USregion === 'SOUTH' || d.region === 'SOUTH') &&
      (
        d.drug_name === 'Heroin' || d.drug_name === 'Heroin with Stimulants' || d.drug_name === 'Heroin without Stimulants'
      )
    ))
    .map(d => ({
      region: d.USregion || d.region,
      drug: d.drug_name,
      // Support period, quarter, and smon_yr for x-axis
      quarter: d.period || d.smon_yr,
      percentage: d.percentage !== undefined ? d.percentage : (d.percentage !== undefined ? d.percentage : null),
      ciLower: d.ciLower !== undefined ? d.ciLower : (d.ciLower === undefined && d.ci_lower !== undefined ? d.ci_lower : null),
      ciUpper: d.ciUpper !== undefined ? d.ciUpper : (d.ciUpper === undefined && d.ci_upper !== undefined ? d.ci_upper : null),
      period: d.Period,
      yrChange: d['Yr change'] || d.Yr_change
    }))
    .filter(d => d.percentage !== null && d.quarter !== undefined && d.drug !== undefined);
}

function mapHeroinWestData(jsonData) {
  return jsonData
    .filter(d => (
      (d.USregion === 'WEST' || d.region === 'WEST') &&
      (
        d.drug_name === 'Heroin' || d.drug_name === 'Heroin with Stimulants' || d.drug_name === 'Heroin without Stimulants'
      )
    ))
    .map(d => ({
      region: d.USregion || d.region,
      drug: d.drug_name,
      quarter: d.period,
      percentage: d.percentage !== undefined ? d.percentage : (d.percentage !== undefined ? d.percentage : null),
      ciLower: d.ciLower !== undefined ? d.ciLower : (d.ciLower === undefined && d.ci_lower !== undefined ? d.ci_lower : null),
      ciUpper: d.ciUpper !== undefined ? d.ciUpper : (d.ciUpper === undefined && d.ci_upper !== undefined ? d.ci_upper : null),
      period: d.Period,
      yrChange: d['Yr change'] || d.Yr_change
    }))
    .filter(d => d.percentage !== null && d.quarter !== undefined && d.drug !== undefined);
}

function mapHeroinNationalData(jsonData) {
  return jsonData
    .filter(d => (d.drug_name === 'Heroin' || d.drug_name === 'Heroin with Stimulants' || d.drug_name === 'Heroin without Stimulants'))
    .map(d => ({
      region: d.USregion || 'National',
      drug: d.drug_name,
      quarter: d.period,
      percentage: d.rcent_pos || d.percentage,
      ciLower: d['CI lower'] || d.ciLower,
      ciUpper: d['CI upper'] || d.ciUpper,
      period: d['Period'] || d.period,
      yrChange: d['Yr change'] || d.yr_change
    }));
}

function mapHeroinMidwestData(jsonData) {
  return jsonData
    .filter(d => (
      (d.USregion === 'MIDWEST' || d.region === 'MIDWEST') &&
      (
        d.drug_name === 'Heroin' || d.drug_name === 'Heroin with Stimulants' || d.drug_name === 'Heroin without Stimulants'
      )
    ))
    .map(d => ({
      region: d.USregion || d.region,
      drug: d.drug_name,
      quarter: d.period,
      percentage: d.percentage !== undefined ? d.percentage : (d.percentage !== undefined ? d.percentage : null),
      ciLower: d.ciLower !== undefined ? d.ciLower : (d.ciLower === undefined && d.ci_lower !== undefined ? d.ci_lower : null),
      ciUpper: d.ciUpper !== undefined ? d.ciUpper : (d.ciUpper === undefined && d.ci_upper !== undefined ? d.ci_upper : null),
      period: d.Period,
      yrChange: d['Yr change'] || d.Yr_change
    }))
    .filter(d => d.percentage !== null && d.quarter !== undefined && d.drug !== undefined);
}
