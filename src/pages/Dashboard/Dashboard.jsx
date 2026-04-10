import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState({
    totalAssets: 0,
    availableAssets: 0,
    assignedAssets: 0,
    maintenancePending: 0,
    totalUsers: 0,
    totalDepartments: 0,
    myAssets: 0,
    myMaintenance: 0
  });

  useEffect(() => {
    if (isAdmin) {
      fetchAdminStats();
    } else {
      fetchStaffStats();
    }
  }, [isAdmin]);

  // 👑 ADMIN STATS
  async function fetchAdminStats() {
    const { count: totalAssets } = await supabase
      .from("assets")
      .select("*", { count: "exact", head: true });

    const { count: availableAssets } = await supabase
      .from("assets")
      .select("*", { count: "exact", head: true })
      .eq("status", "available");

    const { count: assignedAssets } = await supabase
      .from("assets")
      .select("*", { count: "exact", head: true })
      .eq("status", "assigned");

    const { count: maintenancePending } = await supabase
      .from("maintenance")
      .select("*", { count: "exact", head: true })
      .neq("status", "completed");

    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true });

    const { count: totalDepartments } = await supabase
      .from("departments")
      .select("*", { count: "exact", head: true });

    setStats({
      totalAssets,
      availableAssets,
      assignedAssets,
      maintenancePending,
      totalUsers,
      totalDepartments
    });
  }

  // 👤 STAFF STATS
  async function fetchStaffStats() {
    const { count: myAssets } = await supabase
      .from("assignments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");

    const { count: myMaintenance } = await supabase
      .from("maintenance")
      .select("*", { count: "exact", head: true })
      .eq("reported_by", user.id)
      .neq("status", "completed");

    setStats({
      myAssets,
      myMaintenance
    });
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{isAdmin ? "Admin Dashboard" : "Staff Dashboard"}</h2>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {isAdmin ? (
          <>
            <Card title="Total Assets" value={stats.totalAssets} />
            <Card title="Available Assets" value={stats.availableAssets} />
            <Card title="Assigned Assets" value={stats.assignedAssets} />
            <Card title="Pending Maintenance" value={stats.maintenancePending} />
            <Card title="Total Users" value={stats.totalUsers} />
            <Card title="Departments" value={stats.totalDepartments} />
          </>
        ) : (
          <>
            <Card title="My Active Assets" value={stats.myAssets} />
            <Card title="My Pending Maintenance" value={stats.myMaintenance} />
          </>
        )}
      </div>
    </div>
  );
}

// 🎨 Reusable Card Component
function Card({ title, value }) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        minWidth: 200,
        textAlign: "center"
      }}
    >
      <h4>{title}</h4>
      <h2>{value ?? 0}</h2>
    </div>
  );
}