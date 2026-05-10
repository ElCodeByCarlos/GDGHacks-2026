import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faSync } from '@fortawesome/free-solid-svg-icons';

const TikTokPanel = () => {
  const [videoData, setVideoData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef(null);

  const USE_LIVE_API = false;

  const fetchRandomVideo = async () => {

    if (!USE_LIVE_API) {
      console.log("API call blocked to save tokens. Set USE_LIVE_API to true to fetch.");
      return;
    }

    const options = {
      method: 'GET',
      url: 'https://tiktok-random-video-generator.p.rapidapi.com/random',
      headers: {
        'X-RapidAPI-Key': 'ebcbd71415mshdf0b35b36a8f245p1a13efjsn9ed96b7aa75', // Replace with your key
        'X-RapidAPI-Host': 'tiktok-random-video-generator.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setVideoData(response.data);
      setIsPlaying(true);
    } catch (error) {
      console.error("Error fetching brainrot:", error);
    }
  };

  useEffect(() => {
    //fetchRandomVideo();
    if(USE_LIVE_API)
    {
        fetchRandomVideo();
    }
    else {
       
       const localPool = [
        "/videos/video1.mp4",
        "/videos/video2.mp4",
        "/videos/video3.mp4",
        "/videos/video4.mp4",
        "/videos/video5.mp4"
       ];
       const randomIndex = Math.floor(Math.random() * localPool.length);

       setVideoData({video_url: localPool[randomIndex]});
    }
    }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="content-panel">
      {videoData ? (
        <video 
          ref={videoRef}
          src={videoData.video_url} 
          autoPlay 
          loop 
          muted 
          className="background-video"
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      ) : (
        <p>Loading Brainrot...</p>
      )}

      {/* This navbar connects to your design layout */}
      <nav className="floating-navbar">
        <button className="nav-item" onClick={togglePlay}>
          <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
        </button>
        <button className="nav-item" onClick={fetchRandomVideo}>
          <FontAwesomeIcon icon={faSync} />
        </button>
      </nav>
    </div>
  );
};

export default TikTokPanel;