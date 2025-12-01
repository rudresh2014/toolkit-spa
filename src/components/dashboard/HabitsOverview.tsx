import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Flame, Star, Calendar } from "lucide-react";

type HabitsOverviewProps = {
    totalHabits: number;
    completedToday: number;
    averageStreak: number;
    bestDay: string;
    completionRate: number;
};

export function HabitsOverview({
    totalHabits,
    completedToday,
    averageStreak,
    bestDay,
    completionRate
}: HabitsOverviewProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Habits Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Total Habits</span>
                        </div>
                        <div className="text-2xl font-bold">{totalHabits}</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Completed Today</span>
                        </div>
                        <div className="text-2xl font-bold">{completedToday}</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Flame className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Avg Streak</span>
                        </div>
                        <div className="text-2xl font-bold">{averageStreak.toFixed(1)}</div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Completion Rate</span>
                        </div>
                        <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Best Day</span>
                        </div>
                        <div className="text-lg font-medium">{bestDay}</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
