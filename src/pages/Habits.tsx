import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "../components/ui/dialog";
import { Plus, Target, Loader2, Flame } from "lucide-react";
import { cn } from "../lib/utils";
import { FuturisticSelect, type Option } from "../components/ui/FuturisticSelect";

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

type HabitWithLogs = Habit & {
    logs: HabitLog[];
    streak: number;
};

export default function Habits() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [habits, setHabits] = useState<HabitWithLogs[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Form state
    const [title, setTitle] = useState("");
    const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("daily");
    const [icon, setIcon] = useState("Target");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHabits();
    }, [user]);

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

    const fetchHabits = async () => {
        if (!user) return;
        setLoading(true);

        const { data: habitsData, error: habitsError } = await supabase
            .from("habits")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        if (!habitsError && habitsData) {
            // Fetch logs for all habits
            const { data: logsData, error: logsError } = await supabase
                .from("habit_logs")
                .select("*")
                .in("habit_id", habitsData.map(h => h.id));

            if (!logsError && logsData) {
                const habitsWithLogs = habitsData.map(habit => {
                    const habitLogs = logsData.filter(log => log.habit_id === habit.id);
                    return {
                        ...habit,
                        logs: habitLogs,
                        streak: calculateStreak(habitLogs)
                    };
                });
                setHabits(habitsWithLogs);
            }
        }
        setLoading(false);
    };

    const handleAddHabit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !title) return;

        setSubmitting(true);

        const { data, error } = await supabase
            .from("habits")
            .insert([{
                user_id: user.id,
                title,
                frequency,
                icon
            }])
            .select();

        if (!error && data) {
            setHabits([{ ...data[0], logs: [], streak: 0 }, ...habits]);
            setIsAddOpen(false);
            setTitle("");
            setFrequency("daily");
            setIcon("Target");
        }
        setSubmitting(false);
    };

    const handleMarkDone = async (habitId: string) => {
        if (!user) return;

        const today = new Date().toISOString().split('T')[0];

        // Check if already logged today
        const { data: existingLog } = await supabase
            .from('habit_logs')
            .select('*')
            .eq('habit_id', habitId)
            .eq('date', today)
            .single();

        if (existingLog) {
            alert('Already marked as done today!');
            return;
        }

        // Insert new log
        const { error } = await supabase
            .from('habit_logs')
            .insert({ habit_id: habitId, date: today });

        if (!error) {
            // Refresh habits to update streak
            fetchHabits();
        }
    };

    const getFrequencyColor = (f: string) => {
        switch (f) {
            case "daily": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
            case "weekly": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "monthly": return "text-purple-500 bg-purple-500/10 border-purple-500/20";
            default: return "text-muted-foreground";
        }
    };

    const frequencyOptions: Option[] = [
        { value: "daily", label: "Daily", color: "text-blue-400" },
        { value: "weekly", label: "Weekly", color: "text-green-400" },
        { value: "monthly", label: "Monthly", color: "text-purple-400" },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Habits</h1>
                    <p className="text-muted-foreground">Track your daily habits and build streaks.</p>
                </div>
                <Button onClick={() => setIsAddOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Habit
                </Button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : habits.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">No habits yet. Create your first habit to get started!</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {habits.map((habit) => (
                        <Card
                            key={habit.id}
                            className="transition-all hover:shadow-md cursor-pointer"
                            onClick={() => navigate(`/habits/${habit.id}`)}
                        >
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        <Target className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {habit.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Flame className="h-4 w-4 text-orange-500" />
                                        <span className="text-sm font-semibold text-orange-500">
                                            {habit.streak}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", getFrequencyColor(habit.frequency))}>
                                        {habit.frequency}
                                    </span>
                                    <Button
                                        size="sm"
                                        className="ml-auto"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkDone(habit.id);
                                        }}
                                    >
                                        Mark Done
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Habit</DialogTitle>
                        <DialogClose onClick={() => setIsAddOpen(false)} />
                    </DialogHeader>
                    <form onSubmit={handleAddHabit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <label htmlFor="title">Title</label>
                                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="frequency">Frequency</label>
                                <FuturisticSelect
                                    value={frequency}
                                    onChange={(val) => setFrequency(val as any)}
                                    options={frequencyOptions}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="icon">Icon (optional)</label>
                                <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="Target" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={submitting}>
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Habit
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
