import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { usePageVisibility } from '@/hooks/usePageVisibility';

const LessonPlayer = ({ lesson, onReady, onEnd }) => {
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const isVisible = usePageVisibility();

  const onPlayerReady = (event) => {
    playerRef.current = event.target;
    onReady(event);
    if(event.target && typeof event.target.playVideo === 'function'){
      event.target.playVideo();
    }
  };
  
  useEffect(() => {
    const container = playerContainerRef.current;
    if (container) {
      const preventContext = (e) => e.preventDefault();
      container.addEventListener('contextmenu', preventContext);
      return () => {
        container.removeEventListener('contextmenu', preventContext);
      };
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      const playerState = playerRef.current.getPlayerState();
      if (!isVisible && playerState === 1) { // 1 = playing
        playerRef.current.pauseVideo();
      }
    } else if (playerRef.current && typeof playerRef.current.pause === 'function') { // Native video player
      if (!isVisible && !playerRef.current.paused) {
        playerRef.current.pause();
      }
    }
  }, [isVisible]);

  const renderPlayer = () => {
    if (lesson.video_type === 'youtube') {
      const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
          autoplay: 1,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          controls: 1,
          color: 'white',
          fs: 1,
          disablekb: 0,
          cc_load_policy: 0,
          playsinline: 1,
          autohide: 1,
          origin: typeof window !== 'undefined' ? window.location.origin : '',
          loop: 0,
        },
      };

      return (
        <YouTube
          videoId={lesson.video_id}
          opts={opts}
          onReady={onPlayerReady}
          onEnd={onEnd}
          className="w-full h-full"
          iframeClassName="w-full h-full"
        />
      );
    }

    if (lesson.video_type === 'native' && lesson.video_url) {
      return (
        <video
          ref={playerRef}
          src={lesson.video_url}
          controls
          autoPlay
          playsInline
          onEnded={onEnd}
          onCanPlay={(e) => onReady({ target: e.target })}
          className="w-full h-full"
        >
          Tarayıcınız video etiketini desteklemiyor.
        </video>
      );
    }
    
    return null;
  };

  return (
    <div 
      ref={playerContainerRef}
      className="aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-2 ring-primary/30 relative"
    >
      {renderPlayer()}
      {lesson.video_type === 'youtube' && (
        <div 
          className="absolute top-0 left-0 w-full h-[50px] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)' }}
        ></div>
      )}
    </div>
  );
};

export default LessonPlayer;