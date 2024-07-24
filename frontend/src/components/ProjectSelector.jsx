import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';

const ProjectSelector = () => {
    const { projects, filters, setFilters } = useContext(JiraContext);

    const handleChange = (e) => {
        const project = e.target.value;
        setFilters({ ...filters, project, epic: '' });
    };

    return (
        <select value={filters.project} onChange={handleChange}>
            <option value="">Seleccione un proyecto</option>
            {projects.map((project) => (
                <option key={project} value={project}>
                    {project}
                </option>
            ))}
        </select>
    );
};

export default ProjectSelector;
