import React, { useState, useEffect } from 'react';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { LinePath, Circle } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleLinear, scalePoint } from '@visx/scale';
import ReactTooltip from 'react-tooltip';
import { format } from 'd3-format';
import '../../css/MonthChart.css';
import { max, min } from 'd3-array';

function SingleLineChart(params) {
    const { data, maxDifference, width, height, el, accessible, metric, isPercent = true, value2Lable, colorCode = '#712177',
        selectedLabel, label, chartClick, lineClick, colorScaleLighterClasses, setTooltipColor
        , axisOnly = false
    } = params;
    const [animated, setAnimated] = useState(false);
    const margin = { top: 30, bottom: 10, left: 0, right: 10 };
    const adjustedHeight = height - margin.top - margin.bottom;
    const adjustedWidth = width - margin.left - margin.right;
    const [hovered, setHovered] = useState(null);
    // const [hoveredLabel, setHoveredLabel] = useState('');
    const toolTipColor = 'circumstances-lighter';

    const maxValue = max(data, m => m.value)
    const minValue = min(data, m => m.value)
    const dataDifference = Math.abs(maxValue - minValue)
    const consolidatedAdjustedHeight = axisOnly? adjustedHeight +5: (20 + (adjustedHeight-20) * (dataDifference/maxDifference));



    const getToolTip = (d) => {
        return `<strong>${d['key']}</strong>${value2Lable ? `<br/><span>${value2Lable}: ${Number(d.value2).toLocaleString()}</span>` : ``}<br/><span>${metric}: ${metric == 'Deaths' ? Number(d.value).toLocaleString() : Number(d.value).toFixed(1).toLocaleString()}${isPercent ? '%' : ''}</span><br/>`
    }
    const xScale = scalePoint({
        domain: data.map(d => d['key']),
        range: [100, adjustedWidth - 70],
        padding: 0
    });

    // const max = header ? maxes.quarter : maxes.month;

    const yScale = scaleLinear({
        range: [consolidatedAdjustedHeight-10, 10],
        domain: [minValue, maxValue ]
    });

    const onScroll = () => {
        if (el.current && !animated && window.scrollY + window.innerHeight > el.current.getBoundingClientRect().top - document.body.getBoundingClientRect().top) {
            window.removeEventListener('scroll', onScroll);
            setAnimated(true);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        setTimeout(onScroll, 50); // eslint-disable-next-line
    }, []);

    const handleCircleMouseOver = (event, d) => {
        // setHoveredLabel(dr);
        setHovered(d);
        ReactTooltip.rebuild();
    };

    const handleCircleMouseLeave = () => {
        setHovered(null);
        // setHoveredLabel('');
    };

    const getOpacity = () => {
        if (selectedLabel === label || selectedLabel == '') {
            return 1;
        } else {
            return 0.3;
        }
    }

    const selectLabel = (e, l) => {
        lineClick(e, l);
    };

    return width > 0 &&
        (accessible) ? (
        <div></div>
    ) : (
        <svg width={width} height={consolidatedAdjustedHeight} onClick={() => {
            chartClick()
        }}>
            <Group  left={margin.left}>
                {
                    !axisOnly && <>
                        <text
                            // key={`label-${dr}`}
                            opacity={getOpacity()}
                            x={40}
                            y={yScale(data[0].value) + 5}
                            onClick={(e) => {
                                selectLabel(e, label);
                            }}
                            verticalAnchor="middle"
                            stroke={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                            style={{ cursor: 'pointer' }}
                            strokeWidth={0.5}
                            fontSize={14}

                        >
                            {data[0].value?.toFixed(1) + '%'}
                        </text>
                        {data.map(d => (
                            <Group key={`point-${d['key']}`}>
                                <Circle
                                    r={9 + (hovered == d ? 1 : 0)}
                                    cx={xScale(d['key'])}
                                    cy={yScale(d.value)}
                                    fill={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                                    opacity={getOpacity()}
                                    onClick={(e) => {
                                        selectLabel(e, label);
                                    }}
                                    cursor={'pointer'}
                                    strokeWidth={2}
                                    stroke={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                                    data-tip={getToolTip(d)}
                                    onMouseEnter={(event) => {
                                        setTooltipColor(toolTipColor)
                                        handleCircleMouseOver(event, d);
                                    }}
                                    onMouseLeave={() => {
                                        setTooltipColor('')
                                        handleCircleMouseLeave()
                                    }
                                    }
                                />
                            </Group>
                        ))}
                        <LinePath
                            key={`line`}
                            data={data}
                            x={d => xScale(d['key'])}
                            y={d => yScale(d.value)}
                            stroke={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                            onClick={(e) => {
                                selectLabel(e, label);
                            }}
                            strokeWidth="2"
                            pointerEvents="none"
                            opacity={getOpacity()}
                            cursor={'pointer'}
                        />
                        <text
                            // key={`label-${dr}`}
                            opacity={getOpacity()}
                            x={adjustedWidth - 50}
                            y={yScale(data[data.length - 1].value) + 5}
                            onClick={(e) => {
                                selectLabel(e, label);
                            }}
                            verticalAnchor="middle"
                            stroke={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                            style={{ cursor: 'pointer' }}
                            strokeWidth={0.5}
                            fontSize={14}
                        >
                            {data[data.length - 1].value?.toFixed(1) + '%'}
                        </text>
                        {
                            hovered && <Circle
                                // visibility={hovered ? 'visible' : 'hidden'}
                                strokeWidth={2}
                                // opacity={getOpacity()}
                                stroke={selectedLabel === label || selectedLabel == '' ? colorCode : '#000'}
                                key={`dottool-dynamic-hover`}
                                style={{ cursor: 'pointer' }}
                                cx={xScale(hovered?.key)}
                                cy={yScale(hovered ? hovered.value : 0)}
                                r={10}
                                fill={'#fff'}
                                onMouseEnter={(event) => {
                                    setTooltipColor(toolTipColor)
                                    handleCircleMouseOver(event, hovered);
                                    // setTooltipColor(colorScaleLighterClasses[hoveredLabel])
                                }}
                                onMouseLeave={() => {
                                    setTooltipColor('')
                                    handleCircleMouseLeave()
                                    // setTooltipColor()
                                }
                                }
                                data-tip={ hovered ? getToolTip(hovered) : '' }
                                onClick={(e) => {
                                    selectLabel(e, label);
                                }}
                            />
                        }

                    </>
                }
                {
                    axisOnly && <>
                    <AxisBottom
                        top={0}
                        scale={xScale}
                        tickTransform='translate(0, 4)'
                        tickFormat={format('d')}
                        hideTicks={true}
                        label='Year of death'
                        labelOffset={14}
                    ></AxisBottom>
                    {/* <text x={(adjustedWidth) / 2 + 14}
                        y={adjustedHeight - 1}
                        textAnchor='middle'
                        // fontSize={'medium'}
                        >Year of death</text> */}
                    </>
                }

            </Group>
        </svg>
    );
}

export default SingleLineChart;
