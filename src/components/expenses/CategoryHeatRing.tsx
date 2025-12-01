import { useState } from "react";
import { cn } from "../../lib/utils";

type CategoryData = {
    name: string;
    value: number;
    color: string;
};

type CategoryHeatRingProps = {
    data: CategoryData[];
};

export function CategoryHeatRing({ data }: CategoryHeatRingProps) {
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    const total = data.reduce((sum, item) => sum + item.value, 0);
    const size = 200;
    const center = size / 2;
    const radius = 70;
    const strokeWidth = 14;
    const gapDegrees = 2;

    // Calculate arcs
    const arcs = data.map((item, index) => {
        const percentage = (item.value / total) * 100;
        const degrees = (item.value / total) * 360 - gapDegrees;

        // Calculate start angle (sum of previous arcs)
        const startAngle = data.slice(0, index).reduce((sum, prev) => {
            return sum + ((prev.value / total) * 360);
        }, 0);

        const endAngle = startAngle + degrees;

        // Convert to radians
        const startRad = (startAngle - 90) * (Math.PI / 180);
        const endRad = (endAngle - 90) * (Math.PI / 180);

        // Calculate arc path
        const startX = center + radius * Math.cos(startRad);
        const startY = center + radius * Math.sin(startRad);
        const endX = center + radius * Math.cos(endRad);
        const endY = center + radius * Math.sin(endRad);

        const largeArcFlag = degrees > 180 ? 1 : 0;

        const pathData = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

        return {
            name: item.name,
            value: item.value,
            percentage,
            pathData,
            color: item.color,
            strokeDasharray: degrees > 0 ? `${(degrees / 360) * (2 * Math.PI * radius)} ${2 * Math.PI * radius}` : "0"
        };
    });

    // Color mapping for categories
    const getStrokeColor = (color: string) => {
        const colorMap: Record<string, string> = {
            'rgba(147, 197, 253, 0.8)': '#93C5FD',
            'rgba(134, 239, 172, 0.8)': '#86EFAC',
            'rgba(253, 224, 71, 0.8)': '#FDE047',
            'rgba(253, 186, 116, 0.8)': '#FDBA74',
            'rgba(216, 180, 254, 0.8)': '#D8B4FE',
            'rgba(249, 168, 212, 0.8)': '#F9A8D4'
        };
        return colorMap[color] || color;
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-6">
            {/* SVG Heat Ring */}
            <div className="flex-shrink-0">
                <svg width={size} height={size} className="transform -rotate-0">
                    {/* Background circle */}
                    <circle
                        cx={center}
                        cy={center}
                        r={radius}
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="1"
                        opacity="0.2"
                    />

                    {/* Category arcs */}
                    {arcs.map((arc) => (
                        <path
                            key={arc.name}
                            d={arc.pathData}
                            fill="none"
                            stroke={getStrokeColor(arc.color)}
                            strokeWidth={hoveredCategory === arc.name ? strokeWidth + 4 : strokeWidth}
                            strokeLinecap="round"
                            opacity={hoveredCategory === null || hoveredCategory === arc.name ? 1 : 0.3}
                            className="transition-all duration-300"
                            onMouseEnter={() => setHoveredCategory(arc.name)}
                            onMouseLeave={() => setHoveredCategory(null)}
                            style={{
                                cursor: 'pointer'
                            }}
                        />
                    ))}
                </svg>
            </div>

            {/* Labels */}
            <div className="flex-1 space-y-3">
                {arcs.map((arc) => (
                    <div
                        key={arc.name}
                        className={cn(
                            "flex items-center justify-between p-2 rounded-md transition-all duration-300 cursor-pointer",
                            hoveredCategory === arc.name ? "bg-muted/50" : ""
                        )}
                        onMouseEnter={() => setHoveredCategory(arc.name)}
                        onMouseLeave={() => setHoveredCategory(null)}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getStrokeColor(arc.color) }}
                            />
                            <span className="text-sm font-medium text-muted-foreground">
                                {arc.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                                {arc.percentage.toFixed(1)}%
                            </span>
                            <span className="text-sm font-medium">
                                ₹{arc.value.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
