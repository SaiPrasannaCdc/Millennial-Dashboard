export const UtilityFunctions = {

   getGroupedData: (data, region, mdrug, pos, periodKey, drugs) => {

    const arr = data?.[region]?.[mdrug]?.[pos]?.[periodKey] || [];
    if (periodKey == 'HalfYearly')
    { 
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
          period:  (d.period || d.smon_yr)?.substring(5) + ' ' + (d.period || d.smon_yr).substring(0,4), 
          percentage: parseFloat(d.percentage),
          ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
          ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
          annual: d.Annual || d['Yr_change'] || d.yr_change || '',
          periodChange: d.Period || d.periodChange || '',
          yearlyChange: d.yr_change || '',
        }))
      })).filter(line => line.data.length > 0);
    }
    else
    {
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
          quarter:  d.period || d.smon_yr, 
          percentage: parseFloat(d.percentage),
          ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
          ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
          annual: d.Annual || d['Yr_change'] || d.yr_change || '',
          periodChange: d.Period || d.periodChange || '',
          yearlyChange: d.yr_change || '',
        }))
      })).filter(line => line.data.length > 0);
    }
  },
}