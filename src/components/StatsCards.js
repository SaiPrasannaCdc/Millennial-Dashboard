import React from 'react';
import './StatsCards.css';
import { UtilityFunctions } from '../utility';

function StatsCards(params) {

    const { data, rgn, tframe } = params;

    const dataUrl = window.location.origin.includes('localhost') ? '' : '/overdose-prevention/data-dashboards/clinical-urine-dashboard';

    return (
        <div className="stats-cards-container">
            <div className="stats-card">
                <div className="containerImg"><img src={dataUrl + '/data/' + rgn + '.png'}/></div>
           </div>
            <div className="stats-card">
                <table>
                    <tr>
                        <td><div className="stats-card-number">{UtilityFunctions.getNoOfTests(data, rgn, tframe)}<br></br>Tests</div></td>
                        <td class="alignTop"><div className="stats-card-content"><p className="title">Subset of urine drug tests for fentanyl, heroin, cocaine, and methamphetamine analyzed by Millennium Health</p></div></td>
                    </tr>
                    <br></br>
                    <tr>
                        <td colspan='2'><p className="smallFont">{UtilityFunctions.getTimeStamp(data, rgn, tframe)}</p></td>
                    </tr>
                </table>

            </div>
            <div className="stats-card">
                <table>
                    <tr>
                        <td><div className="stats-card-number">{UtilityFunctions.getNoOfStates(data, rgn, tframe)}<br></br>States</div></td>
                        <td class="alignTop"><div className="stats-card-content"><p className="title">Conducted more than 1000 tests</p></div></td>
                    </tr>
                    <tr>
                        <td>&nbsp;</td>
                    </tr>
                    <tr>
                        <td colspan='2'><p className="smallFont">{UtilityFunctions.getTimeStamp(data, rgn, tframe)}</p></td>
                    </tr>
                </table>

            </div>
        </div>
    );
};

export default StatsCards;
