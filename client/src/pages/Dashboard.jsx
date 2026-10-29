import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import StatsCard from "../components/dashboard/StatsCard";
import ProfileCard from "../components/dashboard/ProfileCard";
import QuickActions from "../components/dashboard/QuickActions";
import RecentIncidents from "../components/dashboard/RecentIncidents";
import LiveMap from "../components/dashboard/LiveMap";

import { getMyIncidents } from "../services/incidentService";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [incidents, setIncidents] = useState([]);

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    active: 0,
    resolved: 0,
  });

  const loadIncidents = async () => {
    try {
      const data = await getMyIncidents();

      const list = Array.isArray(data)
        ? data
        : data.incidents || [];

      setIncidents(list);

      setStats({
        total: list.length,
        pending: list.filter((i) => i.status === "Pending").length,
        active: list.filter(
          (i) =>
            i.status === "Assigned" ||
            i.status === "In Progress"
        ).length,
        resolved: list.filter(
          (i) => i.status === "Resolved"
        ).length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login");
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));
    loadIncidents();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatsCard
          title="Total Incidents"
          value={stats.total}
          icon="🚨"
          color="bg-red-600"
        />

        <StatsCard
          title="Pending"
          value={stats.pending}
          icon="⏳"
          color="bg-yellow-500"
        />

        <StatsCard
          title="Active"
          value={stats.active}
          icon="🚑"
          color="bg-blue-600"
        />

        <StatsCard
          title="Resolved"
          value={stats.resolved}
          icon="✅"
          color="bg-green-600"
        />

      </div>

      <div className="mb-8">
        <QuickActions />
      </div>

      {/* Live Map */}
<div className="mb-8">
  <LiveMap incidents={incidents} />
</div>

{/* Recent Incidents + Profile */}
<div className="grid lg:grid-cols-3 gap-8">

  <div className="lg:col-span-2">
    <RecentIncidents incidents={incidents} />
  </div>

  <div>
    <ProfileCard user={user} />
  </div>

</div>

    </DashboardLayout>
  );
}

export default Dashboard;