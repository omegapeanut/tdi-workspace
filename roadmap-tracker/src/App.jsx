import { useEffect, useState } from "react";
import { useAuth, logout } from "./lib/auth";
import { subscribePhases, subscribeKpis, subscribeDiscussionPoints, subscribeTeam } from "./lib/data";
import Login from "./components/Login";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import TrackView from "./components/TrackView";
import TeamSettings from "./components/TeamSettings";

export default function App() {
  const { loading, user, isMember } = useAuth();
  const [tab, setTab] = useState("overview");
  const [phases, setPhases] = useState([]);
  const [kpis, setKpis] = useState([]);
  const [discussionPoints, setDiscussionPoints] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    if (!isMember) return;
    const unsubs = [
      subscribePhases(setPhases),
      subscribeKpis(setKpis),
      subscribeDiscussionPoints(setDiscussionPoints),
      subscribeTeam(setTeam),
    ];
    return () => unsubs.forEach((u) => u());
  }, [isMember]);

  if (loading) return <div className="full-screen-loading">Loading…</div>;
  if (!user) return <Login />;
  if (isMember === false) {
    return (
      <div className="full-screen-loading">
        <p>{user.email} is signed in but isn't on the roadmap team list yet.</p>
        <p>Ask an existing member to add your account in the Firebase console.</p>
        <button type="button" className="secondary-btn" onClick={logout}>
          Sign out
        </button>
      </div>
    );
  }

  return (
    <Layout active={tab} onChange={setTab} user={user}>
      {tab === "overview" && (
        <Dashboard phases={phases} kpis={kpis} discussionPoints={discussionPoints} team={team} onNavigate={setTab} />
      )}
      {(tab === "vvision" || tab === "modula") && (
        <TrackView
          track={tab}
          phases={phases}
          kpis={kpis}
          discussionPoints={discussionPoints}
          team={team}
        />
      )}
      {tab === "team" && <TeamSettings team={team} />}
    </Layout>
  );
}
