import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const JiraContext = createContext();

export const JiraProvider = ({ children }) => {
    const [config, setConfig] = useState({
        jiraUser: '',
        jiraToken: '',
        mode: 'demo',
    });
    const [filters, setFilters] = useState({
        project: '',
        epic: '',
        statusFilters: {},
    });
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [epics, setEpics] = useState([]);

    useEffect(() => {
        loadConfig();
        loadFilters();
        fetchProjects();
    }, []);

    useEffect(() => {
        if (filters.project) {
            fetchEpics(filters.project);
            fetchTasks(filters.project, filters.epic);
        }
    }, [filters.project, filters.epic]);

    const loadConfig = () => {
        const savedConfig = localStorage.getItem('jiraVisualizerConfig');
        if (savedConfig) {
            setConfig(JSON.parse(savedConfig));
        }
    };

    const saveConfig = (newConfig) => {
        setConfig(newConfig);
        localStorage.setItem('jiraVisualizerConfig', JSON.stringify(newConfig));
    };

    const loadFilters = () => {
        const savedFilters = localStorage.getItem('jiraVisualizerFilters');
        if (savedFilters) {
            setFilters(JSON.parse(savedFilters));
        }
    };

    const saveFilters = (newFilters) => {
        setFilters(newFilters);
        localStorage.setItem('jiraVisualizerFilters', JSON.stringify(newFilters));
    };

    const fetchProjects = async () => {
        if (config.mode === 'demo') {
            setProjects(['Proyecto A', 'Proyecto B']);
        } else {
            try {
                const response = await axios.post('/api/projects', {
                    username: config.jiraUser,
                    token: config.jiraToken,
                });
                setProjects(response.data.projects);
            } catch (error) {
                console.error('Error al obtener proyectos de Jira:', error);
            }
        }
    };

    const fetchEpics = async (project) => {
        if (config.mode === 'demo') {
            setEpics(demoData.epics[project] || []);
        } else {
            try {
                const response = await axios.post('/api/epics', {
                    username: config.jiraUser,
                    token: config.jiraToken,
                    project,
                });
                setEpics(response.data.epics);
            } catch (error) {
                console.error('Error al obtener epics de Jira:', error);
            }
        }
    };

    const fetchTasks = async (project, epic) => {
        if (config.mode === 'demo') {
            setTasks(demoData.tasks.filter(task => task.project === project && (!epic || task.epic === epic)));
        } else {
            try {
                const response = await axios.post('/api/tasks', {
                    username: config.jiraUser,
                    token: config.jiraToken,
                    project,
                    epic,
                });
                setTasks(response.data.tasks);
            } catch (error) {
                console.error('Error al obtener tareas de Jira:', error);
            }
        }
    };

    return (
        <JiraContext.Provider value={{
            config,
            setConfig: saveConfig,
            filters,
            setFilters: saveFilters,
            tasks,
            projects,
            epics,
            fetchProjects,
            fetchEpics,
            fetchTasks,
        }}>
            {children}
        </JiraContext.Provider>
    );
};
