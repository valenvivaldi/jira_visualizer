import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';

const EpicSelector = () => {
    const { epics, filters, setFilters } = useContext(JiraContext);

    const handleChange = (e) => {
        const epic = e.target.value;
        setFilters({ ...filters, epic });
    };

    return (
        <select value={filters.epic} onChange={handleChange}>
            <option value="">Seleccione un epic</option>
            {epics.map((epic) => (
                <option key={epic} value={epic}>
                    {epic}
                </option>
            ))}
        </select>
    );
};

export default EpicSelector;
