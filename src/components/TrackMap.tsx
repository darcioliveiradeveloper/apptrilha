import type { TrackPoint } from "../lib";
import { IconPin } from "./Icons";

function normalize(points: TrackPoint[]): { x: number; y: number }[] {
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const dLat = maxLat - minLat || 1e-6;
  const dLon = maxLon - minLon || 1e-6;
  // projeta e ajusta proporção (lat/lon ≈ 1.4 em altitudes brasileiras)
  const W = 100, H = 100;
  const spread = Math.max(dLon, dLat * 1.15);
  return points.map((p) => ({
    x: ((p.lon - minLon) / spread) * W + (W - (dLon / spread) * W) / 2,
    y: H - (((p.lat - minLat) / spread) * H + (H - (dLat / spread) * H) / 2),
  }));
}

export function TrackMap({ points }: { points: TrackPoint[] }) {
  const pts = normalize(points);
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = pts[pts.length - 1];

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[1.4rem] border border-line bg-pine-50">
      <svg viewBox="0 0 100 100" className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="track-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2e7d55" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#2e7d55" stopOpacity="0" />
          </linearGradient>
        </defs>
        {pts.length > 1 && (
          <>
            <path d={`${line} L${last!.x},100 L${pts[0].x},100 Z`} fill="url(#track-fill)" />
            <path
              d={line}
              fill="none"
              stroke="#1f6344"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
        {pts.length >= 1 && (
          <>
            <circle cx={pts[0].x} cy={pts[0].y} r="2.2" fill="#ff6b3d" />
            <circle cx={last.x} cy={last.y} r="1.8" fill="#0c2b1e" />
          </>
        )}
      </svg>
      <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-inksoft backdrop-blur">
        <IconPin className="h-3 w-3 text-ember-500" /> deslocamento
      </span>
      {pts.length < 2 && (
        <span className="absolute inset-0 grid place-items-center text-xs font-bold text-inksoft">
          Movimento insuficiente — continue caminhando
        </span>
      )}
    </div>
  );
}
