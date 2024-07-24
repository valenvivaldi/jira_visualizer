import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';

const HideAllDetailsButton = () => {
    const { tasks, setTasks } = useContext(JiraContext);

    const hideAllDetails = () => {
        setTasks(tasks.map(task => ({ ...task, showDetails: false })));
    };

    return (
        <button onClick={hideAllDetails}>Ocultar todos los detalles</button>
    );
};

export default HideAllDetailsButton;
