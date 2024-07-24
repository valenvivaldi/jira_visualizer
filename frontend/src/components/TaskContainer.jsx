import React, { useContext } from 'react';
import { JiraContext } from '../context/JiraContext';
import TaskCard from './TaskCard';

const TaskContainer = () => {
    const { tasks, filters } = useContext(JiraContext);

    return (
        <div id="taskContainer">
            {tasks.map(task => (
                filters.statusFilters[task.status] !== false && (
                    <TaskCard key={task.code} task={task} />
                )
            ))}
        </div>
    );
};

export default TaskContainer;
