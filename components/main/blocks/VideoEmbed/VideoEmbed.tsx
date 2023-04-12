import React, { useRef, useState } from "react";
import elements from "./VideoEmbed.module.scss";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { ResponsiveImage } from "../../../shared/responsiveimage";
import YouTube from "react-youtube";

export const VideoEmbed: React.FC<{ id: string; thumbnail: SanityImageSource }> = ({
  id,
  thumbnail,
}) => {
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [videoTarget, setVideoTarget] = useState<any>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onVideoReady = (event: any) => {
    setVideoTarget(event.target);
  };

  return (
    <div className={elements.videocontainer}>
      {showThumbnail && thumbnail && (
        <div
          className={elements.thumbnail}
          onClick={() => {
            if (videoTarget) {
              setShowThumbnail(false);
              videoTarget.playVideo();
            }
          }}
        >
          <ResponsiveImage image={thumbnail} layout={"fill"} />
        </div>
      )}
      <YouTube
        videoId={id}
        opts={{ playerVars: { color: "white" }, width: "auto", height: "auto" }}
        iframeClassName={elements.videoinnercontainer}
        onReady={onVideoReady}
      />
    </div>
  );
};
