
import { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { Circle } from '@visx/shape';

const firstChartQuarterlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'National_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'National_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'West_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'West_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'MidWest_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'MidWest_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'South_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'South_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B', //Amphetamine,Methamphetamine Legend
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',
}

const secondChartQuarterlyInfo = {
  'National_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'National_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#8E44AD,#2980B9,#5FA0CA,#8E44AD',
  'National_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'National_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'West_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'West_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'West_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'West_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'MidWest_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'MidWest_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'MidWest_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'MidWest_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'South_Fentanyl': 'Heroin,Cocaine,Methamphetamine,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'South_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'South_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'South_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',
}

const firstChartHalfYearlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'National_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'National_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'West_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'West_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'MidWest_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'MidWest_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'South_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'South_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7',
  
  'North_Fentanyl': 'Fentanyl,Fentanyl with Stimulants,Fentanyl without Stimulants|#0073E6,#17632A,#E87722',
  'North_Heroin': 'Heroin,Heroin with Stimulants,Heroin without Stimulants|#6A0DAD,#2077B4,#E67E22',
  'North_Cocaine': 'Cocaine,Cocaine with Opioids,Cocaine without Opioids|#6A0DAD,#E07A5F,#3D405B',
  'North_Methamphetamine': 'Methamphetamine,Methamphetamine with Opioids,Methamphetamine without Opioids|#0073E6,#FF6702,#2457A7'
}

const secondChartHalfYearlyInfo = {
  'National_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'National_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#8E44AD,#2980B9,#5FA0CA,#8E44AD',
  'National_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'National_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'West_Fentanyl': 'Heroin,Cocaine,Methamphetamine,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'West_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'West_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'West_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'MidWest_Fentanyl': 'Heroin,Cocaine,Fentanyl and Stimulants,Methamphetamine|#FFB120,#4F658F,#8472A6,#00BFAE',
  'MidWest_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'MidWest_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'MidWest_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'South_Fentanyl': 'Heroin,Methamphetamine,Cocaine,Fentanyl and Stimulants|#FFB120,#4F658F,#8472A6,#00BFAE',
  'South_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'South_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'South_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705',

  'North_Fentanyl': 'Heroin,Cocaine,Fentanyl and Stimulants,Methamphetamine|#FFB120,#4F658F,#8472A6,#00BFAE',
  'North_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin and Stimulants|#EC7569,#2980B9,#5FA0CA,#8E44AD',
  'North_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#E74C3C,#A66BBE,#2980B9,#27AE60',
  'North_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#27AE60,#8E44AD,#29AF61,#D45705'
}

const drugNodeInfo = {
  'Fentanyl': 'Fentanyl',
  'Fentanyl with Stimulants': 'Fentanyl',
  'Fentanyl without Stimulants': 'Fentanyl',
  'Heroin': 'Heroin',
  'Heroin with Stimulants': 'Heroin',
  'Heroin without Stimulants': 'Heroin',
  'Cocaine': 'Cocaine',
  'Cocaine with Opioids': 'Cocaine',
  'Cocaine without Opioids': 'Cocaine',
  'Methamphetamine': 'Methamphetamine',
  'Methamphetamine with Opioids': 'Methamphetamine',
  'Methamphetamine without Opioids': 'Methamphetamine',
  'Fentanyl and Stimulants': 'Fentanyl',
  'Heroin and Stimulants': 'Heroin',
  'OpioidsC': 'Cocaine',
  'OpioidsM': 'Methamphetamine',
}

const posstivityLabeleInfo = {
  'Fentanyl': 'Fentanyl postivity',
  'Fentanyl with Stimulants': 'Fentanyl postivity with Stimulants',
  'Fentanyl without Stimulants': 'Fentanyl postivity without Stimulants',
  'Heroin': 'Heroin postivity',
  'Heroin with Stimulants': 'Heroin postivity with Stimulants',
  'Heroin without Stimulants': 'Heroin postivity without Stimulants',
  'Cocaine': 'Cocaine postivity',
  'Cocaine with Opioids': 'Cocaine postivity with Opioids',
  'Cocaine without Opioids': 'Cocaine postivity without Opioids',
  'Methamphetamine': 'Methamphetamine postivity',
  'Methamphetamine with Opioids': 'Methamphetamine postivity with Opioids',
  'Methamphetamine without Opioids': 'Methamphetamine postivity without Opioids',
  'Fentanyl and Stimulants': 'Fentanyl and Stimulants postivity',
  'Heroin and Stimulants': 'Heroin and Stimulants postivity',
  'Opioids': 'Opioids postivity',
}

const CoPositiveInfo = {
  'OpioidsC': 'Cocaine',
  'OpioidsM': 'Methamphetamine',
  'Fentanyl and Stimulants': 'Fentanyl',
  'Heroin and Stimulants': 'Heroin',
}

const legendInfo = {
  'Fentanyl with Stimulants': 'Fentanyl with cocaine or methamphetamine',
  'Fentanyl without Stimulants': 'Fentanyl without cocaine or methamphetamine',
  'Fentanyl and Stimulants': 'Cocaine or methamphetamine',
  'Heroin with Stimulants': 'Heroin with cocaine or methamphetamine',
  'Heroin without Stimulants': 'Heroin without cocaine or methamphetamine',
  'Heroin': 'Any Heroin',
  'Heroin and Stimulants': 'Cocaine or methamphetamine',
  'Cocaine with Opioids': 'Cocaine with heroin or fentanyl',
  'Cocaine without Opioids': 'Cocaine without heroin or fentanyl',
  'Cocaine': 'Any Cocaine',
  'Opioids': 'Fentanyl or Heroin',
  'Methamphetamine with Opioids': 'Methamphetamine with heroin or fentanyl',
  'Methamphetamine without Opioids': 'Methamphetamine without heroin or fentanyl',
  'Methamphetamine': 'Any Methamphetamine',
  'Fentanyl': 'Any Fentanyl',
}

export const UtilityFunctions = {

  getPositivity: (drug) => {
    return CoPositiveInfo[drug] != null ? 'CoPositive' : 'Positivity';
  },

  getDrugData: (data, region, mdrug, pos, periodKey, drugs) => {

    const arr = data?.[region]?.[mdrug]?.[pos]?.[periodKey] || [];
    if (periodKey == 'HalfYearly')
    { 
      return drugs.map(name => ({
        label: name.replace('OpioidsC','Opioids').replace('OpioidsM','Opioids'), //SKV TODO
        data: arr.filter(d => (d.drug_name === name)).map(d => ({
          drug: name.replace('OpioidsC','Opioids').replace('OpioidsM','Opioids'), //SKV TODO
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
        data: arr.filter(d => (d.drug_name === name)).map(d => ({
          drug: name,
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

  getCoPositiveExceptions: (region, mdrug, periodKey, drug) => {
    if (region == 'South' && mdrug == 'Fentanyl' && periodKey == 'Quarterly')
      return true;
    if (region == 'West' && mdrug == 'Heroin' && periodKey == 'HalfYearly' && drug == 'Heroin and Stimulants')
      return true;

    return false;
  },

  getDrugDataNew: (data, region, periodKey, mainDrug, drug, chartNum) => {

    var coPos = chartNum == 1 ? 'Positivity' : 'CoPositive';

    //var coPos = (UtilityFunctions.getCoPositiveExceptions(region, mdrug, periodKey, drug) ? 'CoPositive' : UtilityFunctions.getPositivity(drug)) //SKV TODO
    var drugNm = drug.replace('OpioidsC','Opioids').replace('OpioidsM','Opioids'); //SKV TODO
    const arr = data?.[region]?.[mainDrug]?.[coPos]?.[periodKey] || [];
    const drgRecs = arr.filter(d => (d.drug_name == drugNm));
    if (periodKey == 'HalfYearly')
    { 
      return drgRecs.map(drg => ({
          drug: drugNm,
          period:  (drg.period || drg.smon_yr)?.substring(5) + ' ' + (drg.period || drg.smon_yr).substring(0,4), 
          percentage: parseFloat(drg.percentage),
          ciLower: parseFloat(drg['ciLower'] ?? drg['CI lower'] ?? drg['CI_lower'] ?? drg.ciLower),
          ciUpper: parseFloat(drg['ciUpper'] ?? drg['CI upper'] ?? drg['CI_upper'] ?? drg.ciUpper),
          annual: drg.Annual || drg['Yr_change'] || drg.yr_change || '',
          periodChange: drg.Period || drg.periodChange || '',
          yearlyChange: drg.yr_change || '',
        }));
    }
    else
    {
      return drgRecs.map(drg => ({
          drug: drugNm,
          quarter:  drg.period || drg.smon_yr, 
          percentage: parseFloat(drg.percentage),
          ciLower: parseFloat(drg['ciLower'] ?? drg['CI lower'] ?? drg['CI_lower'] ?? drg.ciLower),
          ciUpper: parseFloat(drg['ciUpper'] ?? drg['CI upper'] ?? drg['CI_upper'] ?? drg.ciUpper),
          annual: drg.Annual || drg['Yr_change'] || drg.yr_change || '',
          periodChange: drg.Period || drg.periodChange || '',
          yearlyChange: drg.yr_change || '',
        }));
    }
  },

  getDrugsDataNew: (data, region, periodKey, mainDrug, drugs, chartNum) => {

    var drugsDataSet = [];
    drugs.forEach(function(drug, index) {
      var drugsData = {};
      let vals = UtilityFunctions.getDrugDataNew(data, region, periodKey, mainDrug, drug, chartNum);
      drugsData['name'] = drug.replace('OpioidsC','Opioids').replace('OpioidsM','Opioids'); //SKV TODO
      drugsData['values'] = vals;
      drugsDataSet.push(drugsData);
    });
    return drugsDataSet;
  },

  getChartOneData: (data, region, mdrug, periodKey) => {
    var mainReg = region == 'MIDWEST' ? 'MidWest' : region.charAt(0).toUpperCase() + region.slice(1).toLowerCase(); 
    var mainDrug = mdrug.charAt(0).toUpperCase() + mdrug.slice(1);
    var drugsStr = periodKey == 'Quarterly' ? firstChartQuarterlyInfo[mainReg + '_' + mainDrug] : firstChartHalfYearlyInfo[mainReg + '_' + mainDrug];
    var drugs = drugsStr?.split('|')[0].split(',');

    const drugsData = UtilityFunctions.getDrugsDataNew(data, mainReg, periodKey, mainDrug, drugs, 1);
    const drugsToShow = UtilityFunctions.getDrugsToShow(drugsData);
    const lineColors = UtilityFunctions.getLineColors(1, mainReg, periodKey, mainDrug);

    var chartData = [];
    chartData.push(drugsData);
    chartData.push(drugsToShow);
    chartData.push(lineColors);

    return chartData;
  },

   getChartTwoData: (data, region, mdrug, periodKey) => {
    var mainReg = region == 'MIDWEST' ? 'MidWest' : region.charAt(0).toUpperCase() + region.slice(1).toLowerCase(); 
    var mainDrug = mdrug.charAt(0).toUpperCase() + mdrug.slice(1);
    var drugsStr = periodKey == 'Quarterly' ? secondChartQuarterlyInfo[mainReg + '_' + mainDrug] : secondChartHalfYearlyInfo[mainReg + '_' + mainDrug];
    var drugs = drugsStr?.split('|')[0].split(',');

    const drugsData = UtilityFunctions.getDrugsDataNew(data, mainReg, periodKey, mainDrug, drugs, 2);
    const drugsToShow = UtilityFunctions.getDrugsToShow(drugsData);
    const lineColors = UtilityFunctions.getLineColors(2, mainReg, periodKey, mainDrug);

    var chartData = [];
    chartData.push(drugsData);
    chartData.push(drugsToShow);
    chartData.push(lineColors);

    return chartData;
  },
  
  getDrugsToShow: (data) => {
    var drugs = [];
    for (var i=0; i<data.length;i++)
    {
      if (!drugs.includes(data[i].name))
        drugs.push(data[i].name);
    }
    return drugs;
  },

  getLineColors: (chartNum, region, periodKey, currentDrug) => {
    var lineClrs = {};
    var key = region + '_' + currentDrug;
    var val = '';
    if (chartNum == 1)
    {
      if (periodKey == 'HalfYearly')
        val = firstChartHalfYearlyInfo[key];
      else if (periodKey == 'Quarterly')
        val = firstChartQuarterlyInfo[key];
    }
    else if (chartNum == 2)
    {
      if (periodKey == 'HalfYearly')
        val = secondChartHalfYearlyInfo[key];
      else if (periodKey == 'Quarterly')
        val = secondChartQuarterlyInfo[key];
    }
    var clrs = val?.split('|')[1].split(',');
    var drgs = val?.split('|')[0].split(',');
    for(var i=0;i<drgs.length;i++)
      lineClrs[drgs[i].replace('OpioidsC','Opioids').replace('OpioidsM','Opioids')] = clrs[i]; //SKV TODO

    return lineClrs;

  },

  getLegend: (drug) => {
    return legendInfo[drug] == '' || legendInfo[drug] == null ? drug : legendInfo[drug];
  },

  getHeading: (chartNum, drug, region, period) => {

    var heading = '';
    var rgnFinal = '';
    var prd = (period == 'HalfYearly' ? 'July to December 2022 – July to December 2024' : 'Q4 2022 - Q4 2024');

    switch (region) {
          case 'National':
            rgnFinal = 'United States'; 
            break;
          case 'MIDWEST':
            rgnFinal = 'Midwest Census Region';
            break;
          case 'WEST':
            rgnFinal = 'Western Census Region';
            break;
          case 'SOUTH':
            rgnFinal = 'Southern Census Region';
            break;
          case 'NORTH':
            rgnFinal = 'Northeast Census Region';
            break;
          default:
            break;
        }

    if (chartNum == 1)
    {
      
        switch (drug) {
          case 'Fentanyl':
            heading = 'How often do people with a substance use disorder test positive for ' + drug.toLowerCase() + ' on urine drug tests: Millennium Health, ' + rgnFinal + ' ' + prd; 
            break;
          case 'Heroin':
            heading = 'How often do people with a substance use disorder test positive for ' + drug.toLowerCase() + ' on urine drug tests: Millennium Health, ' + rgnFinal + ' ' + prd; 
            break;
          case 'Cocaine':
            heading = 'How often do people with a substance use disorder test positive for ' + drug.toLowerCase() + ' on urine drug tests: Millennium Health, ' + rgnFinal + ' ' + prd; 
            break;
          case 'Methamphetamine':
            heading = 'How often do people with a substance use disorder test positive for ' + drug.toLowerCase() + ' on urine drug tests: Millennium Health, ' + rgnFinal + ' ' + prd; 
            break;
          default:
            break;
        }
    }
    else if (chartNum == 2)
    {
        switch (drug) {
          case 'Fentanyl':
            heading = 'How often do people with a substance use disorder who test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for cocaine, methamphetamine, or heroin: Millennium Health, ' + rgnFinal + ' ' + prd;  
            break;
          case 'Heroin':
            heading = 'How often do people with a substance use disorder who test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for cocaine, methamphetamine, or fentanyl: Millennium Health, ' + rgnFinal + ' ' + prd;  
            break;
          case 'Cocaine':
            heading = 'How often do people with a substance use disorder who test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for methamphetamine, heroin, or fentanyl: Millennium Health, ' + rgnFinal + ' ' + prd; 
            break;
          case 'Methamphetamine':
            heading = 'How often do people with a substance use disorder who test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for cocaine, heroin, or fentanyl: Millennium Health, ' + rgnFinal + ' ' + prd;  
            break;
          default:
            break;
        }
    }
    return heading;
  },

  getPositivityLabel: (drug) => {
    return posstivityLabeleInfo[drug] == '' || posstivityLabeleInfo[drug] == null ? drug : posstivityLabeleInfo[drug];
  },

  getToggleControls: (ctlName, setShowPercentChange, setShowLabels, showPercentChange, showLabels) => {
    return (
      <Fragment>
        <Fragment>
          <div className="toggle-container" key={{ctlName}} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <div className="toggle-wrapper" style={{ position: 'relative' }}>
                    {(() => {
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
                        ">
                          <div style="margin-top: 8px;">
                            When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
                          </div>
                        </div>
                      `;
                      return (
                        <>
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
                        </>
                      );
                    })()}
                  </div>
          
                  <div className="toggle-wrapper" style={{ position: 'relative' }}>
                    {(() => {
                      const labelTooltip = `
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
                        ">
                          <div style="margin-top: 8px;">
                            When Labels is On, values for all data points will be shown.
                          </div>
                        </div>
                      `;
                      return (
                        <>
                    <label className="toggle-switch" data-tip={labelTooltip} data-for="labelTooltip" style={{ cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={showLabels}
                        onChange={() => setShowLabels(!showLabels)}
                      />
                      <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
                    </label>
                    <span className="toggle-label" style={{ color: showLabels ? '#fff' : '#333', cursor: 'pointer' }} data-tip={labelTooltip} data-for="labelTooltip">Labels {showLabels ? 'On' : 'Off'}</span>
                    <ReactTooltip
                            id="labelTooltip"
                            place="top"
                            effect="solid"
                            backgroundColor="#ededed"
                            border={true}
                            borderColor="#bbb"
                            className="simple-tooltip"
                            html={true}
                            textColor="#222"
                            />
                            </>
                      );
                    })()}
                  </div>
          </div>
        </Fragment>
      </Fragment>
    )
  },

  // Function to calculate non-overlapping label positions
  calculateLabelPositions: (dataPoints, yScale, labelHeight = 20, minGap = 5) => {
    // Sort points by their y position (percentage value)
    const sortedPoints = dataPoints
      .map((point, index) => ({
        ...point,
        originalIndex: index,
        yPos: yScale(parseFloat(point.percentage)),
        preferredY: yScale(parseFloat(point.percentage)) - 14 // Default label position
      }))
      .sort((a, b) => a.yPos - b.yPos);

    // Adjust positions to avoid overlaps
    const adjustedPositions = [];
    let lastLabelBottom = -Infinity;

    sortedPoints.forEach(point => {
      let labelY = point.preferredY;
      const labelTop = labelY - labelHeight / 2;
      const labelBottom = labelY + labelHeight / 2;

      // If this label would overlap with the previous one, push it down
      if (labelTop < lastLabelBottom + minGap) {
        labelY = lastLabelBottom + minGap + labelHeight / 2;
      }

      adjustedPositions[point.originalIndex] = {
        x: point.x,
        y: labelY,
        value: point.percentage
      };

      lastLabelBottom = labelY + labelHeight / 2;
    });

    return adjustedPositions;
  },

  getDrugControls: (ctlName, currentDrug, keyFinding, setSelectedLines, selectedLines, drugsToShow, lineColors, selectedRegion, selectedPeriod, chartNum) => {
    return (
      <Fragment>
        <Fragment>
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
            <div style={{ backgroundColor: '#002b36', color: '#ffffff', padding: '10px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#ffffff', padding: '5px' }}>
                {UtilityFunctions.getHeading(chartNum, currentDrug.charAt(0).toUpperCase() + currentDrug.slice(1), selectedRegion, selectedPeriod)}
                
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>
                
              </p>
            </div>
          </div>
    
          <div style={{
            background: '#4d194d', 
            color: '#fff',
            borderRadius: '24px',
            padding: '14px 24px',
            margin: '24px 0 0 0',
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
                <span style={{ fontWeight: 700 }}>Key finding:</span> {currentDrug} positivity {keyFinding.direction} <span style={{fontWeight:800}}>{keyFinding.absChange}%</span> from <span style={{fontWeight:800}}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{fontWeight:800}}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to {currentDrug} among people with substance use disorders.
              </>
            ) : (
              <>
                <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
              </>
            )}
          </div>
    
    
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === drugsToShow?.length ? '#222' : undefined }}
                    checked={selectedLines.length === drugsToShow?.length && drugsToShow?.every(line => selectedLines.includes(line))}
                    onChange={() => {
                        setSelectedLines(drugsToShow.map(line => line));
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Select All</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === 0 ? '#222' : undefined }}
                    checked={selectedLines?.length === 0}
                    onChange={() => {
                      setSelectedLines([]);
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#222', fontWeight: 400 }}>Clear All</span>
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
              {drugsToShow?.map((drug, idx) => (
                <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedLines?.includes(drug)}
                    onChange={() => {
                      if (selectedLines?.includes(drug)) {
                        setSelectedLines(selectedLines?.filter(line => line !== drug));
                      } else {
                        setSelectedLines([...selectedLines, drug]);
                      }
                    }}
                    style={{ display: 'none' }}
                  />
                  <span
                    style={{
                      display: 'inline-block',
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      border: `2px solid #888`,
                      background: '#fff',
                      marginRight: 2,
                      position: 'relative',
                      transition: 'background 0.2s, border 0.2s',
                    }}
                  >
                    {(selectedLines?.includes(drug)) && (
                      <span
                        style={{
                          display: 'block',
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: lineColors[drug],
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    )}
                  </span>
                  <span style={{ fontSize: '14px', color: '#222' }}>{drug}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        </Fragment>
      </Fragment>
    )
  },
}