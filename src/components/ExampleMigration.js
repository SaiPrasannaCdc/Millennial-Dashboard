// Example of how to migrate from individual chart components to unified components

import React from 'react';
import UnifiedDrugChart from './shared/UnifiedDrugChart';
import StaticDataChart from './shared/StaticDataChart';
import { DRUG_TYPES, REGIONS, PERIODS } from './shared/chartUtils';
import { adaptFentanylData } from './shared/dataAdapters';

// OLD WAY - Multiple specific components
// import FentanylLineChartWest from './FentanylLineChartWest';
// import FentanylLineChartMidwest from './FentanylLineChartMidwest';
// import FentanylLineChartSouth from './FentanylLineChartSouth';

// NEW WAY - Single unified component
const ExampleMigratedChart = ({ region, period }) => {
  return (
    <UnifiedDrugChart 
      drug={DRUG_TYPES.FENTANYL}
      region={region}
      period={period}
      width={1100}
      height={450}
    />
  );
};

// Example of converting hardcoded data to use StaticDataChart
const ExampleStaticChart = () => {
  // Hardcoded data (like in original components)
  const fentanylData = [
    { quarter: 'Q4 2022', percentage: 21.7, ciLower: 21.2, ciUpper: 22.3 },
    { quarter: 'Q1 2023', percentage: 18.6, ciLower: 18.2, ciUpper: 19.1 },
    // ... more data
  ];

  const fentanylWithStimulants = [
    { quarter: 'Q4 2022', percentage: 15.2, ciLower: 14.7, ciUpper: 15.7 },
    { quarter: 'Q1 2023', percentage: 13.5, ciLower: 13.1, ciUpper: 14.0 },
    // ... more data
  ];

  const fentanylWithoutStimulants = [
    { quarter: 'Q4 2022', percentage: 6.5, ciLower: 6.2, ciUpper: 6.8 },
    { quarter: 'Q1 2023', percentage: 5.1, ciLower: 4.8, ciUpper: 5.4 },
    // ... more data
  ];

  // Convert to standard format
  const adaptedData = adaptFentanylData(
    fentanylData,
    fentanylWithStimulants, 
    fentanylWithoutStimulants
  );

  return (
    <StaticDataChart 
      data={adaptedData}
      title="Fentanyl Positivity Over Time - West Region"
      keyFinding="Key finding: Fentanyl positivity in the West region shows declining trends..."
      period="Quarterly"
      width={1100}
      height={450}
    />
  );
};

export { ExampleMigratedChart, ExampleStaticChart };
