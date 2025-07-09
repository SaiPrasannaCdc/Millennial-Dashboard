// Utility functions for data processing and chart configuration

export const DRUG_TYPES = {
  FENTANYL: 'Fentanyl',
  HEROIN: 'Heroin',
  METHAMPHETAMINE: 'Methamphetamine',
  COCAINE: 'Cocaine'
};

export const REGIONS = {
  NATIONAL: 'National',
  WEST: 'West',
  MIDWEST: 'MidWest',  // Note: capital W in data
  SOUTH: 'South',
  NORTHEAST: 'North',  // Maps to "North" in data
  NORTH: 'North'       // Maps to "North" in data
};

export const PERIODS = {
  QUARTERLY: 'Quarterly',
  HALF_YEARLY: 'Half Yearly',
  SIX_MONTHS: '6 Months'
};

// Common line colors for consistency across charts
export const LINE_COLORS = {
  // Fentanyl
  'Fentanyl': '#ff6b6b',
  'Fentanyl with Stimulants': '#4ecdc4',
  'Fentanyl without Stimulants': '#45b7d1',
  
  // Heroin
  'Heroin': '#6a0dad',
  'Heroin with Stimulants': '#2077b4',
  'Heroin without Stimulants': '#e67e22',
  
  // Methamphetamine
  'Methamphetamine': '#f39c12',
  'Methamphetamine with Opioids': '#e74c3c',
  'Methamphetamine without Opioids': '#2ecc71',
  
  // Cocaine
  'Cocaine': '#9b59b6',
  'Cocaine with Opioids': '#3498db',
  'Cocaine without Opioids': '#1abc9c'
};

// Common data alignment utility
export const alignDataToQuarters = (data, quarters) => {
  const map = Object.fromEntries(data.map(d => [d.quarter, d]));
  return quarters.map(q => map[q] || { quarter: q, percentage: null, ciLower: null, ciUpper: null });
};

// Standard quarters for consistency
export const ALL_QUARTERS = [
  'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023',
  'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'
];

// Data transformation utilities
export const transformDataToSeries = (data, seriesConfig) => {
  return seriesConfig.map(config => ({
    name: config.name,
    values: data[config.dataKey] || []
  }));
};

// Generic data fetcher with error handling
export const fetchChartData = async (dataPath) => {
  try {
    const response = await fetch(process.env.PUBLIC_URL + dataPath);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return null;
  }
};

// Data processing for Millennial format
export const processMillenialData = (data, region, drug, period) => {
  // Map the region to the correct data key
  const dataRegionKey = mapRegionToDataKey(region);
  const usRegionValue = mapRegionToUSRegion(dataRegionKey);
  
  if (!data || !data[dataRegionKey] || !data[dataRegionKey][drug]) {
    return [];
  }

  const drugData = data[dataRegionKey][drug];
  const periodKey = period.includes('6') || period.includes('Half') ? 'HalfYearly' : 'Quarterly';
  const positivityData = drugData.Positivity?.[periodKey] || [];

  // Group by drug_name for multi-line charts
  const drugNames = [...new Set(positivityData.map(d => d.drug_name))];
  
  return drugNames.map(name => ({
    name,
    values: positivityData
      .filter(d => d.drug_name === name && d.USregion === usRegionValue)
      .map(d => ({
        quarter: d.period,
        period: d.smon_yr || d.period,
        percentage: parseFloat(d.percentage),
        ciLower: parseFloat(d['CI lower'] || d['CI_lower'] || d.ciLower),
        ciUpper: parseFloat(d['CI upper'] || d['CI_upper'] || d.ciUpper),
        periodChange: d.Period || d.period,
        yearlyChange: d['Yr_change'] || d.yr_change,
        annual: d.Annual || d['Yr_change'] || d.yr_change || '',
      }))
  })).filter(line => line.values.length > 0);
};

// Format half-year labels consistently
export const formatHalfYearLabel = (periodStr) => {
  let year, half;
  let match = periodStr.match(/H([12])\s*([0-9]{4})/);
  if (match) {
    half = match[1];
    year = match[2];
    return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
  }
  match = periodStr.match(/([0-9]{4})\s*H([12])/);
  if (match) {
    year = match[1];
    half = match[2];
    return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
  }
  match = periodStr.match(/([0-9]{4})[- ]([12])/);
  if (match) {
    year = match[1];
    half = match[2];
    return half === '1' ? `Jan-Jun ${year}` : `Jul-Dec ${year}`;
  }
  return periodStr;
};

// Chart configuration presets
export const CHART_CONFIGS = {
  Fentanyl: {
    quarterly: {
      title: 'Fentanyl Positivity Over Time',
      seriesNames: ['Fentanyl', 'Fentanyl with Stimulants', 'Fentanyl without Stimulants']
    },
    halfYearly: {
      title: 'Fentanyl Positivity Over Time (6-Month Periods)',
      seriesNames: ['Fentanyl', 'Fentanyl with Stimulants', 'Fentanyl without Stimulants']
    }
  },
  Heroin: {
    quarterly: {
      title: 'Heroin Positivity Over Time',
      seriesNames: ['Heroin', 'Heroin with Stimulants', 'Heroin without Stimulants']
    },
    halfYearly: {
      title: 'Heroin Positivity Over Time (6-Month Periods)',
      seriesNames: ['Heroin', 'Heroin with Stimulants', 'Heroin without Stimulants']
    }
  },
  Methamphetamine: {
    quarterly: {
      title: 'Methamphetamine Positivity Over Time',
      seriesNames: ['Methamphetamine', 'Methamphetamine with Opioids', 'Methamphetamine without Opioids']
    },
    halfYearly: {
      title: 'Methamphetamine Positivity Over Time (6-Month Periods)',
      seriesNames: ['Methamphetamine', 'Methamphetamine with Opioids', 'Methamphetamine without Opioids']
    }
  },
  Cocaine: {
    quarterly: {
      title: 'Cocaine Positivity Over Time',
      seriesNames: ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids']
    },
    halfYearly: {
      title: 'Cocaine Positivity Over Time (6-Month Periods)',
      seriesNames: ['Cocaine', 'Cocaine with Opioids', 'Cocaine without Opioids']
    }
  }
};

// Key findings by region and drug
export const KEY_FINDINGS = {
  Heroin: {
    WEST: "Key finding: Heroin positivity decreased 1.0% from 5.2% in Q3 2024 to 4.2% in Q4 2024. This may indicate decreased exposure to heroin among people with substance use disorders.",
    MIDWEST: "Key finding: Heroin positivity increased 0.2% from 3.6% in Q3 2024 to 3.8% in Q4 2024. This may indicate increased exposure to heroin among people with substance use disorders.",
    SOUTH: "Key finding: Heroin positivity remained stable at 5.0% in Q3 2024 and Q4 2024. This may indicate stable exposure to heroin among people with substance use disorders.",
    NATIONAL: "Key finding: Heroin positivity increased 0.3% from 4.6% in Q3 2024 to 4.9% in Q4 2024. This may indicate increased exposure to heroin among people with substance use disorders."
  }
  // Add more findings as needed
};

// Map UI region names to data keys
export const mapRegionToDataKey = (region) => {
  const regionMap = {
    'National': 'National',
    'NATIONAL': 'National',
    'West': 'West',
    'WEST': 'West',
    'MidWest': 'MidWest',
    'MIDWEST': 'MidWest',
    'South': 'South', 
    'SOUTH': 'South',
    'North': 'North',
    'NORTH': 'North',
    'NORTHEAST': 'North',
    'Northeast': 'North'
  };
  
  return regionMap[region] || region;
};

// Map UI region names to USregion values in data
export const mapRegionToUSRegion = (region) => {
  const usRegionMap = {
    'National': 'NATIONAL',
    'West': 'WEST',
    'MidWest': 'MIDWEST',
    'South': 'SOUTH',
    'North': 'NORTH'  // North in data maps to NORTH in USregion field
  };
  
  return usRegionMap[region] || region.toUpperCase();
};
