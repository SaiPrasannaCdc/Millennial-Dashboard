import {ageMapping, raceMapping, monthLabelOverrides, statesMappingByGeo} from './constants/Constants';

const getAdjustedPercent = (percent, count) => {
  if (count > 0 && percent === 0) {
    return '<0.1';
  }

  return percent;
}

const toFixed = (num, places = 1) => {
  if (num !== undefined) {
    if (num.toFixed) {
      return num.toFixed(places);
    }
    if (!isNaN(parseFloat(num))) {
      return parseFloat(num).toFixed(places)
    }
  }
  return num;
};

const getPercentFormatted = (d, isFinal) => {
  return isFinal ? toFixed(getAdjustedPercent(d.percent, d.count)) : (`${toFixed(getAdjustedPercent(d.percent))}% (${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`);
}

const getStateNameByGeo = (geo) => {
    if (statesMappingByGeo && statesMappingByGeo[geo])
      return statesMappingByGeo[geo][0];

    return geo;
}

const getData = (data, year, group, state, c) => {
    return data[year][state][group].find(g => g.circumstance === c) || {};
}

const raceSort = (a, b) => {
    const aRace = raceMapping[a.race] || a.race;
    const bRace = raceMapping[b.race] || b.race;
    if (aRace === 'Hispanic') {
      return 1;
    } else if (bRace === 'Hispanic') {
      return -1;
    }
    return (aRace < bRace) ? -1 : 1;
};

export const MultiYearAccessFunctions = {

  generateMUltiYearGlanceData: (datasetsMY, state, myYears, extraColsCnt)=> {

    extraColsCnt = 0;
    let myData = [];

    let obj1 = {};
    let obj4 = {};
    
    //data1
    let key0 = 'quarter';
    let value0 = 'Total';
    obj1[key0] = value0;
    for (var i=0;i<myYears.length;i++)
    {
      let key1 = 'value' + (i+1).toString();
      let value1 = datasetsMY.totalData[myYears[i]][state]
      let key2 = 'percent' + (i+1).toString();
      let value2 = '100.0'
      obj1[key1] = value1;
      obj1[key2] = value2;
    }
    myData.push(obj1);

    //data2
    let obj2 = { quarter: `Quarter`, spacer: true, colSpan: ((myYears.length * 2) + extraColsCnt) } 
    myData.push(obj2);

    //data3
    for (var j=0;j<Object.keys(datasetsMY.timeData).length;j++) {
      let obj3 = {};
      let yr = Object.keys(datasetsMY.timeData)[j];
      key0 = 'quarter';
      value0 = monthLabelOverrides[datasetsMY.timeData[yr][state].quarter[j].quarter];
      obj3[key0] = value0;
      for (i=0;i<myYears.length;i++)
      {
        let key1 = 'value' + (i+1).toString();
        let value1 = datasetsMY.timeData[myYears[i]][state].quarter[j].value;
        let key2 = 'percent' + (i+1).toString();
        let value2 = toFixed((datasetsMY.timeData[myYears[i]][state].quarter[j].value / datasetsMY.totalData[myYears[i]][state] * 1000) / 10)
        obj3[key1] = value1;
        obj3[key2] = value2;
      }

      myData.push(obj3); 
    };

    //data4
    key0 = 'quarter';
    value0 = <>At least one potential opportunity for intervention<sup>1</sup></>;
    obj4[key0] = value0;
    for (i=0;i<myYears.length;i++)
    {
      let key1 = 'value' + (i+1).toString();
      let value1 =  datasetsMY.interventionData[myYears[i]][state].deaths;
      let key2 = 'percent' + (i+1).toString();
      let value2 = datasetsMY.interventionData[myYears[i]][state].percent;
      obj4[key1] = value1;
      obj4[key2] = value2;
    }
    myData.push(obj4);

    return myData;
  },

  generateMultiYearDrugData : (formattedEmergingDrugsData, emergingDrug, myYears, myJurisdictions, extraColsCnt) => {

    extraColsCnt = 0; 
    let myData = [];
  
    let obj = {};
    let key0 = 'jurisdiction';
    let value0 = 'Overall';
    obj[key0] = value0;
    for (var i=0;i<myYears.length;i++)
    {
      let key1 = 'causeCount' + (i+1).toString();
      let value1 = formattedEmergingDrugsData[myYears[i]][emergingDrug][value0] !== undefined ? formattedEmergingDrugsData[myYears[i]][emergingDrug][value0].causeCount : 0;
      let key2 = 'causePercent' + (i+1).toString();
      let value2 = formattedEmergingDrugsData[myYears[i]][emergingDrug][value0] !== undefined ? (formattedEmergingDrugsData[myYears[i]][emergingDrug][value0].causeCount > 0 && formattedEmergingDrugsData[myYears[i]][emergingDrug][value0].causePercent == 0 ? '<0.1' : formattedEmergingDrugsData[myYears[i]][emergingDrug][value0].causePercent) : 0;
      obj[key1] = value1;
      obj[key2] = value2;
    }
    myData.push(obj);        
    
    for (var j=0;j<myJurisdictions.length;j++)
    {
      if (myJurisdictions[j] !== 'Overall') {
        let obj = {};
        let key0 = 'jurisdiction';
        let value0 = getStateNameByGeo(myJurisdictions[j]);
        obj[key0]=value0;

        for (i=0;i<myYears.length;i++)
        {
            let key1 = 'causeCount' + (i+1).toString();
            let value1 = formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]] !== undefined ? formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]].causeCount : 0;
            let key2 = 'causePercent' + (i+1).toString();
            let value2 = formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]] !== undefined ? (formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]].causeCount > 0 && formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]].causePercent == 0 ? '<0.1' : formattedEmergingDrugsData[myYears[i]][emergingDrug][myJurisdictions[j]].causePercent) : 0;
            obj[key1] = value1;
            obj[key2] = value2;
        }
        myData.push(obj); 
      }
    }

    return myData;

  },

  generateMultiYearDemData : (datasetsMY, state, myYears, isFinal, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];
      let colSpanCnt = myYears.length * 3;
  
      //1st one
      let objS1 = { demographic: `Sex`, spacer: true, colSpan: colSpanCnt + extraColsCnt, background: true } 
      let objD1 = {};
      let key01 = 'demographic';
      let value01 = '';
      objD1[key01]=value01
      for (var i=0;i<myYears.length;i++)
      {
        let key1 = 'deaths' + (i+1).toString();
        let value1 = '';
        objD1[key1] = value1;
        let key2 = 'percent' + (i+1).toString();
        let value2 = '';
        objD1[key2] = value2;
        let key3 = 'rate' + (i+1).toString();
        let value3 = ''
        objD1[key3] = value3;
      }
      let keyD1 = 'dummy';
      let valueD1 = true;
      objD1[keyD1] = valueD1;
     
      myData.push(objD1);
      myData.push(objS1);
  
      let dataSorted1 = datasetsMY?.sexData[myYears[0]][state].sort((a, b) => a.sex > b.sex ? -1 : 1);
      
      for (var x=0;x<dataSorted1.length;x++) {
        let obj1 = {};
        let key0 = 'demographic';
        let value0 = `    ${dataSorted1[x].sex}`;
        obj1[key0] = value0;
        for (i=0;i<myYears.length;i++)
        {
          let datum = datasetsMY?.sexData[myYears[i]][state].sort((a, b) => a.sex > b.sex ? -1 : 1)[x];
          let key1 = 'deaths' + (i+1).toString();
          let value1 = datum.count;
          obj1[key1] = value1;
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(datum, isFinal);
          obj1[key2] = value2;
          let key3 = 'rate' + (i+1).toString();
          let value3 = isFinal ? datasetsMY?.sexDataRates[myYears[i]][state][x]?.sex === datum?.sex ? datasetsMY?.sexDataRates[myYears[i]][state][x]?.rate : datasetsMY?.sexDataRates[myYears[i]][state][1 - x]?.rate : undefined
          obj1[key3] = value3;
        }
        myData.push(obj1); 
      }
  
      //2nd one
      let objS2 = { demographic: `Race/Ethnicity`, spacer: true, colSpan: colSpanCnt + extraColsCnt, background: true } 
      myData.push(objS2);
  
      let dataSorted2 = datasetsMY?.raceData[myYears[0]][state].sort(raceSort);
      
      for (x=0;x<dataSorted2.length;x++) {
        let obj1 = {};
        let key0 = 'demographic';
        let value0 = `    ${raceMapping[dataSorted2[x].race] || dataSorted2[x].race}`;
        obj1[key0] = value0;
        for (i=0;i<myYears.length;i++)
        {
          let datum = datasetsMY?.raceData[myYears[i]][state].sort(raceSort)[x];
          let key1 = 'deaths' + (i+1).toString();
          let value1 = datum.deaths;
          obj1[key1] = value1;
          let key2 = 'percent' + (i+1).toString();
          let value2 = isFinal ? getAdjustedPercent(datum.percent, datum.deaths) : `${toFixed(getAdjustedPercent(datum.percent, datum.deaths))}% (${toFixed(datum.low_ci)}%, ${toFixed(datum.high_ci)}%)`;
          obj1[key2] = value2;
          let key3 = 'rate' + (i+1).toString();
          let value3 = isFinal ? datasetsMY?.raceDataRates[myYears[i]][state].sort(raceSort)[x]?.rate : undefined
          obj1[key3] = value3;
        }
        myData.push(obj1); 
      }
  
      //3nd one
      let objS3 = { demographic: `Age (in years)`, spacer: true, colSpan: colSpanCnt + extraColsCnt, background: true } 
      myData.push(objS3);
  
      let dataSorted3 = datasetsMY?.ageData[myYears[0]][state].filter(d => !!d.age && d.age !== 'null');
      
      for (x=0;x<dataSorted3.length;x++) {
        let obj1 = {};
        let key0 = 'demographic';
        let value0 = `    ${ageMapping[dataSorted3[x].age]}`;
        obj1[key0] = value0;
        for (i=0;i<myYears.length;i++)
        {
            let datum = datasetsMY?.ageData[myYears[i]][state].filter(d => !!d.age && d.age !== 'null')[x];
            let key1 = 'deaths' + (i+1).toString();
            let value1 = datum.count;
            obj1[key1] = value1;
            let key2 = 'percent' + (i+1).toString();
            let value2 = getPercentFormatted(datum)
            obj1[key2] = value2;
            let key3 = 'rate' + (i+1).toString();
            let value3 = isFinal ? datum?.rate : undefined
            obj1[key3] = value3;
        }
        myData.push(obj1); 
      }
  
      //4th first one
      let objS4 = { demographic: `Age (in years) by Sex`, spacer: true, colSpan: colSpanCnt + extraColsCnt, background: true } 
      myData.push(objS4);
  
      let objS41 = { demographic: `    Male`, spacer: true, colSpan: colSpanCnt } 
      myData.push(objS41);
  
      let dataSorted41 = datasetsMY?.ageBySexData[myYears[0]][state].Male.filter(d => !!d.age && d.age !== 'null');
  
      for (x=0;x<dataSorted41.length;x++) {
        let obj1 = {};
        let key0 = 'demographic';
        let value0 = `        ${ageMapping[dataSorted41[x].age]}`;
        obj1[key0] = value0;
        for (i=0;i<myYears.length;i++)
        {
          let datum = datasetsMY?.ageBySexData[myYears[i]][state].Male.filter(d => !!d.age && d.age !== 'null')[x];
          let key1 = 'deaths' + (i+1).toString();
          let value1 = datum.count;
          obj1[key1] = value1;
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(datum)
          obj1[key2] = value2;
          let key3 = 'rate' + (i+1).toString();
          let value3 = isFinal ? datum?.rate : undefined
          obj1[key3] = value3;
        }
        myData.push(obj1); 
      }
  
      //4th second one
      let objS42 = { demographic: `    Female`, spacer: true, colSpan: colSpanCnt + extraColsCnt } 
      myData.push(objS42);
  
      let dataSorted42 = datasetsMY?.ageBySexData[myYears[0]][state].Female.filter(d => !!d.age && d.age !== 'null');
  
      for (x=0;x<dataSorted42.length;x++) {
        let obj1 = {};
        let key0 = 'demographic';
        let value0 = `        ${ageMapping[dataSorted42[x].age]}`;
        obj1[key0] = value0;
        for (i=0;i<myYears.length;i++)
        {
          let datum = datasetsMY?.ageBySexData[myYears[i]][state].Female.filter(d => !!d.age && d.age !== 'null')[x];
          let key1 = 'deaths' + (i+1).toString();
          let value1 = datum.count;
          obj1[key1] = value1;
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(datum)
          obj1[key2] = value2;
          let key3 = 'rate' + (i+1).toString();
          let value3 = isFinal ? datum?.rate : undefined
          obj1[key3] = value3;
        }
        myData.push(obj1); 
      }
      
      return myData;
  
    },

    generateMultiYearCauseData : (dataMY, state, myDrugs, myYears, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];
  
      for (var j=0;j<myDrugs.length;j++)
      {
        let obj = {};
  
        let key0 = 'opioid';
        let value0 = myDrugs[j];
        obj[key0]=value0;

        for (var i=0;i<myYears.length;i++)
        {
            let key1 = 'causeCount' + (i+1).toString();
            let value1 = dataMY[myYears[i]][state].find(drug => drug.opioid === myDrugs[j]).causeCount; 
            let key2 = 'causePercent' + (i+1).toString();
            let value2 = dataMY[myYears[i]][state].find(drug => drug.opioid === myDrugs[j]).causePercent; 
            obj[key1] = value1;
            obj[key2] = value2;
        }
        myData.push(obj); 
      }
  
      return myData;
  
    },

    generateMultiYearMonthData : (dataTimeMY, state, myMonths, myYears, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];
  
      for (var j=0;j<myMonths.length;j++)
      {
        let obj = {};
        let key0 = 'month';
        let value0 = myMonths[j];
        obj[key0]=value0;

        for (var i=0;i<myYears.length;i++)
        {
            let key1 = 'value' + (i+1).toString();
            let value1 = dataTimeMY[myYears[i]][state].month[j].value;
            obj[key1] = value1;
        }
        
        myData.push(obj); 
      }
        
      return myData;
  
    },

    generateMultiYearCombData : (dataMY, state, myYears, myCombinations, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];
  
      for (var j=0;j<myCombinations.length;j++)
      {
        let obj = {};
        let key0 = 'name';
        let value0 = myCombinations[j];
        obj[key0]=value0;
  
        switch (myCombinations[j]) {
          case 'Neither opioids nor stimulants':
            for (let i=0;i<myYears.length;i++)
              {
                let key1 = 'deaths' + (i+1).toString();
                let value1 = dataMY[myYears[i]][state].horizontalBarData[0].nCount; 
                let key2 = 'percent' + (i+1).toString();
                let value2 = dataMY[myYears[i]][state].horizontalBarData[0].nPercent; 
                obj[key1] = value1;
                obj[key2] = value2;
              }
              myData.push(obj); 
            break;
          case 'Opioids and no stimulants':
            for (let i=0;i<myYears.length;i++)
              {
                let key1 = 'deaths' + (i+1).toString();
                let value1 = dataMY[myYears[i]][state].horizontalBarData[0].oCount; 
                let key2 = 'percent' + (i+1).toString();
                let value2 = dataMY[myYears[i]][state].horizontalBarData[0].oPercent; 
                obj[key1] = value1;
                obj[key2] = value2;
              }
              myData.push(obj); 
            break;
          case 'Opioids and stimulants':
            for (let i=0;i<myYears.length;i++)
              {
                let key1 = 'deaths' + (i+1).toString();
                let value1 = dataMY[myYears[i]][state].horizontalBarData[0].osCount; 
                let key2 = 'percent' + (i+1).toString();
                let value2 = dataMY[myYears[i]][state].horizontalBarData[0].osPercent; 
                obj[key1] = value1;
                obj[key2] = value2;
              }
              myData.push(obj); 
            break;
          case 'Stimulants and no opioids':
            for (let i=0;i<myYears.length;i++)
              {
                let key1 = 'deaths' + (i+1).toString();
                let value1 = dataMY[myYears[i]][state].horizontalBarData[0].sCount; 
                let key2 = 'percent' + (i+1).toString();
                let value2 = dataMY[myYears[i]][state].horizontalBarData[0].sPercent; 
                obj[key1] = value1;
                obj[key2] = value2;
              }
              myData.push(obj); 
            break;
          default:
            break;
        }
      }
  
      return myData;
  
    },

    generateMultiYearStateData : (dataMY, dataRatesMY, drug, myYears, myStates, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];
  
      let obj1 = {};
      let key0 = 'state';
      let value0 = 'Overall';
      obj1[key0]=value0;
      for (var i=0;i<myYears.length;i++)
      {
          let key1 = 'deaths' + (i+1).toString();
          let value1 = dataMY[myYears[i]][drug][value0] !== undefined ? dataMY[myYears[i]][drug][value0].deaths : ''
          let key2 = 'rate' + (i+1).toString();
          let value2 = dataRatesMY[myYears[i]][drug][value0] !== undefined ? dataRatesMY[myYears[i]][drug][value0].rate : ''
          obj1[key1] = value1;
          obj1[key2] = value2;
      }
      myData.push(obj1); 
  
      for (var j=0;j<myStates.length;j++)
      {
        let obj = {};
        if (myStates[j] !== "Overall") {
          let key0 = 'state';
          let value0 = myStates[j];
          obj[key0]=value0;
  
          for (let i=0;i<myYears.length;i++)
          {
              let key1 = 'deaths' + (i+1).toString();
              let value1 = dataMY[myYears[i]][drug][myStates[j]] !== undefined ? dataMY[myYears[i]][drug][myStates[j]].deaths : ''
              let key2 = 'rate' + (i+1).toString();
              let value2 = dataRatesMY[myYears[i]][drug][myStates[j]] !== undefined ? dataRatesMY[myYears[i]][drug][myStates[j]].rate : ''
              obj[key1] = value1;
              obj[key2] = value2;
          }
          myData.push(obj); 
        }
      }
      
      return myData;
  
    },  

    generateMultiYearCircumByStandData : (dataMY, myYears, group, state, isFinal, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];

      let obj10 = {};
      let key10 = 'circumstance';
      let value10 = <>    Potential bystander present<sup>{isFinal ? 20 : 14}</sup></>;
      obj10[key10]=value10;

      for (var i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Potential bystander present').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Potential bystander present'), isFinal)
          obj10[key1] = value1;
          obj10[key2] = value2;
      }
      myData.push(obj10); 

      let obj20 = { circumstance: `    Among deaths with a potential bystander present:`, spacer: true, colSpan: (myYears.length * 2), background: true } 
      myData.push(obj20); 

      let obj30 = {};
      let key30 = 'circumstance';
      let value30 = `        Bystander provided no overdose response`;
      obj30[key30]=value30;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander provided no overdose response').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander provided no overdose response'), isFinal)
          obj30[key1] = value1;
          obj30[key2] = value2;
      }
      myData.push(obj30); 

      let obj40 = { circumstance: `    Among deaths with no bystander response, reasons for nonresponse included:`, spacer: true, colSpan: (myYears.length * 2), background: true } 
      myData.push(obj40); 

      let obj50 = {};
      let key50 = 'circumstance';
      let value50 = `        Bystander was spatially separated from decedent`;
      obj50[key50]=value50;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander was spatially separated from decedent').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander was spatially separated from decedent'), isFinal)
          obj50[key1] = value1;
          obj50[key2] = value2;
      }
      myData.push(obj50); 

      let obj60 = {};
      let key60 = 'circumstance';
      let value60= `        Bystander was unaware decedent was using substances`;
      obj60[key60]=value60;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander was unaware decedent was using substances')?.count || 0);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander was unaware decedent was using substances'), isFinal)
          obj60[key1] = value1;
          obj60[key2] = value2;
      }
      myData.push(obj60); 

      let obj70 = {};
      let key70 = 'circumstance';
      let value70= `        Bystander did not recognize abnormalities`;
      obj70[key70]=value70;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander did not recognize abnormalities').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander did not recognize abnormalities'), isFinal)
          obj70[key1] = value1;
          obj70[key2] = value2;
      }
      myData.push(obj70); 

      let obj80 = {};
      let key80 = 'circumstance';
      let value80= `        Bystander did not recognize abnormalities as an overdose`;
      obj80[key80]=value80;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander did not recognize abnormalities as an overdose').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander did not recognize abnormalities as an overdose'), isFinal)
          obj80[key1] = value1;
          obj80[key2] = value2;
      }
      myData.push(obj80); 

      let obj90 = {};
      let key90 = 'circumstance';
      let value90= `        Bystander was using substances or alcohol`;
      obj90[key90]=value90;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'Bystander was using substances or alcohol').count);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'Bystander was using substances or alcohol'), isFinal)
          obj90[key1] = value1;
          obj90[key2] = value2;
      }
      myData.push(obj90); 

      let obj100 = {};
      let key100 = 'circumstance';
      let value100= `        It was a public space and strangers did not intervene`;
      obj100[key100]=value100;

      for (let i=0;i<myYears.length;i++)
      {
          let key1 = 'count' + (i+1).toString();
          let value1 = Number(getData(dataMY, myYears[i], group, state, 'It was a public space and strangers did not intervene')?.count || 0);
          let key2 = 'percent' + (i+1).toString();
          let value2 = getPercentFormatted(getData(dataMY, myYears[i], group, state, 'It was a public space and strangers did not intervene'), isFinal)
          obj100[key1] = value1;
          obj100[key2] = value2;
      }
      myData.push(obj100); 

      return myData;

    },

    generateMultiYearCircumData : (dataMY, dataSorted, myYears, group, state, isFinal, atLeastOneValueMY, extraColsCnt) => {

      extraColsCnt = 0;
      let myData = [];

      if (group === 'Potential opportunities for intervention to prevent overdose')
      {
          let obj1 = {};
          let key1 = 'circumstance';
          let value1= '≥1 potential opportunity for intervention';
          obj1[key1]=value1;
  
          for (let i=0;i<myYears.length;i++)
          {
              let key1 = 'count' + (i+1).toString();
              let value1 = atLeastOneValueMY[myYears[i]][state].deaths;
              let key2 = 'percent' + (i+1).toString();
              let value2 = getPercentFormatted(atLeastOneValueMY[myYears[i]][state])
              obj1[key1] = value1;
              obj1[key2] = value2;
          }
          myData.push(obj1); 
      }

      for (var j=0; j<dataSorted.length;j++) {
      
        let obj1 = {};
        let key1 = 'circumstance';
        let value1= `    ${dataSorted[j].circumstance}`;
        obj1[key1]=value1;

          for (let i=0;i<myYears.length;i++)
          {
              let key1 = 'count' + (i+1).toString();
              let value1 = dataMY[myYears[i]][state][group].filter(d => d.circumstance == dataSorted[j].circumstance)[0]?.count;
              let key2 = 'percent' + (i+1).toString();
              let value2 = getPercentFormatted(dataMY[myYears[i]][state][group].filter(d => d.circumstance == dataSorted[j].circumstance)[0])
              obj1[key1] = value1;
              obj1[key2] = value2;
          }
          myData.push(obj1); 
      }
      
      return myData;
    }

}