import type { CSSProperties } from "react";
import type { PreviewDevice } from "./ProductZoomLightbox";

type Language = "sl" | "en";
type Feature = {
  id: string;
  x: number;
  y: number;
  arrow: string;
  accent: string;
  lines: Record<Language, string[]>;
  description: Record<Language, string>;
};

const desktop: Feature[] = [
  {
    id: "dates", x: 75, y: 111,
    arrow: "M 215 125 C 256 140, 280 177, 320 256",
    accent: "M 73 124 Q 128 132 212 120",
    lines: { sl: ["Menjava datumov"], en: ["Change dates"] },
    description: {
      sl: "Hitro se premaknite na drug datum.",
      en: "Quickly move to another date.",
    },
  },
  {
    id: "employees", x: 485, y: 87,
    arrow: "M 621 103 C 633 136, 682 170, 757 287",
    accent: "M 483 99 Q 556 108 655 97",
    lines: { sl: ["Več zaposlenih"], en: ["Multiple employees"] },
    description: {
      sl: "Spremljajte urnike več članov ekipe hkrati.",
      en: "View several team members' schedules at once.",
    },
  },
  {
    id: "rooms", x: 907, y: 91,
    arrow: "M 1006 110 Q 1080 142 1077 250",
    accent: "M 903 105 Q 955 112 1049 102",
    lines: { sl: ["Več prostorov"], en: ["Multiple rooms"] },
    description: {
      sl: "Rezervacije in razpoložljivost različnih prostorov.",
      en: "Manage reservations and room availability.",
    },
  },
  {
    id: "views", x: 1207, y: 128,
    arrow: "M 1281 147 C 1280 190, 1268 219, 1188 256",
    accent: "M 1205 141 Q 1309 146 1432 137",
    lines: { sl: ["Dan / teden", "/ mesec"], en: ["Day / week", "/ month"] },
    description: {
      sl: "Preklopite med različnimi pogledi koledarja.",
      en: "Switch between calendar views.",
    },
  },
  {
    id: "groups", x: 75, y: 765,
    arrow: "M 252 731 C 311 708, 331 589, 438 474",
    accent: "M 73 801 Q 176 814 316 797",
    lines: { sl: ["Skupinski termini", "npr. 7/10 mest"], en: ["Group bookings", "e.g. 7/10 places"] },
    description: {
      sl: "Že v koledarju vidite število prijavljenih in največjo kapaciteto.",
      en: "See booked places and maximum capacity directly in the calendar.",
    },
  },
  {
    id: "overview", x: 710, y: 809,
    arrow: "M 840 772 C 836 709, 813 665, 756 590",
    accent: "M 707 820 Q 840 830 1088 811",
    lines: { sl: ["Pregleden koledar", "terminov"], en: ["Clear appointment", "overview"] },
    description: {
      sl: "Barvno označeni termini omogočajo hiter pregled dneva.",
      en: "Colour-coded bookings make the schedule easier to scan.",
    },
  },
];

const mobile: Feature[] = [
  {
    id: "dates", x: 46, y: 129,
    arrow: "M 222 133 C 275 124, 339 102, 458 111",
    accent: "M 45 166 Q 111 176 247 160",
    lines: { sl: ["Hitra menjava", "datumov"], en: ["Quick date", "navigation"] },
    description: {
      sl: "Datum izberete tudi v mobilnem pogledu.",
      en: "Pick another date in the mobile calendar.",
    },
  },
  {
    id: "notifications", x: 742, y: 104,
    arrow: "M 816 149 Q 783 82 669 108",
    accent: "M 739 142 Q 820 149 1008 139",
    lines: { sl: ["Obvestila o novih", "rezervacijah"], en: ["New booking", "notifications"] },
    description: {
      sl: "Obvestila o novih rezervacijah na napravi, ko so omogočena.",
      en: "Booking notifications on your device when enabled.",
    },
  },
  {
    id: "employees", x: 42, y: 354,
    arrow: "M 252 369 C 332 366, 350 245, 489 238",
    accent: "M 43 388 Q 137 396 270 381",
    lines: { sl: ["Vsa ekipa", "na enem mestu"], en: ["Your whole team", "at a glance"] },
    description: {
      sl: "Na enem zaslonu vidite termine različnih zaposlenih.",
      en: "Check bookings for different team members.",
    },
  },
  {
    id: "mobile-overview", x: 748, y: 433,
    arrow: "M 762 453 Q 734 477 701 504",
    accent: "M 746 472 Q 837 481 1030 467",
    lines: { sl: ["Urnik vedno", "pri roki"], en: ["Calendar", "on the go"] },
    description: {
      sl: "Pregled terminov tudi med delom na poti.",
      en: "Check your schedule wherever you work.",
    },
  },
  {
    id: "capacity", x: 34, y: 676,
    arrow: "M 270 665 C 356 638, 414 563, 485 504",
    accent: "M 32 710 Q 150 719 282 701",
    lines: { sl: ["Skupinske vadbe", "npr. 7/10 mest"], en: ["Group classes", "e.g. 7/10 places"] },
    description: {
      sl: "Vidna sta zasedenost in največje število udeležencev.",
      en: "See booked places and maximum class capacity.",
    },
  },
  {
    id: "spaces", x: 744, y: 753,
    arrow: "M 765 773 C 729 802, 689 823, 650 797",
    accent: "M 744 791 Q 819 800 936 786",
    lines: { sl: ["Filtri za prostore"], en: ["Room filters"] },
    description: {
      sl: "Preklapljajte med prostori v mobilnem koledarju.",
      en: "Switch between rooms in the mobile calendar.",
    },
  },
];

const specs: Record<PreviewDevice, { viewBox: string; features: Feature[] }> = {
  desktop: { viewBox: "0 0 1480 850", features: desktop },
  mobile: { viewBox: "0 0 1080 880", features: mobile },
};

type Props = {
  device: PreviewDevice;
  language: Language;
  visible: boolean;
};

/**
 * Purely illustrative feature callouts layered around the existing screenshots.
 * Position coordinates share the same viewBox as the responsive CSS scene.
 * The accessible list doubles as a readable fallback on small viewports.
 */
export default function ProductZoomAnnotations({ device, language, visible }: Props) {
  const { features, viewBox } = specs[device];
  const arrowId = `product-zoom-arrow-${device}`;
  return (
    <>
      <svg
        className="product-zoom-annotation-svg"
        viewBox={viewBox}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
        data-testid={`feature-arrows-${device}`}
      >
        <defs>
          <marker id={arrowId} viewBox="0 0 12 12" refX="10.5" refY="6" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
            <path d="M 2 2 L 10 6 L 2 10" fill="none" stroke="#74baff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
        {features.map((feature, index) => (
          <g className="product-zoom-annotation" style={{ "--annotation-index": index } as CSSProperties} key={feature.id}>
            <path d={feature.arrow} className="product-zoom-sketched-arrow" markerEnd={`url(#${arrowId})`} />
            <text x={feature.x} y={feature.y} className="product-zoom-handwriting">
              {feature.lines[language].map((line, lineIndex) => (
                <tspan key={lineIndex} x={feature.x} dy={lineIndex === 0 ? 0 : 32}>{line}</tspan>
              ))}
            </text>
            <path d={feature.accent} className="product-zoom-accent-scribble" />
          </g>
        ))}
      </svg>
      <div
        className={`product-zoom-feature-list${visible ? "" : " product-zoom-feature-list-hidden"}`}
        aria-hidden={!visible}
      >
        <p className="product-zoom-feature-list-title">
          {language === "sl" ? "Kaj lahko počnete v Calendri?" : "What can you do in Calendra?"}
        </p>
        <ul>
          {features.map((feature) => (
            <li key={feature.id}>
              <strong>{feature.lines[language].join(" ")}</strong>
              <span>{feature.description[language]}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
