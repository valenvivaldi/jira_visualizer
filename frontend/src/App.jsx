import React, { useState } from 'react';
import { JiraProvider } from './context/JiraContext';
import ConfigModal from './components/ConfigModal';
import Menu from './components/Menu';
import ProjectSelector from "./components/ProjectSelector"
import EpicSelector from './components/EpicSelector';
import StatusFilters from './components/StatusFilters';
import TaskContainer from './components/TaskContainer';
import ShowAllDetailsButton from './components/ShowAllDetailsButton';
import HideAllDetailsButton from './components/HideAllDetailsButton';

const App = () => {
    const [isConfigOpen, setIsConfigOpen] = useState(false);

    const showConfig = () => setIsConfigOpen(true);
    const hideConfig = () => setIsConfigOpen(false);

    return (
        <JiraProvider>
            <div className="app">
                <Menu onShowConfig={showConfig} />
                <ConfigModal isOpen={isConfigOpen} onClose={hideConfig} />
                <ProjectSelector />
                <EpicSelector />
                <StatusFilters />
                <TaskContainer />
                <ShowAllDetailsButton />
                <HideAllDetailsButton />
            </div>
        </JiraProvider>
    );
};

export default App;
