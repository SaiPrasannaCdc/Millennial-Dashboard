import React, { useState, useEffect , useRef , useCallback} from 'react';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleTime, scaleLinear } from '@visx/scale';
import { max } from 'd3-array';
import { format } from 'd3-format';
import { Text } from '@visx/text';
import { capitalizeFirstLetter } from '../constants/functions';
import { adjustArrayToHaveMinimumDistance } from '../constants/functions';
import { colorScaleLighterClasses } from '../constants/Constants';
const formatYear = format('d');

function LineChart(params) {
    const { data, width, height, colorScale, fromYear, toYear, yLabel1, yLabel2, xLabel, isPercent,
        chartClick, lineClick, selectedLabel, setSelectedLabel, toolTip, number, labelWidth,
        value1,
        chartId,
        labelOptions, drugsInvolvedMetric, 
        dataProp = 'value',
        colorScaleLighter, setTooltipColor,
        displayYLables = true,
        maxValueDefined,
        labelSuffix,
        sectionHeading,
        section,
        skipFootNotes = false,
        indicatorHeight,
        setIndicatorHeight
    } = params;
    const [adjustedLabelPositions, setAdjustedLabelPositions] = useState([]);
    const [selectedLabels, setSelectedLabels] = useState([]);
    const [selectedDrugIsSuppressed, setSelectedDrugIsSuppressed] = useState(false);
    const [hovered, setHovered] = useState(null);
    const [hoveredDrug, setHoveredDrug] = useState('');
    const indicatorRef = useRef();
    const labelNames = Object.keys(data);

    const margin = { top: 20, right: 30, bottom: 50, left: 20 };
    const adjustedHeight = height - margin.top - margin.bottom;
    // const xMax = width - margin.left - margin.right;
    const yMax = height - margin.top - margin.bottom;

    useEffect(() => {
        if(setIndicatorHeight && indicatorRef?.current?.clientHeight)
        {
            setIndicatorHeight(indicatorRef?.current?.clientHeight)
        }
    }, [indicatorRef?.current?.clientHeight]);

    useEffect(() => {
        setSelectedLabels(Object.keys(data));
    }, [data]);

    useEffect(() => {
        // setSelectedDrugIsSuppressed(false);
        if(!selectedLabels.includes(selectedLabel)){
            setSelectedLabel('')
        }
    }, [drugsInvolvedMetric, selectedLabels]);

    useEffect(() => {
        setAdjustedLabelPositions(getLabelPositions());
    }, [data, selectedLabels, dataProp]);

    useEffect(() => {
        if (selectedLabel && data[selectedLabel] && drugHasSuppressedValue(yearFilter(data[selectedLabel]), false)) {
            setSelectedDrugIsSuppressed(true);
        }
        else {
            setSelectedDrugIsSuppressed(false);
        }
    },[selectedLabel,section, fromYear, drugsInvolvedMetric, data])

    const getMaxStringLength = (arr) => {
        return (
            (labelSuffix ? labelSuffix.length + 1 : 0) +
            arr.reduce((maxLength, str) => Math.max(maxLength, str.length), 0));
    }
    const drugLabelWidth = 30 + Math.max(getMaxStringLength(labelNames) * (section=='circumstances' ? 9: 11), 135);
    const adjustedWidth = width - drugLabelWidth - margin.left - margin.right + (displayYLables? 0: 100);

    const splitData = (data) => {
        const segments = [];
        let currentSegment = [];
        let isDashed = false;

        for (let i = 0; i < data.length - 1; i++) {
            const currentPoint = { ...data[i] };
            const nextPoint = { ...data[i + 1] };

            if (currentPoint[dataProp] == -1 || nextPoint[dataProp] == -1) {
                isDashed = true;
                if (currentPoint[dataProp] === -1)
                    currentPoint[dataProp] = 1;
                if (nextPoint[dataProp] === -1)
                    nextPoint[dataProp] = 1;
            } else {
                isDashed = false;
            }

            currentSegment.push(currentPoint);
            currentSegment.push(nextPoint);

            segments.push({ data: currentSegment, isDashed: isDashed });
            currentSegment = [];
        }

        return segments;
    };

    const getLabelName = (dr, isForIndicator = false) => {
        let v = dr;
        if (dr == 'All')  v = 'All drugs';
        if (dr == 'Opioid') v = 'Any opioids';
        if (dr == 'Stimulant') v = 'Any stimulants';
        if (!dr) v = '';

        if(isForIndicator){
            if(section == 'demographics-By race')
                return v;
            else
            return v.toLowerCase()
        }

        return v;
    }

    const getSortedKeys = () => {
        const keys = Object.keys(data);
        keys.sort((a, b) => {
            data[a].find(a => a.year == toYear);
            let lastValueA = data[a].find(a => a.year == toYear)[dataProp];
            let lastValueB = data[b].find(a => a.year == toYear)[dataProp];

            if (lastValueA < lastValueB) {
                return 1;
            }
            if (lastValueA > lastValueB) {
                return -1;
            }
            return 0;
        });

        return keys;
    }

    let maxDrugValue = maxValueDefined? maxValueDefined: 0;

    labelNames.forEach(dr => {
        let drugM = max(data[dr], a => a[dataProp]);
        if (drugM > maxDrugValue) {
            maxDrugValue = drugM;
        }
    })

    const yLabelWidth = Math.floor(maxDrugValue).toLocaleString().length * 5;
    
    const minYear = parseInt(fromYear, 10);
    const maxYear = parseInt(toYear, 10);

    // Scales
    const xScale = scaleTime({
        range: [40, adjustedWidth - 20],
        domain: [minYear, maxYear],
        padding: 0.35
    });

    const yScale = scaleLinear({
        range: [adjustedHeight, 0],
        nice: true,
        domain: [0, isPercent ? maxDrugValue * 1.1 : maxDrugValue * 1.1],
    });

    const drugHasSuppressedValue = (d, inloop=true)=> {
        for (const entry of d) {
            if (
                ((entry[dataProp] === -1 && dataProp == 'value') || entry.rate == -1) && drugsInvolvedMetric == 'rate') {
                return true;
            }
        }
        if(!inloop) return false;
    }

    const dataHasSuppressedValue = (data) => {
        for (const key in data) {
            if (data.hasOwnProperty(key) && (!labelOptions || selectedLabels.includes(key))) {
                 if(drugHasSuppressedValue(yearFilter(data[key]))) return true
            }
        }
        return false;
    }

    const yearFilter = (d) => {
        return d.filter(a => a.year >= fromYear && a.year <= toYear);
    }

    const hasSuppressedRate = dataHasSuppressedValue(data);

    const getLabelPositions = () => {
        let currentPositions = [];
        getSortedKeys()
            .filter(k => !labelOptions || selectedLabels.includes(k))
            .forEach(dr => {
                let last = yearFilter(data[dr]).length - 1;
                const lastDataPoint = yearFilter(data[dr])[last];
                currentPositions.push(yScale(lastDataPoint[dataProp] == -1 ? 1 : lastDataPoint[dataProp]));
            })

        return adjustArrayToHaveMinimumDistance(currentPositions, 17, yScale(0), yScale(maxDrugValue));
    }

    const drugOptionClick = (dr) => {
        if (selectedLabels.includes(dr)) {
            setSelectedLabels(selectedLabels.filter(l => l != dr));
            if (selectedLabel == dr) {
                setSelectedLabel('');
            }
        }
        else {
            setSelectedLabels([...selectedLabels, dr]);
        }
    }

    const drugOptions = (dr, clickable = true, disable = false) => {
        return <div className={`drug-select-option-button ${disable? 'disabled' : ''}`} key={`label-${dr}`} disable={disable}>
            <div className='circle-container' id={`label-c-${dr}`}
                onClick={
                    (e) => {
                        if(clickable)
                        drugOptionClick(dr)
                    }
                }>
                <svg viewBox="-3 -5 110 110" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="50" 
                        fill={ (!labelOptions || selectedLabels.includes(dr)) && clickable ? colorScale[dr] : '#C0C0C0'} 
                        stroke="#555" strokeWidth="4">
                    </circle></svg>
            </div>
            <div className='label-container'>
                <label
                    onClick={
                        (e) => {
                            if(clickable)
                            drugOptionClick(dr)
                        }
                    }
                    htmlFor={`label-${dr}`}>{capitalizeFirstLetter(getLabelName(dr))}</label>
            </div>
        </div>;
    }

    const selectLabel = (e, dr, hasSuppressedValue) => {
        // setShowDefaultIndicator(false)
        lineClick(e, dr);
        if (!hasSuppressedValue) {
            setSelectedDrugIsSuppressed(false);
        }
        else {
            setSelectedDrugIsSuppressed(true);
        }
    };

    const handleCircleMouseOver = (event, d, dr) => {
        setHoveredDrug(dr);
        setHovered(d);
    };

    const handleCircleMouseLeave = () => {
        setHovered(null);
        setHoveredDrug('');
    };

    const printLabel = l => {
        return getLabelName(l) + (section=='demographics-By sex' ? 's': '') + (labelSuffix ? labelSuffix : '');
    }

    const getTrendWord1 = (c, v) => {
        if(v>0) 
            return `${Math.abs(value1).toFixed(1)} ${c} higher than`
        if(v<0) 
            return `${Math.abs(value1).toFixed(1)} ${c} lower than`
        else
            return 'same as'
    }

    const getLableWording = () => {
        if(section=='drugsinvolved') return 'involving'
        if(section=='demographics-By sex') return 'among'
        if(section=='demographics-By race') return 'among'
        if(section=='demographics-By age') return 'among people aged'
        if(section=='demographics-By age & sex') return 'among '+ sectionHeading?.toLowerCase() + 's aged'
        else return ''
    }

    const yAxisLabelWidth = 70;

    // const checkIfSelectedDrugIsSuppressed = () => {
    //     if (selectedLabel) {
    //         const selectedData = data[selectedLabel];
    //         if (selectedData) {
    //             const selectedYearData = selectedData.find(d => d.year == toYear);
    //             if (selectedYearData) {
    //                 if (selectedYearData[dataProp] == -1) {
    //                     setSelectedDrugIsSuppressed(true);
    //                 }
    //             }
    //         }
    //     }

    //     return false;
    // }


    return (
        <>
            {
                sectionHeading && <h4 className="individual-header smaller" style={{color: 'black' }}>{sectionHeading}</h4>
            }
            
            <div 
                ref={indicatorRef}
                className='trendSummaryOverdoseDeaths' 
                style={{ 
                    backgroundColor: colorScaleLighter[selectedLabel],
                    height: (indicatorHeight && selectedLabel != '') ? indicatorHeight : undefined
                    }}>
                {!selectedDrugIsSuppressed && (selectedLabel != '') &&
                    <div visibility={!selectedDrugIsSuppressed && selectedLabel != '' ? 'visible' : 'hidden'}>
                        {
                            (drugsInvolvedMetric == 'rate' || drugsInvolvedMetric == 'count') && <h2 className='trendSummaryOverdoseDeathsLabel' style={{ padding: section=='demographics-By age & sex'?'0.5em 0.5em':'0.5em 4em'}}>
                                From {fromYear} to {toYear}, there was {value1 == 0 && <>no change</>}{value1 != 0 && <>a <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{Math.abs(value1).toFixed(1)}% relative {value1 > 0 ? 'increase' : 'decrease'}</span></>} in the {drugsInvolvedMetric == 'count' ? 'number' : 'rate'} of overdose deaths {getLableWording()} {selectedLabel == '' ? (drugsInvolvedMetric == 'rate' ? 'all drugs' : '') : getLabelName(selectedLabel,true)}{section=='demographics-By sex'?'s':''}{labelSuffix ? ' years' : ''}.
                            </h2>
                        }
                        {
                            section=='drugsinvolved' && drugsInvolvedMetric == 'percent' && <h2 className='trendSummaryOverdoseDeathsLabel'>
                                The percentage of overdose deaths involving {selectedLabel == '' ? 'any opioids' : getLabelName(selectedLabel, true)} in {toYear} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{Math.abs(value1).toFixed(1)} percentage points {value1 > 0 ? 'higher' : 'lower'}</span> than in {fromYear}.
                            </h2>
                        }
                        {
                            (section=='drugsinvolvedcombinations') && <h2 className='trendSummaryOverdoseDeathsLabel'>
                                The percentage of overdose deaths in {toYear} that involved {getLabelName(selectedLabel, true)} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{Math.abs(value1).toFixed(1)} percentage points {value1 > 0 ? 'higher' : 'lower'}</span> than in {fromYear}.
                            </h2>
                        }
                        {
                            drugsInvolvedMetric == 'percent' && section=='demographics-By sex' && <h2 className='trendSummaryOverdoseDeathsLabel'>The percentage of overdose deaths that occurred among {(selectedLabel)?.toLowerCase()}s in {toYear} was <span className='heightlighted'  style={{ color: colorScale[selectedLabel] }}>{getTrendWord1('percentage points', value1)} </span>in {fromYear}.</h2>
                        }
                        {
                            drugsInvolvedMetric == 'percent' && section=='demographics-By race' && <h2  className='trendSummaryOverdoseDeathsLabel'>The percentage of overdose deaths among {getLabelName(selectedLabel, true)} people in {toYear} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{getTrendWord1('percentage points', value1)} </span>in {fromYear}.</h2>
                        }
                        {
                            drugsInvolvedMetric == 'percent' && section=='demographics-By age' && <h2  className='trendSummaryOverdoseDeathsLabel'>The percentage of overdose deaths that occurred among people aged {selectedLabel} years in {toYear} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{getTrendWord1('percentage points', value1)} </span> in {fromYear}.</h2>
                        }
                        {
                            drugsInvolvedMetric == 'percent' && section=='demographics-By age & sex' && <h2  className='trendSummaryOverdoseDeathsLabel' style={{ padding: '0.5em 0.5em'}}>The percentage of overdose deaths that occurred among {sectionHeading?.toLowerCase()}s aged {selectedLabel} years in {toYear} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{getTrendWord1('percentage points', value1)} </span>in {fromYear}.</h2>
                        }
                        {
                            section=='circumstances' && <h2  className='trendSummaryOverdoseDeathsLabel' style={{ padding: '0.5em 0.5em'}}>The percentage of overdose deaths for which there was {selectedLabel?.toLowerCase()} in {toYear} was <span className='heightlighted' style={{ color: colorScale[selectedLabel] }}>{getTrendWord1('percentage points', value1)} </span>in {fromYear}.</h2>
                        }
                    </div>
                }
                {selectedDrugIsSuppressed && selectedLabel != '' && <h4 className='trendSummaryOverdoseDeathsLabel'>Statistic cannot be calculated due to suppressed data.</h4>}
            </div>
            <div className='row'>
                <div id={chartId}  className="trendview-line-chart-container chart-container" >
                    <svg width={width} height={height} onClick={() => {
                        chartClick()
                        setSelectedDrugIsSuppressed(false)
                        // setShowDefaultIndicator(false)
                    }}>
                        <Group left={
                            displayYLables? (margin.left + yAxisLabelWidth + yLabelWidth): 5} top={margin.top}>
                            <g transform={`translate(${0}, 0))`}>
                                {yScale.ticks(5).map((tick, i) => (
                                    <line
                                        key={i}
                                        x1={ 0 }
                                        x2={adjustedWidth}
                                        y1={yScale(tick)}
                                        y2={yScale(tick)}
                                        stroke="#ccc"
                                        strokeWidth="0.5"
                                    />
                                ))}
                            </g>
                            <AxisBottom
                                top={yMax}
                                scale={xScale}
                                numTicks={width > 520 ? 10 : 5}
                                tickFormat={formatYear}
                                hideTicks={true}
                                hideAxisLine={true}
                                tickTransform='translate(0, 4)'
                            />
                            <AxisLeft
                                scale={yScale}
                                hideTicks={true}
                                hideAxisLine={true}
                                numTicks={5}
                                tickLabelProps={() => ({
                                    display: displayYLables ? 'block' : 'none', // Hide the labels
                                    textAnchor: 'end',
                                })}
                                tickFormat={value => `${dataProp == 'count' ? value.toLocaleString() : value}${isPercent ? '%' : ''}`}
                                tickTransform='translate(0, 5)'
                            />
                            {
                                (yLabel1 || yLabel2) && <>
                                    <text
                                        x={height / -2 + 50}
                                        y={ -yLabelWidth - yAxisLabelWidth}
                                        textAnchor="middle"
                                        // fontSize={'medium'}
                                        transform="rotate(-90)">
                                        {yLabel1}{yLabel2 ? '' : '†'}
                                    </text>
                                    <text
                                        x={height / -2 + 35}
                                        y={ -yLabelWidth - yAxisLabelWidth + 20 }
                                        textAnchor="middle"
                                        // fontSize={'medium'}
                                        transform="rotate(-90)">
                                        {yLabel2}{yLabel2 ? '†' : ''}
                                    </text>
                                </>
                            }

                            {
                                getSortedKeys()
                                    .filter(k => !labelOptions || selectedLabels.includes(k))
                                    .map((dr, i) => {
                                        let yearFilterData = yearFilter(data[dr]);
                                        // Find the last data point
                                        let last = yearFilterData.length - 1;
                                        const lastDataPoint = yearFilterData[last];
                                        const lastX = xScale(lastDataPoint.year);
                                        let lastY = lastDataPoint[dataProp] == -1 ? yScale(1) : yScale(lastDataPoint[dataProp]);

                                        const hasSuppressedValue = yearFilterData.some(d => d[dataProp] == -1);
                                        // setHasSuppressedValue(hasSuppressed)
                                        // const correctedData = yearFilterData.map(d => ({ ...d, value: d[dataProp] == -1 ? 1 : d[dataProp] }));

                                        const segments = splitData(yearFilterData);

                                        return <React.Fragment key={`fragment-${number}-${dr}`}>
                                            {segments.map((segment, j) => (
                                                <LinePath
                                                    key={`${i}-${j}-${dr}`}
                                                    data={segment.data}
                                                    x={d => xScale(d.year)}
                                                    y={d => yScale(d[dataProp] === -1 ? 1 : d[dataProp])}
                                                    stroke={colorScale[dr]}
                                                    strokeWidth={2}
                                                    strokeDasharray={segment.isDashed ? "4 4" : ""}
                                                    style={{ cursor: 'pointer' }}
                                                    opacity={selectedLabel === dr || selectedLabel == '' ? 1 : 0.3}
                                                    onClick={(e) => selectLabel(e, dr, segment.isDashed)}
                                                />
                                            ))}
                                            {/* <LinePath
                                                key={`${number}-line-${dr}`}
                                                onClick={(e) => {
                                                    selectLabel(e, dr, hasSuppressedValue);
                                                }}
                                                style={{ cursor: 'pointer' }}
                                                opacity={selectedLabel === dr || selectedLabel == '' ? 1 : 0.3}
                                                data={suppressedData} // Suppressing data points
                                                x={d => xScale(d.year)}
                                                y={d => yScale(d[dataProp])}
                                                stroke={colorScale[dr]}
                                                strokeWidth={2}
                                                strokeDasharray={hasSuppressedValue ? "4 4" : "0"}
                                            /> */}
                                            {yearFilterData.map((d, i) => (
                                                <React.Fragment key={`fragment-${number}-${dr}-${i}-${d.year}`}>
                                                    {
                                                        d[dataProp] == -1 && <text
                                                            fill={colorScale[dr]}
                                                            key={`${number}-star-${i}`}
                                                            x={xScale(d.year)}
                                                            y={yScale(1)}
                                                            fontSize={40}
                                                            textAnchor="middle"
                                                            opacity={selectedLabel === dr || selectedLabel == '' ? 1 : 0.3}
                                                            data-tip={toolTip(getLabelName(dr), d)}
                                                            onMouseLeave={() => setTooltipColor('')}
                                                            onMouseEnter={() => setTooltipColor(colorScaleLighterClasses[dr] || '')}
                                                            dy=".5em"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                selectLabel(e, dr, hasSuppressedValue);
                                                            }}>*</text>
                                                    }
                                                    {
                                                        d[dataProp] != -1 && <Circle
                                                            id={`dot-${dr}-${d.year}`}
                                                            key={`${number}-dot-${i}`}
                                                            opacity={selectedLabel === dr || selectedLabel == '' ? 1 : 0.3}
                                                            cx={xScale(d.year)}
                                                            cy={yScale(d[dataProp])}
                                                            r={9 + (hovered == d ? 1 : 0)}
                                                            fill={hovered == d ? '#fff' : colorScale[dr]}
                                                            data-tip={toolTip(getLabelName(dr), d)}
                                                            onMouseEnter={(event) => {
                                                                handleCircleMouseOver(event, d, dr)
                                                                setTooltipColor(colorScaleLighterClasses[dr] || '')
                                                            }}
                                                            onMouseLeave={() => { setTooltipColor(colorScaleLighterClasses[dr] || ''); handleCircleMouseLeave() }}
                                                            strokeWidth={2}
                                                            stroke={hovered == d ? colorScale[dr] : 'none'}
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={(e) => {
                                                                selectLabel(e, dr, hasSuppressedValue);
                                                            }}
                                                        />
                                                    }
                                                </React.Fragment>
                                            ))}
                                            <Text
                                                key={`label-${dr}`}
                                                opacity={selectedLabel === dr || selectedLabel == '' ? 1 : 0.3}
                                                x={lastX + 30}
                                                y={adjustedLabelPositions[i]}
                                                onClick={(e) => {
                                                    selectLabel(e, dr, hasSuppressedValue);
                                                }}
                                                verticalAnchor="middle"
                                                stroke={colorScale[dr]}
                                                style={{ cursor: 'pointer' }}
                                                strokeWidth={0.5}>
                                                {printLabel(dr)}
                                            </Text>
                                            {
                                                adjustedLabelPositions[i] != lastY &&
                                                <line
                                                    k1={`line-leading-${dr}`}
                                                    x1={xScale(lastDataPoint.year)}
                                                    y1={lastY}
                                                    x2={lastX + 18} // Same x position as the text
                                                    y2={adjustedLabelPositions[i]}
                                                    stroke={colorScale[dr]}
                                                    strokeWidth={0.5}
                                                />
                                            }
                                        </React.Fragment>
                                    })
                            }
                            {/* Render One more layer of circles/star for the selected drug */}
                            {
                                selectedLabel && data[selectedLabel] && yearFilter(data[selectedLabel]).map(d => ({ ...d, suppressed: d[dataProp] == -1 ? true : false })).map((d, i) => (
                                    <React.Fragment key={`fragment-${number}-${selectedLabel}-${i}-${d.year}`}>
                                        {
                                            d.suppressed && <text
                                                fill={colorScale[selectedLabel]}
                                                key={`hover-star-h`}
                                                x={xScale(d.year)}
                                                y={yScale(1)}
                                                fontSize={40}
                                                textAnchor="middle"
                                                data-tip={toolTip(getLabelName(selectedLabel), d)}
                                                onMouseLeave={() => setTooltipColor('')}
                                                onMouseEnter={() => setTooltipColor(colorScaleLighterClasses[selectedLabel])}
                                                dy=".5em"
                                                style={{ cursor: 'pointer' }}
                                            // onClick={(e) => {
                                            //     selectLabel(e, selectedLabel, true);
                                            // }}
                                            >*</text>
                                        }
                                        {
                                            !d.suppressed && <circle
                                                key={`dottool-${i}`}
                                                style={{ cursor: 'pointer' }}
                                                cx={xScale(d.year)}
                                                cy={yScale(d[dataProp])}
                                                r={9 + (hovered == d ? 1 : 0)}
                                                fill={hovered == d ? '#fff' : colorScale[selectedLabel]}
                                                data-tip={toolTip(getLabelName(selectedLabel), d)}
                                                strokeWidth={2}
                                                stroke={hovered == d ? colorScale[selectedLabel] : 'none'}
                                                onMouseEnter={(event) => {
                                                    handleCircleMouseOver(event, d, selectedLabel)
                                                    setTooltipColor(colorScaleLighterClasses[selectedLabel])
                                                }}
                                                onMouseLeave={() => { handleCircleMouseLeave(); setTooltipColor('') }}
                                            // onClick={(e) => {
                                            //     selectLabel(e, selectedLabel, false);
                                            // }}
                                            />
                                        }
                                    </React.Fragment>
                                ))}

                            {/* Render top layer of circles, for hovered drug if it is not suppressed point */}
                            {
                                hovered && hovered[dataProp] > 0 && <Circle
                                    visibility={ (hovered && hoveredDrug) ? 'visible' : 'hidden'}
                                    strokeWidth={2}
                                    stroke={colorScale[hoveredDrug]}
                                    key={`dottool-dynamic-hover`}
                                    style={{ cursor: 'pointer' }}
                                    cx={xScale(hovered?.year)}
                                    cy={yScale(hovered ? hovered[dataProp] : 0)}
                                    r={10}
                                    fill={'#fff'}
                                    onMouseEnter={(event) => {
                                        handleCircleMouseOver(event, hovered, hoveredDrug); setTooltipColor(colorScaleLighterClasses[hoveredDrug])
                                    }}
                                    onMouseLeave={() => {
                                        handleCircleMouseLeave()
                                        setTooltipColor()
                                    }
                                    }
                                    data-tip={hovered ? toolTip(getLabelName(hoveredDrug), hovered) : ''}
                                    onClick={(e) => {
                                        selectLabel(e, hoveredDrug, yearFilter(data[hoveredDrug]).some(d => d[dataProp] == -1));
                                    }}
                                />
                            }
                            {/* Render one layer of star for the hovered drug if it is suppressed point */}
                            {
                                hovered && hovered[dataProp] == -1 &&
                                <text
                                    visibility={hovered && hoveredDrug && hovered[dataProp] == -1 ? 'visible' : 'hidden'}
                                    fill={colorScale[hoveredDrug]}
                                    key={`hover-star-h`}
                                    x={xScale(hovered.year)}
                                    y={yScale(1)}
                                    fontSize={40}
                                    textAnchor="middle"
                                    data-tip={hovered ? toolTip(getLabelName(hoveredDrug), hovered) : ''}
                                    onMouseLeave={() => setTooltipColor('')}
                                    onMouseEnter={() => setTooltipColor(colorScaleLighterClasses[hoveredDrug])}
                                    dy=".5em"
                                    style={{ cursor: 'pointer' }}
                                    onClick={(e) => {
                                        selectLabel(e, hoveredDrug, yearFilter(data[hoveredDrug]).some(d => d[dataProp] == -1));
                                    }}
                                >*</text>
                            }

                            <text
                                x={(adjustedWidth) / 2}
                                y={height - margin.bottom + 28}
                                textAnchor="middle"
                                // fontSize={'medium'}
                            >{xLabel}</text>

                        </Group>
                    </svg>
                </div>
            </div>

            {
                labelOptions &&
                <div className='ml-1'>
                    <br></br>
                    <fieldset className='border drug-selector-fieldset'>
                        <legend className='float-none w-auto'>{
                            // (drugsInvolvedMetric == 'count' || drugsInvolvedMetric == 'rate' || drugsInvolvedMetric == 'count') &&
                            <div className='row font16 bold ml-1'>
                                <div><b>Make a selection to change the line graph above </b></div>
                            </div>}
                        </legend>
                        <div className='drug-selector-container'>
                            {
                                <div className='drug-selector-column'>
                                    {
                                        drugOptions('All', !isPercent, drugsInvolvedMetric == 'percent')
                                    }
                                </div>
                            }
                            <div className='drug-selector-column'>
                                {
                                    drugOptions('Any opioids', true)
                                }
                                {
                                    drugOptions('Heroin', true)
                                }
                                {
                                    drugOptions('Illegally-made fentanyls', true)
                                }
                                {
                                    drugOptions('Prescription opioids', true)
                                }</div>
                            <div className='drug-selector-column'>
                                {
                                    drugOptions('Any stimulants', true)
                                }
                                {
                                    drugOptions('Cocaine', true)
                                }
                                {
                                    drugOptions('Methamphetamine', true)
                                }
                            </div>
                            <div className='drug-selector-column'>
                                {
                                    drugOptions('Any non-opioid sedatives', true)
                                }
                                {
                                    drugOptions('Benzodiazepines', true)
                                }
                            </div>
                        </div>
                        <div className='row ml-1 mt-3'>
                            <div className='col-md-5'>
                                {/* <input
                                    type="checkbox"
                                    id={`label-All`}
                                    name={`label-All`}
                                    checked={selectedLabels.length == labelNames.length}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedLabels(labelNames);
                                        }
                                    }}
                                ></input> */}
                                {/* <label htmlFor="label-All">&nbsp;Show all selections</label> */}
                                <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedLabels(labelNames);
                                    }}>Show all selections</a>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {/* <input
                                    type="checkbox"
                                    id={`label-clear-All`}
                                    name={`label-clear-All`}
                                    checked={selectedLabels.length == 0}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedLabels([]);
                                        }
                                        setSelectedLabel('');
                                    }}
                                ></input> */}
                                {/* <label htmlFor='label-clear-All'>&nbsp;Clear all selections</label> */}
                                <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedLabels([]);
                                        setSelectedLabel('');
                                    }}>Clear all selections</a>
                            </div>
                        </div>
                    </fieldset>
                </div>
            }
            {
                !skipFootNotes &&
                <div className=''>
 <p className="scale-note"><sup>†</sup><span style={{ fontSize: '14px' }}>Scale of the chart may change based on the data presented.</span>
 <br></br>
                        {hasSuppressedRate && <><sup>*</sup>Rate is suppressed due to sparse data.</>}</p>
                    </div>
            }
        </>
    );
}

export default LineChart;