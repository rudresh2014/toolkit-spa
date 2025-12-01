import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReminderProvider, useReminder } from "./context/ReminderContext";
import { ThemeProvider } from "./components/theme-provider";
import AnimatedRoutes from "./components/layout/AnimatedRoutes";
import { ReminderNotification } from "./components/ReminderNotification";

function AppContent() {
  const { activeReminder, dismissReminder } = useReminder();

  return (
    <>
      <AnimatedRoutes />
      {activeReminder && (
        <ReminderNotification
          habitTitle={activeReminder.habit_title}
          onDismiss={dismissReminder}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AuthProvider>
        <ReminderProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ReminderProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
