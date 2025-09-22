import React from 'react';
import './StatsCards.css';
import { UtilityFunctions } from '../utility';

function StatsCards(params) {

    const { data, rgn, tframe, isSmallViewPort, drugClr } = params;

    const dataUrl = window.location.origin.includes('localhost') ? '' : '/overdose-prevention/data-dashboards/clinical-urine-dashboard';

    return (
        <div className={isSmallViewPort ? "stats-cards-container-SVP" : "stats-cards-container"}>
            <div className={isSmallViewPort ?"stats-card-SVP" : "stats-card"}>
                <div className="containerImg"><img src={dataUrl + '/data/' + rgn + '.png'}/></div>
           </div>
            <div className={isSmallViewPort ?"stats-card-SVP" : "stats-card"}>
                <table>
                    <tr>
                        <td><div className="stats-card-number" style={{'color': drugClr}}>{UtilityFunctions.getNoOfTests(data, rgn, tframe)}<br></br></div></td>
                        <td class="alignTop"><div className="stats-card-content"><p className="title" style={{'color': drugClr}}>Subset of urine drug tests for fentanyl, heroin, cocaine, and methamphetamine analyzed by Millennium Health</p></div></td>
                    </tr>
                    <br></br>
                    <tr>
                        <td colspan='2'><p className="smallFont">{UtilityFunctions.getTimeStamp(data, rgn, tframe)}</p></td>
                    </tr>
                </table>

            </div>
            <div className={isSmallViewPort ?"stats-card-SVP" : "stats-card"}>
                <table>
                    <tr>
                        <td class="alignTop"><div className="stats-card-content"><p className="reg" style={{'color': drugClr}}><strong>{rgn == 'National' ? 'Data are not nationally representative ' : 'Caution: '}</strong>{rgn == 'National' ? 'because this is a convenient sample. 50 states and District of Columbia submitted varying # of urine drug tests to Millennium Health.' : 'Results cannot be compared across regions because the types of patients tested vary across regions.'}</p></div></td>
                    </tr>
                </table>
            </div>
        </div>
    );
};

export default StatsCards;
