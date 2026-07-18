import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { AppShell } from "./components/layout/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { DeniedPage } from "./pages/DeniedPage";
import { DashboardPage } from "./pages/DashboardPage";
import { MyTasksPage } from "./pages/MyTasksPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { GoalsPage } from "./pages/GoalsPage";
import { DepartmentsPage } from "./pages/DepartmentsPage";
import { PeoplePage } from "./pages/PeoplePage";
import { PersonDetailPage } from "./pages/PersonDetailPage";
import { ReportsPage } from "./pages/ReportsPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ComingSoon } from "./components/common/EmptyState";

function Splash() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg">
      <div className="flex flex-col items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 font-display text-sm font-bold text-white animate-pulse">M</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-muted">Loading BusinessHQ…</span>
      </div>
    </div>
  );
}

function Gate() {
  const { phase } = useAuth();

  if (phase === "loading") return <Splash />;
  if (phase === "signed_out") return <LoginPage />;
  if (phase === "not_provisioned") return <DeniedPage />;

  return (
    <DataProvider>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="my-tasks" element={<MyTasksPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route path="calendar" element={<ComingSoon title="Calendar" description="A shared team calendar for deadlines, milestones and events is coming soon." />} />
          <Route path="people" element={<PeoplePage />} />
          <Route path="people/:userId" element={<PersonDetailPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="documents" element={<ComingSoon title="Documents" description="A simple knowledge base for SOPs, policies and meeting notes is coming soon." />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </DataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Gate />
    </AuthProvider>
  );
}
