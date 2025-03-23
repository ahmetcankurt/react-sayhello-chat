import React, { useState } from 'react';
import "./DropdownMenu.css"

function App() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="app">
      <button className="dropdown-toggle" onClick={toggleDropdown}>
        Menü
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <ul>
            <li>Seçenek 1</li>
            <li>Seçenek 2</li>
            <li>Seçenek 3</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
