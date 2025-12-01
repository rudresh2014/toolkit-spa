import React, { Suspense } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { Loader2 } from "lucide-react";

const DesktopDashboard = React.lazy(() => import("./Dashboard.desktop"));
const MobileDashboard = React.lazy(() => import("./Dashboard.mobile"));

export default function Dashboard() {
    const isMobile = useIsMobile();

    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-full min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            {isMobile ? <MobileDashboard /> : <DesktopDashboard />}
        </Suspense>
    );
}
