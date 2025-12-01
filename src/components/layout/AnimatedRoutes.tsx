import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import AppLayout from "./AppLayout";
import Login from "../../pages/Login";
import Signup from "../../pages/Signup";
import ForgotPassword from "../../pages/ForgotPassword";
import Dashboard from "../../pages/dashboard/Dashboard";
import ChooseExperience from "../../pages/ChooseExperience";
import ExpenseTracker from "../../pages/ExpenseTracker";
import TodoApp from "../../pages/TodoApp";
import Habits from "../../pages/Habits";
import HabitDetail from "../../pages/habits/HabitDetail";
import PageTransition from "./PageTransition";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { session, loading } = useAuth();

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/login" element={
                    <PageTransition>
                        <Login />
                    </PageTransition>
                } />
                <Route path="/signup" element={
                    <PageTransition>
                        <Signup />
                    </PageTransition>
                } />
                <Route path="/forgot-password" element={
                    <PageTransition>
                        <ForgotPassword />
                    </PageTransition>
                } />

                <Route path="/choose" element={
                    <ProtectedRoute>
                        <PageTransition>
                            <ChooseExperience />
                        </PageTransition>
                    </ProtectedRoute>
                } />

                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>

                    <Route path="/" element={
                        <PageTransition>
                            <Dashboard />
                        </PageTransition>
                    } />
                    <Route path="/expense" element={
                        <PageTransition>
                            <ExpenseTracker />
                        </PageTransition>
                    } />
                    <Route path="/todo" element={
                        <PageTransition>
                            <TodoApp />
                        </PageTransition>
                    } />
                    <Route path="/habits" element={
                        <PageTransition>
                            <Habits />
                        </PageTransition>
                    } />
                    <Route path="/habits/:id" element={
                        <PageTransition>
                            <HabitDetail />
                        </PageTransition>
                    } />
                </Route>
            </Routes>
        </AnimatePresence>
    );
}
