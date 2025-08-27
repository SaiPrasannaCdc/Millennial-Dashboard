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
                <div className="stats-card-number">{UtilityFunctions.getNoOfTests(data, rgn, tframe)}<br></br>Tests</div>
                
                <div className="stats-card-content">
                    <p className="title"># of urine drug tests conducted by Millennium Health<br></br><br></br><br></br><br></br><br></br></p>
                    <p className="smallFont">{UtilityFunctions.getTimeStamp(data, rgn, tframe)}</p> 
                </div>
            </div>
            <div className="stats-card">
                <div className="stats-card-number">{UtilityFunctions.getNoOfStates(data, rgn, tframe)}<br></br>States</div>
                <div className="stats-card-content">
                    <p className="title">Conducted more than 1000 tests<br></br><br></br><br></br><br></br><br></br><br></br></p>
                    <p className="smallFont">{UtilityFunctions.getTimeStamp(data, rgn, tframe)}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
