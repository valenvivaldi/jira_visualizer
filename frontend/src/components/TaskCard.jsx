import React, { useState } from 'react';

const TaskCard = ({ task }) => {
    const [showDetails, setShowDetails] = useState(false);

    const toggleDetails = () => {
        setShowDetails(!showDetails);
    };

    const getContrastYIQ = (hexcolor) => {
        hexcolor = hexcolor.replace('#', '');
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    };

    return (
        <div className="task-card" style={{ backgroundColor: task.color, color: getContrastYIQ(task.color) }}>
            <h3 style={{ color: 'blue' }}>
                <a href={task.link} target="_blank" rel="noopener noreferrer">{task.code}</a>
            </h3>
            <p>{task.name}</p>
            <p>Estado: {task.status}</p>
            <p>Asignado a: {task.assignee}</p>
            <button onClick={toggleDetails}>{showDetails ? 'Ocultar detalles' : 'Mostrar detalles'}</button>
            {showDetails && (
                <div className="details">
                    <p>Fecha de vencimiento: {task.dueDate}</p>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
