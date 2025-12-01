import { X } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

interface ReminderNotificationProps {
    habitTitle: string;
    onDismiss: () => void;
}

export function ReminderNotification({ habitTitle, onDismiss }: ReminderNotificationProps) {
    return (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2">
            <Card className="w-80 shadow-lg border-primary/50">
                <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                            <p className="text-sm font-medium">Habit Reminder</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Complete your habit: {habitTitle}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onDismiss}
                            className="h-6 w-6 -mr-2 -mt-2"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
