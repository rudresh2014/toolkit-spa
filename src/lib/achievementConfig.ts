import { Award, Flame, Target, Sun, Moon } from "lucide-react";

export type AchievementKey =
    | "streak_3"
    | "streak_7"
    | "streak_30"
    | "consistency_50"
    | "consistency_75"
    | "early_bird"
    | "night_owl";

export type Habit = {
    id: string;
    user_id: string;
    title: string;
    frequency: "daily" | "weekly" | "monthly";
    icon: string;
    created_at: string;
};

export type HabitLog = {
    id: string;
    habit_id: string;
    date: string;
    created_at: string;
};

export type AchievementCheckData = {
    currentStreak: number;
    longestStreak: number;
    consistencyScore: number;
    logs: HabitLog[];
    habit: Habit;
};

export type Achievement = {
    key: AchievementKey;
    name: string;
    description: string;
    icon: any;
    checkCondition: (data: AchievementCheckData) => boolean;
};

export const ACHIEVEMENTS: Achievement[] = [
    {
        key: "streak_3",
        name: "Getting Started",
        description: "Complete 3 days in a row",
        icon: Flame,
        checkCondition: (data) => data.currentStreak >= 3
    },
    {
        key: "streak_7",
        name: "Week Warrior",
        description: "Complete 7 days in a row",
        icon: Flame,
        checkCondition: (data) => data.currentStreak >= 7
    },
    {
        key: "streak_30",
        name: "Month Master",
        description: "Complete 30 days in a row",
        icon: Award,
        checkCondition: (data) => data.currentStreak >= 30
    },
    {
        key: "consistency_50",
        name: "Steady Progress",
        description: "Achieve 50% consistency",
        icon: Target,
        checkCondition: (data) => data.consistencyScore >= 50
    },
    {
        key: "consistency_75",
        name: "Highly Consistent",
        description: "Achieve 75% consistency",
        icon: Target,
        checkCondition: (data) => data.consistencyScore >= 75
    },
    {
        key: "early_bird",
        name: "Early Bird",
        description: "Complete before 7 AM at least 10 times",
        icon: Sun,
        checkCondition: (data) => {
            const earlyLogs = data.logs.filter(log => {
                const hour = new Date(log.created_at).getHours();
                return hour < 7;
            });
            return earlyLogs.length >= 10;
        }
    },
    {
        key: "night_owl",
        name: "Night Owl",
        description: "Complete after 10 PM at least 10 times",
        icon: Moon,
        checkCondition: (data) => {
            const lateLogs = data.logs.filter(log => {
                const hour = new Date(log.created_at).getHours();
                return hour >= 22;
            });
            return lateLogs.length >= 10;
        }
    }
];
