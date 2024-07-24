import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';

const StatusFilters = () => {
    const { filters, setFilters } = useContext(JiraContext);
    const statuses = ['To Do', 'In Progress', 'Done'];

    const handleChange = (status) => {
        setFilters({
            ...filters,
            statusFilters: {
                ...filters.statusFilters,
                [status]: !filters.statusFilters[status],
            },
        });
    };

    return (
        <div className="status-filters">
            {statuses.map((status) => (
                <label key={status}>
                    <input
                        type="checkbox"
                        checked={filters.statusFilters[status] !== false}
                        onChange={() => handleChange(status)}
                    />
                    {status}
                </label>
            ))}
        </div>
    );
};

export default StatusFilters;
