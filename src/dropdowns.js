import React from 'react';
import './dropdowns.css'; // Import the CSS styles

const Dropdowns = ({ selectedPeriod, onPeriodChange }) => {
    return (
        <div className="dropdown-container">
            {/* Region Dropdown */}
            <div className="dropdown">
                <label htmlFor="region">Region:</label>
                <select id="region" name="region">
                <option value="northeast">USA</option>
                    <option value="northeast">Northeast</option>
                    <option value="midwest">Midwest</option>
                    <option value="south">South</option>
                    <option value="west">West</option>
                </select>
            </div>

            {/* Drug Dropdown */}
            <div className="dropdown">
                <label htmlFor="drug">Drug:</label>
                <select id="drug" name="drug">
                    <option value="fentanyl">Fentanyl</option>
                    <option value="heroine">Heroine</option>
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
                    <option value="Half Yearly">Half Yearly</option>
                    <option value="Yearly">Yearly</option>
                </select>
            </div>
        </div>
    );
};

export default Dropdowns;
