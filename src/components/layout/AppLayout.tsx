import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileBottomNav } from "../dashboard/mobile/MobileBottomNav";
import { useState, useEffect } from "react";

function DesktopAppLayout() {
    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function MobileAppLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <main className="flex-1 overflow-y-auto pb-20">
                <div className="p-4">
                    <Outlet />
                </div>
            </main>
            <MobileBottomNav />
        </div>
    );
}

export default function AppLayout() {
    const [viewMode, setViewMode] = useState<"web" | "mobile">("web");

    useEffect(() => {
        const stored = localStorage.getItem("viewMode");
        if (stored === "mobile" || stored === "web") {
            setViewMode(stored);
        }
    }, []);

    if (viewMode === "mobile") {
        return <MobileAppLayout />;
    }
    return <DesktopAppLayout />;
}
