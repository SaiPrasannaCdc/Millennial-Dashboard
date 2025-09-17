import React from 'react';
import './dropdowns.css'; // Import the CSS styles

const Dropdowns = ({ selectedPeriod, onPeriodChange, selectedRegion, onRegionChange, selectedDrug, onDrugChange, isSmallViewPort}) => {

    const isQuarterly = selectedPeriod === 'Quarterly';
    
    return (
        <>
        {!isSmallViewPort &&    
        <div className="dropdown-container">
            <div className="dropdown">
                <label htmlFor="region">Select a Region:</label>
                <select
                    id="region"
                    name="region"
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                >
                    <option value="National">National</option>
                    <option value="NORTH">Northeast Census Region</option>
                    <option value="MIDWEST">Midwest Census Region</option>
                    <option value="SOUTH">Southern Census Region</option>
                    <option value="WEST">Western Census Region</option>
                </select>
            </div>

            <div className="dropdown">
                <label htmlFor="drug">Select a Drug:</label>
                <select id="drug" name="drug" value={selectedDrug} onChange={(e) => onDrugChange(e.target.value)}>
                    <option value="fentanyl">Fentanyl</option>
                    <option value="heroin">Heroin</option>
                    <option value="cocaine">Cocaine</option>
                    <option value="methamphetamine">Methamphetamine</option>
                </select>
            </div>

            <div className="dropdown">
                <label htmlFor="period">Select a Time Frame:</label>
                <select
                    id="period"
                    name="period"
                    value={selectedPeriod}
                    onChange={(e) => onPeriodChange(e.target.value)}
                >
                    <option value="Quarterly" disabled={selectedRegion == 'NORTH' ? true : false}>Quarterly</option>
                    <option value="HalfYearly">6 Months</option>
                </select>
            </div>
        </div>
        }
        {isSmallViewPort && 

            <table>
                <tr>
                    <td>
                        <label htmlFor="region">Select a Region:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                    <div className="dropdownSVP">
                            <select
                                id="region"
                                name="region"
                                value={selectedRegion}
                                onChange={(e) => onRegionChange(e.target.value)}
                            >
                                <option value="National">National</option>
                                <option value="NORTH">Northeast Census Region</option>
                                <option value="MIDWEST">Midwest Census Region</option>
                                <option value="SOUTH">Southern Census Region</option>
                                <option value="WEST">Western Census Region</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="drug">Select a Drug:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="dropdownSVP">
                            <select id="drug" name="drug" value={selectedDrug} onChange={(e) => onDrugChange(e.target.value)}>
                                <option value="fentanyl">Fentanyl</option>
                                <option value="heroin">Heroin</option>
                                <option value="cocaine">Cocaine</option>
                                <option value="methamphetamine">Methamphetamine</option>
                            </select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor="period">Select a Time Frame:</label>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className="dropdownSVP">
                            <select
                                id="period"
                                name="period"
                                value={selectedPeriod}
                                onChange={(e) => onPeriodChange(e.target.value)}
                            >
                                <option value="Quarterly" disabled={selectedRegion == 'NORTH' ? true : false}>Quarterly</option>
                                <option value="HalfYearly">6 Months</option>
                            </select>
                        </div>
                    </td>
                </tr>
            </table>
        }
        </>
    );
              
};

export default Dropdowns;
