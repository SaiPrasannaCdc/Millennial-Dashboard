import React from 'react';
import './StatsCards.css';

const StatsCards = (rgn) => {

    const dataUrl = window.location.origin.includes('localhost') ? '' : '/overdose-prevention/data-dashboards/clinical-urine-dashboard';

    return (
        <div className="stats-cards-container">
            <div className="stats-card">
                <div className="containerImg"><img src={dataUrl + '/data/' + rgn.rgn + '.png'}/></div>
           </div>
            <div className="stats-card">
                <div className="stats-card-number">129.9</div>
                <div className="stats-card-content">
                    <p className="title">Overall</p>
                    <p>Rate<sup>1</sup> of ED visits for nonfatal all drug overdose in <strong>2023</strong></p>
                </div>
            </div>
            <div className="stats-card">
                <div className="stats-card-number">30</div>
                <div className="stats-card-content">
                    <p className="title">States Participating<sup>2</sup></p>
                    <p>Participating states with reported data</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCards;
