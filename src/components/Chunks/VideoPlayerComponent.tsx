import React, { useState, useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

// Интерфейсы
interface VideoSource {
  src: string;
  type: string;
}

interface PlaylistItem {
  sources: VideoSource[];
  poster?: string;
  duration?: number;
}

interface VideoMediaSource {
  init: (player: any) => void;
  // Другие методы VideoMediaSource
}

interface VideoPlayerComponentProps {
  type?: string;
  source?: string | null;
  sources?: VideoSource[];
  playlist?: PlaylistItem[];
  mediaSource?: VideoMediaSource | null;
  cover?: string | null;
  duration?: number | null;
  width?: string;
  height?: string;
  fluid?: boolean;
  fill?: boolean;
  responsive?: boolean;
  controls?: boolean;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  settings?: Record<string, any>;
  onReady?: (player: any) => void;
  onEnded?: (player: any) => void;
  onTimeUpdate?: (player: any) => void;
}

const VideoPlayerComponent: React.FC<VideoPlayerComponentProps> = ({
  type = "video/mp4",
  source = null,
  sources = [],
  playlist = [],
  mediaSource = null,
  cover = null,
  duration = null,
  width = "100%",
  height = "100%",
  fluid = true,
  fill = true,
  responsive = true,
  controls = true,
  autoplay = false,
  muted = false,
  loop = false,
  settings = {},
  onReady,
  onEnded,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const [player, setPlayer] = useState<any>(null);

  // Вычисляемые опции
  const options = {
    language: "ru",
    fill,
    responsive,
    fluid,
    width,
    height,
    controls,
    autoplay,
    muted,
    loop,
    playbackRates: [0.5, 1, 1.5, 2, 3],
    ...(cover ? { poster: cover } : {}),
    ...(duration ? { duration } : {}),
    ...(playlist.length > 0 ? { playlist } : {}),
    ...(sources.length > 0
      ? { sources }
      : source
      ? { sources: [{ type, src: source }] }
      : {}),
    ...settings,
  };

  // Инициализация плеера
  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;

    const playerOptions = Object.assign(
      {},
      {
        liveui: true,
        controls: true,
        autoplay: true,
        preload: "auto",
        responsive: true,
        fluid: true,
      },
      options
    );

    const newPlayer = videojs(videoElement, playerOptions);

    setPlayer(newPlayer);
    playerRef.current = newPlayer;

    // Обработчик готовности
    newPlayer.ready(() => {
      if (onReady) {
        onReady(newPlayer);
      }

      // Регистрация событий
      if (onEnded) {
        newPlayer.on("ended", () => onEnded(newPlayer));
      }

      if (onTimeUpdate) {
        newPlayer.on("timeupdate", () => onTimeUpdate(newPlayer));
      }

      // Инициализация mediaSource
      if (mediaSource) {
        mediaSource.init(newPlayer);
      }
    });

    // Очистка при размонтировании
    return () => {
      if (newPlayer) {
        newPlayer.dispose();
      }
    };
  }, []);

  // Методы для управления плеером
  const setTimePosition = (seconds: number) => {
    if (player) {
      player.currentTime(seconds);
    }
  };

  const playVideoPlaylist = (id: string) => {
    // TODO: реализовать переключение плейлиста
    console.log("Play video playlist:", id);
  };

  // Делаем методы доступными через ref
  useEffect(() => {
    // Добавляем методы в ref для внешнего использования
    if (playerRef.current) {
      playerRef.current.setTimePosition = setTimePosition;
      playerRef.current.playVideoPlaylist = playVideoPlaylist;
    }
  }, [player]);

  return (
    <div className="video-player-component" style={{ height: "100%" }}>
      <video
        ref={videoRef}
        className="video-js vjs-default-skin"
        controls={controls}
        autoPlay={autoplay}
        playsInline
        muted={muted}
        style={{ width, height }}
      />
    </div>
  );
};

export default VideoPlayerComponent;
