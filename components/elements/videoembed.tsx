import React from "react";
import elements from "../../styles/Elements.module.css";

export const VideoEmbed: React.FC<{ id: string }> = ({ id }) => {
  return (
    <div className={elements.videocontainer}>
      <iframe
        title="video"
        src={`https://www.youtube.com/embed/${id}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
