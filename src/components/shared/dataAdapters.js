// Data adapters for converting existing hardcoded data to standardized format

export const adaptQuarterlyData = (data, seriesName) => {
  return [{
    name: seriesName,
    values: data.map(item => ({
      quarter: item.quarter,
      percentage: item.percentage,
      ciLower: item.ciLower,
      ciUpper: item.ciUpper,
      periodChange: item.periodChange,
      yearlyChange: item.yearlyChange
    }))
  }];
};

export const adaptMultiSeriesData = (dataMap, seriesNames) => {
  return seriesNames.map(name => ({
    name,
    values: dataMap[name] || []
  }));
};

// Fentanyl data adapters
export const adaptFentanylData = (mainData, withStimulantsData, withoutStimulantsData) => {
  return [
    { name: 'Fentanyl', values: mainData },
    { name: 'Fentanyl with Stimulants', values: withStimulantsData },
    { name: 'Fentanyl without Stimulants', values: withoutStimulantsData }
  ];
};

// Heroin data adapters
export const adaptHeroinData = (mainData, withStimulantsData, withoutStimulantsData) => {
  return [
    { name: 'Heroin', values: mainData },
    { name: 'Heroin with Stimulants', values: withStimulantsData },
    { name: 'Heroin without Stimulants', values: withoutStimulantsData }
  ];
};

// Methamphetamine data adapters  
export const adaptMethamphetamineData = (mainData, withOpioidsData, withoutOpioidsData) => {
  return [
    { name: 'Methamphetamine', values: mainData },
    { name: 'Methamphetamine with Opioids', values: withOpioidsData },
    { name: 'Methamphetamine without Opioids', values: withoutOpioidsData }
  ];
};

// Cocaine data adapters
export const adaptCocaineData = (mainData, withOpioidsData, withoutOpioidsData) => {
  return [
    { name: 'Cocaine', values: mainData },
    { name: 'Cocaine with Opioids', values: withOpioidsData },
    { name: 'Cocaine without Opioids', values: withoutOpioidsData }
  ];
};

// Convert period format for 6-month data
export const adaptSixMonthData = (data, seriesName) => {
  return [{
    name: seriesName,
    values: data.map(item => ({
      period: item.period,
      percentage: item.percentage,
      ciLower: item.ciLower,
      ciUpper: item.ciUpper,
      periodChange: item.periodChange,
      yearlyChange: item.yearlyChange
    }))
  }];
};
