import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { Card, SectionHeading } from "../components/common/Card";
import { Avatar } from "../components/common/Avatar";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { updateEntity } from "../lib/mutations";
import { canManageUsers } from "../lib/permissions";
import { TEAM_LOGINS } from "../config";
import type { Role, User } from "../types";

const PALETTE = ["#8A9A7E", "#BE8C5C", "#7A93A8", "#B5533C", "#8B7CB0", "#5F8A6F"];

const PERMISSIONS_TABLE: { role: string; scope: string }[] = [
  { role: "Owner", scope: "Everything" },
  { role: "Admin", scope: "Everything except billing" },
  { role: "Manager", scope: "Their department" },
  { role: "Employee", scope: "Their own work" },
];

export function SettingsPage() {
  const { profile } = useAuth();
  const { users, departments, loading } = useData();
  const navigate = useNavigate();
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(TEAM_LOGINS[0]?.email ?? "");
  const [departmentId, setDepartmentId] = useState("");
  const [role, setRole] = useState<Role>("employee");
  const [status, setStatus] = useState("");

  if (!profile || loading) return null;
  const canAdmin = canManageUsers(profile.role);

  async function provisionUser() {
    if (!uid.trim() || !name.trim()) return;
    const newUser: Omit<User, "id"> = {
      name: name.trim(), email, role, departmentId: departmentId || null, managerId: null,
      jobTitle: "", avatarColor: PALETTE[users.length % PALETTE.length], availability: "available",
      createdBy: profile!.id, updatedBy: profile!.id, createdAt: Date.now(), updatedAt: Date.now(), status: "active",
    };
    await setDoc(doc(db, "hqUsers", uid.trim()), newUser);
    setStatus(`${name.trim()} added.`);
    setUid(""); setName("");
    setTimeout(() => setStatus(""), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-muted">Your profile, the team roster, and how permissions work.</p>
      </div>

      <Card className="flex items-center gap-4">
        <Avatar name={profile.name} color={profile.avatarColor} size="lg" />
        <div className="flex-1">
          <div className="font-display text-lg font-semibold text-ink">{profile.name}</div>
          <div className="text-sm text-muted">{profile.jobTitle || "Team member"}</div>
        </div>
        <button type="button" onClick={() => navigate(`/people/${profile.id}`)} className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink-soft hover:bg-surface-soft">
          Edit my profile
        </button>
      </Card>

      <Card>
        <SectionHeading title="Resetting your PIN" />
        <p className="text-sm text-muted">
          BusinessHQ uses a name + 4-digit PIN to sign in. There's no self-service reset yet — ask an Owner or Admin
          to update your password in the Firebase console (Authentication → your row → Reset password).
        </p>
      </Card>

      {canAdmin && (
        <>
          <Card>
            <SectionHeading title="Team & Roles" subtitle="Every signed-in person and what they can do" />
            <div className="flex flex-col">
              {users.map((u) => {
                const dept = departments.find((d) => d.id === u.departmentId);
                return (
                  <div key={u.id} className="flex flex-wrap items-center gap-3 border-t border-line/70 py-3 first:border-t-0">
                    <Avatar name={u.name} color={u.avatarColor} size="sm" />
                    <span className="min-w-[100px] flex-1 text-sm font-semibold text-ink">{u.name}</span>
                    <select value={u.role} onChange={(e) => updateEntity<User>("hqUsers", u.id, { role: e.target.value as Role }, profile.id)} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                      <option value="owner">Owner</option>
                      <option value="admin">Admin</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </select>
                    <select value={u.departmentId ?? ""} onChange={(e) => updateEntity<User>("hqUsers", u.id, { departmentId: e.target.value || null }, profile.id)} className="rounded-lg border border-line bg-surface px-2 py-1 text-xs">
                      <option value="">No department</option>
                      {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    {dept && <span className="text-[11px] text-muted">{dept.name}</span>}
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionHeading title="Add a teammate" subtitle="After creating their sign-in in the Firebase console" />
            <p className="mb-3 text-xs text-muted">
              1. Add them to <code>TEAM_LOGINS</code> in <code>src/config.ts</code> and redeploy. 2. Create their Firebase Auth
              account (Authentication → Add user) with that email and a <code>hq-XXXX</code> password. 3. Paste their UID here
              to create their BusinessHQ profile.
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
              <input value={uid} onChange={(e) => setUid(e.target.value)} placeholder="Firebase Auth UID" className="rounded-xl border border-line bg-surface px-3 py-2 text-sm" />
              <select value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                {TEAM_LOGINS.map((p) => <option key={p.email} value={p.email}>{p.name} · {p.email}</option>)}
              </select>
              <select value={departmentId} onChange={(e) => setDepartmentId(e.target.value)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                <option value="">No department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="rounded-xl border border-line bg-surface px-3 py-2 text-sm">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <button type="button" onClick={provisionUser} disabled={!uid.trim() || !name.trim()} className="rounded-full bg-sage-600 px-4 py-2 text-sm font-bold text-white hover:bg-sage-700 disabled:opacity-50">
                Add teammate
              </button>
              {status && <span className="text-sm font-semibold text-sage-600">{status}</span>}
            </div>
          </Card>
        </>
      )}

      <Card>
        <SectionHeading title="Permissions" />
        <div className="flex flex-col">
          {PERMISSIONS_TABLE.map((row) => (
            <div key={row.role} className="flex justify-between border-t border-line/70 py-2.5 first:border-t-0 text-sm">
              <span className="font-semibold text-ink">{row.role}</span>
              <span className="text-muted">{row.scope}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
