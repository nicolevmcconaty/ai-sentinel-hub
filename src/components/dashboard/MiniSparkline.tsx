import { useMemo } from "react";

interface MiniSparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function MiniSparkline({ 
  data, 
  color = "hsl(var(--primary))", 
  height = 24, 
  width = 50 
}: MiniSparklineProps) {
  const pathD = useMemo(() => {
    if (!data || data.length < 2) return "";
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    });
    
    return `M ${points.join(" L ")}`;
  }, [data, height, width]);

  if (!data || data.length < 2) return null;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
      />
      {/* End point dot */}
      <circle
        cx={width}
        cy={(() => {
          const max = Math.max(...data);
          const min = Math.min(...data);
          const range = max - min || 1;
          const lastValue = data[data.length - 1];
          return height - ((lastValue - min) / range) * (height - 4) - 2;
        })()}
        r={2}
        fill={color}
        className="animate-pulse"
      />
    </svg>
  );
}