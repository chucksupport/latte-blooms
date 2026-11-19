// Illustrated bouquet used on the collection cards. `petal` tints the blooms so
// each collection reads differently while sharing one drawing.
export function BouquetArt({ petal }: { petal: string }) {
  const blooms: [number, number][] = [
    [35, 40],
    [65, 30],
    [95, 48],
  ];
  return (
    <svg
      viewBox="0 0 130 150"
      aria-hidden="true"
      className="h-[150px] w-[130px]"
    >
      <path d="M30 85 L65 145 L102 85Z" fill="#c8a980" />
      <path
        d="M65 122 Q40 65 35 40 M65 122 L65 40 M65 122 Q90 60 95 48"
        stroke="#7c8664"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M55 99 Q24 98 24 73 Q49 74 55 99 M74 91 Q105 90 107 65 Q80 68 74 91"
        fill="#8b9672"
      />
      {blooms.map(([x, y]) => (
        <g key={`${x}-${y}`} fill={petal} stroke="#ad846a" strokeWidth=".7">
          <circle cx={x - 10} cy={y} r="12" />
          <circle cx={x + 10} cy={y} r="12" />
          <circle cx={x} cy={y - 10} r="12" />
          <circle cx={x} cy={y + 10} r="12" />
          <circle cx={x} cy={y} r="6" fill="#b58c51" />
        </g>
      ))}
      <path
        d="M55 128 Q40 114 46 113 Q60 111 65 128 Q83 107 87 116 Q92 127 65 128"
        fill="none"
        stroke="#8e6653"
        strokeWidth="2"
      />
    </svg>
  );
}
