import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

import { 
  faHome, 
  faPlay, 
  faPause, 
  faClipboardList 
} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [count, setCount] = useState(0)
 
  return (
    <div className="main-page-container">
      {/* Top Panel */}
      <div className="content-panel top-panel">
        {/* Placeholder Content */}
        <h2>Upper Content Area</h2>
      </div>

      {/* Floating Navigation Bar */}
      <nav className="floating-navbar">
        <button className="nav-item" onClick={() => console.log('Home Clicked')}>
          <FontAwesomeIcon icon={faHome} />
        </button>
        <button className="nav-item" onClick={() => console.log('Play Clicked')}>
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button className="nav-item" onClick={() => console.log('Pause Clicked')}>
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button className="nav-item" onClick={() => console.log('Tasks Clicked')}>
          <FontAwesomeIcon icon={faClipboardList} />
        </button>
      </nav>

      {/* Bottom Panel */}
      <div className="content-panel bottom-panel">
        {/* Placeholder Content */}
        <h2>Lower Content Area</h2>
      </div>
    </div>
  );
}

export default App
