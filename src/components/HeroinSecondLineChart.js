import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import { UtilityFunctions } from '../utility';
import { allQuarters, allPeriods6M } from '../constants/Constants';

const lineColors = {
  'Fentanyl': '#e74c3c',
  'Cocaine': '#2980b9',
  'Methamphetamine': '#27ae60',
  'Heroin and Stimulants': '#8e44ad',
};

function alignDataToQuarters(data, quarters) {
  const drugs = [...new Set(data.map(d => d.drug))];
  return drugs.map(drug => ({
    label: drug,
    color: lineColors[drug],
    data: quarters.map(q => {
      const found = data.find(d => d.drug === drug && d.quarter === q);
      return found ? found : { quarter: q, percentage: null, ciLower: null, ciUpper: null };
    })
  }));
}

const regionKeyFindings = {
  WEST: "Key finding: Fentanyl positivity decreased 1% from 20.1% in Q3 2024 to 19.1% in Q4 2024. This may indicate decreased exposure to fentanyl among people with substance use disorders.",
  MIDWEST: "Key finding: Fentanyl positivity increased 2.1% from 86.6% in Q2 2024 to 88.7% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders.",
  National: "Key finding: Fentanyl positivity increased 7.8% from 68.5% in Q2 2024 to 76.3% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders.",
  SOUTH: "Key finding: Fentanyl positivity increased 2.4% from 70.7% in Q2 2024 to 73.1% in Q4 2024. This may indicate increased exposure to fentanyl among people with substance use disorders."
};

const HeroinSecondLineChart = ({ region = 'WEST', width, height }) => {
  const [showLabels, setShowLabels] = useState(false);
  const [selectedLines, setSelectedLines] = useState(Object.keys(lineColors));
  const [showPercentChange, setShowPercentChange] = useState(false);
  const [heroinSecondChartData, setHeroinSecondChartData] = useState([]);
  
  const allLineKeys = Object.keys(lineColors);

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

  const renderChangeIndicators = () => {
    if (!showPercentChange) return null;
    return datasets
      .filter(ds => selectedLines.includes(ds.label))
      .map((ds, dsIdx) => {
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
            const color = change > 0 ? '#6a0dad' : '#2077b4';
            const rotate = change > 0 ? 0 : 180;
            return `<svg width='20' height='20' style='margin-right: 10px;'><polygon points='10,0 20,10 15,10 15,20 5,20 5,10 0,10' fill='${color}' transform='rotate(${rotate}, 10, 10)' /></svg>`;
          };
          return (
            <g key={`indicator-second-${ds.label}-${i}`}>
              <Circle
                cx={x}
                cy={y}
                r={4}
                fill={ds.color}
                data-tip={`<div style='text-align: left;'>
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

  const margin = { top: 60, right: 30, bottom: 50, left: 90 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = height - margin.top - margin.bottom;

  useEffect(() => {
    ReactTooltip.rebuild();
  }, [selectedLines, region]);

  useEffect(() => {
          fetch(process.env.PUBLIC_URL + '/data/Millenial-Format.normalized.json')
            .then(res => res.json())
            .then(data => {

            var rgn = '';
            switch (region) {
              case 'WEST':
                rgn = 'West'; 
                break;
              case 'MIDWEST':
                rgn = 'MidWest'; 
                break;
              case 'SOUTH':
                rgn = 'South'; 
                break;
              case 'National':
                rgn = 'National'; 
                break;
              default:
                break;
            }

            var heroinSecondChartData = [];

            const fData = UtilityFunctions.getGroupedData(data, rgn, 'Fentanyl', 'Positivity', 'Quarterly', ['Fentanyl']);
            const cData = UtilityFunctions.getGroupedData(data, rgn, 'Cocaine', 'Positivity', 'Quarterly', ['Cocaine']);
            const mData = UtilityFunctions.getGroupedData(data, rgn, 'Methamphetamine', 'Positivity', 'Quarterly', ['Methamphetamine']);
            const hData = UtilityFunctions.getGroupedData(data, rgn, 'Heroin', 'CoPositive', 'Quarterly', ['Heroin and Stimulants']);

            
            if (fData.length > 0) {
                for(var i=0; i<fData[0].data.length; i++)
                  heroinSecondChartData.push(fData[0].data[i])
            }
            if (cData.length > 0) {
                for(var i=0; i<cData[0].data.length; i++)
                  heroinSecondChartData.push(cData[0].data[i])
            }
            if (mData.length > 0) {
                for(var i=0; i<mData[0].data.length; i++)
                  heroinSecondChartData.push(mData[0].data[i])
            }
            if (hData.length > 0) {
                for(var i=0; i<hData[0].data.length; i++)
                  heroinSecondChartData.push(hData[0].data[i])
            }
 
          setHeroinSecondChartData(heroinSecondChartData);
  
            });
        }, []); 


  const regionData = heroinSecondChartData;
  const datasets = alignDataToQuarters(regionData, allQuarters);

  const xDomain = allQuarters;
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

  const keyFinding = regionKeyFindings[region];

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', marginBottom: 40 }}>
      <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
        <div style={{ textAlign: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff' }}>
            % of people with substance use disorder who test positive for fentanyl, cocaine, methamphetamine, or heroin+stimulants: {region} Q4 2022 - Q4 2024
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
        
      {UtilityFunctions.getToggleControls('HeroinSecondLineChartToggle', setShowPercentChange, setShowLabels, showPercentChange, showLabels)}

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
            <span style={{ display: 'inline-block', width: 16, height: 16, borderRadius: '50%', border: `2px solid #888`, background: '#fff', marginRight: 2, position: 'relative' }}>
              {selectedLines.includes(drug) && (
                <span style={{ display: 'block', width: 10, height: 10, borderRadius: '50%', background: color, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
              )}
            </span>
            <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
          </label>
        ))}
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
          <AxisLeft scale={yScale} tickFormat={value => `${value}%`} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'end', dx: -6, dy: 3, fill: '#222' })} />
          <AxisBottom top={adjustedHeight} scale={xScale} tickLabelProps={() => ({ fontSize: 16, textAnchor: 'middle', dy: 10 })} />
          {datasets.filter(ds => selectedLines.includes(ds.label)).map((ds, idx) => (
            <React.Fragment key={ds.label}>
              <LinePath
                data={ds.data}
                x={d => xScale(d.quarter) + xScale.bandwidth() / 2}
                y={d => d.percentage !== null ? yScale(d.percentage) : null}
                stroke={ds.color}
                strokeWidth={3}
                curve={null}
              />
              {ds.data.map((d, i) => {
                if (d.percentage === null) return null;
                const n = ds.data.length;
                const showLabel = showLabels || (
                  i === 0 || i === n - 1 || i === n - 2 || i === Math.floor((n - 1) / 2)
                );
                let labelYOffset = -14;
                if (ds.label === 'Cocaine') labelYOffset = -8;
                if (ds.label === 'Heroin and Stimulants') labelYOffset = 22;
                return (
                  <React.Fragment key={`${ds.label}-pt-${i}`}>
                    <Circle
                      cx={xScale(d.quarter) + xScale.bandwidth() / 2}
                      cy={yScale(d.percentage)}
                      r={4}
                      fill={ds.color}
                      data-tip={
                        showPercentChange
                          ? undefined
                          : `<div style='text-align: left;'><strong>${d.quarter}</strong><br/>${ds.label} positivity: ${d.percentage}%<br/>CI: ${d.ciLower}% - ${d.ciUpper}%</div>`
                      }
                    />
                    {showLabel && (
                      <text
                        x={xScale(d.quarter) + xScale.bandwidth() / 2}
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
          {renderChangeIndicators()}
        </Group>
      </svg>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        {datasets.map(ds => (
          <div key={ds.key} style={{ display: 'flex', alignItems: 'center', marginRight: '15px' }}>
            <div style={{ width: '30px', height: '2px', backgroundColor: lineColors[ds.label] || '#1f77b4', marginRight: '5px' }}></div>
            <span style={{ fontSize: '16px', color: '#333' }}>{ds.label}</span>
          </div>
        ))}
      </div>
      <div style={{ height: '32px' }} />
      <ReactTooltip html={true} />
    </div>
  );
};

export default HeroinSecondLineChart;
