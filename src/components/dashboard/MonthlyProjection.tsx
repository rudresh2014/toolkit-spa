import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "../ui/progress";

type MonthlyProjectionProps = {
    projected: number;
    current: number;
    budget: number;
    trend: 'up' | 'down' | 'same';
};

export function MonthlyProjection({ projected, current, budget, trend }: MonthlyProjectionProps) {
    const progressPercentage = budget > 0 ? (current / budget) * 100 : 0;
    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const trendColor = trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Projection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Projected</span>
                        <span className="text-lg font-bold">₹{projected.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current</span>
                        <span className="text-base font-medium">₹{current.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Budget Progress</span>
                        <span>{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={Math.min(progressPercentage, 100)} />
                </div>

                <div className={`flex items-center gap-1 ${trendColor}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span className="text-sm">
                        {trend === 'up' ? 'Above budget pace' : trend === 'down' ? 'Below budget pace' : 'On track'}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
}
