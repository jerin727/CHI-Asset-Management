import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function Maintenance() {
  const { user, isAdmin } = useAuth();
  const [assets, setAssets] = useState([]);
  const [records, setRecords] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAssets();
    fetchMaintenance();
  }, []);

  async function fetchAssets() {
    const { data } = await supabase
      .from("assets")
      .select("id, name, asset_tag")
      .order("created_at", { ascending: false });

    setAssets(data || []);
  }

  async function fetchMaintenance() {
    setLoading(true);

    const { data, error } = await supabase
      .from("maintenance")
      .select(
        `
        id,
        issue_description,
        status,
        reported_at,
        resolved_at,
        asset_id,
        assets (
          name,
          asset_tag
        ),
        profiles:reported_by (full_name)
      `,
      )
      .order("reported_at", { ascending: false });

    if (error) console.error(error);
    else setRecords(data || []);

    setLoading(false);
  }

  // async function handleCreate(e) {
  //   e.preventDefault();

  //   if (!user) {
  //     alert("User not loaded");
  //     return;
  //   }

  //   const { error } = await supabase.from("maintenance").insert([
  //     {
  //       asset_id: selectedAsset,
  //       issue_description: description,
  //       reported_by: user.id,
  //     },
  //   ]);

  //   if (error) {
  //     console.error(error);
  //     alert(error.message);
  //   }
  // }
  async function handleCreate(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await supabase
    .from("maintenance")
    .insert([
      {
        asset_id: selectedAsset,
        issue_description: description,
        reported_by: user.id
      }
    ]);

  if (error) {
    console.error(error);
    setLoading(false);
    return;
  }

  // 🔥 CLEAR FORM
  // setIssueDescription("");
  setSelectedAsset("");

  // 🔥 REFRESH LIST
  await fetchMaintenance();

  setLoading(false);
}

  // 🔹 Update Status (Admin Only)
  async function updateStatus(id, newStatus, assetId) {
    setLoading(true);

    const updates = {
      status: newStatus,
    };

    if (newStatus === "completed") {
      updates.resolved_at = new Date();
    }

    await supabase.from("maintenance").update(updates).eq("id", id);

    if (newStatus === "completed") {
      await supabase
        .from("assets")
        .update({ status: "available" })
        .eq("id", assetId);
    }

    await fetchMaintenance();
    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Maintenance Management</h2>

      {/* 🔹 Create Form */}
      <form onSubmit={handleCreate}>
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

        <input
          type="text"
          placeholder="Describe the issue..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Report Issue"}
        </button>
      </form>

      <hr />

      {/* 🔹 Maintenance List */}
      <h3>Maintenance Records</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Asset</th>
              <th>Description</th>
              <th>Status</th>
              <th>Reported by</th>
              <th>Reported time</th>
              <th>Resolved time</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id}>
                <td>
                  {r.assets?.asset_tag} - {r.assets?.name}
                </td>
                <td>{r.issue_description}</td>
                <td>{r.status}</td>
                <td>{r.profiles?.full_name || "Unknown"}</td>
                
                <td>{new Date(r.reported_at).toLocaleString()}</td>
                <td>
                  {r.resolved_at
                    ? new Date(r.resolved_at).toLocaleString()
                    : "-"}
                </td>

                {isAdmin && (
                  <td>
                    {r.status !== "completed" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(r.id, "in_progress", r.asset_id)
                          }
                        >
                          In Progress
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(r.id, "completed", r.asset_id)
                          }
                        >
                          Complete
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
