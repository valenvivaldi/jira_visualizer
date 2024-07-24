import React from 'react';

const Menu = ({ onShowConfig }) => {
    return (
        <div className="menu">
            <button onClick={onShowConfig}>Configurar</button>
            {/* Aquí puedes agregar más botones o elementos del menú si es necesario */}
        </div>
    );
};

export default Menu;
