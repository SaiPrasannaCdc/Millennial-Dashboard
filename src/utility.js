
import { Fragment } from 'react';
import ReactTooltip from 'react-tooltip';

export const UtilityFunctions = {

   getGroupedData: (data, region, mdrug, pos, periodKey, drugs) => {

    const arr = data?.[region]?.[mdrug]?.[pos]?.[periodKey] || [];
    if (periodKey == 'HalfYearly')
    { 
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
          drug: name,
          period:  (d.period || d.smon_yr)?.substring(5) + ' ' + (d.period || d.smon_yr).substring(0,4), 
          percentage: parseFloat(d.percentage),
          ciLower: parseFloat(d['ciLower'] ?? d['CI lower'] ?? d['CI_lower'] ?? d.ciLower),
          ciUpper: parseFloat(d['ciUpper'] ?? d['CI upper'] ?? d['CI_upper'] ?? d.ciUpper),
          annual: d.Annual || d['Yr_change'] || d.yr_change || '',
          periodChange: d.Period || d.periodChange || '',
          yearlyChange: d.yr_change || '',
        }))
      })).filter(line => line.data.length > 0);
    }
    else
    {
      return drugs.map(name => ({
        label: name,
        data: arr.filter(d => (d.drug_name === name || d.drug_name === name)).map(d => ({
          drug: name,
          quarter:  d.period || d.smon_yr, 
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

  getToggleControls: (ctlName, setShowPercentChange, setShowLabels, showPercentChange, showLabels) => {
    return (
      <Fragment>
        <Fragment>
          <div className="toggle-container" key={{ctlName}} style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
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
                          box-shadow: 0 2px 12px #bbb3;
                        ">
                          <div style="margin-top: 8px;">
                            When <b>% Chg</b> is on, hover over the data point for the 5 most recent quarters to view percent change from the same quarter in the previous year and the previous quarter.
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
                              checked={showPercentChange}
                              onChange={() => setShowPercentChange(!showPercentChange)}
                            />
                            <span className="slider percent-toggle" style={{ backgroundColor: showPercentChange ? '#002b36' : '#ccc' }}></span>
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
                          box-shadow: 0 2px 12px #bbb3;
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
                        checked={showLabels}
                        onChange={() => setShowLabels(!showLabels)}
                      />
                      <span className="slider label-toggle" style={{ backgroundColor: showLabels ? '#002b36' : '#ccc' }}></span>
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
  }
}