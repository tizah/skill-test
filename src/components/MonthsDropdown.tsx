// components/Dropdown.js
import React from 'react';

const Dropdown = ({ selectedRange, setSelectedRange }: any) => {
    return (
        <div>
            <select
                id="timeRange"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
                className="bg-transparent"
            >
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="12months">Last 12 Months</option>
                <option value="all">All</option>
            </select>
        </div>
    );
};

export default Dropdown;
