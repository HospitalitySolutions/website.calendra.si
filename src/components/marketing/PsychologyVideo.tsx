import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { SiteLanguage } from "@/lib/site-language";
import "./group-booking-video.css";

const VIDEO_SRC = "/videos/calendra-svetovanje.mp4";
const POSTER_SRC = "/videos/calendra-svetovanje-poster.webp";

/** Keep the actual video out of the initial HTML; load it only on user interaction. */
const PsychologyVideo = ({ language }: { language: SiteLanguage }) => {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionId = useId();
  const sl = language === "sl";
  const playLabel = sl
    ? "Predvajaj predstavitev Calendra za psihološko prakso (1 minuta 50 sekund)"
    : "Play the Calendra psychology demo (Slovenian audio, 1 minute 50 seconds)";

  useEffect(() => {
    if (!started) return;
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;
    video.focus({ preventScroll: true });
    video.play()?.catch(() => {
      if (!disposed) setPlayBlocked(true);
    });
    return () => {
      disposed = true;
      video.pause();
    };
  }, [started]);

  return (
    <figure className="group-booking-video psychology-video">
      <div className="group-booking-video__frame">
        {started ? (
          <video
            ref={videoRef}
            className="group-booking-video__player"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            controls
            playsInline
            preload="none"
            tabIndex={0}
            aria-label={playLabel}
            aria-describedby={captionId}
            onPlay={() => setPlayBlocked(false)}
            onError={() => setFailed(true)}
          >
            {sl ? "Vaš brskalnik ne podpira predvajanja videoposnetkov." : "Your browser does not support video playback."}
          </video>
        ) : (
          <button
            type="button"
            className="group-booking-video__poster"
            aria-label={playLabel}
            aria-describedby={captionId}
            onClick={() => setStarted(true)}
          >
            <img src={POSTER_SRC} width={1280} height={720} alt="" loading="eager" decoding="async" />
            <span className="group-booking-video__play" aria-hidden="true"><Play /></span>
            <span className="group-booking-video__duration" aria-hidden="true">1:50</span>
          </button>
        )}
      </div>
      {failed ? (
        <p className="group-booking-video__notice" role="alert">
          {sl ? "Videoposnetka trenutno ni mogoče predvajati. " : "This video could not be played. "}
          <a href={VIDEO_SRC} target="_blank" rel="noopener noreferrer">
            {sl ? "Odprite video v novem zavihku." : "Open the video in a new tab."}
          </a>
        </p>
      ) : playBlocked ? (
        <p className="group-booking-video__notice" role="status">
          {sl ? "Za začetek uporabite gumb za predvajanje v videu." : "Use the video's play control to start watching."}
        </p>
      ) : null}
      <figcaption id={captionId} className="group-booking-video__caption">
        <span className="group-booking-video__caption-icon" aria-hidden="true"><Play /></span>
        <span>
          <strong>{sl ? "Oglejte si, kako Calendra pomaga v psihološki praksi" : "See how Calendra helps psychology practices"}</strong>
          <span className="group-booking-video__description">
            {sl ? "Kratek pregled ključnih funkcionalnosti v manj kot 2 minutah." : "A quick overview of key features in under 2 minutes. Slovenian audio."}
          </span>
        </span>
      </figcaption>
    </figure>
  );
};

export default PsychologyVideo;
