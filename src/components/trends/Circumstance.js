import React, { useEffect, useRef, useState} from 'react';
import LineChart from '../LineChart';
function CircumstanceTrendView(params) {
    const {
        setSelectedOptionInCircumstanceLineTrend, selectedOptionInCircumstanceLineTrend, 
        fromYear, toYear, stateLabel, isFinal,headerBackGroundColor,
        circumStanceGroup,multiYearCircumstanceData,
        colorScale,getDimension,colorScaleLighter,setTooltipColor,defaultValueIfEmpty,
        chartClickCircumstanceLineTrend,lineClickCircumstanceLineTrend,
        circumstanceGroup, setCircumstanceGroup,
        circumstances
     } = params;
     const lineChartRef = useRef();

     useEffect(() => {
      setCircumstanceGroup(circumStanceGroup);
     },[circumstances])
    //  const [bystandersSelected, setBystandersSelected] = useState(false);

     const toolTipPercent = (l, d) => {
        return `<strong>${l}</strong> (${d.year})<br/><span>Number of deaths: ${Number(d.count).toLocaleString()}</span><br/><span>Percent: ${d.percent?.toFixed(1)}%</span>`;
    }

    const circumstanceSelector = () => (<>
        <select aria-label="View data by circumstance group" className='circumstance-selector'
          value={circumstanceGroup}
          onChange={(e) => {
            setCircumstanceGroup(e.target.value);
            // if(e.target.value == 'Bystanders')
            //     setBystandersSelected(true);
            // else 
            //     setBystandersSelected(false);
          }}>
          {
            circumstances &&
            circumstances?.map(c => {
              return c == 'Routes of drug use' ?
                <option key={`dropdown-option-${c}`} value={c}>{c}&#178;{isFinal ? '\u2077' : '\u00B9'}</option>
                : <option key={`dropdown-option-${c}`} value={c}>{c}</option>
            }
            )
          }
        </select></>
      );

    const bystandersSelector = () => {
        return (<>
            <select aria-label="View data by bystander presence" className='circumstance-selector'
                value={circumstanceGroup}
                onChange={(e) => {
                    setCircumstanceGroup(e.target.value);
                }}>
                <option value="Among deaths with a potential bystander present">Among deaths with a potential bystander present</option>
                <option value="Among deaths with no bystander response, reasons for nonresponse included">Among deaths with no bystander response, reasons for nonresponse included:</option>
            </select></>)
    }

    return (<>
    <div className="header margin" style={{ backgroundColor: headerBackGroundColor() }}>
        <h2 className="preheader-label" style={{ color: isFinal ? 'white' : 'black' }}>Percent change in the number of drug overdose deaths, {fromYear}–{toYear}, <nobr>{stateLabel}</nobr></h2>
    </div>
    <span>View data for:</span>
        {circumstanceSelector()}
        {/* {
            bystandersSelected && <>
            {bystandersSelector()}
            </>
        } */}
    <div ref={lineChartRef} className='chart-container'>
    <LineChart
        chartId={"circumstance-line-chart-container"}
        section={"circumstances"}
        number={8}
        colorScale={colorScale}
        fromYear={fromYear}
        toYear={toYear}
        width={getDimension(lineChartRef, 'width')}
        height={550}
        data={multiYearCircumstanceData}
        dataProp={'percent'}
        isPercent={true}
        xLabel={'Year of death'}
        yLabel1={'Percentage of overdose deaths'
        }
        yLabel2={''}
        chartClick={chartClickCircumstanceLineTrend}
        lineClick={lineClickCircumstanceLineTrend}
        selectedLabel={selectedOptionInCircumstanceLineTrend}
        setSelectedLabel={setSelectedOptionInCircumstanceLineTrend}
        toolTip={toolTipPercent}
        defaultValueIfEmpty={defaultValueIfEmpty}
        value1={0}
        yearFrom={fromYear}
        yearTo={toYear}
        labelOptions={false}
        colorScaleLighter={colorScaleLighter}
        setTooltipColor={setTooltipColor}
    >

    </LineChart>
    </div>
    </>)
}
export default CircumstanceTrendView;