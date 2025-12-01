import React, { Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const DesktopDashboard = React.lazy(() => import("./Dashboard.desktop"));
const MobileDashboard = React.lazy(() => import("./Dashboard.mobile"));

export default function Dashboard() {
    const navigate = useNavigate();
    const viewMode = localStorage.getItem("viewMode");

    useEffect(() => {
        if (!viewMode) {
            navigate("/choose");
        }
    }, [viewMode, navigate]);

    if (!viewMode) return null;

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            {viewMode === 'mobile' ? <MobileDashboard /> : <DesktopDashboard />}
        </Suspense>
    );
}
