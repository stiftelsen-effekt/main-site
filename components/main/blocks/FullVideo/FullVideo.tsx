import styles from "./FullVideo.module.scss";
import { SanityAsset } from "@sanity/image-url/lib/types/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "react-feather";

export const FullVideo: React.FC<{ video: SanityAsset; alt: string }> = ({ video, alt }) => {
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const playPause = () => {
    if (!playing) {
      videoPlayerRef.current?.play();
      setPlaying(true);
    } else {
      videoPlayerRef.current?.pause();
      setPlaying(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.videoWrapper}>
        <div className={styles.playbutton} onClick={playPause}>
          {!playing && (
            <div className={styles.playbuttoninner}>
              <Play size={78}></Play>
            </div>
          )}
        </div>

        <VideoProgress videoPlayerRef={videoPlayerRef} playing={playing}></VideoProgress>
        <video
          ref={videoPlayerRef}
          onEnded={() => {
            (videoPlayerRef.current as any).currentTime = 0;
            setPlaying(false);
          }}
          playsInline
        >
          <source src={video.url} type={"video/mp4"}></source>
        </video>
      </div>
      <span className="caption">{alt}</span>
    </div>
  );
};

/**
 * @param progress A number between 0 and 1
 */
const VideoProgress: React.FC<{ videoPlayerRef: any; playing: boolean }> = ({
  videoPlayerRef,
  playing,
}) => {
  const [progress, setProgress] = useState(0);
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (playing) setCurrentFrame(requestAnimationFrame(updateProgress));
    else cancelAnimationFrame(currentFrame);
  }, [playing, setCurrentFrame]);

  const updateProgress = useCallback(() => {
    setProgress(videoPlayerRef.current?.currentTime / videoPlayerRef.current?.duration);
    requestAnimationFrame(updateProgress);
  }, [setProgress, videoPlayerRef]);

  return <div className={styles.videoProgressBar} style={{ width: `${progress * 100}%` }}></div>;
};
