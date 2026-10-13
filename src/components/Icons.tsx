type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  focusable: false,
};

export const PhoneIcon = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const MapPin = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);
export const ShieldDoc = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
export const Hammer = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m15 12-8.4 8.4a2 2 0 0 1-2.8-2.8L12.2 9" />
    <path d="M17.6 15 22 10.6 13.4 2 9 6.4z" />
  </svg>
);
export const Store = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M3 9 4.5 4h15L21 9M3 9h18v0a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0zM5 12v8h14v-8M10 20v-5h4v5" />
  </svg>
);
export const Chat = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M21 12a8 8 0 0 1-11.8 7L3 21l2-6.2A8 8 0 1 1 21 12z" />
  </svg>
);
export const Check = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="m5 12 5 5 9-10" />
  </svg>
);
export const Menu = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const Close = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const Camera = ({ className = "h-6 w-6" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
    <circle cx="12" cy="13" r="3.5" />
  </svg>
);
