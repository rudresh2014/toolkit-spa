import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { HabitsOverview } from "../../components/dashboard/HabitsOverview";
import { KPICard, RecentActivity } from "../../components/dashboard/DashboardWidgets";
import { CheckCircle, DollarSign, ListTodo } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DesktopDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // State for dashboard data
    const [stats, setStats] = useState({
        totalExpenses: 0,
        expenseTrend: 'same' as 'up' | 'down' | 'same',
        pendingTodos: 0,
        completedTodos: 0,
        activeHabits: 0,
        habitsCompletedToday: 0,
        habitStreak: 0,
        bestHabitDay: 'N/A',
        habitCompletionRate: 0
    });

    const [recentActivity, setRecentActivity] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            // 1. Fetch Expenses
            const { data: expenses } = await supabase
                .from("expenses")
                .select("*")
                .eq("user_id", user?.id)
                .order("created_at", { ascending: false });

            // Calculate Expense Stats
            const now = new Date();
            const thisMonth = now.getMonth();
            const thisYear = now.getFullYear();
            const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
            const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

            const thisMonthExpenses = expenses?.filter(e => {
                const d = new Date(e.created_at);
                return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
            }) || [];

            const lastMonthExpenses = expenses?.filter(e => {
                const d = new Date(e.created_at);
                return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
            }) || [];

            const thisMonthTotal = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
            const lastMonthTotal = lastMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

            let expenseTrend: 'up' | 'down' | 'same' = 'same';
            if (thisMonthTotal > lastMonthTotal) expenseTrend = 'up';
            else if (thisMonthTotal < lastMonthTotal) expenseTrend = 'down';

            // 2. Fetch Todos
            const { data: todos } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user?.id);

            const pendingTodos = todos?.filter(t => !t.completed).length || 0;
            const completedTodos = todos?.filter(t => t.completed).length || 0;

            // 3. Fetch Habits
            const { data: habits } = await supabase
                .from("habits")
                .select("*")
                .eq("user_id", user?.id);

            const { data: habitLogs } = await supabase
                .from("habit_logs")
                .select("*")
                .in("habit_id", habits?.map(h => h.id) || []);

            // Calculate Habit Stats
            const todayStr = new Date().toISOString().split('T')[0];
            const completedToday = habitLogs?.filter(l => l.date === todayStr).length || 0;

            // Calculate average streak (simplified)
            const activeHabits = habits?.length || 0;

            // Calculate completion rate (last 30 days)
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const recentLogs = habitLogs?.filter(l => new Date(l.date) >= thirtyDaysAgo) || [];
            const totalPossible = activeHabits * 30; // Rough estimate
            const completionRate = totalPossible > 0 ? (recentLogs.length / totalPossible) * 100 : 0;

            // Best Day
            const dayCounts: Record<string, number> = {};
            habitLogs?.forEach(l => {
                const day = new Date(l.date).toLocaleDateString('en-US', { weekday: 'long' });
                dayCounts[day] = (dayCounts[day] || 0) + 1;
            });
            const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

            // Recent Activity
            const recentExpenses = expenses?.slice(0, 5).map(e => ({
                id: e.id,
                title: e.title,
                category: e.category,
                amount: e.amount,
                type: 'expense'
            })) || [];

            setStats({
                totalExpenses: thisMonthTotal,
                expenseTrend,
                pendingTodos,
                completedTodos,
                activeHabits,
                habitsCompletedToday: completedToday,
                habitStreak: 0,
                bestHabitDay: bestDay,
                habitCompletionRate: completionRate
            });

            setRecentActivity(recentExpenses);

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <KPICard
                    title="Total Expenses (Month)"
                    value={`₹${stats.totalExpenses.toLocaleString('en-IN')}`}
                    icon={DollarSign}
                    trend={stats.expenseTrend === 'same' ? undefined : (stats.expenseTrend === 'up' ? '+ Increase' : '- Decrease')}
                    trendUp={stats.expenseTrend === 'down'} // For expenses, down is good (green)
                    onEdit={() => navigate('/expense')}
                />
                <KPICard
                    title="Pending Tasks"
                    value={stats.pendingTodos.toString()}
                    icon={ListTodo}
                    trend={`${stats.completedTodos} completed`}
                    trendUp={true}
                    onEdit={() => navigate('/todo')}
                />
                <KPICard
                    title="Active Habits"
                    value={stats.activeHabits.toString()}
                    icon={CheckCircle}
                    trend={`${stats.habitsCompletedToday} today`}
                    trendUp={true}
                    onEdit={() => navigate('/habits')}
                />
            </div>

            {/* Habits Overview Section */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4">
                    <HabitsOverview
                        totalHabits={stats.activeHabits}
                        completedToday={stats.habitsCompletedToday}
                        averageStreak={stats.habitStreak}
                        bestDay={stats.bestHabitDay}
                        completionRate={stats.habitCompletionRate}
                    />
                </div>
                <div className="col-span-3">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Recent Expenses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RecentActivity activities={recentActivity} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
