import React, { useState, useEffect } from 'react';
import BaseLineChart from './BaseLineChart';
import {
  DRUG_TYPES,
  REGIONS,
  PERIODS,
  LINE_COLORS,
  CHART_CONFIGS,
  KEY_FINDINGS,
  fetchChartData,
  processMillenialData,
  formatHalfYearLabel
} from './chartUtils';

const UnifiedDrugChart = ({
  drug = DRUG_TYPES.FENTANYL,
  region = REGIONS.NATIONAL,
  period = PERIODS.QUARTERLY,
  width = 1100,
  height = 450,
  showMultiDrug = false,
  staticData = null // For components with hardcoded data
}) => {
  const [millenialData, setMillenialData] = useState(null);
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define isHalfYearly early so it can be used in error messages
  const isHalfYearly = period.includes('6') || period.includes('Half');

  useEffect(() => {
    const loadData = async () => {
      if (staticData) {
        // Use provided static data
        setSeriesData(staticData);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchChartData('/data/Millenial-Format.normalized.json');
        if (data) {
          setMillenialData(data);
          const processedData = processMillenialData(data, region, drug, period);
          setSeriesData(processedData);
        } else {
          setError('Failed to load data');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [drug, region, period, staticData]);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading chart data...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>Error: {error}</div>;
  }

  if (!seriesData || seriesData.length === 0) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>No data available for {drug} in {region}</div>;
  }

  // Get chart configuration
  const configKey = isHalfYearly ? 'halfYearly' : 'quarterly';
  const chartConfig = CHART_CONFIGS[drug]?.[configKey] || { title: `${drug} Positivity Over Time` };

  // Get title with region
  const title = region === REGIONS.NATIONAL 
    ? chartConfig.title 
    : `${chartConfig.title} - ${region}`;

  // Get key finding
  const keyFinding = KEY_FINDINGS[drug]?.[region] || '';

  // Custom x-accessor based on period
  const xAccessor = isHalfYearly
    ? (d) => formatHalfYearLabel(d.period || d.smon_yr)
    : (d) => d.quarter || d.period;

  return (
    <BaseLineChart
      data={seriesData}
      width={width}
      height={height}
      title={title}
      keyFinding={keyFinding}
      lineColors={LINE_COLORS}
      period={period}
      showMultiDrug={showMultiDrug}
      formatPeriodLabel={isHalfYearly ? formatHalfYearLabel : null}
      xAccessor={xAccessor}
    />
  );
};

export default UnifiedDrugChart;
