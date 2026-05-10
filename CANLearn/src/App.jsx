import { useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPause, faSync } from '@fortawesome/free-solid-svg-icons';
import TikTokPanel from './videoContainer';
import QuizPanel from './QuizPanel';
import './App.css'

function App() {
  // This ref acts like a remote control for the video component
  const videoControlRef = useRef(null);

  return (
    <div className="main-page-container">
      <div className="logo-container">
        <p className="logo-text">
          <span className="can">CAN</span><span className="learn">Learn</span>
        </p>
      </div>

      <div className="panels-wrapper">
        <div className="content-panel top-panel">
          {/* We pass the ref to the video container here */}
          <TikTokPanel ref={videoControlRef} />
        </div>

        <div className="content-panel bottom-panel">
          <QuizPanel />
        </div>
      </div>

      {/* Floating Navbar with only the 2 buttons you need */}
      <div className="floating-navbar">
        <button className="nav-item" onClick={() => videoControlRef.current?.togglePlay()}>
          <FontAwesomeIcon icon={faPause} />
        </button>
        <button className="nav-item" onClick={() => videoControlRef.current?.restart()}>
          <FontAwesomeIcon icon={faSync} />
        </button>
      </div>
    </div>
  );
}

export default App;