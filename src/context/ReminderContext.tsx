import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../lib/supabase";

type Reminder = {
    id: string;
    habit_id: string;
    habit_title: string;
    reminder_time: string;
    enabled: boolean;
};

type ReminderContextType = {
    activeReminder: Reminder | null;
    dismissReminder: () => void;
    hasUnseenReminder: boolean;
    clearBadge: () => void;
};

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export function ReminderProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [activeReminder, setActiveReminder] = useState<Reminder | null>(null);
    const [hasUnseenReminder, setHasUnseenReminder] = useState(false);
    const [lastCheckedTime, setLastCheckedTime] = useState<string>("");

    useEffect(() => {
        if (!user) return;

        // Check every minute
        const interval = setInterval(() => {
            checkReminders();
        }, 60000);

        // Initial check
        checkReminders();

        return () => clearInterval(interval);
    }, [user]);

    const checkReminders = async () => {
        if (!user) return;

        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

        // Prevent duplicate notifications for same minute
        if (currentTime === lastCheckedTime) return;
        setLastCheckedTime(currentTime);

        // Fetch enabled reminders with habit info
        const { data: reminders } = await supabase
            .from('habit_reminders')
            .select(`
                id,
                habit_id,
                reminder_time,
                enabled,
                habits!inner (
                    title
                )
            `)
            .eq('user_id', user.id)
            .eq('enabled', true);

        if (!reminders || reminders.length === 0) return;

        // Check if any reminder matches current time
        const matchingReminder = reminders.find(r => r.reminder_time === currentTime);

        if (matchingReminder && matchingReminder.habits) {
            setActiveReminder({
                id: matchingReminder.id,
                habit_id: matchingReminder.habit_id,
                habit_title: (matchingReminder.habits as any).title,
                reminder_time: matchingReminder.reminder_time,
                enabled: matchingReminder.enabled
            });
            setHasUnseenReminder(true);
        }
    };

    const dismissReminder = () => {
        setActiveReminder(null);
    };

    const clearBadge = () => {
        setHasUnseenReminder(false);
    };

    return (
        <ReminderContext.Provider value={{ activeReminder, dismissReminder, hasUnseenReminder, clearBadge }}>
            {children}
        </ReminderContext.Provider>
    );
}

export function useReminder() {
    const context = useContext(ReminderContext);
    if (!context) throw new Error("useReminder must be used within ReminderProvider");
    return context;
}
