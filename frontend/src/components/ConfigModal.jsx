import React, { useContext, useState } from 'react';
import { JiraContext } from '../context/JiraContext';

const ConfigModal = ({ isOpen, onClose }) => {
    const { config, setConfig } = useContext(JiraContext);
    const [localConfig, setLocalConfig] = useState(config);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLocalConfig(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        setConfig(localConfig);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Configuración</h2>
                <label htmlFor="jiraUser">Usuario de Jira:</label>
                <input type="text" id="jiraUser" name="jiraUser" value={localConfig.jiraUser} onChange={handleChange} />
                <label htmlFor="jiraToken">Token de Jira:</label>
                <input type="password" id="jiraToken" name="jiraToken" value={localConfig.jiraToken} onChange={handleChange} />
                <label htmlFor="modeSelector">Modo:</label>
                <select id="modeSelector" name="mode" value={localConfig.mode} onChange={handleChange}>
                    <option value="demo">Demo</option>
                    <option value="production">Producción</option>
                </select>
                <button onClick={handleSave}>Guardar</button>
            </div>
        </div>
    );
};

export default ConfigModal;
