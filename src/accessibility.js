import { UtilityFunctions } from './utility'

export const AccessibilityFunctions = {

  formatHalfYearLabel : (periodStr) => {
      if (periodStr == null || periodStr == undefined || periodStr == '')
        return '';

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
  },

  getPercentageValue : (dataSet, drug, timePeriod, period) => {
      for (var x=0;x<dataSet.length;x++)
      {
        if (drug == dataSet[x].name)
        {
          for (var y=0;y<dataSet[x].values.length;y++)
          {
            if (timePeriod == 'Quarterly') {
              if (dataSet[x].values[y].quarter == period)
                return dataSet[x].values[y].percentage;
            }
            else
            {
              if (dataSet[x].values[y].period == period)
                return dataSet[x].values[y].percentage;
            }
          }
        }
      }
  },

  getPrevPeriodValue : (lineData, i, offset = 1) => {
    if (i - offset >= 0) {
      return parseFloat(lineData.values[i - offset].percentage);
    }
    return null;
  },

  getPrevPeriodPeriod : (lineData, i, offset = 1, period) => {
    if (i - offset >= 0) {
      return period == 'Quarterly' ? lineData.values[i - offset].quarter : lineData.values[i - offset].period;
    }
    return null;
  },

  getTooltip1Value : (dataSet, drug, timePeriod, period) => {
    
    var perc = null;
    var ciUpp = null;
    var ciLow = null;
    if (timePeriod == 'Quarterly') {
      var drugrec = dataSet.find(rec => rec.name == drug);
      for (var x=0;x<drugrec.values.length;x++) {
        if (drugrec.values[x].quarter == period) {
          perc = drugrec.values[x].percentage;
          ciUpp = drugrec.values[x].ciUpper;
          ciLow = drugrec.values[x].ciLower;
          return UtilityFunctions.getPositivityLabel(drug) + ': ' + perc + '</br>' + '95% confidence interval: ' + ciLow + '% - ' + ciUpp + '%';
        }
      }
    }
    else
    {
      var drugrec = dataSet.find(rec => rec.name == drug);
      for (var x=0;x<drugrec.values.length;x++) {
        if (drugrec.values[x].period == period) {
          perc = drugrec.values[x].percentage;
          ciUpp = drugrec.values[x].ciUpper;
          ciLow = drugrec.values[x].ciLower;
          return UtilityFunctions.getPositivityLabel(drug) + ': ' + perc + '</br>' + '95% confidence interval: ' + ciLow + '% - ' + ciUpp + '%';
        }
      }
    }
  },

  getTooltip2Value : (dataSet, drug, timePeriod, period, index) => {

      const datarec = dataSet.find(rec => rec.name == drug);
      const prevPeriod = AccessibilityFunctions.getPrevPeriodValue(datarec, index, 1);
      const prevPeriodPeriod = AccessibilityFunctions.getPrevPeriodPeriod(datarec, index, 1, timePeriod);
      const yearlyOffset = timePeriod === 'Quarterly' ? 4 : 2;
      const prevYear = AccessibilityFunctions.getPrevPeriodValue(datarec, index, yearlyOffset);
      const prevYearPeriod = AccessibilityFunctions.getPrevPeriodPeriod(datarec, index, yearlyOffset, timePeriod);
      const curr = parseFloat(AccessibilityFunctions.getPercentageValue(dataSet, drug, timePeriod, period));

      const yearlyChange = prevYear !== null ? ((curr - prevYear) / prevYear) * 100 : null;
      const periodChange = prevPeriod !== null ? ((curr - prevPeriod) / prevPeriod) * 100 : null;

      const xLabel = timePeriod === 'Quarterly' ? datarec.values[index]?.quarter : AccessibilityFunctions.formatHalfYearLabel(datarec.values[index]?.period);
      if (isNaN(curr)) return null;

      const showYearlyIndicator = index >= yearlyOffset;

      return `${showYearlyIndicator ? `<strong>Yearly Change:</strong> ${yearlyChange !== null ? Number(yearlyChange).toFixed(1) : 'N/A'}% (${yearlyChange !== null && yearlyChange > 0 ? 'Increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})</br>    ${UtilityFunctions.getPositivityLabel(drug)} ${yearlyChange !== null && yearlyChange > 0 ? 'increased' : (Number(yearlyChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevYear !== null ? prevYear.toFixed(1) : 'N/A'}% in ${prevYearPeriod} to ${curr.toFixed(1)}% in ${xLabel}` : ''}</br><strong>${timePeriod === 'Quarterly' ? 'Quarterly' : '6 Month'} Change:</strong> ${periodChange !== null ? Number(periodChange).toFixed(1) : 'N/A'}% (${periodChange !== null && periodChange > 0 ? 'Increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'No Change' : 'Decreased')})</br>    ${UtilityFunctions.getPositivityLabel(drug)} ${periodChange !== null && periodChange > 0 ? 'increased' : (Number(periodChange).toFixed(1) == 0.0 ? 'no change' : 'decreased')} from ${prevPeriod !== null ? prevPeriod.toFixed(1) : 'N/A'}% in ${prevPeriodPeriod} to ${curr.toFixed(1)}% in ${xLabel}`;
  },

  generateLineChartData : (dataSet, selectedDrugs, period) => {

      let myData = {};
      let drugs = [];
      let quarters = [];
      let periods = [];

      if (dataSet.length == 0)
        return myData;

      for (var k=0;k<dataSet.length;k++)
        drugs.push(dataSet[k].name);
      
      if (period == 'Quarterly') {
        for (var j=0;j<dataSet[0].values.length;j++)
          quarters.push(dataSet[0].values[j].quarter)
      
        quarters.forEach((qrt) => {
          let obj = {};
          drugs.forEach((drg) => {
            if (selectedDrugs.includes(drg))
            {
              obj[drg] = AccessibilityFunctions.getPercentageValue(dataSet, drg, period, qrt)
            }
          });
          myData[qrt] = obj;
        });
      }
      else
      {
        for (var j=0;j<dataSet[0].values.length;j++)
          periods.push(dataSet[0].values[j].period)
      
        periods.forEach((prd) => {
          let obj = {};
          drugs.forEach((drg) => {
            if (selectedDrugs.includes(drg))
            {
              obj[drg] = AccessibilityFunctions.getPercentageValue(dataSet, drg, period, prd)
            }
          });
          myData[prd] = obj;
        });
      }   

    return myData;
  
  },  

  generateToolTipData : (dataSet, selectedDrugs, period, num) => {

      let myData = {};
      let drugs = [];
      let quarters = [];
      let periods = [];

      if (dataSet.length == 0)
        return myData;

      for (var k=0;k<dataSet.length;k++)
        drugs.push(dataSet[k].name);
      
      if (period == 'Quarterly') {
        for (var j=0;j<dataSet[0].values.length;j++)
          quarters.push(dataSet[0].values[j].quarter)
      
        quarters.forEach((qrt, index) => {
          let obj = {};
          drugs.forEach((drg) => {
            if (selectedDrugs.includes(drg))
            {
              obj[drg] = num == 1 ? AccessibilityFunctions.getTooltip1Value(dataSet, drg, period, qrt) : AccessibilityFunctions.getTooltip2Value(dataSet, drg, period, qrt, index);
            }
          });
          myData[qrt] = obj;
        });
      }
      else
      {
        for (var j=0;j<dataSet[0].values.length;j++)
          periods.push(dataSet[0].values[j].period)
      
        periods.forEach((prd, index) => {
          let obj = {};
          drugs.forEach((drg) => {
            if (selectedDrugs.includes(drg))
            {
              obj[drg] = num == 1 ? AccessibilityFunctions.getTooltip1Value(dataSet, drg, period, prd) : AccessibilityFunctions.getTooltip2Value(dataSet, drg, period, prd, index);
            }
          });
          myData[prd] = obj;
        });
      }   

    return myData;
  
  },  
}