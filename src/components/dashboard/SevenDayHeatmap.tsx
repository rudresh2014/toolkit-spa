import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { cn } from "../../lib/utils";

type SevenDayHeatmapProps = {
    data: {
        date: string;
        completed: number;
        total: number;
    }[];
};

export function SevenDayHeatmap({ data }: SevenDayHeatmapProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>7-Day Habit Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-2">
                    {data.map((day, index) => {
                        const completionRate = day.total > 0 ? day.completed / day.total : 0;
                        const dayLabel = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });

                        return (
                            <div key={index} className="flex flex-col items-center gap-2 flex-1">
                                <div
                                    className={cn(
                                        "w-full aspect-square rounded-md transition-all duration-300 hover:scale-110 cursor-pointer",
                                        completionRate === 0 && "bg-muted",
                                        completionRate > 0 && completionRate < 0.5 && "bg-primary/30",
                                        completionRate >= 0.5 && completionRate < 1 && "bg-primary/60",
                                        completionRate === 1 && "bg-primary"
                                    )}
                                    title={`${dayLabel}: ${day.completed}/${day.total} completed`}
                                />
                                <span className="text-xs text-muted-foreground">{dayLabel}</span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
