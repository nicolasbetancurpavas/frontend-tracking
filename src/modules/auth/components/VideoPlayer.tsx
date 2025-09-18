// VideoPlayer.tsx
import React from "react";

type VideoPlayerProps = {
  src: string;
  poster?: string;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, poster }) => {
  return (
    <video
      src={src}
      autoPlay
      muted
      loop
      playsInline
      controls={false}
      poster={poster}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
  );
};

export default VideoPlayer;
