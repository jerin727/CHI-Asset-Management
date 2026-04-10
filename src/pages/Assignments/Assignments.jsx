import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

export default function Assignments() {
  const { isAdmin } = useAuth();

  const [assets, setAssets] = useState([]);
  const [users, setUsers] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchUsers();
    fetchAssignments();
  }, []);

  async function fetchAssets() {
    const { data } = await supabase
      .from("assets")
      .select("*")
      .eq("status", "available");

    setAssets(data || []);
  }

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select("*");

    setUsers(data || []);
  }

  async function fetchAssignments() {
    const { data } = await supabase
      .from("assignments")
      .select(`
        *,
        assets (name, asset_tag),
        profiles (full_name)
      `)
      .order("assigned_at", { ascending: false });

    setAssignments(data || []);
    await supabase.from("notifications").insert([
  {
    user_id: selectedUser,
    title: "New Asset Assigned",
    message: "An asset has been assigned to you.",
    type: "assignment"
  }
]);
  }

  // 🔹 Assign Asset
  async function handleAssign(e) {
    e.preventDefault();
    setLoading(true);

    // Insert assignment
    const { error } = await supabase
      .from("assignments")
      .insert([
        {
          asset_id: selectedAsset,
          user_id: selectedUser,
          status: "active"
        }
      ]);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    // Update asset status
    await supabase
      .from("assets")
      .update({ status: "assigned" })
      .eq("id", selectedAsset);

    setSelectedAsset("");
    setSelectedUser("");

    await fetchAssets();
    await fetchAssignments();

    setLoading(false);
  }

  // 🔹 Return Asset
  async function handleReturn(assignmentId, assetId) {
    setLoading(true);

    await supabase
      .from("assignments")
      .update({
        status: "returned",
        returned_at: new Date()
      })
      .eq("id", assignmentId);

    await supabase
      .from("assets")
      .update({ status: "available" })
      .eq("id", assetId);

    await fetchAssets();
    await fetchAssignments();

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Asset Assignments</h2>

      {/* ASSIGN FORM */}
      {isAdmin && (
        <form onSubmit={handleAssign}>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            required
          >
            <option value="">Select Asset</option>
            {assets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.asset_tag} - {asset.name}
              </option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.full_name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={loading}>
            {loading ? "Assigning..." : "Assign"}
          </button>
        </form>
      )}

      <hr />

      {/* ASSIGNMENT LIST */}
      <h3>Assignment History</h3>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Asset</th>
            <th>User</th>
            <th>Status</th>
            <th>Assigned At</th>
            <th>Returned At</th>
            {isAdmin && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <tr key={a.id}>
              <td>
                {a.assets?.asset_tag} - {a.assets?.name}
              </td>
              <td>{a.profiles?.full_name}</td>
              <td>{a.status}</td>
              <td>{new Date(a.assigned_at).toLocaleString()}</td>
              <td>
                {a.returned_at
                  ? new Date(a.returned_at).toLocaleString()
                  : "-"}
              </td>

              {isAdmin && a.status === "active" && (
                <td>
                  <button
                    onClick={() =>
                      handleReturn(a.id, a.asset_id)
                    }
                  >
                    Return
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}