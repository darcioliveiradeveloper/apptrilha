import type { Mood } from "../lib";

type P = { className?: string };

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconFoot = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M9.3 3.6c1.6-.3 2.8 1 3 3 .2 1.7-.4 3.1-1.9 3.4-1.5.3-2.7-.9-3-2.8-.3-1.8.3-3.3 1.9-3.6Zm1 8.1c1-.2 1.9.5 2 1.5l.3 1.9c.1 1-.6 1.9-1.6 2.1s-1.9-.5-2-1.5l-.3-1.9c-.1-1 .6-1.9 1.6-2.1Z" />
    <path d="M14.7 8.6c-1.6-.3-2.9 1-3.1 3-.2 1.7.4 3.1 1.9 3.4 1.5.3 2.7-.9 3-2.8.3-1.8-.3-3.3-1.8-3.6Zm-1.1 8.1c-1-.2-1.9.5-2 1.5l-.3 1.9c-.1 1 .6 1.9 1.6 2.1s1.9-.5 2-1.5l.3-1.9c.1-1-.6-1.9-1.6-2.1Z" opacity=".72" />
  </svg>
);

export const IconHome = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M4 11.2 12 4.5l8 6.7" />
    <path d="M6 9.8V19a1 1 0 0 0 1 1h3.2v-4.6a1.8 1.8 0 0 1 3.6 0V20H17a1 1 0 0 0 1-1V9.8" />
  </svg>
);

export const IconList = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="12" r="8.2" />
    <path d="M12 7.6V12l3 2.2" />
    <path d="M19.5 5.5 21 7l-1.5 1.5" opacity=".7" />
  </svg>
);

export const IconTarget = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="12" r="8.2" />
    <circle cx="12" cy="12" r="4.4" />
    <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

export const IconTrophy = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M8 4h8v6a4 4 0 0 1-8 0V4Z" />
    <path d="M8 5.5H5.2a2.9 2.9 0 0 0 3 3.6M16 5.5h2.8a2.9 2.9 0 0 1-3 3.6" />
    <path d="M12 14v3m-3.4 3h6.8M9.5 17h5l.6 3H8.9l.6-3Z" />
  </svg>
);

export const IconFlame = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M12.6 3.2c.3 2.6 1.5 4 2.9 5.5 1.4 1.6 2.6 3.2 2.6 5.4a6.1 6.1 0 0 1-12.2 0c0-2 .8-3.5 1.9-4.9.5-.6 1.5-.3 1.6.5.1.7.3 1.3.8 1.7-.2-2.9.7-6.3 2.4-8.2Zm-.6 15.9a2.6 2.6 0 0 0 2.6-2.6c0-1.2-.8-2-1.5-2.8-.4-.5-1.2-.4-1.5.2-.3.6-.7 1.1-1.2 1.5-.6.5-1 .9-1 1.9a2.6 2.6 0 0 0 2.6 2.6Z" />
  </svg>
);

export const IconPlay = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M8.5 5.9c0-1 1.1-1.6 2-1.1l9 5.3c.9.5.9 1.8 0 2.3l-9 5.3c-.9.5-2-.1-2-1.1V5.9Z" />
  </svg>
);

export const IconPause = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <rect x="6.5" y="5" width="4" height="14" rx="1.4" />
    <rect x="13.5" y="5" width="4" height="14" rx="1.4" />
  </svg>
);

export const IconFlag = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M6 21V4.5" />
    <path d="M6 5h11l-2.4 3.5L17 12H6" fill="currentColor" stroke="none" opacity=".9" />
    <path d="M6 5h11l-2.4 3.5L17 12H6" />
  </svg>
);

export const IconPin = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M12 21s-6.5-5.4-6.5-10.3a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" />
    <circle cx="12" cy="10.5" r="2.3" />
  </svg>
);

export const IconTrash = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M5 7h14M10 7V5.4A1.4 1.4 0 0 1 11.4 4h1.2A1.4 1.4 0 0 1 14 5.4V7" />
    <path d="M6.5 7l.8 12a1.6 1.6 0 0 0 1.6 1.5h6.2a1.6 1.6 0 0 0 1.6-1.5l.8-12" />
    <path d="M10 11v6m4-6v6" opacity=".7" />
  </svg>
);

export const IconPlus = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.4} aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconX = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.2} aria-hidden>
    <path d="m6 6 12 12M18 6 6 18" />
  </svg>
);

export const IconCheck = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} strokeWidth={2.4} aria-hidden>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </svg>
);

export const IconChevronR = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
  </svg>
);

export const IconBolt = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M13.2 2.6 5.6 13.4c-.4.6 0 1.4.7 1.4h4l-1.4 6c-.2.9.9 1.4 1.4.7l7.7-10.8c.4-.6 0-1.4-.7-1.4h-4l1.3-6c.2-.9-.9-1.4-1.4-.7Z" />
  </svg>
);

export const IconMountain = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="m3 19 6-10 3.2 5.3L14.5 11l6.5 8H3Z" />
    <path d="m9 9 1.5-2.5L12 9" opacity=".7" />
  </svg>
);

export const IconStar = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="m12 3 2.5 5.4 5.9.7-4.4 4 1.2 5.8L12 16l-5.2 2.9 1.2-5.8-4.4-4 5.9-.7L12 3Z" />
  </svg>
);

export const IconSunrise = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M12 3v3M5.2 6.2 7 8m11.8-1.8L17 8M3 15h2m14 0h2" />
    <path d="M7.5 15a4.5 4.5 0 0 1 9 0" />
    <path d="M4 18.5h16" opacity=".7" />
  </svg>
);

export const IconMedal = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="14.5" r="5" />
    <path d="m8.8 3.5 2 4.6m4.4-4.6-2 4.6M8.8 3.5H6l3 6.6m9.2-6.6H18l-3 6.6" />
    <path d="m12 12.4.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3.9-1.8Z" fill="currentColor" stroke="none" opacity=".85" />
  </svg>
);

export const IconMoon = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="M19.5 14.2A8 8 0 0 1 9.8 4.5a8 8 0 1 0 9.7 9.7Z" />
  </svg>
);

export const IconNote = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M7 4h10a1.5 1.5 0 0 1 1.5 1.5v13A1.5 1.5 0 0 1 17 20H7a1.5 1.5 0 0 1-1.5-1.5v-13A1.5 1.5 0 0 1 7 4Z" />
    <path d="M9 9h6M9 12.5h6M9 16h3.5" opacity=".75" />
  </svg>
);

export const IconTimer = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <circle cx="12" cy="13.5" r="7.2" />
    <path d="M12 9.8v3.7l2.6 1.8M9.5 3h5M12 3v3.3" />
  </svg>
);

export const IconDownload = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <path d="M12 4v10m0 0 4.2-4.2M12 14 7.8 9.8" />
    <path d="M5 17.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-.5" opacity=".7" />
  </svg>
);

export const IconCopy = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <rect x="9" y="9" width="10.5" height="11" rx="2" />
    <path d="M6.2 15H5.6A1.6 1.6 0 0 1 4 13.4v-7.8A1.6 1.6 0 0 1 5.6 4h7.8A1.6 1.6 0 0 1 15 5.6v.6" opacity=".7" />
  </svg>
);

export const IconTerminal = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...S} aria-hidden>
    <rect x="3.5" y="5" width="17" height="14" rx="2.4" />
    <path d="m7.5 10 3 2.4-3 2.4M12.8 15.2H16" />
  </svg>
);

/* ---------- humor ---------- */

const MOOD_COLOR: Record<Mood, string> = {
  otimo: "#e8a400",
  bem: "#2e7d55",
  neutro: "#7a8b80",
  cansado: "#c77b3a",
  ruim: "#c2483c",
};

export function MoodFace({ mood, className }: { mood: Mood; className?: string }) {
  const c = MOOD_COLOR[mood];
  const eyes =
    mood === "otimo" ? (
      <>
        <path d="M7.6 10c.5-.9 1.9-.9 2.4 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
        <path d="M14 10c.5-.9 1.9-.9 2.4 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
      </>
    ) : (
      <>
        <circle cx="8.8" cy="9.8" r="1.05" fill={c} />
        <circle cx="15.2" cy="9.8" r="1.05" fill={c} />
      </>
    );
  const mouth = {
    otimo: <path d="M7.5 13.2c1.2 2.2 7.8 2.2 9 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    bem: <path d="M8.4 13.6c1 1.4 6.2 1.4 7.2 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    neutro: <path d="M8.6 14.4h6.8" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    cansado: <path d="M8.4 15c1.2-.9 6-1 7.2 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
    ruim: <path d="M8.2 15.6c1-1.7 6.6-1.7 7.6 0" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />,
  }[mood];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <circle cx="12" cy="12" r="9.2" fill={c} opacity=".16" />
      <circle cx="12" cy="12" r="9.2" fill="none" stroke={c} strokeWidth="1.6" opacity=".55" />
      {eyes}
      {mouth}
      {mood === "otimo" && <path d="m18.6 4.6.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5.5-1.3Z" fill={c} />}
      {mood === "cansado" && <path d="M17.5 16.5c.9.3 1.6.9 2 1.8" stroke={c} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity=".8" />}
    </svg>
  );
}

export function AchievementIcon({ icon, className }: { icon: "foot" | "flame" | "star" | "bolt" | "mountain" | "sunrise" | "medal" | "moon"; className?: string }) {
  switch (icon) {
    case "foot": return <IconFoot className={className} />;
    case "flame": return <IconFlame className={className} />;
    case "star": return <IconStar className={className} />;
    case "bolt": return <IconBolt className={className} />;
    case "mountain": return <IconMountain className={className} />;
    case "sunrise": return <IconSunrise className={className} />;
    case "medal": return <IconMedal className={className} />;
    case "moon": return <IconMoon className={className} />;
  }
}
