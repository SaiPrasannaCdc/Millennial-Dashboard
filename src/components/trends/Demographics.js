import { useEffect, useCallback, useRef, useState } from 'react';
import LineChart from '../LineChart';
import { colorScale } from '../../constants/Constants';
import { colorScaleLighter } from '../../constants/Constants';
import { max } from 'd3-array';
import MetricSelector from './MetricSelector';
// import '../../App.css'

function Demographics(params) {
    const trendBySexRef = useRef();
    const trendByAgeMRef = useRef();
    const trendByAgeFRef = useRef();

    const { multiYearBySexData, multiYearByRaceData, multiYearByAgeData, multiYearByAgeSexDataF, multiYearByAgeSexDataM,
        dimensions, viewportCutoffSmall,
        colorScaleLighter, yearFrom, yearTo, getDimension,
        demograhicsMetric, setDemograhicsMetric, defaultValueIfEmpty, setTooltipColor,
        chartClickDemographicLineTrend, lineClickDemographicLineTrend, selectedOptionInDemographicLineTrend, setSelectedOptionInDemographicLineTrend,
        calculateTrendValue
    } = params;
    const [option, setOption] = useState('By sex');
    const [metricHeight, setMetricHeight] = useState(0);
    const [byAgeAndSexMaleIndicatorHeight,setByAgeAndSexMaleIndicatorHeight] = useState(0);
    const [byAgeAndSexFemaleIndicatorHeight,setByAgeAndSexFemaleIndicatorHeight] = useState(0);

    const optionTab = (optitonTab) => (
        <button
            className={`drug-tab${optitonTab === option ? ' active' : ''}`}
            onClick={() => {
                setOption(optitonTab);
                setSelectedOptionInDemographicLineTrend('');
            }}
        >{optitonTab}</button>
    );

    const hotButtonForOptions = () => {
        return (
            <>
            { (
                <select className="dropdown-selectors" onChange={(e) => { setOption(e.target.value); setSelectedOptionInDemographicLineTrend(''); }} value={option}>
                    <option value="By sex">Sex</option>
                    <option value="By race">Race/ethnicity</option>
                    <option value="By age">Age</option>
                    <option value="By age & sex">Sex & age</option>
                </select>
            )}
                {/* {dimensions.width >= viewportCutoffSmall && (
                    <div>
                        <div className="drug-tab-section">
                            {optionTab('By sex')}
                            {optionTab('By race')}
                        </div>
                        <div className="drug-tab-section">
                            {optionTab('By age')}
                            {optionTab('By age & sex')}
                        </div>
                    </div>
                )} */}
                </>)
    }

    const toolTipRate = (l, d) => {
        return `<strong>${l}${option == 'By age'|| option == 'By age & sex' ? ' Years' : ''}</strong> (${d.year})<br/><span>Number of deaths: ${Number(d.count).toLocaleString()}</span><br/><span>Age-adjusted rate: ${d.rate == -1 ? '*Data suppressed' : d.rate?.toFixed(1)}</span>`;
    }
    const toolTipPercent = (l, d) => {
        return `<strong>${l}${option == 'By age'|| option == 'By age & sex' ? ' Years' : ''}</strong> (${d.year})<br/><span>Number of deaths: ${Number(d.count).toLocaleString()}</span><br/><span>Percent: ${d.percent?.toFixed(1)}%</span>`;
    }

    const toolTipCount = (l, d) => {
        return `<strong>${l}${option == 'By age'|| option == 'By age & sex' ? ' Years' : ''}</strong> (${d.year})<br/><span>Number of deaths: ${Number(d.count).toLocaleString()}</span><br/><span>Percent: ${d.percent?.toFixed(1)}%</span>`;    }

    const getMaxValueSource = (d1, d2, dataProp) => {
        const k1 = Object.keys(d1);
        const k2 = Object.keys(d2);

        let maxValue = 0;

        k1.forEach(dr => {
                let drugM = max(d1[dr], a => a[dataProp]);
                if (drugM > maxValue) {
                    maxValue = drugM;
                }
            })
            k2.forEach(dr => {
                let drugM = max(d2[dr], a => a[dataProp]);
                if (drugM > maxValue) {
                    maxValue = drugM;
                }
            })

        return maxValue;
    }

    return (<>
        {hotButtonForOptions()}
        {
            (
                (option == 'By sex' && multiYearBySexData) ||
                (option == 'By race' && multiYearByRaceData) ||
                (option == 'By age' && multiYearByAgeData)
            ) &&
            <>
            <MetricSelector
                        showClickALine={true}
                        selectedLabel={selectedOptionInDemographicLineTrend}
                        includeMetricSelectorNumber={true}
                        onCountSelected={(e)=> {
                            setDemograhicsMetric(e.target.value);
                        }}
                        onRateSelected={(e) => {
                            setDemograhicsMetric(e.target.value);
                        }}
                        onPercentSelected={(e) => {
                            setDemograhicsMetric(e.target.value);
                        }}
                        selectedMetric={demograhicsMetric}
                    >
                </MetricSelector>
            <div
                ref={trendBySexRef}
                className="chart-container"
            >
                <LineChart
                    chartId={"by-sex-line-chart-container"}
                    section={ `demographics-${option}`}
                    number={1}
                    colorScale={colorScale}
                    fromYear={yearFrom}
                    toYear={yearTo}
                    width={getDimension(trendBySexRef, 'width')}
                    height={550}
                    data={option == 'By sex' ? multiYearBySexData : option == 'By race' ? multiYearByRaceData : multiYearByAgeData}
                    dataProp={demograhicsMetric}
                    isPercent={demograhicsMetric == 'percent'}
                    xLabel={'Year of death'}
                    yLabel1={
                        demograhicsMetric == 'rate' ? 'Age-adjusted rate of occurrent deaths per'
                        : demograhicsMetric == 'percent' ? 'Percentage of overdose deaths'
                            : 'Number of overdose deaths'
                    }
                    yLabel2={demograhicsMetric == 'rate' ? '100,000 resident population' : ''}
                    chartClick={chartClickDemographicLineTrend}
                    lineClick={lineClickDemographicLineTrend}
                    selectedLabel={selectedOptionInDemographicLineTrend}
                    setSelectedLabel={setSelectedOptionInDemographicLineTrend}
                    toolTip={demograhicsMetric == 'rate' ? toolTipRate : 
                        demograhicsMetric == 'percent'? toolTipPercent : toolTipCount}
                    defaultValueIfEmpty={defaultValueIfEmpty}
                    value1={demograhicsMetric == 'rate' ?
                        calculateTrendValue(option == 'By sex' ? multiYearBySexData : option == 'By race' ? multiYearByRaceData : multiYearByAgeData, selectedOptionInDemographicLineTrend, 'rate', false) :
                        demograhicsMetric == 'percent' ? calculateTrendValue(option == 'By sex' ? multiYearBySexData : option == 'By race' ? multiYearByRaceData : multiYearByAgeData, selectedOptionInDemographicLineTrend, 'percent', true) :
                        calculateTrendValue(option == 'By sex' ? multiYearBySexData : option == 'By race' ? multiYearByRaceData : multiYearByAgeData, selectedOptionInDemographicLineTrend, 'count', false)
                    }
                    yearFrom={yearFrom}
                    yearTo={yearTo}
                    labelOptions={false}
                    // includeMetricSelector={true}
                    drugsInvolvedMetric={demograhicsMetric}
                    setDrugsInvolvedMetric={setDemograhicsMetric}
                    colorScaleLighter={colorScaleLighter}
                    setTooltipColor={setTooltipColor}
                    // includeMetricSelectorNumber={false}
                    labelSuffix={option == 'By age' ? ' Yrs' : ''}
                ></LineChart></div>
        </>
        }
        {
            option == 'By age & sex' &&
            <>
                <MetricSelector
                        showClickALine={true}
                        selectedLabel={selectedOptionInDemographicLineTrend}
                        includeMetricSelectorNumber={true}
                        onCountSelected={(e)=> {
                            setDemograhicsMetric(e.target.value);
                        }}
                        onRateSelected={(e) => {
                            setDemograhicsMetric(e.target.value);
                        }}
                        onPercentSelected={(e) => {
                            setDemograhicsMetric(e.target.value);
                        }}
                        selectedMetric={demograhicsMetric}
                    >
                </MetricSelector>
            <div style={{ display: 'flex' }}>
                <div
                    ref={trendByAgeMRef}
                    style={{ width: '51.9%' }}
                    className="chart-container"
                >
                    <LineChart
                        chartId={"by-sex-line-chart-container"}
                        section={ `demographics-${option}`}
                        number={1}
                        colorScale={colorScale}
                        fromYear={yearFrom}
                        toYear={yearTo}
                        width={getDimension(trendByAgeMRef, 'width')}
                        height={550}
                        data={multiYearByAgeSexDataM}
                        dataProp={demograhicsMetric}
                        isPercent={demograhicsMetric == 'percent'}
                        xLabel={'Year of death'}
                        yLabel1={demograhicsMetric == 'rate' ? 'Age-adjusted rate of occurrent deaths per'
                            : demograhicsMetric == 'percent' ? 'Percentage of overdose deaths'
                                : 'Number of overdose deaths'
                        }
                        yLabel2={demograhicsMetric == 'rate' ? '100,000 resident population' : ''}
                        chartClick={chartClickDemographicLineTrend}
                        lineClick={lineClickDemographicLineTrend}
                        selectedLabel={selectedOptionInDemographicLineTrend}
                        setSelectedLabel={setSelectedOptionInDemographicLineTrend}
                        toolTip={demograhicsMetric == 'rate' ? toolTipRate : 
                            demograhicsMetric == 'percent'? toolTipPercent : toolTipCount}
                        defaultValueIfEmpty={defaultValueIfEmpty}
                        value1={demograhicsMetric == 'rate' ?
                            calculateTrendValue(multiYearByAgeSexDataM, selectedOptionInDemographicLineTrend, 'rate', false) :
                            demograhicsMetric == 'percent' ?calculateTrendValue(multiYearByAgeSexDataM, selectedOptionInDemographicLineTrend, 'percent', true):
                            calculateTrendValue(multiYearByAgeSexDataM, selectedOptionInDemographicLineTrend, 'count', false)
                        }
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        labelOptions={false}
                        drugsInvolvedMetric={demograhicsMetric}
                        colorScaleLighter={colorScaleLighter}
                        setTooltipColor={setTooltipColor}
                        labelSuffix={' Yrs'}
                        sectionHeading={'Male'}
                        getDimension={getDimension}
                        indicatorHeight={
                            byAgeAndSexFemaleIndicatorHeight>0 && byAgeAndSexMaleIndicatorHeight>0 ?
                            Math.max(byAgeAndSexFemaleIndicatorHeight, byAgeAndSexMaleIndicatorHeight):undefined}
                        setIndicatorHeight={setByAgeAndSexMaleIndicatorHeight}
                    ></LineChart></div>
                <div style={{ width: '0.1%' }}></div>
                <div
                    ref={trendByAgeFRef}
                    style={{ width: '48%' }}
                    className="chart-container"
                >
                    
                    <LineChart
                        maxValueDefined={getMaxValueSource(multiYearByAgeSexDataM, multiYearByAgeSexDataF, demograhicsMetric == 'rate' ? 'rate' : 'percent')}
                        section={ `demographics-${option}`}
                        chartId={"by-sex-line-chart-container"}
                        number={1}
                        colorScale={colorScale}
                        fromYear={yearFrom}
                        toYear={yearTo}
                        width={getDimension(trendByAgeFRef, 'width')}
                        height={550}
                        data={ multiYearByAgeSexDataF }
                        dataProp={demograhicsMetric}
                        isPercent={demograhicsMetric == 'percent'}
                        xLabel={'Year of death'}
                        chartClick={chartClickDemographicLineTrend}
                        lineClick={lineClickDemographicLineTrend}
                        selectedLabel={selectedOptionInDemographicLineTrend}
                        setSelectedLabel={setSelectedOptionInDemographicLineTrend}
                        toolTip={demograhicsMetric == 'rate' ? toolTipRate : demograhicsMetric == 'rate' ?toolTipPercent:toolTipCount}
                        defaultValueIfEmpty={defaultValueIfEmpty}
                        value1={demograhicsMetric == 'rate' ?
                            calculateTrendValue(multiYearByAgeSexDataF, selectedOptionInDemographicLineTrend, 'rate', false) :
                            demograhicsMetric == 'percent' ? calculateTrendValue(multiYearByAgeSexDataF, selectedOptionInDemographicLineTrend, 'percent', true) :
                            calculateTrendValue(multiYearByAgeSexDataF, selectedOptionInDemographicLineTrend, 'count', false)
                        }
                        yearFrom={yearFrom}
                        yearTo={yearTo}
                        labelOptions={false}
                        drugsInvolvedMetric={demograhicsMetric}
                        colorScaleLighter={colorScaleLighter}
                        setTooltipColor={setTooltipColor}
                        displayYLables={false}
                        labelSuffix={' Yrs'}
                        sectionHeading={'Female'}
                        skipFootNotes={true}
                        getDimension={getDimension}
                        setIndicatorHeight={setByAgeAndSexFemaleIndicatorHeight}
                        indicatorHeight={
                                byAgeAndSexFemaleIndicatorHeight>0 && byAgeAndSexMaleIndicatorHeight>0 ?
                                Math.max(byAgeAndSexFemaleIndicatorHeight, byAgeAndSexMaleIndicatorHeight):undefined}
                    ></LineChart></div>

            </div>
            </>
        }
    </>);
}

export default Demographics;