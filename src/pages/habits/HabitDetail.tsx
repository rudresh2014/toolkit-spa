import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "../../components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Switch } from "../../components/ui/switch";
import { ArrowLeft, Target, Flame, Trash2, Loader2, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../../lib/utils";
import { ACHIEVEMENTS, type Achievement, type AchievementCheckData } from "../../lib/achievementConfig";

type Habit = {
    id: string;
    user_id: string;
    title: string;
    frequency: "daily" | "weekly" | "monthly";
    icon: string;
    created_at: string;
};

type HabitLog = {
    id: string;
    habit_id: string;
    date: string;
    created_at: string;
};

type CalendarDay = {
    date: number | string;
    isCompleted: boolean;
    isCurrentMonth: boolean;
};

export default function HabitDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [habit, setHabit] = useState<Habit | null>(null);
    const [logs, setLogs] = useState<HabitLog[]>([]);
    const [loading, setLoading] = useState(true);
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Reminder state
    const [reminderEnabled, setReminderEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("09:00");
    const [savedReminderTime, setSavedReminderTime] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // Achievement state
    const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
    const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);

    useEffect(() => {
        fetchHabitDetails();
        loadReminder();
        loadAchievements();
    }, [id, user]);

    useEffect(() => {
        if (habit && logs.length > 0) {
            checkAndUnlockAchievements();
        }
    }, [habit, logs]);

    const fetchHabitDetails = async () => {
        if (!user || !id) return;
        setLoading(true);

        // Fetch habit
        const { data: habitData, error: habitError } = await supabase
            .from("habits")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();

        if (!habitError && habitData) {
            setHabit(habitData);

            // Fetch logs
            const { data: logsData, error: logsError } = await supabase
                .from("habit_logs")
                .select("*")
                .eq("habit_id", id)
                .order("date", { ascending: false });

            if (!logsError && logsData) {
                setLogs(logsData);
            }
        }

        setLoading(false);
    };

    const calculateStreak = (logs: HabitLog[]): number => {
        if (logs.length === 0) return 0;

        const sortedDates = logs
            .map(log => new Date(log.date))
            .sort((a, b) => b.getTime() - a.getTime());

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let streak = 0;
        let currentDate = new Date(today);

        for (const logDate of sortedDates) {
            logDate.setHours(0, 0, 0, 0);
            if (logDate.getTime() === currentDate.getTime()) {
                streak++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        return streak;
    };

    const calculateLongestStreak = (logs: HabitLog[]): number => {
        if (logs.length === 0) return 0;

        const sortedDates = logs
            .map(log => new Date(log.date))
            .sort((a, b) => a.getTime() - b.getTime());

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i - 1]);
            const currDate = new Date(sortedDates[i]);

            prevDate.setDate(prevDate.getDate() + 1);
            prevDate.setHours(0, 0, 0, 0);
            currDate.setHours(0, 0, 0, 0);

            if (prevDate.getTime() === currDate.getTime()) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else {
                currentStreak = 1;
            }
        }

        return maxStreak;
    };

    const calculateCompletionRate = (logs: HabitLog[], days: number = 30): number => {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);

        const recentLogs = logs.filter(log => new Date(log.date) >= cutoffDate);
        return Math.round((recentLogs.length / days) * 100);
    };

    const generateCalendarData = (logs: HabitLog[], month: number, year: number): CalendarDay[] => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay(); // 0 = Sunday

        const days: CalendarDay[] = [];
        const logDates = new Set(logs.map(log => log.date));

        // Adjust startDay to make Monday first (0 = Monday)
        const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

        // Add previous month padding
        for (let i = 0; i < adjustedStartDay; i++) {
            days.push({ date: '', isCompleted: false, isCurrentMonth: false });
        }

        // Add current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            days.push({
                date: i,
                isCompleted: logDates.has(dateStr),
                isCurrentMonth: true
            });
        }

        return days;
    };

    const calculateBestWorstDays = (logs: HabitLog[]) => {
        if (logs.length === 0) return { bestDay: 'N/A', worstDay: 'N/A', weekdayCounts: [0, 0, 0, 0, 0, 0, 0] };

        const weekdayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat

        logs.forEach(log => {
            const day = new Date(log.date).getDay();
            weekdayCounts[day]++;
        });

        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        const maxCount = Math.max(...weekdayCounts);
        const minCount = Math.min(...weekdayCounts.filter(c => c > 0));

        const bestDay = maxCount > 0 ? dayNames[weekdayCounts.indexOf(maxCount)] : 'N/A';
        const worstDay = minCount > 0 && minCount < maxCount ? dayNames[weekdayCounts.indexOf(minCount)] : bestDay;

        return { bestDay, worstDay, weekdayCounts };
    };

    const calculateConsistencyScore = (logs: HabitLog[], createdAt: string): number => {
        const created = new Date(createdAt);
        const today = new Date();

        const daysSinceCreated = Math.floor(
            (today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceCreated === 0) return 0;

        return Math.round((logs.length / daysSinceCreated) * 100);
    };

    const calculateTrend = (logs: HabitLog[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7Days = logs.filter(log => {
            const logDate = new Date(log.date);
            const daysAgo = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysAgo >= 0 && daysAgo < 7;
        }).length;

        const previous7Days = logs.filter(log => {
            const logDate = new Date(log.date);
            const daysAgo = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
            return daysAgo >= 7 && daysAgo < 14;
        }).length;

        if (last7Days > previous7Days) return 'up';
        if (last7Days < previous7Days) return 'down';
        return 'same';
    };

    const getLastWeekData = (logs: HabitLog[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const last7Days = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            last7Days.push({
                day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()],
                completed: logs.some(log => log.date === dateStr)
            });
        }

        return last7Days;
    };

    const generateInsightSummary = (
        bestDay: string,
        worstDay: string,
        trendDirection: string,
        consistencyScore: number
    ): string => {
        let summary = '';

        if (consistencyScore >= 80) {
            summary = `Excellent consistency! `;
        } else if (consistencyScore >= 60) {
            summary = `Good progress! `;
        } else if (consistencyScore > 0) {
            summary = `Keep building your habit. `;
        } else {
            summary = `Start tracking your habit to see insights. `;
        }

        if (bestDay !== 'N/A' && worstDay !== 'N/A' && bestDay !== worstDay) {
            summary += `You're most consistent on ${bestDay}s. `;
            summary += `Try not to miss ${worstDay} — it's your weakest day. `;
        }

        if (trendDirection === 'up') {
            summary += `Your weekly performance is improving. Keep it up!`;
        } else if (trendDirection === 'down') {
            summary += `Your weekly performance has declined. Stay focused!`;
        } else {
            summary += `Your weekly performance is steady.`;
        }

        return summary;
    };

    const loadReminder = async () => {
        if (!habit?.id) return;

        const { data } = await supabase
            .from('habit_reminders')
            .select('*')
            .eq('habit_id', habit.id)
            .maybeSingle();

        if (data) {
            setReminderEnabled(data.enabled);
            setReminderTime(data.reminder_time);
            setSavedReminderTime(data.reminder_time);
        }
    };

    const handleSaveReminder = async () => {
        if (!habit || !user) return;
        setSaving(true);

        const { data: existing } = await supabase
            .from('habit_reminders')
            .select('*')
            .eq('habit_id', habit.id)
            .maybeSingle();

        if (existing) {
            await supabase
                .from('habit_reminders')
                .update({ reminder_time: reminderTime, enabled: reminderEnabled })
                .eq('habit_id', habit.id);
        } else {
            await supabase
                .from('habit_reminders')
                .insert({
                    habit_id: habit.id,
                    user_id: user.id,
                    reminder_time: reminderTime,
                    enabled: reminderEnabled
                });
        }

        setSavedReminderTime(reminderTime);
        setSaving(false);
    };

    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const loadAchievements = async () => {
        if (!habit || !user) return;

        const { data } = await supabase
            .from('habit_achievements')
            .select('*')
            .eq('user_id', user.id)
            .eq('habit_id', habit.id);

        setUnlockedAchievements(data || []);
    };

    const checkAndUnlockAchievements = async () => {
        if (!habit || !user || logs.length === 0) return;

        // Fetch existing achievements
        const { data: existingAchievements } = await supabase
            .from('habit_achievements')
            .select('achievement_key')
            .eq('user_id', user.id)
            .eq('habit_id', habit.id);

        const unlockedKeys = new Set(existingAchievements?.map(a => a.achievement_key) || []);

        // Prepare check data
        const checkData: AchievementCheckData = {
            currentStreak: calculateStreak(logs),
            longestStreak: calculateLongestStreak(logs),
            consistencyScore: calculateConsistencyScore(logs, habit.created_at),
            logs,
            habit
        };

        // Check each achievement
        for (const achievement of ACHIEVEMENTS) {
            if (!unlockedKeys.has(achievement.key) && achievement.checkCondition(checkData)) {
                // Unlock achievement
                await supabase
                    .from('habit_achievements')
                    .insert({
                        user_id: user.id,
                        habit_id: habit.id,
                        achievement_key: achievement.key,
                        metadata: {
                            streak: checkData.currentStreak,
                            consistency: checkData.consistencyScore
                        }
                    });

                unlockedKeys.add(achievement.key);
            }
        }

        // Reload achievements if any were unlocked
        if (unlockedKeys.size > (existingAchievements?.length || 0)) {
            loadAchievements();
        }
    };

    const handleDelete = async () => {
        if (!user || !id) return;

        if (!confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
            return;
        }

        const { error } = await supabase
            .from("habits")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (!error) {
            navigate("/habits");
        } else {
            alert("Failed to delete habit");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!habit) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate("/habits")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Habits
                </Button>
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">Habit not found.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentStreak = calculateStreak(logs);
    const longestStreak = calculateLongestStreak(logs);
    const completionRate = calculateCompletionRate(logs);
    const calendarDays = generateCalendarData(logs, currentMonth, currentYear);

    // Insights calculations
    const { bestDay, worstDay } = calculateBestWorstDays(logs);
    const consistencyScore = habit ? calculateConsistencyScore(logs, habit.created_at) : 0;
    const trendDirection = calculateTrend(logs);
    const lastWeekData = getLastWeekData(logs);
    const insightSummary = generateInsightSummary(bestDay, worstDay, trendDirection, consistencyScore);

    return (
        <div className="space-y-6">
            <Button variant="ghost" onClick={() => navigate("/habits")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Habits
            </Button>

            {/* Header Card */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <Target className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">{habit.title}</h1>
                                <p className="text-muted-foreground">
                                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-semibold text-orange-500">
                                        {currentStreak} day streak
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Streak Analytics */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{currentStreak} days</div>
                        <p className="text-xs text-muted-foreground">Keep it up!</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Longest Streak</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{longestStreak} days</div>
                        <p className="text-xs text-muted-foreground">Personal best</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{completionRate}%</div>
                        <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </CardContent>
                </Card>
            </div>

            {/* Heatmap Calendar */}
            <Card>
                <CardHeader>
                    <CardTitle>Completion Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {/* Day labels */}
                        <div className="grid grid-cols-7 gap-2">
                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                <div key={day} className="text-xs text-center text-muted-foreground font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "aspect-square rounded-md border transition-colors flex items-center justify-center",
                                        day.isCompleted
                                            ? "bg-primary/20 border-primary"
                                            : "bg-muted border-border",
                                        !day.isCurrentMonth && "opacity-30"
                                    )}
                                >
                                    {day.date && (
                                        <span className="text-xs font-medium">{day.date}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Completion History */}
            <Card>
                <CardHeader>
                    <CardTitle>Completion History</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                        No completions yet.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                logs.slice(0, 10).map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="font-medium">
                                            {new Date(log.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Insights Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Best/Worst Day */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">Best Day</p>
                            <p className="text-xs text-muted-foreground">{bestDay}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Worst Day</p>
                            <p className="text-xs text-muted-foreground">{worstDay}</p>
                        </div>
                    </div>

                    {/* Consistency Score & Trend */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Consistency</span>
                            <span className={cn(
                                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                {consistencyScore}%
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Trend</span>
                            {trendDirection === 'up' && (
                                <TrendingUp className="h-4 w-4 text-green-500" />
                            )}
                            {trendDirection === 'down' && (
                                <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                            {trendDirection === 'same' && (
                                <Minus className="h-4 w-4 text-muted-foreground" />
                            )}
                        </div>
                    </div>

                    {/* Mini Weekly Trend Bar */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">Last 7 Days</p>
                        <div className="flex items-center gap-2">
                            {lastWeekData.map((day, index) => (
                                <div key={index} className="flex flex-col items-center gap-1">
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-md border transition-colors",
                                            day.completed
                                                ? "bg-primary/20 border-primary"
                                                : "bg-muted border-border"
                                        )}
                                    />
                                    <span className="text-xs text-muted-foreground">{day.day}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Insight Summary */}
                    <div className="pt-4 border-t">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {insightSummary}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Reminder Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Reminder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                        Get notified each day at a selected time.
                    </p>

                    {/* Enable/Disable Switch */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Enable Reminder</span>
                        <Switch
                            checked={reminderEnabled}
                            onCheckedChange={setReminderEnabled}
                        />
                    </div>

                    {/* Time Picker */}
                    {reminderEnabled && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reminder Time</label>
                            <Input
                                type="time"
                                value={reminderTime}
                                onChange={(e) => setReminderTime(e.target.value)}
                                className="w-full"
                            />
                        </div>
                    )}

                    {/* Save Button */}
                    {reminderEnabled && (
                        <Button onClick={handleSaveReminder} disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Reminder
                        </Button>
                    )}

                    {/* Active Reminder Display */}
                    {reminderEnabled && savedReminderTime && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                Active reminder at{" "}
                                <span className={cn(
                                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                                    "bg-primary/10 border-primary/20 text-primary"
                                )}>
                                    {formatTime(savedReminderTime)}
                                </span>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {ACHIEVEMENTS.map((achievement) => {
                            const isUnlocked = unlockedAchievements.some(
                                a => a.achievement_key === achievement.key
                            );

                            return (
                                <button
                                    key={achievement.key}
                                    onClick={() => setSelectedAchievement(achievement)}
                                    className={cn(
                                        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                                        isUnlocked
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-muted border-border text-muted-foreground opacity-50"
                                    )}
                                >
                                    <achievement.icon className="h-3 w-3" />
                                    {achievement.name}
                                </button>
                            );
                        })}
                    </div>

                    {unlockedAchievements.length > 0 && (
                        <div className="pt-4 border-t">
                            <p className="text-sm text-muted-foreground">
                                {unlockedAchievements.length} of {ACHIEVEMENTS.length} achievements unlocked
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Achievement Dialog */}
            <Dialog open={!!selectedAchievement} onOpenChange={() => setSelectedAchievement(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedAchievement && (
                                <>
                                    <selectedAchievement.icon className="h-5 w-5" />
                                    {selectedAchievement.name}
                                </>
                            )}
                        </DialogTitle>
                        <DialogClose onClick={() => setSelectedAchievement(null)} />
                    </DialogHeader>

                    {selectedAchievement && (
                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">
                                {selectedAchievement.description}
                            </p>

                            {(() => {
                                const isUnlocked = unlockedAchievements.some(
                                    a => a.achievement_key === selectedAchievement.key
                                );
                                const unlockedData = unlockedAchievements.find(
                                    a => a.achievement_key === selectedAchievement.key
                                );

                                if (isUnlocked && unlockedData) {
                                    return (
                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium">Unlocked</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(unlockedData.unlocked_at).toLocaleDateString('en-US', {
                                                    weekday: 'short',
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <div className="pt-4 border-t">
                                            <p className="text-sm font-medium text-muted-foreground">Locked</p>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedAchievement.description}
                                            </p>
                                        </div>
                                    );
                                }
                            })()}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
