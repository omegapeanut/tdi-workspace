import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { collection, onSnapshot, type QuerySnapshot, type DocumentData } from "firebase/firestore";
import { db } from "../firebase";
import type {
  User,
  Department,
  Goal,
  Project,
  Milestone,
  Task,
  Comment,
  ActivityEvent,
  Kpi,
  Announcement,
} from "../types";

// BusinessHQ is built for 2-30 employees, so — same call the roadmap tracker
// made — the whole workspace is loaded live into memory via onSnapshot and
// everything downstream (rollups, filters, search) runs client-side over
// that in-memory copy. This keeps every page trivially "auto-saving" and
// realtime with zero extra plumbing, and only becomes the wrong call at a
// company size far beyond this product's stated scope.
interface DataState {
  loading: boolean;
  users: User[];
  departments: Department[];
  goals: Goal[];
  projects: Project[];
  milestones: Milestone[];
  tasks: Task[];
  comments: Comment[];
  activity: ActivityEvent[];
  kpis: Kpi[];
  announcements: Announcement[];
}

const DataContext = createContext<DataState | null>(null);

function live<T>(name: string, set: (rows: T[]) => void) {
  return onSnapshot(collection(db, name), (snap: QuerySnapshot<DocumentData>) => {
    set(
      snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as T)
        // @ts-expect-error status is common to all AuditFields-backed entities
        .filter((row) => row.status !== "deleted"),
    );
  });
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loadedKeys, setLoadedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const mark = (key: string) => setLoadedKeys((prev) => new Set(prev).add(key));
    const unsubs = [
      live<User>("hqUsers", (rows) => { setUsers(rows); mark("hqUsers"); }),
      live<Department>("hqDepartments", (rows) => { setDepartments(rows); mark("hqDepartments"); }),
      live<Goal>("hqGoals", (rows) => { setGoals(rows); mark("hqGoals"); }),
      live<Project>("hqProjects", (rows) => { setProjects(rows); mark("hqProjects"); }),
      live<Milestone>("hqMilestones", (rows) => { setMilestones(rows); mark("hqMilestones"); }),
      live<Task>("hqTasks", (rows) => { setTasks(rows); mark("hqTasks"); }),
      live<Comment>("hqComments", (rows) => { setComments(rows); mark("hqComments"); }),
      live<ActivityEvent>("hqActivity", (rows) => { setActivity(rows); mark("hqActivity"); }),
      live<Kpi>("hqKpis", (rows) => { setKpis(rows); mark("hqKpis"); }),
      live<Announcement>("hqAnnouncements", (rows) => { setAnnouncements(rows); mark("hqAnnouncements"); }),
    ];
    return () => unsubs.forEach((u) => u());
  }, []);

  const requiredKeys = [
    "hqUsers", "hqDepartments", "hqGoals", "hqProjects", "hqMilestones",
    "hqTasks", "hqComments", "hqActivity", "hqKpis", "hqAnnouncements",
  ];
  const loading = !requiredKeys.every((k) => loadedKeys.has(k));

  const value: DataState = {
    loading,
    users,
    departments,
    goals,
    projects,
    milestones,
    tasks,
    comments,
    activity,
    kpis,
    announcements,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
