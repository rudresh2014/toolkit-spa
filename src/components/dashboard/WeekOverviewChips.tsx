import { CheckCircle, Target, DollarSign } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type WeekOverviewChipsProps = {
    tasksCompleted: number;
    habitsCompleted: number;
    weeklyExpenses: number;
    loading?: boolean;
};

export function WeekOverviewChips({
    tasksCompleted,
    habitsCompleted,
    weeklyExpenses,
    loading = false
}: WeekOverviewChipsProps) {
    if (loading) {
        return (
            <div className="flex flex-wrap gap-4">
                <Skeleton className="h-16 w-48" />
                <Skeleton className="h-16 w-48" />
                <Skeleton className="h-16 w-48" />
            </div>
        );
    }

    return (
        <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Tasks This Week</p>
                    <p className="text-2xl font-bold">{tasksCompleted}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Habits This Week</p>
                    <p className="text-2xl font-bold">{habitsCompleted}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border bg-card p-4 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">Weekly Expenses</p>
                    <p className="text-2xl font-bold">₹{weeklyExpenses.toLocaleString('en-IN')}</p>
                </div>
            </div>
        </div>
    );
}
