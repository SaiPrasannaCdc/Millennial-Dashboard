import React, { useState, useEffect } from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand } from '@visx/scale';
import ReactTooltip from 'react-tooltip';

// 6 Months data for all regions
const heroin6MonthsData = {
 
 
  
 
 
};

const lineColors = {
  'Heroin': '#8e44ad',
  'Heroin with Stimulants': '#e74c3c',
  'Heroin without Stimulants': '#3498db',
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

const HeroinLineChartRegions6months = ({ region = 'SOUTH', width = 1100, height = 350, period = '6 Months' }) => {
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
        const periods = [
          '2022 Jul-Dec', '2023 Jan-Jun', '2023 Jul-Dec', '2024 Jan-Jun', '2024 Jul-Dec'
        ];
        const drugs = [
          'Heroin',
          'Heroin with Stimulants',
          'Heroin without Stimulants',
        ];
        // SOUTH (now matches your provided data structure exactly)
        const heroinSouth = drugs.map(drug => ({
          name: drug,
          values: periods.map(period => {
            const arr = data?.South?.Heroin?.Positivity?.HalfYearly || [];
            const d = arr.find(x => {
              // South: drug_name, USregion, period
              const drugMatch = x.drug_name === drug;
              const regionMatch = x.USregion === 'SOUTH';
              const periodMatch = x.period === period;
              return drugMatch && regionMatch && periodMatch;
            });
            return d ? {
              period: d.period,
              percentage: d.percentage !== undefined ? parseFloat(d.percentage) : null,
              ciLower: d.ciLower !== undefined ? parseFloat(d.ciLower) : null,
              ciUpper: d.ciUpper !== undefined ? parseFloat(d.ciUpper) : null,
              periodChange: d.Period || '',
              yrChange: d['Yr change'] !== undefined ? d['Yr change'] : ''
            } : { period, percentage: null, ciLower: null, ciUpper: null };
          })
        }));
        setHeroinSouth6MData(heroinSouth);
        // WEST (now matches your provided data structure exactly)
        const heroinWest = drugs.map(drug => ({
          name: drug,
          values: periods.map(period => {
            const arr = data?.West?.Heroin?.Positivity?.HalfYearly || [];
            const d = arr.find(x => {
              // West: drug_name, USregion, period
              const drugMatch = x.drug_name === drug;
              const regionMatch = x.USregion === 'WEST';
              const periodMatch = x.period === period;
              return drugMatch && regionMatch && periodMatch;
            });
            return d ? {
              period: d.period,
              percentage: d.percentage !== undefined ? parseFloat(d.percentage) : null,
              ciLower: d.ciLower !== undefined ? parseFloat(d.ciLower) : null,
              ciUpper: d.ciUpper !== undefined ? parseFloat(d.ciUpper) : null,
              periodChange: d.Period || '',
              yrChange: d['Yr change'] !== undefined ? d['Yr change'] : ''
            } : { period, percentage: null, ciLower: null, ciUpper: null };
          })
        }));
        setHeroinWest6MData(heroinWest);
        // NORTHEAST
        const heroinNortheast = drugs.map(drug => ({
          name: drug,
          values: periods.map(period => {
            // Flexible period and drug name matching for Northeast
            const d = (data?.Northeast?.Heroin?.Positivity?.HalfYearly || []).find(x => {
              const drugMatch = (x.drug_name === drug || x.drug_name === drug || x.drug_nam === drug);
              const regionMatch = (x.USregion === 'NORTHEAST' || x.USregion === 'NORTH');
              // Match by year and first 3 letters of month
              const periodNorm = period.slice(0, 4) + period.slice(5, 8);
              const qrtYearNorm = (x.qrt_year || '').slice(0, 4) + (x.qrt_year || '').slice(5, 8);
              return drugMatch && regionMatch && periodNorm === qrtYearNorm;
            });
            return d ? {
              period: d.qrt_year,
              percentage: d.rcent_pos,
              ciLower: d['CI lower'] || d['CI_lower'],
              ciUpper: d['CI upper'] || d['CI_upper'],
              periodChange: d['Period'],
              yrChange: d['Yr change'] || d['Yr_change']
            } : { period, percentage: null, ciLower: null, ciUpper: null };
          })
        }));
        setHeroinNortheast6MData(heroinNortheast);
        // NATIONAL
        const heroinNational = drugs.map(drug => ({
          name: drug,
          values: periods.map(period => {
            // National data: match by drug_name and period
            const d = (data?.National?.Heroin?.Positivity?.HalfYearly || []).find(x => {
              const drugMatch = (x.drug_name === drug || x.drug_name === drug || x.drug_nam === drug);
              // Accept both 'period' and 'qrt_year' keys for period
              const periodMatch = (x.period === period || x.qrt_year === period);
              return drugMatch && periodMatch;
            });
            return d ? {
              period: d.period || d.qrt_year,
              percentage: d.percentage ? parseFloat(d.percentage) : (d.rcent_pos ? parseFloat(d.rcent_pos) : null),
              ciLower: d.ciLower ? parseFloat(d.ciLower) : (d['CI lower'] ? parseFloat(d['CI lower']) : null),
              ciUpper: d.ciUpper ? parseFloat(d.ciUpper) : (d['CI upper'] ? parseFloat(d['CI upper']) : null),
              periodChange: d['Period'] || '',
              yrChange: d['yr_change'] || d['Yr change'] || d['Yr_change'] || ''
            } : { period, percentage: null, ciLower: null, ciUpper: null };
          })
        }));
        setHeroinNational6MData(heroinNational);
        // MIDWEST (now matches your provided data structure exactly)
        const heroinMidwest = drugs.map(drug => ({
          name: drug,
          values: periods.map(period => {
            const arr = data?.Midwest?.Heroin?.Positivity?.HalfYearly || data?.MidWest?.Heroin?.Positivity?.HalfYearly || [];
            const d = arr.find(x => {
              // Midwest: drug_name, USregion, period
              const drugMatch = x.drug_name === drug;
              const regionMatch = x.USregion === 'MIDWEST';
              const periodMatch = x.period === period;
              return drugMatch && regionMatch && periodMatch;
            });
            return d ? {
              period: d.period,
              percentage: d.percentage !== undefined ? parseFloat(d.percentage) : null,
              ciLower: d.ciLower !== undefined ? parseFloat(d.ciLower) : null,
              ciUpper: d.ciUpper !== undefined ? parseFloat(d.ciUpper) : null,
              periodChange: d.Period || '',
              yrChange: d.Yr_change !== undefined ? d.Yr_change : ''
            } : { period, percentage: null, ciLower: null, ciUpper: null };
          })
        }));
        setHeroinMidwest6MData(heroinMidwest);
      });
  }, []);

  const adjustedDataRaw = regionKey === 'SOUTH' ? heroinSouth6MData : regionKey === 'WEST' ? heroinWest6MData : regionKey === 'NORTHEAST' ? heroinNortheast6MData : regionKey === 'NATIONAL' ? heroinNational6MData : regionKey === 'MIDWEST' ? heroinMidwest6MData : (heroin6MonthsData[regionKey] || heroin6MonthsData['SOUTH']);
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
