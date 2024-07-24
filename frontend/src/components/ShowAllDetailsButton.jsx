import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';

const ShowAllDetailsButton = () => {
    const { tasks, setTasks } = useContext(JiraContext);

    const showAllDetails = () => {
        setTasks(tasks.map(task => ({ ...task, showDetails: true })));
    };

    return (
        <button onClick={showAllDetails}>Mostrar todos los detalles</button>
    );
};

export default ShowAllDetailsButton;
