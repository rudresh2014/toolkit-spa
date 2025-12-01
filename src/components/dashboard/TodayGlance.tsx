import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CheckCircle, Target, DollarSign, Cloud } from "lucide-react";

type TodayGlanceProps = {
    tasksCompleted: number;
    totalTasks: number;
    habitsCompleted: number;
    totalHabits: number;
    todayExpenses: number;
};

export function TodayGlance({
    tasksCompleted,
    totalTasks,
    habitsCompleted,
    totalHabits,
    todayExpenses
}: TodayGlanceProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Today at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Tasks</span>
                            </div>
                            <div className="text-base font-medium">
                                {tasksCompleted} / {totalTasks}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Habits</span>
                            </div>
                            <div className="text-base font-medium">
                                {habitsCompleted} / {totalHabits}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Expenses</span>
                            </div>
                            <div className="text-base font-medium">
                                ₹{todayExpenses.toLocaleString('en-IN')}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Cloud className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Weather</span>
                            </div>
                            <div className="text-base font-medium text-muted-foreground">
                                See header
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
