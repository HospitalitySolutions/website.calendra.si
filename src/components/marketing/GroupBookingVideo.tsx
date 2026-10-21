import { useEffect, useId, useRef, useState } from "react";
import { Play } from "lucide-react";
import type { SiteLanguage } from "@/lib/site-language";
import "./group-booking-video.css";

const VIDEO_SRC = "/videos/calendra-skupinske-rezervacije.mp4";
const POSTER_SRC = "/videos/calendra-skupinske-rezervacije-poster.webp";

type GroupBookingVideoProps = {
  language: SiteLanguage;
};

/** The MP4 is not mounted or requested until the visitor presses Play. */
const GroupBookingVideo = ({ language }: GroupBookingVideoProps) => {
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const captionId = useId();
  const sl = language === "sl";
  const title = sl ? "Skupinske rezervacije v praksi" : "Group bookings in practice";
  const playLabel = sl
    ? "Predvajaj predstavitev skupinskih rezervacij (2 minuti in 32 sekund)"
    : "Play group bookings demo (Slovenian audio, 2 minutes 32 seconds)";

  useEffect(() => {
    if (!started) return;
    const video = videoRef.current;
    if (!video) return;
    let disposed = false;

    video.focus({ preventScroll: true });
    // This effect runs only after the Play button is activated. If a browser
    // declines programmatic playback, its native controls remain available.
    video.play()?.catch(() => {
      if (!disposed) setPlayBlocked(true);
    });

    return () => {
      disposed = true;
      video.pause();
    };
  }, [started]);

  return (
    <figure className="group-booking-video">
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
            <img
              src={POSTER_SRC}
              width={1920}
              height={1080}
              alt=""
              loading="eager"
              decoding="async"
            />
            <span className="group-booking-video__play" aria-hidden="true">
              <Play />
            </span>
            <span className="group-booking-video__duration" aria-hidden="true">2:32</span>
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
          <strong>{title}</strong>
          <span className="group-booking-video__description">
            {sl
              ? "Oglejte si, kako potekajo prijave in vodenje obiskov."
              : "See how sign-ups and visit tracking work. Slovenian audio."}
          </span>
        </span>
      </figcaption>
    </figure>
  );
};

export default GroupBookingVideo;
