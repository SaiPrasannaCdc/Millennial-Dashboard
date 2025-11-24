
import { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';
import { Circle } from '@visx/shape';

const firstChartQuarterlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'National_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'National_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'West_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'West_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'MidWest_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'MidWest_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'South_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'South_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'North_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'North_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'North_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'North_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',
}

const firstChartHalfYearlyInfo = {
  'National_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'National_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'National_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'National_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'West_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'West_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'West_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'West_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'MidWest_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'MidWest_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'MidWest_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'MidWest_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'South_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'South_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'South_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'South_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',

  'North_Fentanyl': 'Fentanyl,Fentanyl with cocaine or methamphetamine,Fentanyl without cocaine or methamphetamine|#1C1570,#f04b53,#356ECC',
  'North_Heroin': 'Heroin,Heroin with cocaine or methamphetamine,Heroin without cocaine or methamphetamine|#0E6F97,#255056,#69ADBA',
  'North_Cocaine': 'Cocaine,Cocaine with fentanyl or heroin,Cocaine without fentanyl or heroin|#663795,#501649,#9D4EB9',
  'North_Methamphetamine': 'Methamphetamine,Methamphetamine with fentanyl or heroin,Methamphetamine without fentanyl or heroin|#9179B5,#A32E63,#DCB3F7',
}

const secondChartQuarterlyInfo = {
  'Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  'Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  'Cocaine': 'Fentanyl or heroin,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  'Methamphetamine': 'Fentanyl or heroin,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'National_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'National_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'National_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'National_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'West_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'West_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'West_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'West_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'MidWest_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'MidWest_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'MidWest_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'MidWest_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'South_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'South_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'South_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'South_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'North_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'North_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'North_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'North_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',
}

const secondChartHalfYearlyInfo = {

  'Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  'Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  'Cocaine': 'Fentanyl or heroin,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  'Methamphetamine': 'Fentanyl or heroin,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'National_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'National_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'National_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'National_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'West_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'West_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'West_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'West_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'MidWest_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'MidWest_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'MidWest_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'MidWest_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'South_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'South_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'South_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'South_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',

  // 'North_Fentanyl': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Heroin|#f04b53,#663795,#9179B5,#0E6F97',
  // 'North_Heroin': 'Cocaine or methamphetamine,Cocaine,Methamphetamine,Fentanyl|#255056,#663795,#9179B5,#1C1570',
  // 'North_Cocaine': 'OpioidsC,Fentanyl,Heroin,Methamphetamine|#F09F34,#1C1570,#0E6F97,#9179B5',
  // 'North_Methamphetamine': 'OpioidsM,Fentanyl,Heroin,Cocaine|#F09F34,#1C1570,#0E6F97,#663795',
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
  // 'OpioidsC': 'Cocaine',
  // 'OpioidsM': 'Methamphetamine',
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
  // 'Opioids': 'Fentanyl or heroin postivity',
}

const CoPositiveInfo = {
  // 'OpioidsC': 'Cocaine',
  // 'OpioidsM': 'Methamphetamine',
  'Fentanyl with cocaine or methamphetamine': 'Fentanyl',
  'Heroin with cocaine or methamphetamine': 'Heroin',
}

const legendInfo = {
  'Fentanyl with cocaine or methamphetamine': 'Cocaine or methamphetamine',
  'Fentanyl without cocaine or methamphetamine': 'Fentanyl without cocaine or methamphetamine',
  'Heroin with cocaine or methamphetamine': 'Cocaine or methamphetamine',
  'Heroin without cocaine or methamphetamine': 'Heroin without cocaine or methamphetamine',
  'Heroin': 'Any Heroin',
  'Cocaine with fentanyl or heroin': 'Cocaine with heroin or fentanyl',
  'Cocaine without fentanyl or heroin': 'Cocaine without heroin or fentanyl',
  'Cocaine': 'Any Cocaine',
  // 'Opioids': 'Fentanyl or Heroin',
  'Methamphetamine with fentanyl or heroin': 'Methamphetamine with heroin or fentanyl',
  'Methamphetamine without fentanyl or heroin': 'Methamphetamine without heroin or fentanyl',
  'Methamphetamine': 'Any Methamphetamine',
  'Fentanyl': 'Any Fentanyl',
}

const drugOptions = {
  'fentanyl': {
    'color': '#1C1570',
  },
  'heroin': {
    'color': '#0E6F97',
  },
  'cocaine': {
    'color': '#663795',
  },
  'methamphetamine': {
    'color': '#9179B5',

  }
}

export const UtilityFunctions = {

  getPositivity: (drug) => {
    return CoPositiveInfo[drug] != null ? 'CoPositive' : 'Positivity';
  },

  getDrugData: (data, region, mdrug, pos, periodKey, drugs) => {

    const arr = data?.[region]?.[mdrug]?.[pos]?.[periodKey] || [];
    if (periodKey == 'HalfYearly') {
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name)).map(d => ({
          drug: name,
          period: (d.period || d.smon_yr)?.substring(5) + ' ' + (d.period || d.smon_yr).substring(0, 4),
          percentage: parseFloat(d.percentage),
          ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
          ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
          annual: d.Annual || d['Yr_change'] || d.yr_change || '',
          periodChange: d.Period || d.periodChange || '',
          yearlyChange: d.yr_change || '',
        }))
      })).filter(line => line.data.length > 0);
    }
    else {
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name)).map(d => ({
          drug: name,
          quarter: d.period || d.smon_yr,
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
    var drugNm = drug; //SKV TODO
    const arr = data?.[region]?.[mainDrug]?.[coPos]?.[periodKey] || [];
    
    const drgRecs = arr.filter(d => (d.drug_name == drugNm));
    if (periodKey == 'HalfYearly') {
      return drgRecs.map(drg => ({
        drug: drugNm,
        period: (drg.period || drg.smon_yr)?.substring(5) + ' ' + (drg.period || drg.smon_yr).substring(0, 4),
        percentage: parseFloat(drg.percentage).toFixed(1),
        ciLower: parseFloat(drg['ciLower'] ?? drg['CI lower'] ?? drg['CI_lower'] ?? drg.ciLower),
        ciUpper: parseFloat(drg['ciUpper'] ?? drg['CI upper'] ?? drg['CI_upper'] ?? drg.ciUpper),
        annual: drg.Annual || drg['Yr_change'] || drg.yr_change || '',
        periodChange: drg.Period || drg.periodChange || '',
        yearlyChange: drg.yr_change || '',
      }));
    }
    else {
      return drgRecs.map(drg => ({
        drug: drugNm,
        quarter: drg.period.replace('Q1','Jan-Mar').replace('Q2','Apr-Jun').replace('Q3','Jul-Sep').replace('Q4','Oct-Dec') || drg.smon_yr,
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
    drugs.forEach(function (drug, index) {
      var drugsData = {};
      let vals = UtilityFunctions.getDrugDataNew(data, region, periodKey, mainDrug, drug, chartNum);
      drugsData['name'] = drug; //SKV TODO
      drugsData['values'] = vals;
      drugsDataSet.push(drugsData);
    });
    return drugsDataSet;
  },

  getChartOneData: (data, region, mdrug, periodKey, isSVP) => {

    var mainReg = region == 'MIDWEST' ? 'MidWest' : region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
    var mainDrug = mdrug.charAt(0).toUpperCase() + mdrug.slice(1);
    var drugsStr = periodKey == 'Quarterly' ? firstChartQuarterlyInfo[mainReg + '_' + mainDrug] : firstChartHalfYearlyInfo[mainReg + '_' + mainDrug];
    var drugs = drugsStr?.split('|')[0].split(',');

    const drugsData = (region == 'NORTH' && periodKey == 'Quarterly') ? UtilityFunctions.getDrugsDataNew(data, 'South', periodKey, mainDrug, drugs, 1) : UtilityFunctions.getDrugsDataNew(data, mainReg, periodKey, mainDrug, drugs, 1);
    const drugsToShow = UtilityFunctions.getDrugsToShow(drugsData);
    const lineColors = UtilityFunctions.getLineColors(1, mainReg, periodKey, mainDrug);

    //temp workaround 
    if (region == 'NORTH' && periodKey == 'Quarterly')
    {
      for(var x=0;x<drugsData.length;x++) {
        for(var y=0;y<drugsData[x].values.length;y++) {
          drugsData[x].values[y].ciLower = -1;
          drugsData[x].values[y].ciUpper = -1;
          drugsData[x].values[y].percentage = -1;
        }
      }
    }

    var chartData = [];
    chartData.push(drugsData);
    chartData.push(drugsToShow);
    chartData.push(lineColors);

    return chartData;
  },

  getChartTwoData: (data, region, mdrug, periodKey) => {
    
    var mainReg = region == 'MIDWEST' ? 'MidWest' : region.charAt(0).toUpperCase() + region.slice(1).toLowerCase();
    var mainDrug = mdrug.charAt(0).toUpperCase() + mdrug.slice(1);
    var drugsStr = periodKey == 'Quarterly' ? secondChartQuarterlyInfo[mainDrug] : secondChartHalfYearlyInfo[mainDrug];
    var drugs = drugsStr?.split('|')[0].split(',');

    const drugsData = (region == 'NORTH' && periodKey == 'Quarterly') ? UtilityFunctions.getDrugsDataNew(data, 'South', periodKey, mainDrug, drugs, 2) : UtilityFunctions.getDrugsDataNew(data, mainReg, periodKey, mainDrug, drugs, 2);
    const drugsToShow = UtilityFunctions.getDrugsToShow(drugsData);
    const lineColors = UtilityFunctions.getLineColors(2, mainReg, periodKey, mainDrug);

    //temp workaround
    if (region == 'NORTH' && periodKey == 'Quarterly')
    {
      for(var x=0;x<drugsData.length;x++) {
        for(var y=0;y<drugsData[x].values.length;y++) {
          drugsData[x].values[y].ciLower = -1;
          drugsData[x].values[y].ciUpper = -1;
          drugsData[x].values[y].percentage = -1;
        }
      }
    }

    var chartData = [];
    chartData.push(drugsData);
    chartData.push(drugsToShow);
    chartData.push(lineColors);

    return chartData;
  },

  getDrugsToShow: (data) => {
    var drugs = [];
    for (var i = 0; i < data.length; i++) {
      if (!drugs.includes(data[i].name))
        drugs.push(data[i].name);
    }
    return drugs;
  },

  getLineColors: (chartNum, region, periodKey, currentDrug) => {
    var lineClrs = {};
    var key = region + '_' + currentDrug;
    var val = '';
    if (chartNum == 1) {
      if (periodKey == 'HalfYearly')
        val = firstChartHalfYearlyInfo[key];
      else if (periodKey == 'Quarterly')
        val = firstChartQuarterlyInfo[key];
    }
    else if (chartNum == 2) {
      if (periodKey == 'HalfYearly')
        val = secondChartHalfYearlyInfo[currentDrug];
      else if (periodKey == 'Quarterly')
        val = secondChartQuarterlyInfo[currentDrug];
    }
    var clrs = val?.split('|')[1].split(',');
    var drgs = val?.split('|')[0].split(',');
    for (var i = 0; i < drgs.length; i++)
      lineClrs[drgs[i]] = clrs[i]; 
    //SKV TODO

    return lineClrs;

  },

  getLegend: (drug) => {
    return legendInfo[drug] == '' || legendInfo[drug] == null ? drug : legendInfo[drug];
  },

  formatText: (drugLabel, chartNum) => {
    if (chartNum == 1)
      return UtilityFunctions.getLegend(drugLabel);
    else {
      return UtilityFunctions.getLegend(drugLabel.replace('Fentanyl with cocaine or methamphetamine', 'Cocaine or methamphetamine').replace('Heroin with cocaine or methamphetamine', 'Cocaine or methamphetamine'));
    }
  },

  getHeading: (chartNum, drug, region, period) => {

    var heading = '';
    var rgnFinal = '';
    var rgnShort = '';
    var prd = (period == 'HalfYearly' ? 'July 2022 – December 2024' : 'October 2022 – December 2024');

    switch (region) {
      case 'National':
        rgnFinal = 'National';
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

    switch (region) {
      case 'National':
        rgnShort = 'National';
        break;
      case 'MIDWEST':
        rgnShort = 'Midwest';
        break;
      case 'WEST':
        rgnShort = 'West';
        break;
      case 'SOUTH':
        rgnShort = 'South';
        break;
      case 'NORTH':
        rgnShort = 'Northeast';
        break;
      default:
        break;
    }

    if (chartNum == 1) {

      switch (drug) {
        case 'Fentanyl':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests: ' + rgnShort + ', ' + prd;
          break;
        case 'Heroin':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests: ' + rgnShort + ', ' + prd;
          break;
        case 'Cocaine':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests: ' + rgnShort + ', ' + prd;
          break;
        case 'Methamphetamine':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests: ' + rgnShort + ', ' + prd;
          break;
        default:
          break;
      }
    }
    else if (chartNum == 2) {
      switch (drug) {
        case 'Fentanyl':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests and also test positive for cocaine, methamphetamine, or heroin: ' + rgnShort + ', ' + prd;
          break;
        case 'Heroin':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for cocaine, methamphetamine, or fentanyl: ' + rgnShort + ', ' + prd;
          break;
        case 'Cocaine':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for fentanyl, heroin, or methamphetamine: ' + rgnShort + ', ' + prd;
          break;
        case 'Methamphetamine':
          heading = 'Percentage of specimens from people with a substance use disorder that test positive for ' + drug.toLowerCase() + ' on urine drug tests also test positive for fentanyl, heroin, or cocaine: ' + rgnShort + ', ' + prd;
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

  getToggleControls: (ctlName, setShowPercentChange, setShowLabels, showPercentChange, showLabels, selectedRegion, selectedPeriod, isSVP) => {
    return (
      <Fragment>
        <Fragment>
          <div className="toggle-container" key={{ ctlName }} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
                            When <b>% Chg</b> is on, ` + (selectedPeriod == 'Quarterly' ? 'hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.' : 'hover over the data points for the 3 most recent 6-month time periods to view precent change from the same 6-month period in the previous year and the previous 6-month period.') + `
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
                        checked={(selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? false : showPercentChange}
                        onChange={() => setShowPercentChange(!showPercentChange)}
                        disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                      />
                      <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? ((selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? '#ccc' : '#002b36') : '#ccc' }}></span>
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
                        checked={(selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? false : showLabels}
                        onChange={() => setShowLabels(!showLabels)}
                        disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                      />
                      <span className="slider label-toggle" style={{ backgroundColor: showLabels ? ((selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? '#ccc' : '#002b36') : '#ccc' }}></span>
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

  getDrugControls: (ctlName, currentDrug, keyFinding, setSelectedLines, selectedLines, drugsToShow, lineColors, selectedRegion, selectedPeriod, chartNum, isSVP) => {
    return (
      <Fragment>
        <Fragment>
          <div style={{ fontFamily: 'Arial, sans-serif' }}>
              <div style={{ 'backgroundColor': drugOptions[currentDrug].color}}>
                <h2 className="data-bite-header">
                  {UtilityFunctions.getHeading(chartNum, currentDrug.charAt(0).toUpperCase() + currentDrug.slice(1), selectedRegion, selectedPeriod)}{<sup>*,†</sup>}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#ffffff' }}>

                </p>
              </div>

            {/* {selectedRegion == 'National' && selectedPeriod == 'Quarterly' &&
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
                    <span style={{ fontWeight: 700 }}>Key finding:</span> {currentDrug.charAt(0).toUpperCase() + currentDrug.slice(1).toLowerCase()} positivity {keyFinding.direction} <span style={{ fontWeight: 800 }}>{keyFinding.absChange}%</span> from <span style={{ fontWeight: 800 }}>{keyFinding.prev}%</span> in {keyFinding.prevLabel} to <span style={{ fontWeight: 800 }}>{keyFinding.last}%</span> in {keyFinding.lastLabel}. This may indicate {keyFinding.direction === 'decreased' ? 'decreased exposure' : 'increased exposure'} to {currentDrug} among people with substance use disorders.
                  </>
                ) : (
                  <>
                    <span style={{ fontWeight: 700 }}>Key finding:</span> Not enough data to calculate change.
                  </>
                )}
              </div>
            } */}

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px' }}>
              {!isSVP && 
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginTop: '18px' }}>
                <span style={{ fontSize: '15px', fontWeight: '700', marginRight: '20px' }}>Make a selection to change the line graph</span>
                
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === drugsToShow?.length ? '#222' : undefined }}
                      checked={selectedLines.length === drugsToShow?.length && drugsToShow?.every(line => selectedLines.includes(line))}
                      onChange={() => {
                        setSelectedLines(drugsToShow.map(line => line));
                      }}
                       disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                    />
                    <span style={{ fontSize: '1rem', color: '#222', fontWeight: 400 }}>Select All</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === 0 ? '#222' : undefined }}
                      checked={selectedLines?.length === 0 || (selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH')}
                      onChange={() => {
                        setSelectedLines([]);
                      }}
                      disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                    />
                    <span style={{ fontSize: '1rem', color: '#222', fontWeight: 400 }}>Clear All</span>
                  </label>
                </div>
              </div>
              }
              {isSVP && 
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px' }}>
                  <table>
                    <tr>
                      <td colspan='2'>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: '20px' }}>Make a selection to change the line graph</span>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === drugsToShow?.length ? '#222' : undefined }}
                            checked={selectedLines.length === drugsToShow?.length && drugsToShow?.every(line => selectedLines.includes(line))}
                            onChange={() => {
                              setSelectedLines(drugsToShow.map(line => line));
                            }}
                             disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                          />
                          <span style={{ fontSize: '1rem', color: '#222', fontWeight: 400 }}>Select All</span>
                          </label>
                      </td>
                      <td>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input type="radio" name={'select-clear-drug' + ctlName} style={{ accentColor: selectedLines?.length === 0 ? '#222' : undefined }}
                            checked={selectedLines?.length === 0 || (selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH')}
                            onChange={() => {
                              setSelectedLines([]);
                            }}
                             disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
                          />
                          <span style={{ fontSize: '1rem', color: '#222', fontWeight: 400 }}>Clear All</span>
                        </label>
                      </td>
                    </tr>
                  </table>
                 </div>
                }
              {isSVP && <br></br>}
              {chartNum == 2 && <span style={{ fontSize: '13px', fontWeight: 'bold', marginRight: '20px' }}>Other drugs detected among specimens positive for {currentDrug.toLowerCase()}</span>}
              {isSVP && <br></br>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px', marginBottom: '20px' }}>
                {!isSVP && drugsToShow?.map((drug, idx) => (
                  <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? false: selectedLines?.includes(drug)}
                      onChange={() => {
                        if (selectedLines?.includes(drug)) {
                          setSelectedLines(selectedLines?.filter(line => line !== drug));
                        } else {
                          setSelectedLines([...selectedLines, drug]);
                        }
                      }}
                      disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
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
                            background: (selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? '' : lineColors[drug],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      )}
                    </span>
                    <span style={{ color: '#222', fontSize: '1rem', fontWeight: 400}}>{UtilityFunctions.formatText(drug, chartNum)}</span>
                  </label>
                ))}
                {isSVP && 
                <table>
                  {drugsToShow?.map((drug, idx) => (
                  <tr>
                    <td>
                  <label key={drug} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={(selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? false: selectedLines?.includes(drug)}
                      onChange={() => {
                        if (selectedLines?.includes(drug)) {
                          setSelectedLines(selectedLines?.filter(line => line !== drug));
                        } else {
                          setSelectedLines([...selectedLines, drug]);
                        }
                      }}
                      disabled={selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH'}
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
                            background: (selectedPeriod == 'Quarterly' && selectedRegion == 'NORTH') ? '' : lineColors[drug],
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                          }}
                        />
                      )}
                    </span>
                    <span style={{ color: '#222', fontSize: '1rem', fontWeight: 400 }}>{UtilityFunctions.formatText(drug, chartNum)}</span>
                  </label>
                  </td>
                  </tr>
                ))}
                </table>
                }
              </div>
            </div>
          </div>
        </Fragment>
      </Fragment>
    )
  },

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

  getNoOfTests: (data, region, tframe) => {

    return data[region][tframe].noOfTests;

  },

  getNoOfStates: (data, region, tframe) => {
    
    return data[region][tframe].noOfStates;

  },

  getTimeStamp: (data, region, tframe) => {
    
    return data[region][tframe].timeStamp;

  },

   calculateYScaleDomain: (data, selectedDrugs)=> {

    var percVals = [];
    for (var i=0;i<data.length;i++)
    {
      for (var j=0;j<data[i].values.length;j++)
      {
        if (selectedDrugs.includes(data[i].name))
          percVals.push(data[i].values[j].percentage)
      }
    }

    percVals.sort((a, b) => b - a);

    return percVals[0];
  }, 
}