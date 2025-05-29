import React from 'react';
import './dropdowns.css'; // Import the CSS styles

const Dropdowns = ({ selectedPeriod, onPeriodChange, selectedRegion, onRegionChange, selectedDrug, onDrugChange }) => {
    // Determine if Northeast should be disabled (for Quarterly)
    const isQuarterly = selectedPeriod === 'Quarterly';
    return (
        <div className="dropdown-container">
            {/* Region Dropdown */}
            <div className="dropdown">
                <label htmlFor="region">Region:</label>
                <select
                    id="region"
                    name="region"
                    value={selectedRegion}
                    onChange={(e) => onRegionChange(e.target.value)}
                >
                    <option value="National">National</option>
                    <option value="NORTH" disabled={isQuarterly} style={isQuarterly ? { color: '#bbb' } : {}}>Northeast Census Region{isQuarterly ? ' (Not displayed)' : ''}</option>
                    <option value="MIDWEST">Midwest Census Region</option>
                    <option value="SOUTH">Southern Census Region</option>
                    <option value="WEST">Western Census Region</option>
                </select>
            </div>

            {/* Drug Dropdown */}
            <div className="dropdown">
                <label htmlFor="drug">Drug:</label>
                <select id="drug" name="drug" value={selectedDrug} onChange={(e) => onDrugChange(e.target.value)}>
                    <option value="fentanyl">Fentanyl</option>
                    <option value="heroin">Heroin</option>
                    <option value="cocaine">Cocaine</option>
                    <option value="methamphetamine">Methamphetamine</option>
                </select>
            </div>

            {/* Period Dropdown */}
            <div className="dropdown">
                <label htmlFor="period">Period:</label>
                <select
                    id="period"
                    name="period"
                    value={selectedPeriod}
                    onChange={(e) => onPeriodChange(e.target.value)}
                >
                    <option value="Quarterly">Quarterly</option>
                    <option value="Half Yearly">6 Months</option>
                </select>
            </div>
        </div>
    );
};

export default Dropdowns;
