import { Bar, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { Text } from '@visx/text';
import { scaleBand, scaleLinear } from '@visx/scale';
import { orderOfCircumstance } from '../constants/Constants';
import DataTable from './DataTable';
import DataTableMY from './DataTableMY';
import { countCutoff } from '../constants.json';

import '../css/CircumstancesChart.css';
import { MultiYearAccessFunctions } from '../utility'

function CircumstancesChart(params) {

  let lolipopHeight = 70;
  if (window.innerWidth < 550) {
    lolipopHeight = 90;
  }

  const { dataMY, data, group, atLeastOneValue, atLeastOneValueMY, width, height, accessible, colorScale, allStatesMax, toFixed, isFinal, getAdjustedPercent, state, years } = params;
  const margin = { top: 10, bottom: 10, left: 0, right: 0, bar: 15 };
  const adjustedWidth = width - margin.left - margin.right;
  const adjustedHeight = data[group].length * lolipopHeight - margin.top - margin.bottom;
  const barThickness = 6;
  const barThicknessHalf = barThickness / 2;

  const xScale = scaleLinear({
    domain: [0, allStatesMax * 1.1],
    range: [0, adjustedWidth - 75]
  });

  const yScale = scaleBand({
    range: [0, adjustedHeight],
    domain: data[group].map(d => d.circumstance),
    padding: 0.2
  });

  const getData = (c) => {
    return data[group].find(g => g.circumstance == c) || {};
  }

  const getPercentFormatted = (d) => {
    return isFinal ? toFixed(getAdjustedPercent(d.percent, d.count)) : `${toFixed(getAdjustedPercent(d.percent))}% (${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`;
  }

  const getYearsArray = () => {

    let myArray = [];
    
    let yr = parseInt(years['yearFrom'].yearFrom);
    myArray.push(yr);
    while (yr < parseInt(years['yearTo'].yearTo))
    {
      yr = yr + 1;
      myArray.push(yr);
    }
    return myArray;
  };

  const bystandersTable = () => {
    return (<div className='table-container custom-background demographics-table'>
      <table tabIndex={0}>
        <thead>
          <th>Bystanders</th>
          <th>Number of deaths</th>
          <th>Percent of deaths{ isFinal ? '' : ' (95% CI)'}</th>
        </thead>
        <tbody>
          <tr>
            <th scope='row'>    Potential bystander present<sup>{isFinal ? 20 : 14}</sup></th>
            <td>{Number(getData('Potential bystander present').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Potential bystander present'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr className='background'>
            <th scope='row'>    Among deaths with a potential bystander present:</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th scope='row'>        Bystander provided no overdose response</th>
            <td>{Number(getData('Bystander provided no overdose response').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander provided no overdose response'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr className='background'>
            <th scope='row'>    Among deaths with no bystander response, reasons for nonresponse included:</th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th scope='row'>        Bystander was spatially separated from decedent</th>
            <td>{Number(getData('Bystander was spatially separated from decedent').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander was spatially separated from decedent'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr>
            <th scope='row'>        Bystander was unaware decedent was using substances</th>
            <td>{Number(getData('Bystander was unaware decedent was using substances')?.count || 0).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander was unaware decedent was using substances'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr>
            <th scope='row'>        Bystander did not recognize abnormalities</th>
            <td>{Number(getData('Bystander did not recognize abnormalities').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander did not recognize abnormalities'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr>
            <th scope='row'>        Bystander did not recognize abnormalities as an overdose</th>
            <td>{Number(getData('Bystander did not recognize abnormalities as an overdose').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander did not recognize abnormalities as an overdose'))}{isFinal? '%' : ''}</td>
          </tr>
          
          <tr>
            <th scope='row'>        Bystander was using substances or alcohol</th>
            <td>{Number(getData('Bystander was using substances or alcohol').count).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('Bystander was using substances or alcohol'))}{isFinal? '%' : ''}</td>
          </tr>
          <tr>
            <th scope='row'>        It was a public space and strangers did not intervene</th>
            <td>{Number(getData('It was a public space and strangers did not intervene')?.count || 0).toLocaleString()}</td>
            <td>{getPercentFormatted(getData('It was a public space and strangers did not intervene'))}{isFinal? '%' : ''}</td>
          </tr>
          
        </tbody>
      </table>
    </div>)
  };

  const sortCircumstances = (a, b) => {
    return (orderOfCircumstance[group + a.circumstance] > orderOfCircumstance[group + b.circumstance]) ? -1 : 1;
  }

  const accessibleDataTable = [
    ...data[group]
    .sort(sortCircumstances)
    .map(d => ({ circumstance: `    ${d.circumstance}`, count: d.count, percent: getPercentFormatted(d) }))];

  const getAccessibleDataTable = () => {

    if(group == 'Potential opportunities for intervention to prevent overdose')
    {
      return [{
        circumstance: '≥1 potential opportunity for intervention',
        count: atLeastOneValue.deaths, 
        percent: getPercentFormatted(atLeastOneValue)
      }, ...accessibleDataTable];
    }

    return accessibleDataTable;
  }

  return width > 0 &&
    accessible ? ((years != undefined && years != null) ? (<>
      {<DataTableMY
        data= {group != 'Bystanders' ? MultiYearAccessFunctions.generateMultiYearCircumData(dataMY, dataMY[getYearsArray()[0]][state][group].sort(sortCircumstances), getYearsArray(), group, state, isFinal, atLeastOneValueMY, 2) : MultiYearAccessFunctions.generateMultiYearCircumByStandData(dataMY, getYearsArray(), group, state, isFinal, 2)}
        xAxisKey={'circumstance'}
        labelOverrides={{
          'count1': 'Number of deaths',
          'percent1': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
          'count2': 'Number of deaths',
          'percent2': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
          'count3': 'Number of deaths',
          'percent3': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
          'count4': 'Number of deaths',
          'percent4': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
          'circumstance': group,
          '    Current treatment for substance use disorder(s)': <>    Current treatment for substance use disorder(s)<sup>{isFinal ? 19 :13}</sup></>,
          '    Potential bystander present': <>    Potential bystander present<sup>{isFinal ? 20 :14}</sup></>,
          '    Decedent was recently released from institutional setting': <>    Decedent was recently released from institutional setting<sup>{isFinal ? 21 :15}</sup></>,
          '    History of opioid use': <>    History of opioid use<sup>{isFinal ? 22 :16}</sup></>,
          '    History of stimulant use': <>    History of stimulant use<sup>{isFinal ? 23 :17}</sup></>,
          '    Recent return to use of opioids': <>    Recent return to use of opioids<sup>{isFinal ? 24 :18}</sup></>,
          '    Decedent was experiencing homelessness or housing instability': <>    Decedent was experiencing homelessness or housing instability<sup>{isFinal ? 25 :19}</sup></>,
          '    Naloxone administered': <>    Naloxone administered<sup>{isFinal ? 26 :20}</sup></>,
          '    Evidence of prescription drug use': <>    Evidence of prescription drug use<sup>{isFinal ? 28 :22}</sup></>,
          '    Evidence of illegal drug use': <>    Evidence of illegal drug use<sup>{isFinal ? 29 :23}</sup></>,
          '    Evidence of illicit drug use': <>    Evidence of illicit drug use</>,
          '    Evidence of counterfeit pill use': <>    Evidence of counterfeit pill use<sup>{isFinal ? 30 :24}</sup></>
        }}
        suffixes={{
          'percent1': isFinal ? '%' : '',
          'percent2': isFinal ? '%' : '',
          'percent3': isFinal ? '%' : '',
          'percent4': isFinal ? '%' : '',
        }}
        transforms={{
          percent1: isFinal ? num => toFixed(num) : num => num,
          percent2: isFinal ? num => toFixed(num) : num => num,
          percent3: isFinal ? num => toFixed(num) : num => num,
          percent4: isFinal ? num => toFixed(num) : num => num
        }}
        years={years}
        extraCols = {[`Percentage change in percent, ${years['yearTo'].yearTo} vs. ${years['yearFrom'].yearFrom}`, `Percentage of deaths, ${years['yearFrom'].yearFrom} - ${years['yearTo'].yearTo}`]}
        customBackground={group != 'Bystanders' ? false : true}
        caption={'Circumstances involved in drug deaths'}
      />}</>
  ) : (<>
      {
        group == 'Bystanders' && bystandersTable()
      }
      {group != 'Bystanders' && <DataTable
        data= {getAccessibleDataTable() }
        xAxisKey={'circumstance'}
        orderedKeys={['count', 'percent']}
        labelOverrides={{
          'count': 'Number of deaths',
          'percent': isFinal ? 'Percent of deaths' : 'Percent of deaths (95% CI)',
          'circumstance': group,
          '    Current treatment for substance use disorder(s)': <>    Current treatment for substance use disorder(s)<sup>{isFinal ? 19 :13}</sup></>,
          '    Potential bystander present': <>    Potential bystander present<sup>{isFinal ? 20 :14}</sup></>,
          '    Decedent was recently released from institutional setting': <>    Decedent was recently released from institutional setting<sup>{isFinal ? 21 :15}</sup></>,
          '    History of opioid use': <>    History of opioid use<sup>{isFinal ? 22 :16}</sup></>,
          '    History of stimulant use': <>    History of stimulant use<sup>{isFinal ? 23 :17}</sup></>,
          '    Recent return to use of opioids': <>    Recent return to use of opioids<sup>{isFinal ? 24 :18}</sup></>,
          '    Decedent was experiencing homelessness or housing instability': <>    Decedent was experiencing homelessness or housing instability<sup>{isFinal ? 25 :19}</sup></>,
          '    Naloxone administered': <>    Naloxone administered<sup>{isFinal ? 26 :20}</sup></>,
          '    Evidence of prescription drug use': <>    Evidence of prescription drug use<sup>{isFinal ? 28 :22}</sup></>,
          '    Evidence of illegal drug use': <>    Evidence of illegal drug use<sup>{isFinal ? 29 :23}</sup></>,
          '    Evidence of illicit drug use': <>    Evidence of illicit drug use</>,
          '    Evidence of counterfeit pill use': <>    Evidence of counterfeit pill use<sup>{isFinal ? 30 :24}</sup></>
        }}
        suffixes={{
          'percent': isFinal ? '%' : ''
        }}
        transforms={{
          percent: isFinal ? num => toFixed(num) : num => num
        }}
        caption={'Circumstances involved in drug deaths'}
      />}</>
  )) : (
    <svg width={width} height={adjustedHeight + (group == 'Bystanders' ? 100 : 0)} >
      <Group top={margin.top} left={margin.left}>
        {data[group].sort(sortCircumstances).map((d, i) => {
          var adhocHeight = 0
          if (group == 'Bystanders')
            adhocHeight = i > 1 ? 110 + (window.innerWidth < 550 ? 20 : 0 ) : (i == 1 ? 55 : 0);

          return <Group key={`group-${d.circumstance}`}>
            {
              d.circumstance === 'Potential bystander present' && group == 'Bystanders'
              &&
              <foreignObject
                x={0}
                y={yScale(d.circumstance) + adhocHeight + barThickness + margin.bar + 50}
                width={adjustedWidth}
                height="50">
                <span><b>Among deaths with a potential bystander present:</b></span>
              </foreignObject>
            }
            {
              d.circumstance === 'Bystander provided no overdose response' && group == 'Bystanders'
              &&
              <foreignObject x={0} y={yScale(d.circumstance) + adhocHeight + barThickness + margin.bar + 50} width={adjustedWidth} height={window.innerWidth < 550 ? 72 : 50}>
                <span><b>Among deaths with no bystander response, reasons for nonresponse included:</b></span>
              </foreignObject>
            }

            <Bar
              key={`bar-${d.circumstance}`}
              x={0}
              y={yScale(d.circumstance) + adhocHeight}
              width={xScale(d.percent)}
              height={barThickness}
              fill={colorScale.Intervention}
            />
            <Circle
              key={`point-${d.circumstance}`}
              r={11}
              cx={xScale(d.percent)}
              cy={yScale(d.circumstance) + adhocHeight + barThicknessHalf}
              fill={colorScale.Intervention}
              data-tip={`<strong>${d.circumstance}</strong><br/>
                  Number of deaths: ${d.count < countCutoff ? `< ${countCutoff}` : Number(d.count).toLocaleString()}<br/>
                  Percent${isFinal ? '' : ' (95% CI)'}: ${toFixed(d.percent || 0)}% ${isFinal ? '' : `(${toFixed(d.low_ci)}%, ${toFixed(d.high_ci)}%)`}`}
            />
            <text
              x={(xScale(d.percent) || 0) + 15}
              y={yScale(d.circumstance) + adhocHeight + barThickness + 2} fontWeight="bold" fontSize="medium" fill={colorScale.Intervention}>{toFixed(getAdjustedPercent( d.percent, d.count))}%</text>

            <foreignObject x={0} y={yScale(d.circumstance) + adhocHeight + barThickness + margin.bar - 10} width={adjustedWidth} height="50">
              <span>{d.circumstance}
                {d.circumstance === 'Current treatment for substance use disorder(s)' && <sup aria-describedby="footnote-19">{isFinal ? 19 :13}</sup>}
                {d.circumstance === 'Potential bystander present' && <sup aria-describedby="footnote-20">{isFinal ? 20 :14}</sup>}
                {d.circumstance === 'Decedent was recently released from institutional setting' && <sup aria-describedby="footnote-21">{isFinal ? 21 :15}</sup>}
                {d.circumstance === 'History of opioid use' && <sup aria-describedby="footnote-22">{isFinal ? 22 :16}</sup>}
                {d.circumstance === 'History of stimulant use' && <sup aria-describedby="footnote-23">{isFinal ? 23 :17}</sup>}
                {d.circumstance === 'Recent return to use of opioids' && <sup aria-describedby="footnote-24">{isFinal ? 24 :18}</sup>}
                {d.circumstance === 'Decedent was experiencing homelessness or housing instability' && <sup aria-describedby="footnote-25">{isFinal ? 25 :19}</sup>}
                {d.circumstance === 'Naloxone administered' && <sup aria-describedby="footnote-26">{isFinal ? 26 :20}</sup>}
                {d.circumstance === 'Evidence of prescription drug use' && <sup aria-describedby="footnote-28">{isFinal ? 28 :22}</sup>}
                {d.circumstance === 'Evidence of illegal drug use' && <sup aria-describedby="footnote-27">{isFinal ? 29 : 23}</sup>}
                {d.circumstance === 'Evidence of illicit drug use'}
                {d.circumstance === 'Evidence of counterfeit pill use' && <sup aria-describedby="footnote-30">{isFinal ? 30 :24}</sup>}
              </span>
            </foreignObject>
          </Group>
        }
        )}
      </Group>
    </svg>
  )
}

export default CircumstancesChart;
