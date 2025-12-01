import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 767px)").matches);
        };

        // Initial check
        checkMobile();

        // Listener
        const mediaQuery = window.matchMedia("(max-width: 767px)");
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

        mediaQuery.addEventListener("change", handler);

        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    return isMobile;
}
