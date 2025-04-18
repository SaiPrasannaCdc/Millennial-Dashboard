import React, { } from 'react';

function MetricSelector(params) {
    const { showClickALine = false, selectedLabel, includeMetricSelectorNumber,
        includeMetricSelectorRate = true,
        onCountSelected,
        onRateSelected,
        onPercentSelected,
        selectedMetric,
        isLineChart,
        setIsLineChart,
        showToogle = false,
        lineChartRename = 'Line Chart',
        secondOptionName = 'Map',
        accessible,
        className

     } = params;

    return (
        <>
            <div className={`metric-selectors mb-2 ${ className ? className : ''}`}>
                    <strong>Metric: </strong>
                    <nobr>
                        {
                            includeMetricSelectorNumber && <div>
                                <input
                                    id="emerging-count-metric"
                                    name="emerging-metric"
                                    type="radio"
                                    value="count"
                                    checked={selectedMetric === 'count'}
                                    onChange={(e) => {
                                        onCountSelected(e);
                                    }} />
                                <label
                                    htmlFor="emerging-count-metric">Number</label>
                            </div>
                        }
                        {
                            includeMetricSelectorRate && <div>
                            <input
                                id="emerging-rate-metric"
                                name="emerging-metric"
                                type="radio"
                                value="rate"
                                checked={selectedMetric === 'rate'}
                                onChange={(e) => {
                                    onRateSelected(e)
                                }} />
                            <label
                                htmlFor="emerging-rate-metric">Rate</label>
                        </div>
                        }
                        
                        <div>
                            <input
                                id="emerging-percent-metric"
                                name="emerging-metric"
                                type="radio"
                                value="percent"
                                checked={selectedMetric === 'percent'}
                                onChange={(e) => {
                                    onPercentSelected(e)
                                }
                                }
                            />
                            <label
                                htmlFor="emerging-percent-metric">Percent</label>
                        </div></nobr>
                </div>
                {
                showClickALine && !accessible && <div className='statText'>
                Click a line on the chart to {selectedLabel == '' ? 'view' : 'change'} the statistic.
            </div>
            }
            {
                showToogle && !accessible && <span className="toggle-wrap" onClick={() => { setIsLineChart(isLineChart ? false : true)}} style={{float: 'right'}}>
                <span>{lineChartRename}</span><div className="toggle-container"><span className="toggle-background"></span><span className={`toggle-indicators${ isLineChart ? ' ' : ' map'}`}></span></div><span>{selectedMetric === 'count'? 'Bar Chart': secondOptionName}</span>
              </span>
            }
            
        </>
    );
}

export default MetricSelector;