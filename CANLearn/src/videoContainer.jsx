import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';


const localPool = [
  "/videos/video1.mp4",
  "/videos/video2.mp4",
  "/videos/video3.mp4",
  "/videos/video4.mp4",
  "/videos/video5.mp4"
];

const TikTokPanel = forwardRef((props, ref) => {
  const [videoData, setVideoData] = useState(null);
  const videoRef = useRef(null);

  const getRandomVideo = () => {
    const randomIndex = Math.floor(Math.random() * localPool.length);
    return { video_url: localPool[randomIndex] };
  };

  // This lets App.jsx trigger these specific functions
  useImperativeHandle(ref, () => ({
    togglePlay: () => {
      if (videoRef.current) {
        videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause();
      }
    },

restart: () => {
      const newVideo = getRandomVideo();
      setVideoData(newVideo);

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }
  }));

  useEffect(() => {
    const localPool = ["/videos/video1.mp4", "/videos/video2.mp4", "/videos/video3.mp4"];
    const randomIndex = Math.floor(Math.random() * localPool.length);
    setVideoData({ video_url: localPool[randomIndex] });
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {videoData ? (
        <video 
          ref={videoRef}
          src={videoData.video_url} 
          autoPlay loop muted 
          style={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
});

export default TikTokPanel;