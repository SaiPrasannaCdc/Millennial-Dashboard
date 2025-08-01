
import { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { Circle } from '@visx/shape';

const firstChartQuarterlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'National_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'National_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'West_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'West_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'MidWest_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'MidWest_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'South_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'South_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA', 
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',
}

const secondChartQuarterlyInfo = {
  'National_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl with cocaine or methamphetamine|#A378E8,#671AAA,#0C6F96,#0B3345',
  'National_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'National_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'National_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'West_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl with cocaine or methamphetamine|#A378E8,#671AAA,#0C6F96,#0B3345',
  'West_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'West_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'West_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'MidWest_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl with cocaine or methamphetamine|#A378E8,#671AAA,#0C6F96,#0B3345',
  'MidWest_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'MidWest_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'MidWest_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'South_Fentanyl': 'Heroin,Cocaine,Methamphetamine,Fentanyl with cocaine or methamphetamine|#0C6F96,#671AAA,#A378E8,#0B3345',
  'South_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'South_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'South_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',
}

const firstChartHalfYearlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'National_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'National_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'West_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'West_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'MidWest_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'MidWest_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'South_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'South_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7',
  
  'North_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#294891,#0B3345,#0E96CC',
  'North_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0C6F96,#245056,#6AADBA',
  'North_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#671AAA,#50164A,#9E4EBA',
  'North_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#A378E8,#A02B93,#DDB3F7'
}

const secondChartHalfYearlyInfo = {
  'National_Fentanyl': 'Methamphetamine,Cocaine,Heroin,Fentanyl with cocaine or methamphetamine|#A378E8,#671AAA,#0C6F96,#0B3345',
  'National_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'National_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'National_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'West_Fentanyl': 'Heroin,Cocaine,Methamphetamine,Fentanyl with cocaine or methamphetamine|#0C6F96,#671AAA,#A378E8,#0B3345',
  'West_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'West_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'West_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'MidWest_Fentanyl': 'Heroin,Cocaine,Fentanyl with cocaine or methamphetamine,Methamphetamine|#0C6F96,#671AAA,#0B3345,#A378E8',
  'MidWest_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'MidWest_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'MidWest_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'South_Fentanyl': 'Heroin,Methamphetamine,Cocaine,Fentanyl with cocaine or methamphetamine|#0C6F96,#A378E8,#671AAA,#0B3345',
  'South_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'South_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'South_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA',

  'North_Fentanyl': 'Heroin,Cocaine,Fentanyl with cocaine or methamphetamine,Methamphetamine|#0C6F96,#671AAA,#0B3345,#A378E8',
  'North_Heroin': 'Fentanyl,Cocaine,Methamphetamine,Heroin with cocaine or methamphetamine|#294891,#671AAA,#A378E8,#245056',
  'North_Cocaine': 'Fentanyl,Heroin,OpioidsC,Methamphetamine|#294891,#0C6F96,#000C77,#A378E8',
  'North_Methamphetamine': 'Fentanyl,Heroin,OpioidsM,Cocaine|#294891,#0C6F96,#000C77,#671AAA'
}

const drugNodeInfo = {
  'Fentanyl': 'Fentanyl',
  'Fentanyl with cocaine or methamphetamine': 'Fentanyl',
  'Fentanyl without cocaine or methamphetamine': 'Fentanyl',
  'Heroin': 'Heroin',
  'Heroin with cocaine or methamphetamine': 'Heroin',
  'Heroin without cocaine or methamphetamine': 'Heroin',
  'Cocaine': 'Cocaine',
  'Cocaine with fentanyl or heroin': 'Cocaine',
  'Cocaine without fentanyl or heroin': 'Cocaine',
  'Methamphetamine': 'Methamphetamine',
  'Methamphetamine with fentanyl or heroin': 'Methamphetamine',
  'Methamphetamine without fentanyl or heroin': 'Methamphetamine',
  'OpioidsC': 'Cocaine',
  'OpioidsM': 'Methamphetamine',
}

const posstivityLabeleInfo = {
  'Fentanyl': 'Fentanyl postivity',
  'Fentanyl with cocaine or methamphetamine': 'Fentanyl postivity with cocaine or methamphetamine',
  'Fentanyl without cocaine or methamphetamine': 'Fentanyl postivity without cocaine or methamphetamine',
  'Heroin': 'Heroin postivity',
  'Heroin with cocaine or methamphetamine': 'Heroin postivity with cocaine or methamphetamine',
  'Heroin without cocaine or methamphetamine': 'Heroin postivity without cocaine or methamphetamine',
  'Cocaine': 'Cocaine postivity',
  'Cocaine with fentanyl or heroin': 'Cocaine postivity with fentanyl or heroin',
  'Cocaine without fentanyl or heroin': 'Cocaine postivity without fentanyl or heroin',
  'Methamphetamine': 'Methamphetamine postivity',
  'Methamphetamine with fentanyl or heroin': 'Methamphetamine postivity with fentanyl or heroin',
  'Methamphetamine without fentanyl or heroin': 'Methamphetamine postivity without fentanyl or heroin',
  'Opioids': 'Fentanyl or heroin postivity',
}

const CoPositiveInfo = {
  'OpioidsC': 'Cocaine',
  'OpioidsM': 'Methamphetamine',
  'Fentanyl with cocaine or methamphetamine': 'Fentanyl',
  'Heroin with cocaine or methamphetamine': 'Heroin',
}

const legendInfo = {
  'Fentanyl with cocaine or methamphetamine': 'Fentanyl with cocaine or methamphetamine',
  'Fentanyl without cocaine or methamphetamine': 'Fentanyl without cocaine or methamphetamine',
  'Heroin with cocaine or methamphetamine': 'Heroin with cocaine or methamphetamine',
  'Heroin without cocaine or methamphetamine': 'Heroin without cocaine or methamphetamine',
  'Heroin': 'Any Heroin',
  'Cocaine with fentanyl or heroin': 'Cocaine with heroin or fentanyl',
  'Cocaine without fentanyl or heroin': 'Cocaine without heroin or fentanyl',
  'Cocaine': 'Any Cocaine',
  'Opioids': 'Fentanyl or Heroin',
  'Methamphetamine with fentanyl or heroin': 'Methamphetamine with heroin or fentanyl',
  'Methamphetamine without fentanyl or heroin': 'Methamphetamine without heroin or fentanyl',
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
    if (region == 'West' && mdrug == 'Heroin' && periodKey == 'HalfYearly' && drug == 'Heroin with cocaine or methamphetamine')
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
          percentage: parseFloat(drg.percentage).toFixed(1),
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
          percentage: parseFloat(drg.percentage).toFixed(1),
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
                  <span style={{ fontSize: '14px', color: '#222' }}>{drug.replace('Opioids','Fentanyl or heroin')}</span>
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