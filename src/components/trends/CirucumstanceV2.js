import React, { useRef, useState, useEffect } from 'react';
import '../../css/CircumstanceV2.css';
import SingleLineChart from './SingleLineChart';
import { orderOfCircumstance } from '../../constants/Constants';
import { max, min } from 'd3-array';

function CircumstanceTrendViewV2(params) {
    const {
        circumstanceSelector,
        cirumstanceIcon,
        cirumstanceDescription,
        headerBackGroundColor,
        dimensions,
        viewportCutoffSmall,
        accessible,
        circumstanceGroup,
        data,
        isFinal,
        getAdjustedPercent,
        stateLabel,
        headingYear,
        waffleChartRef,
        getDimension,
        colorScale,
        yearFrom,
        yearTo,
        filterValidNumbers,
        colorScaleLighter,
        setTooltipColor,
        toFixed

    } = params;
    const [selectedLabel, setSelectedLabel] = useState('')
    const [hoveredLabel, setHoveredLabel] = useState('');
    const axisRef = useRef(null);

    useEffect(() => {
        setSelectedLabel('');
    }, [circumstanceGroup]);

    const labelPrefixSpaces = {
        'Bystander provided no overdose response': 2,
        'Bystander was spatially separated from decedent': 2,
        'Bystander was unaware decedent was using substances': 2,
        'Bystander did not recognize abnormalities': 2,
        'Bystander did not recognize abnormalities as an overdose': 2,
        'Bystander was using substances or alcohol': 2,
        'It was a public space and strangers did not intervene': 2
    };

    const statBoxLabel = {
        'Current treatment for substance use disorder(s)': 'decedents with evidence of current treatment for substance use disorder(s).',
        'Fatal drug use witnessed': 'decedents whose fatal drug use was witnessed.',
        'Evidence of a mental health diagnosis': 'decedents with evidence of a mental health diagnosis.',
        'Potential bystander present': 'decedents who fatally overdosed with a bystander present.',
        'Prior overdose': 'decedents with evidence of a prior diagnosis.',
        'Decedent was recently released from institutional setting': 'decedents recently released from an institutional setting.',

        'Potential bystander present': 'decedents who fatally overdosed with a bystander present.',
        'Bystander provided no overdose response': 'bystanders who provided no overdose response.',
        'Bystander was spatially separated from decedent': 'bystanders who were spatially separated from decedent.',
        'Bystander was unaware decedent was using substances': 'bystanders who were unaware decedent was using substances.',
        'Bystander did not recognize abnormalities': 'bystanders who did not recognize abnormalities.',
        'Bystander did not recognize abnormalities as an overdose': 'bystanders who did not recognize abnormalities as an overdose.',
        'Bystander was using substances or alcohol': 'bystanders who were using substances or alcohol.',
        'It was a public space and strangers did not intervene': 'bystanders who did not intervene because it was a public space.',

        'No pulse at first responder arrival': 'decedents who had no pulse at first responder arrival.',
        'Naloxone administered': 'decedents to whom naloxone was administered.',
        'Seen in emergency department': 'decedents seen in an emergency department.',
        'Admitted to hospital': 'decedents admitted to a hospital.',

        'History of drug use': 'decedents with evidence of a history of drug use.',
        'History of opioid use': 'decedents with evidence of a history of opioid use.',
        'History of stimulant use': 'decedents with evidence of a history of stimulant use.',
        'Recent return to use of opioids': 'evidence of recent return to use of opioids.',
        'Prior overdose': 'decedents with evidence of a prior diagnosis.',
        'Prior overdose within one month of death': 'decedents with evidence of a prior overdose within one month of death.',

        'Evidence of a mental health diagnosis': 'decedents with evidence of a mental health diagnosis.',
        'Ever treated for mental health or substance use disorder(s)': 'decedents with evidence of ever being treated for mental health or substance use disorder(s).',
        'Current treatment for mental health or substance use disorder(s)': 'decedents with evidence of current treatment for mental health or substance use disorder(s).',
        'History of suicide attempt, ideation, or self-harm': 'decedents with evidence of a history of suicide attempt, ideation, or self-harm.',

        'Ever treated for substance use disorder(s)': 'decedents ever treated for substance use disorder(s).',
        'Current treatment for substance use disorder(s)': 'decedents with evidence of current treatment for substance use disorder(s).',
        'Prescribed medications for opioid use disorder': 'decedents prescribed medications for opioid use disorder.',

        'Overdose occurred in a house or apartment setting': 'decedents who overdosed in a house or apartment setting.',
        'Overdose occurred where the decedent lived': 'decedents who overdosed where they lived.',
        'Overdose occurred at a hotel/motel': 'decedents who overdosed at a hotel/motel.',
        'Decedent was experiencing homelessness or housing instability': 'decedents experiencing homelessness or housing instability.',
        'Decedent was recently released from institutional setting': 'decedents recently released from an institutional setting.',
        'Decedent was currently treated for pain': 'decedents who were currently treated for pain.',

        'Evidence of prescription drug use': 'decedents who had evidence of prescription drug use.',
        'Evidence of illegal drug use': 'decedents who had evidence of illegal drug use.',
        'Evidence of counterfeit pill use': 'decedents who had evidence of counterfeit pill use.',

        'Evidence of ingestion': 'decedents who had evidence of ingestion.',
        'Evidence of injection': 'decedents who had evidence of injection.',
        'Evidence of smoking': 'decedents who had evidence of smoking.',
        'Evidence of snorting': 'decedents who had evidence of snorting.',
        'Evidence of other route of drug use': 'decedents who had evidence of other route of drug use.',
        'No information on route of drug use': 'decedents who had no information on route of drug use.'
    }

    const getBystandardHeading = (text) => {
        return (
            <div className="circumstance-heading" style={{ gridColumn: '1 / span 2', fontWeight: 700, margin: '0.5em 0', textAlign: 'left' }}>
                {text}
            </div>
        );
    };

    // Create a ref object to store multiple refs dynamically
    const trendRefs = useRef({});
    // Function to get or create a ref dynamically
    const getTrendRef = (key) => {
        if (!trendRefs.current[key]) {
            trendRefs.current[key] = React.createRef();
        }
        return trendRefs.current[key];
    };

    const getSideLabel = (label) => {
        return (
            <>
                <div style={{
                    fontWeight: selectedLabel == label ? 700 : 500, color: selectedLabel == label ? '#117298' : undefined, display: 'flex', alignItems: 'center', cursor: 'pointer', height: '100%', marginLeft: `${labelPrefixSpaces[label] || 0}em`
                }}
                    onClick={(e) => lineClick(e, label)}
                ><div style={{ width: 4, backgroundColor: selectedLabel == label ? '#117298' : (hoveredLabel == label ) ? '#ccc' : '#fff', height: '100%', marginRight: '0.5em' }}>&nbsp;
                    </div>{label}</div>
            </>);
    }
    

    const getMaxDifference = () => {
        let maxDifference = 0;
        Object.keys(data[circumstanceGroup]).forEach((k) => {

            let maxValue = max(data[circumstanceGroup][k], m => m.percent)
            let minValue = min(data[circumstanceGroup][k], m => m.percent)

            
            maxDifference = Math.max(maxDifference, Math.abs(maxValue - minValue));
            console.log('1 ', maxDifference)
            console.log('2 ', maxValue)
            console.log('3 ', minValue)
        })

        return maxDifference;
    }

    const getLineChart = (key) => {
        return (<>
            <div id="circumstance-simple-line" className="chart-container trend-line-chart-container single-line-chart"
                ref={getTrendRef(key)}>
                <SingleLineChart
                    data={data[circumstanceGroup][key]
                        ?.filter(y => y.year >= yearFrom && y.year <= yearTo)
                        ?.map(y => ({ key: parseInt(y.year), value: y.percent, value2: y.count }))
                        ?.filter(filterValidNumbers)
                        || []}
                    maxDifference = {getMaxDifference()}
                    width={getDimension(getTrendRef(key), 'width') || 100}
                    height={getDimension(getTrendRef(key), 'height') || 80}
                    colorScale={colorScale}
                    el={getTrendRef(key)}
                    accessible={accessible}
                    metric={'Percent'}
                    isPercent={true}
                    colorCode={'#117298'}
                    selectedLabel={selectedLabel}
                    label={key}
                    chartClick={chartClick}
                    lineClick={(e) => lineClick(e, key)}
                    value2Lable={'Number of deaths'}
                    setTooltipColor={setTooltipColor}

                />
            </div>
        </>);
    }

    const chartClick = () => {
        if (setSelectedLabel != '') {
            setSelectedLabel('');
        }
    }

    const lineClick = (e, label) => {
        if (selectedLabel == label) {
            setSelectedLabel('');
        }
        else {
            setSelectedLabel(label);
        }
        e.stopPropagation()
    }

    const sortCircumstances = (a, b) => {
        return (orderOfCircumstance[circumstanceGroup + a] > orderOfCircumstance[circumstanceGroup + b]) ? -1 : 1;
    }

    const trendPercent = () => {
        if (data[circumstanceGroup][selectedLabel]) {
            let fromYearValue = data[circumstanceGroup][selectedLabel].filter(d => d.year == yearFrom)[0]?.percent;
            let toYearValue = data[circumstanceGroup][selectedLabel].filter(d => d.year == yearTo)[0]?.percent;

            if (!fromYearValue || !toYearValue) return 0;

            return toFixed(toYearValue - fromYearValue);
        }
        else return '';
    }

    const value1 = trendPercent() || 0;

    const getTrendWord1 = (c, v) => {
        if (v > 0)
            return `${Math.abs(value1).toFixed(1)} ${c} increase`
        if (v < 0)
            return `${Math.abs(value1).toFixed(1)} ${c} decrease`
        else
            return 'same as'
    }

    const getStatBoxLabel = (label) => {
        return statBoxLabel[label] || '';
    }

    const firstProp = o => {
        if (o == null || Object.keys(o).length === 0) return null;

        return o[Object.keys(o)[0]];
    }

    const axisData = firstProp(firstProp(data));

    return (<>
        <div className="section opioid-section">
            <div className="header margin" style={{ backgroundColor: headerBackGroundColor() }}>
                <h2 className="preheader-label" aria-describedby="footnote-16" style={{ color: isFinal ? 'white' : 'black' }}>{!isFinal && '[Preliminary Data] '}What were the circumstances<sup>{isFinal ? 18 : 12}</sup> surrounding overdose deaths {yearFrom}–{yearTo}, {stateLabel}?</h2>
            </div>
            <span>View data for:</span>
            {circumstanceSelector()} <br></br>
            {
                accessible && circumstanceGroup != 'Potential opportunities for intervention to prevent overdose' && cirumstanceDescription(circumstanceGroup)
            }
            {
                <div className="cicumstances">
                    <div className={dimensions.width < viewportCutoffSmall ? '' : 'row'}>
                        {
                            !accessible && <div className="cicumstances-icon-section">
                                <div id="waffle-chart-container" className="chart-container" >
                                    {
                                        cirumstanceIcon(circumstanceGroup)
                                    }
                                </div>
                            </div>
                        }

                        {
                            !accessible && cirumstanceDescription(circumstanceGroup)
                        }
                    </div>
                    <div className='statText' style={{ marginLeft: '.5em' }}>
                        Click a line on a circumstance to {selectedLabel == '' ? 'view' : 'change'} the statistic.
                    </div>

                    <div
                        className='trendSummaryOverdoseDeaths'
                        style={{
                            backgroundColor: colorScaleLighter[selectedLabel],
                        }}>
                        {(selectedLabel != '') &&
                            <div visibility={selectedLabel != '' ? 'visible' : 'hidden'}>
                                {
                                    <h2 className='trendSummaryOverdoseDeathsLabel' style={{ padding: '0.5em 0.5em' }}>
                                        From {yearFrom} to {yearTo}, there was a <span className='heightlighted' style={{ color: '#117298' }}>{getTrendWord1('percentage point', value1)} </span> in the percentage of {getStatBoxLabel(selectedLabel)}</h2>
                                }
                            </div>
                        }
                    </div>

                    <div className="cicumstances-trend-section" style={{ marginTop: '1em' }}>
                        <div className="circumstance-trend-container" onClick={chartClick}>
                            {data && data[circumstanceGroup] && Object.keys(data[circumstanceGroup]).sort(sortCircumstances).map((key, index) => (
                                <React.Fragment key={index}
                                >
                                    {
                                        key == 'Bystander provided no overdose response' && getBystandardHeading('Among deaths with a potential bystander present:')
                                    }
                                    {
                                        key == 'Bystander was spatially separated from decedent' && getBystandardHeading('Among deaths with no bystander response, reasons for nonresponse included:')
                                    }
                                    <div className="circumstance-label" style={{ height: '100%' }}
                                        onMouseEnter={() => {
                                            setHoveredLabel(key)
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredLabel()
                                        }}>
                                        {getSideLabel(key)}</div>

                                    <div className="circumstance-trend-chart"
                                        onMouseEnter={() => {
                                            setHoveredLabel(key)
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredLabel()
                                        }}>
                                        {
                                            getLineChart(key)
                                        }
                                    </div>
                                </React.Fragment>
                            ))}

                            <div className="circumstance-label" style={{ height: '100%' }}
                            >
                            </div>

                            <div className="circumstance-trend-chart">
                                <div id="circumstance-simple-line" className="chart-container trend-line-chart-container row single-line-chart"
                                    ref={axisRef}>
                                    {axisData && <>
                                        <SingleLineChart
                                            data={axisData
                                                ?.filter(y => y.year >= yearFrom && y.year <= yearTo)
                                                ?.map(y => ({ key: parseInt(y.year), value: y.percent, value2: y.count }))
                                                ?.filter(filterValidNumbers)
                                                || []}
                                            width={getDimension(axisRef, 'width') || 300} // Default width if ref is not resolved
                                            height={getDimension(axisRef, 'height') || 100} // Default height if ref is not resolved
                                            colorScale={colorScale}
                                            el={axisRef}
                                            accessible={accessible}
                                            metric={'Percent'}
                                            isPercent={true}
                                            colorCode={'#117298'}
                                            selectedLabel={selectedLabel}
                                            setTooltipColor={setTooltipColor}
                                            axisOnly={true} // Ensure this property is handled correctly in SingleLineChart
                                        />
                                        
                                    </>}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>
    </>);
}
export default CircumstanceTrendViewV2;