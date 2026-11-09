const pen = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function Picture({ children }) {
  return (
    <svg viewBox="0 0 160 112" className="art" aria-hidden="true" focusable="false">
      {children}
    </svg>
  );
}

function r1(value) {
  return Math.round(value * 10) / 10;
}

function Arrow({ x1, y1, x2, y2, dashed = false }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * 9;
  const by = y2 - uy * 9;
  const px = -uy * 5.5;
  const py = ux * 5.5;
  return (
    <g>
      <path
        {...pen}
        strokeDasharray={dashed ? "6 5" : undefined}
        d={`M${r1(x1)} ${r1(y1)} L${r1(x2 - ux * 2)} ${r1(y2 - uy * 2)}`}
      />
      <path
        {...pen}
        d={`M${r1(x2)} ${r1(y2)} L${r1(bx + px)} ${r1(by + py)} M${r1(x2)} ${r1(y2)} L${r1(bx - px)} ${r1(by - py)}`}
      />
    </g>
  );
}

function Dot({ cx, cy, r = 3 }) {
  return <circle cx={cx} cy={cy} r={r} fill="currentColor" stroke="none" />;
}

function Doc({ x, y, w = 40, h = 52, lines = 3, dashed = false, opacity = 1 }) {
  const fold = Math.min(11, Math.round(w * 0.26));
  const outline = `M${x} ${y}h${w - fold}l${fold} ${fold}v${h - fold}h${-w}z`;
  const marks = [];
  for (let i = 0; i < lines; i += 1) {
    const ly = y + fold + 8 + i * 8;
    if (ly > y + h - 7) break;
    const lw = Math.max(8, w - 16 - (i === lines - 1 ? 8 : 0));
    marks.push(<path key={i} {...pen} opacity="0.72" d={`M${x + 7} ${ly}h${lw}`} />);
  }
  return (
    <g opacity={opacity}>
      <path d={outline} fill="currentColor" stroke="none" opacity="0.14" />
      <path {...pen} d={outline} strokeDasharray={dashed ? "5 4" : undefined} />
      <path {...pen} d={`M${x + w - fold} ${y}v${fold}h${fold}`} />
      {marks}
    </g>
  );
}

function Block({ x, y, w = 28, h = 34, opacity = 1 }) {
  return (
    <g opacity={opacity}>
      <rect x={x} y={y} width={w} height={h} rx="5" fill="currentColor" stroke="none" opacity="0.14" />
      <rect {...pen} x={x} y={y} width={w} height={h} rx="5" />
    </g>
  );
}

function Strip({ x, y, w = 28 }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="10" rx="3" fill="currentColor" stroke="none" opacity="0.16" />
      <rect {...pen} x={x} y={y} width={w} height="10" rx="3" />
    </g>
  );
}

function Check({ x, y }) {
  return <path {...pen} d={`M${x} ${y} l6 7 16-18`} />;
}

function Cross({ x, y, s = 7 }) {
  return <path {...pen} d={`M${x - s} ${y - s} l${s * 2} ${s * 2} M${x + s} ${y - s} l${-s * 2} ${s * 2}`} />;
}

function Clock({ cx, cy, r = 16 }) {
  return (
    <g>
      <circle {...pen} cx={cx} cy={cy} r={r} />
      <path {...pen} d={`M${cx} ${cy} V${cy - r + 5} M${cx} ${cy} H${cx + r - 6}`} />
    </g>
  );
}

function Padlock({ x, y, w = 32 }) {
  const shackle = w * 0.62;
  const left = x + (w - shackle) / 2;
  const radius = shackle / 2;
  const bodyY = y + radius + 6;
  const bodyH = w * 0.72;
  return (
    <g>
      <rect x={x} y={bodyY} width={w} height={bodyH} rx="4" fill="currentColor" stroke="none" opacity="0.14" />
      <path {...pen} d={`M${left} ${bodyY + 2}v-6a${radius} ${radius} 0 0 1 ${shackle} 0v6`} />
      <rect {...pen} x={x} y={bodyY} width={w} height={bodyH} rx="4" />
      <Dot cx={x + w / 2} cy={bodyY + bodyH * 0.48} r={2.2} />
    </g>
  );
}

function Rack({ x, y, w = 46, h = 56, dim = false }) {
  return (
    <g opacity={dim ? 0.45 : 1}>
      <rect x={x} y={y} width={w} height={h} rx="6" fill="currentColor" stroke="none" opacity="0.12" />
      <rect {...pen} x={x} y={y} width={w} height={h} rx="6" />
      <path {...pen} d={`M${x} ${y + h / 3}h${w}M${x} ${y + (2 * h) / 3}h${w}`} />
      <Dot cx={x + 8} cy={y + h / 6} r={2.1} />
      <Dot cx={x + 8} cy={y + h / 2} r={2.1} />
      <Dot cx={x + 8} cy={y + (5 * h) / 6} r={2.1} />
    </g>
  );
}

function Cloud({ x, y }) {
  const d = "M8 22c0-7 6-12 13-10 2-6 12-7 16-2 7-2 14 4 12 11 6 2 7 12 0 15H16c-7 0-12-6-8-14z";
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={d} fill="currentColor" stroke="none" opacity="0.14" />
      <path {...pen} d={d} />
    </g>
  );
}

function Gate({ x, y }) {
  return (
    <g>
      <path {...pen} d={`M${x} ${y + 56} V${y + 24} a24 24 0 0 1 48 0 v32`} />
      <path {...pen} d={`M${x + 16} ${y + 56} v-18 h16 v18`} />
    </g>
  );
}

function Pin({ x, y }) {
  return (
    <g transform={`translate(${x - 12} ${y})`}>
      <path {...pen} d="M12 21s7-7.2 7-12.4A7 7 0 0 0 5 8.6C5 13.8 12 21 12 21z" />
      <Dot cx="12" cy="8.5" r="2.4" />
    </g>
  );
}

function Key({ x, y }) {
  return (
    <g>
      <circle {...pen} cx={x} cy={y} r="9" />
      <path {...pen} d={`M${x + 8} ${y} h26 M${x + 24} ${y} v7 M${x + 32} ${y} v7`} />
    </g>
  );
}

function Glass({ x, y, r = 16 }) {
  return (
    <g>
      <circle {...pen} cx={x} cy={y} r={r} />
      <path {...pen} d={`M${x + r * 0.7} ${y + r * 0.7} l${r * 0.9} ${r * 0.9}`} />
    </g>
  );
}

function Cert({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="40" height="52" rx="4" fill="currentColor" stroke="none" opacity="0.12" />
      <rect {...pen} x={x} y={y} width="40" height="52" rx="4" />
      <path {...pen} opacity="0.75" d={`M${x + 8} ${y + 12} h24 M${x + 8} ${y + 20} h16`} />
      <circle {...pen} cx={x + 20} cy={y + 36} r="7" />
      <path {...pen} d={`M${x + 15} ${y + 42} l5 8 5-8`} />
    </g>
  );
}

function Scribble({ x, y }) {
  return <path {...pen} d={`M${x} ${y} c8 6-6 12 2 18 8 6-6 12 2 18`} />;
}

function Warn({ x, y }) {
  return (
    <g>
      <path {...pen} d={`M${x} ${y + 28} L${x + 16} ${y} L${x + 32} ${y + 28} z`} />
      <path {...pen} d={`M${x + 16} ${y + 11} v8`} />
      <Dot cx={x + 16} cy={y + 23} r={1.6} />
    </g>
  );
}

const SCENES = {
  100() {
    return (
      <Picture>
        <Doc x={20} y={32} w={34} h={44} lines={2} />
        <Arrow x1={60} y1={56} x2={88} y2={56} />
        <Doc x={96} y={24} w={42} h={60} lines={4} />
      </Picture>
    );
  },
  101() {
    return (
      <Picture>
        <Doc x={16} y={32} w={34} h={46} lines={2} />
        <Arrow x1={56} y1={56} x2={82} y2={56} />
        <rect x={92} y={40} width={40} height={32} rx="6" fill="currentColor" stroke="none" opacity="0.12" />
        <rect {...pen} x={92} y={40} width={40} height={32} rx="6" />
        <path {...pen} d="M104 40 v-12 M120 40 v-12" />
      </Picture>
    );
  },
  102() {
    return (
      <Picture>
        <circle {...pen} cx="80" cy="56" r="28" strokeDasharray="7 6" />
        <circle {...pen} cx="80" cy="56" r="8" />
        <Dot cx={80} cy={28} />
        <Dot cx={106} cy={70} />
        <Dot cx={54} cy={70} />
      </Picture>
    );
  },
  103() {
    return (
      <Picture>
        <Doc x={64} y={30} w={46} h={58} lines={3} opacity={0.4} />
        <rect x={24} y={22} width={46} height={16} rx="8" fill="currentColor" stroke="none" opacity="0.14" />
        <rect {...pen} x={24} y={22} width={46} height={16} rx="8" />
        <path {...pen} d="M32 30 h22" />
        <rect {...pen} x={36} y={46} width={40} height={16} rx="8" />
        <path {...pen} d="M44 54 h18" />
      </Picture>
    );
  },
  104() {
    return (
      <Picture>
        <path {...pen} d="M80 92 V68" />
        <path d="M70 58 l10-14 10 14 z" fill="currentColor" stroke="none" opacity="0.18" />
        <path {...pen} d="M70 58 l10-14 10 14 z" />
        <Arrow x1={80} y1={44} x2={80} y2={20} />
      </Picture>
    );
  },
  200() {
    return (
      <Picture>
        <circle cx="80" cy="56" r="32" fill="currentColor" stroke="none" opacity="0.14" />
        <circle {...pen} cx="80" cy="56" r="32" />
        <path {...pen} d="M62 57 l12 13 26-28" />
      </Picture>
    );
  },
  201() {
    return (
      <Picture>
        <Doc x={36} y={26} w={48} h={60} lines={3} />
        <circle cx="112" cy="34" r="16" fill="currentColor" stroke="none" opacity="0.14" />
        <circle {...pen} cx="112" cy="34" r="16" />
        <path {...pen} d="M112 26 v16 M104 34 h16" />
      </Picture>
    );
  },
  202() {
    return (
      <Picture>
        <path d="M24 40 h72 v40 H24 z" fill="currentColor" stroke="none" opacity="0.12" />
        <path {...pen} d="M24 40 h72 v40 H24 z" />
        <path {...pen} d="M24 40 l36 22 36-22" />
        <Clock cx={122} cy={72} r={14} />
      </Picture>
    );
  },
  203() {
    return (
      <Picture>
        <Doc x={30} y={20} w={42} h={52} lines={3} />
        <Doc x={68} y={38} w={42} h={52} lines={2} dashed />
      </Picture>
    );
  },
  204() {
    return (
      <Picture>
        <rect x={46} y={26} width={68} height={60} rx="8" fill="currentColor" stroke="none" opacity="0.08" />
        <rect {...pen} x={46} y={26} width={68} height={60} rx="8" />
      </Picture>
    );
  },
  205() {
    return (
      <Picture>
        <rect {...pen} x={58} y={30} width={52} height={56} rx="6" />
        <path {...pen} d="M46 70 a26 26 0 1 1 8-28" />
        <path {...pen} d="M42 46 l12 2 -2-12" />
      </Picture>
    );
  },
  206() {
    return (
      <Picture>
        <path d="M50 22 h40 l12 12 v46 h-52 z" fill="currentColor" stroke="none" opacity="0.08" />
        <path d="M50 22 v58 h28 V22 z" fill="currentColor" stroke="none" opacity="0.24" />
        <path {...pen} d="M50 22 h40 l12 12 v46 h-52 z" />
        <path {...pen} d="M90 22 v12 h12" />
        <path {...pen} d="M78 22 v58" />
      </Picture>
    );
  },
  207() {
    return (
      <Picture>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect {...pen} x={24 + i * 42} y={30} width={34} height={50} rx="6" />
            {i === 1 ? (
              <Cross x={41 + i * 42} y={55} s={6} />
            ) : (
              <path {...pen} d={`M${32 + i * 42} 56 l5 5 12-14`} />
            )}
          </g>
        ))}
      </Picture>
    );
  },
  208() {
    return (
      <Picture>
        <Doc x={26} y={28} w={40} h={52} lines={2} opacity={0.4} />
        <Doc x={78} y={28} w={40} h={52} lines={2} />
        <Check x={88} y={50} />
      </Picture>
    );
  },
  226() {
    return (
      <Picture>
        <Doc x={28} y={26} w={44} h={58} lines={3} opacity={0.4} />
        <rect x={78} y={36} width={52} height={40} rx="5" fill="currentColor" stroke="none" opacity="0.14" />
        <rect {...pen} x={78} y={36} width={52} height={40} rx="5" />
        <path {...pen} d="M88 52 h28 M88 62 h16" />
        <path {...pen} d="M64 24 l10 16 h-20 z" />
      </Picture>
    );
  },
  300() {
    return (
      <Picture>
        <Dot cx={28} cy={56} r={5} />
        <path {...pen} d="M36 56 h24" />
        <Arrow x1={60} y1={56} x2={116} y2={26} />
        <Arrow x1={60} y1={56} x2={128} y2={56} />
        <Arrow x1={60} y1={56} x2={116} y2={88} />
      </Picture>
    );
  },
  301() {
    return (
      <Picture>
        <Block x={14} y={40} w={26} h={32} />
        <Arrow x1={44} y1={56} x2={70} y2={56} />
        <Strip x={76} y={51} w={28} />
        <Pin x={128} y={24} />
      </Picture>
    );
  },
  302() {
    return (
      <Picture>
        <Block x={14} y={40} w={26} h={32} />
        <Arrow x1={44} y1={56} x2={70} y2={56} dashed />
        <Strip x={76} y={51} w={28} />
        <Clock cx={124} cy={36} r={14} />
      </Picture>
    );
  },
  303() {
    return (
      <Picture>
        <Doc x={14} y={30} w={34} h={48} lines={3} />
        <Arrow x1={54} y1={56} x2={80} y2={56} />
        <rect x={88} y={28} width={48} height={54} rx="5" fill="currentColor" stroke="none" opacity="0.12" />
        <rect {...pen} x={88} y={28} width={48} height={54} rx="5" />
        <path {...pen} d="M88 42 h48" />
        <path {...pen} d="M104 62 l6 6 14-16" />
      </Picture>
    );
  },
  304() {
    return (
      <Picture>
        <Doc x={16} y={28} w={36} h={52} lines={2} />
        <path {...pen} d="M64 46 h28 M64 64 h28" />
        <Doc x={104} y={28} w={36} h={52} lines={2} />
      </Picture>
    );
  },
  305() {
    return (
      <Picture>
        <Dot cx={22} cy={56} r={5} />
        <Arrow x1={30} y1={56} x2={48} y2={56} />
        <rect {...pen} x={52} y={36} width={32} height={40} rx="5" />
        <path {...pen} d="M52 50 h32" />
        <Arrow x1={88} y1={56} x2={106} y2={56} />
        <Rack x={108} y={32} w={32} h={46} />
      </Picture>
    );
  },
  306() {
    return (
      <Picture>
        <rect {...pen} x={40} y={24} width={80} height={64} rx="8" strokeDasharray="6 5" />
        <path {...pen} d="M52 36 L108 80" />
      </Picture>
    );
  },
  307() {
    return (
      <Picture>
        <Block x={14} y={40} w={26} h={32} />
        <Arrow x1={44} y1={56} x2={72} y2={56} dashed />
        <Block x={78} y={40} w={26} h={32} />
        <Clock cx={128} cy={36} r={13} />
      </Picture>
    );
  },
  308() {
    return (
      <Picture>
        <Block x={14} y={42} w={26} h={32} />
        <Arrow x1={44} y1={58} x2={72} y2={58} />
        <Block x={78} y={42} w={26} h={32} />
        <Pin x={128} y={18} />
      </Picture>
    );
  },
  400() {
    return (
      <Picture>
        <path {...pen} d="M48 24 h36 l12 12 v28 l-10 10 -12-8 -8 12 H48 z" />
        <path {...pen} d="M84 24 v12 h12" />
        <path {...pen} opacity="0.75" d="M60 48 h24 M60 58 h16" />
        <Cross x={116} y={40} s={9} />
      </Picture>
    );
  },
  401() {
    return (
      <Picture>
        <Padlock x={28} y={28} w={40} />
        <Key x={96} y={62} />
      </Picture>
    );
  },
  402() {
    return (
      <Picture>
        <rect x={24} y={34} width={70} height={44} rx="6" fill="currentColor" stroke="none" opacity="0.12" />
        <rect {...pen} x={24} y={34} width={70} height={44} rx="6" />
        <path {...pen} d="M24 48 h70" />
        <circle cx="118" cy="64" r="18" fill="currentColor" stroke="none" opacity="0.14" />
        <circle {...pen} cx="118" cy="64" r="18" />
        <circle {...pen} cx="118" cy="64" r="8" />
      </Picture>
    );
  },
  403() {
    return (
      <Picture>
        <rect x={54} y={18} width={52} height={76} rx="4" fill="currentColor" stroke="none" opacity="0.1" />
        <rect {...pen} x={54} y={18} width={52} height={76} rx="4" />
        <circle {...pen} cx="90" cy="58" r="4" />
        <path {...pen} d="M32 56 h96" />
      </Picture>
    );
  },
  404() {
    return (
      <Picture>
        <rect {...pen} x={24} y={34} width={54} height={44} rx="6" strokeDasharray="5 4" />
        <Glass x={108} y={52} r={20} />
      </Picture>
    );
  },
  405() {
    return (
      <Picture>
        {[0, 1, 2].map((i) => (
          <rect key={i} {...pen} x={28} y={24 + i * 24} width={104} height={16} rx="8" />
        ))}
        <path {...pen} d="M40 32 h22 M40 56 h40 M40 80 h16" opacity="0.75" />
        <path {...pen} d="M36 62 L124 50" />
      </Picture>
    );
  },
  406() {
    return (
      <Picture>
        <rect {...pen} x={28} y={28} width={44} height={56} rx="4" />
        <circle {...pen} cx="112" cy="56" r="24" />
        <path {...pen} d="M78 34 l28 44" />
      </Picture>
    );
  },
  407() {
    return (
      <Picture>
        <rect {...pen} x={20} y={26} width={52} height={60} rx="6" />
        <path {...pen} d="M20 44 h52" />
        <path {...pen} opacity="0.7" d="M30 58 h28 M30 68 h18" />
        <Padlock x={88} y={34} w={40} />
      </Picture>
    );
  },
  408() {
    return (
      <Picture>
        <path {...pen} d="M54 24 h52 L80 52 Z" />
        <path {...pen} d="M54 88 h52 L80 60 Z" />
        <Dot cx={80} cy={72} r={2.4} />
      </Picture>
    );
  },
  409() {
    return (
      <Picture>
        <Arrow x1={22} y1={30} x2={78} y2={58} />
        <Arrow x1={22} y1={84} x2={78} y2={54} />
        <path {...pen} d="M96 40 l8 10 -10 2 8 14" />
      </Picture>
    );
  },
  410() {
    return (
      <Picture>
        <Doc x={36} y={28} w={48} h={58} lines={0} dashed opacity={0.55} />
        <Dot cx={108} cy={36} r={2.2} />
        <Dot cx={122} cy={50} r={1.7} />
        <Dot cx={112} cy={66} r={2.5} />
        <Dot cx={126} cy={78} r={1.5} />
      </Picture>
    );
  },
  411() {
    return (
      <Picture>
        <Block x={24} y={34} w={40} h={44} />
        <path {...pen} d="M44 50 c6 0 10 3 10 8 s-5 7-9 8 v5" />
        <Dot cx={45} cy={76} r={1.6} />
        <path {...pen} d="M80 32 h52" />
        <path {...pen} d="M80 32 v10 M94 32 v6 M108 32 v10 M122 32 v6" />
      </Picture>
    );
  },
  412() {
    return (
      <Picture>
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect {...pen} x="36" y={24 + i * 24} width="18" height="18" rx="3" />
            <path {...pen} opacity="0.7" d={`M64 ${33 + i * 24} h${i === 2 ? 28 : 48}`} />
          </g>
        ))}
        <path {...pen} d="M40 34 l4 4 8-9" />
        <Cross x={45} y={57} s={5} />
        <path {...pen} d="M40 82 l4 4 8-9" />
      </Picture>
    );
  },
  413() {
    return (
      <Picture>
        <path {...pen} d="M36 62 h88 v28 H36 z" />
        <rect x={52} y={18} width={56} height={58} rx="4" fill="currentColor" stroke="none" opacity="0.16" />
        <rect {...pen} x={52} y={18} width={56} height={58} rx="4" />
      </Picture>
    );
  },
  414() {
    return (
      <Picture>
        <rect {...pen} x={16} y={24} width={96} height={66} rx="6" />
        <path {...pen} d="M16 46 h96" />
        <rect x={26} y={30} width={120} height={14} rx="7" fill="currentColor" stroke="none" opacity="0.16" />
        <rect {...pen} x={26} y={30} width={120} height={14} rx="7" />
        <path {...pen} opacity="0.75" d="M36 37 h48" />
        <path {...pen} opacity="0.55" d="M28 62 h46 M28 74 h30" />
      </Picture>
    );
  },
  415() {
    return (
      <Picture>
        <Doc x={36} y={22} w={48} h={64} lines={3} />
        <circle cx="112" cy="58" r="20" fill="currentColor" stroke="none" opacity="0.12" />
        <circle {...pen} cx="112" cy="58" r="20" />
        <path {...pen} d="M100 46 l24 24" />
      </Picture>
    );
  },
  416() {
    return (
      <Picture>
        <rect {...pen} x={20} y={46} width={84} height={18} rx="9" />
        <path {...pen} d="M112 32 h22 v48 h-22" />
      </Picture>
    );
  },
  417() {
    return (
      <Picture>
        <ellipse cx="78" cy="50" rx="42" ry="26" fill="currentColor" stroke="none" opacity="0.1" />
        <ellipse {...pen} cx="78" cy="50" rx="42" ry="26" />
        <path {...pen} d="M64 72 l-6 16 22-12" />
        <Cross x={78} y={50} s={10} />
      </Picture>
    );
  },
  418() {
    return (
      <Picture>
        <path {...pen} opacity="0.7" d="M64 28 c3-6 8-6 8 0 s5 6 8 0" />
        <path {...pen} d="M74 40 v-8 h10 v8" />
        <path {...pen} d="M58 44 h42" />
        <ellipse cx="78" cy="66" rx="24" ry="16" fill="currentColor" stroke="none" opacity="0.14" />
        <ellipse {...pen} cx="78" cy="66" rx="24" ry="16" />
        <path {...pen} d="M102 58 c16 1 20 10 12 18" />
        <path {...pen} d="M54 58 c-14 2 -16 16 -2 20" />
        <path {...pen} opacity="0.45" d="M40 90 h84" />
      </Picture>
    );
  },
  421() {
    return (
      <Picture>
        <Rack x={100} y={16} w={34} h={40} dim />
        <Rack x={72} y={48} w={40} h={48} />
        <Arrow x1={22} y1={78} x2={70} y2={68} />
      </Picture>
    );
  },
  422() {
    return (
      <Picture>
        <Doc x={32} y={20} w={52} h={68} lines={3} />
        <path {...pen} d="M46 58 c4 4 8-4 12 0 s8-4 12 0 s8-4 12 0" />
        <circle {...pen} cx="116" cy="36" r="16" />
        <Cross x={116} y={36} s={6} />
      </Picture>
    );
  },
  423() {
    return (
      <Picture>
        <Doc x={24} y={26} w={46} h={60} lines={3} />
        <Padlock x={86} y={36} w={42} />
      </Picture>
    );
  },
  424() {
    return (
      <Picture>
        <Block x={12} y={40} w={28} h={28} />
        <path {...pen} d="M40 54 h14" />
        <Block x={56} y={40} w={28} h={28} />
        <Cross x={70} y={54} s={6} />
        <path {...pen} strokeDasharray="4 4" d="M86 54 h16" />
        <Block x={106} y={40} w={28} h={28} opacity={0.4} />
      </Picture>
    );
  },
  425() {
    return (
      <Picture>
        <path {...pen} d="M20 80 h120" />
        <path {...pen} d="M30 80 a16 16 0 0 1 32 0" />
        <Arrow x1={72} y1={62} x2={102} y2={62} />
        <path {...pen} d="M118 36 v52" />
      </Picture>
    );
  },
  426() {
    return (
      <Picture>
        <Arrow x1={42} y1={86} x2={42} y2={26} />
        <rect {...pen} x={64} y={64} width={70} height={18} rx="4" opacity="0.45" />
        <path {...pen} d="M72 80 l54-14" opacity="0.7" />
        <rect x={64} y={28} width={70} height={18} rx="4" fill="currentColor" stroke="none" opacity="0.14" />
        <rect {...pen} x={64} y={28} width={70} height={18} rx="4" />
        <path {...pen} d="M76 37 h36" />
      </Picture>
    );
  },
  428() {
    return (
      <Picture>
        <rect {...pen} x={28} y={40} width={26} height={26} rx="4" />
        <path {...pen} opacity="0.75" d="M66 46 h46 M66 58 h30" />
        <path {...pen} d="M124 28 v22 M113 39 h22 M116 32 l16 14 M132 32 l-16 14" />
      </Picture>
    );
  },
  429() {
    return (
      <Picture>
        <Arrow x1={16} y1={30} x2={78} y2={48} />
        <Arrow x1={16} y1={48} x2={78} y2={54} />
        <Arrow x1={16} y1={66} x2={78} y2={60} />
        <Arrow x1={16} y1={84} x2={78} y2={68} />
        <path {...pen} d="M100 24 v64 M100 24 h22 M100 88 h22" />
      </Picture>
    );
  },
  431() {
    return (
      <Picture>
        <rect {...pen} x={36} y={36} width={78} height={58} rx="4" />
        <rect x={16} y={16} width={128} height={28} rx="4" fill="currentColor" stroke="none" opacity="0.16" />
        <rect {...pen} x={16} y={16} width={128} height={28} rx="4" />
        <path {...pen} opacity="0.7" d="M28 30 h70" />
      </Picture>
    );
  },
  451() {
    return (
      <Picture>
        <path
          d="M80 14 c8 10 16 12 16 24 a16 16 0 0 1-32 0 c0-8 6-12 8-20 2 6 4 8 8 8 0-6 0-10 0-12 z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
        <path {...pen} d="M50 64 h60 v34 H50 z" />
        <path {...pen} d="M80 64 v34" />
        <path {...pen} opacity="0.7" d="M58 76 h14 M88 76 h14" />
      </Picture>
    );
  },
  500() {
    return (
      <Picture>
        <Rack x={52} y={20} w={52} h={70} />
        <path {...pen} d="M76 28 l12 16 -14 6 12 22" />
      </Picture>
    );
  },
  501() {
    return (
      <Picture>
        <rect {...pen} x={46} y={18} width={68} height={76} rx="6" strokeDasharray="6 5" />
        <path {...pen} opacity="0.45" d="M46 42 h68 M46 64 h68" />
        <path {...pen} d="M74 34 h6 c14 0 20 6 20 14 0 8-6 12-14 14" />
        <path {...pen} d="M86 62 v12" />
        <Dot cx={86} cy={82} r={1.8} />
      </Picture>
    );
  },
  502() {
    return (
      <Picture>
        <Gate x={12} y={26} />
        <Scribble x={72} y={32} />
        <Rack x={112} y={32} w={32} h={48} dim />
      </Picture>
    );
  },
  503() {
    return (
      <Picture>
        <Rack x={22} y={24} w={44} h={58} />
        <path {...pen} d="M96 90 l12-42 h12 l12 42 z" />
        <path {...pen} d="M102 74 h28 M106 62 h20" />
        <path {...pen} d="M90 90 h48" />
      </Picture>
    );
  },
  504() {
    return (
      <Picture>
        <Gate x={12} y={24} />
        <path {...pen} strokeDasharray="5 4" d="M66 78 h36" />
        <Clock cx={118} cy={42} r={16} />
        <Rack x={108} y={62} w={34} h={32} dim />
      </Picture>
    );
  },
  505() {
    return (
      <Picture>
        <rect {...pen} x={16} y={32} width={48} height={48} rx="6" />
        <path {...pen} d="M28 56 h24" />
        <path {...pen} strokeDasharray="4 4" d="M70 56 h20" />
        <rect {...pen} x={96} y={32} width={48} height={48} rx="6" />
        <path {...pen} d="M108 48 h24 M108 64 h24" />
      </Picture>
    );
  },
  506() {
    return (
      <Picture>
        <Doc x={14} y={30} w={36} h={48} lines={2} />
        <Doc x={110} y={30} w={36} h={48} lines={2} />
        <Arrow x1={54} y1={42} x2={106} y2={42} />
        <Arrow x1={106} y1={74} x2={54} y2={74} />
      </Picture>
    );
  },
  507() {
    return (
      <Picture>
        <ellipse {...pen} cx="80" cy="40" rx="28" ry="9" />
        <path {...pen} d="M52 40 v36 a28 9 0 0 0 56 0 V40" />
        <path {...pen} d="M52 58 a28 9 0 0 0 56 0" />
        <Dot cx={80} cy={20} r={2.4} />
        <Dot cx={66} cy={26} r={1.8} />
        <Dot cx={96} cy={24} r={2} />
      </Picture>
    );
  },
  508() {
    return (
      <Picture>
        <circle {...pen} cx="70" cy="56" r="26" />
        <path {...pen} d="M70 30 l8 7 -12 1" />
        <rect {...pen} x={108} y={42} width={24} height={24} rx="3" />
      </Picture>
    );
  },
  510() {
    return (
      <Picture>
        <rect {...pen} x={28} y={24} width={42} height={30} rx="4" />
        <rect {...pen} x={74} y={24} width={42} height={30} rx="4" />
        <rect {...pen} x={28} y={58} width={42} height={30} rx="4" />
        <rect {...pen} x={74} y={58} width={42} height={30} rx="4" strokeDasharray="5 4" />
        <path {...pen} d="M62 34 h8 M46 50 v6" opacity="0.7" />
      </Picture>
    );
  },
  511() {
    return (
      <Picture>
        <path {...pen} d="M42 46 a38 38 0 0 1 76 0" />
        <path {...pen} d="M56 58 a24 24 0 0 1 48 0" />
        <Padlock x={64} y={62} w={32} />
      </Picture>
    );
  },
  419() {
    return (
      <Picture>
        <rect x={22} y={36} width={78} height={40} rx="6" fill="currentColor" stroke="none" opacity="0.12" />
        <rect {...pen} x={22} y={36} width={78} height={40} rx="6" />
        <path {...pen} strokeDasharray="4 4" d="M42 36 v40" />
        <Clock cx={122} cy={56} r={16} />
      </Picture>
    );
  },
  420() {
    return (
      <Picture>
        <path {...pen} d="M36 82 a44 44 0 0 1 88 0" />
        <path {...pen} d="M80 82 L112 52" />
        <Dot cx={80} cy={82} r={3} />
        <Dot cx={40} cy={36} r={3} />
        <Dot cx={58} cy={24} r={2.4} />
        <Dot cx={78} cy={20} r={2} />
      </Picture>
    );
  },
  444() {
    return (
      <Picture>
        <path {...pen} d="M18 56 h22" />
        <rect {...pen} x={40} y={44} width={22} height={24} rx="4" />
        <rect {...pen} x={98} y={44} width={22} height={24} rx="4" />
        <path {...pen} d="M120 56 h22" />
        <path {...pen} opacity="0.55" d="M70 48 l8 8 M78 48 l-8 8" />
      </Picture>
    );
  },
  449() {
    return (
      <Picture>
        <path {...pen} d="M108 36 a30 30 0 1 0 6 28" />
        <path {...pen} d="M112 58 l10 4 -12 6" />
        <circle {...pen} cx="48" cy="56" r="16" />
        <path {...pen} d="M48 48 v16 M40 56 h16" />
      </Picture>
    );
  },
  450() {
    return (
      <Picture>
        <path {...pen} d="M80 16 l40 14 v28 c0 24-40 38-40 38 s-40-14-40-38 V30 z" />
        <path {...pen} d="M62 62 V48 l18-10 18 10 v14" />
        <path {...pen} d="M74 62 v-8 h12 v8" />
      </Picture>
    );
  },
  494() {
    return (
      <Picture>
        <rect {...pen} x={16} y={22} width={128} height={24} rx="4" />
        <path {...pen} opacity="0.7" d="M28 34 h48" />
        <path {...pen} d="M86 14 v40" />
        <path {...pen} d="M78 22 l8 8 8-8 M78 46 l8-8 8 8" />
        <Doc x={48} y={56} w={64} h={42} lines={2} />
      </Picture>
    );
  },
  495() {
    return (
      <Picture>
        <Cert x={36} y={28} />
        <circle {...pen} cx="112" cy="58" r="20" />
        <Cross x={112} y={58} s={8} />
      </Picture>
    );
  },
  496() {
    return (
      <Picture>
        <rect {...pen} x={36} y={24} width={44} height={58} rx="4" strokeDasharray="5 4" />
        <circle {...pen} cx="112" cy="56" r="18" />
        <path {...pen} d="M112 46 v20 M102 56 h20" />
      </Picture>
    );
  },
  497() {
    return (
      <Picture>
        <Doc x={14} y={30} w={34} h={48} lines={2} />
        <Arrow x1={54} y1={56} x2={84} y2={56} />
        <Padlock x={96} y={30} w={40} />
      </Picture>
    );
  },
  498() {
    return (
      <Picture>
        <rect {...pen} x={16} y={34} width={52} height={36} rx="5" />
        <path {...pen} d="M68 38 l8 8 -8 8 8 8 -8 8" />
        <rect {...pen} x={90} y={46} width={52} height={36} rx="5" />
      </Picture>
    );
  },
  499() {
    return (
      <Picture>
        <rect {...pen} x={16} y={20} width={82} height={58} rx="5" />
        <path {...pen} d="M16 34 h82" />
        <Cross x={86} y={27} s={5} />
        <Rack x={112} y={48} w={32} h={44} dim />
      </Picture>
    );
  },
  509() {
    return (
      <Picture>
        <rect {...pen} x={62} y={28} width={36} height={68} rx="8" />
        <rect x={68} y={46} width={24} height={44} rx="4" fill="currentColor" stroke="none" opacity="0.28" />
        <Dot cx={80} cy={16} r={2.6} />
        <Dot cx={66} cy={22} r={2} />
        <Dot cx={96} cy={20} r={2.2} />
      </Picture>
    );
  },
  520() {
    return (
      <Picture>
        <Cloud x={8} y={16} />
        <Scribble x={78} y={30} />
        <Rack x={114} y={36} w={32} h={46} dim />
      </Picture>
    );
  },
  521() {
    return (
      <Picture>
        <Cloud x={6} y={14} />
        <path {...pen} d="M66 48 h14" />
        <path {...pen} d="M80 48 l10-8 M80 48 l10 8" />
        <Rack x={104} y={30} w={38} h={52} />
        <Cross x={123} y={56} s={7} />
      </Picture>
    );
  },
  522() {
    return (
      <Picture>
        <Cloud x={4} y={18} />
        <path {...pen} strokeDasharray="5 4" d="M64 52 h26" />
        <Clock cx={108} cy={34} r={13} />
        <Rack x={108} y={54} w={36} h={40} dim />
      </Picture>
    );
  },
  523() {
    return (
      <Picture>
        <Cloud x={2} y={22} />
        <path {...pen} d="M62 74 h18" />
        <path {...pen} d="M84 62 l12 20" />
        <path {...pen} d="M102 74 h12" />
        <Rack x={116} y={32} w={32} h={46} dim />
      </Picture>
    );
  },
  524() {
    return (
      <Picture>
        <Cloud x={2} y={28} />
        <path {...pen} d="M60 62 H104" />
        <Clock cx={86} cy={34} r={13} />
        <Rack x={104} y={40} w={40} h={50} />
      </Picture>
    );
  },
  525() {
    return (
      <Picture>
        <Cloud x={50} y={2} />
        <circle {...pen} cx="46" cy="78" r="16" />
        <circle {...pen} cx="114" cy="78" r="16" />
        <path {...pen} d="M62 72 h12 M98 72 H86" />
      </Picture>
    );
  },
  526() {
    return (
      <Picture>
        <Cloud x={2} y={28} />
        <Cert x={68} y={16} />
        <Warn x={114} y={64} />
      </Picture>
    );
  },
  530() {
    return (
      <Picture>
        <Cloud x={4} y={16} />
        <path {...pen} strokeDasharray="4 4" d="M64 46 h20" />
        <Glass x={102} y={52} r={16} />
        <path {...pen} d="M126 30 c8 0 14 4 14 10 s-6 8-10 10 c-3 2-4 4-4 7" />
        <Dot cx={126} cy={64} r={1.7} />
      </Picture>
    );
  },
};

export function StatusArt({ code }) {
  const Scene = SCENES[code];
  if (!Scene) return null;
  return <Scene />;
}
