// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { supabase } from "../../lib/supabase";

// export default function AssetDetail() {
//   const { id } = useParams();
//   const [asset, setAsset] = useState(null);
//   const [assignments, setAssignments] = useState([]);
//   const [maintenance, setMaintenance] = useState([]);

//   useEffect(() => {
//     fetchAsset();
//   }, [id]);

//   async function fetchAsset() {
//     // Asset with category + department
//     const { data: assetData } = await supabase
//       .from("assets")
//       .select(
//         `
//          *,
//          departments(name)
//          `,
//       )
//       .eq("id", id)
//       .single();

//     setAsset(assetData);

//     // Assignment history
//     const { data: assignmentData } = await supabase
//       .from("assignments")
//       .select(
//         `
//         *,
//         profiles(full_name)
//       `,
//       )
//       .eq("asset_id", id)
//       .order("assigned_at", { ascending: false });

//     setAssignments(assignmentData);

//     // Maintenance history
//     const { data: maintenanceData } = await supabase
//       .from("maintenance")
//       .select("*")
//       .eq("asset_id", id)
//       .order("created_at", { ascending: false });

//     setMaintenance(maintenanceData);
//   }

//   if (!asset) return <p>Loading...</p>;

//   return (
//     <div className="p-6 space-y-6">
//       {/* Basic Info */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">Asset Details</h2>
//         <p>
//           <strong>Name:</strong> {asset.name}
//         </p>
//         <p>
//           <strong>Tag:</strong> {asset.asset_tag}
//         </p>
//         <p>
//           <strong>Status:</strong> {asset.status}
//         </p>
//         <p>
//           <strong>Category:</strong> {asset.categories?.name}
//         </p>
//         <p>
//           <strong>Department:</strong> {asset.departments?.name}
//         </p>
//         <p>
//           <strong>Warranty Expiry:</strong> {asset.warranty_expiry}
//         </p>
//       </div>

//       {/* Assignment History */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">Assignment History</h2>
//         {assignments.map((a) => (
//           <div key={a.id} className="border-b py-2">
//             <p>User: {a.profiles?.full_name}</p>
//             <p>Assigned: {new Date(a.assigned_at).toLocaleDateString()}</p>
//             <p>
//               Returned:{" "}
//               {a.returned_at
//                 ? new Date(a.returned_at).toLocaleDateString()
//                 : "Active"}
//             </p>
//           </div>
//         ))}
//       </div>

//       {/* Maintenance */}
//       <div className="bg-white p-6 rounded shadow">
//         <h2 className="text-xl font-bold mb-4">Maintenance</h2>
//         {maintenance.map((m) => (
//           <div key={m.id} className="border-b py-2">
//             <p>Issue: {m.issue}</p>
//             <p>Status: {m.status}</p>
//             <p>Date: {new Date(m.created_at).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [asset, setAsset] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) fetchAsset();
  }, [id]);

  async function fetchAsset() {
    setLoading(true);
    setError(null);

    // 1️⃣ Fetch Asset
    const { data: assetData, error: assetError } = await supabase
      .from("assets")
      .select(`
        *,
        departments(name)
      `)
      .eq("id", id)
      .single();

    if (assetError) {
      console.error("Asset fetch error:", assetError);
      setError("Failed to load asset.");
      setLoading(false);
      return;
    }

    setAsset(assetData);

    // 2️⃣ Fetch Assignments
    const { data: assignmentData, error: assignError } = await supabase
      .from("assignments")
      .select(`
        *,
        profiles(full_name)
      `)
      .eq("asset_id", id)
      .order("assigned_at", { ascending: false });

    if (assignError) {
      console.error("Assignment fetch error:", assignError);
    } else {
      setAssignments(assignmentData || []);
    }

    setLoading(false);
  }

  async function handleReturn(assignmentId) {
    const confirmReturn = window.confirm("Mark this asset as returned?");
    if (!confirmReturn) return;

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
      .eq("id", id);

    fetchAsset();
  }

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (error) return <p style={{ padding: 20 }}>{error}</p>;
  if (!asset) return <p style={{ padding: 20 }}>Asset not found</p>;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <h2>{asset.name}</h2>

      <div style={cardStyle}>
        <p><strong>Asset Tag:</strong> {asset.asset_tag}</p>
        <p><strong>Status:</strong> {asset.status}</p>
        <p><strong>Category:</strong> {asset.category || "-"}</p>
        <p><strong>Purchase Date:</strong> {asset.purchase_date || "-"}</p>
        <p><strong>Purchase Cost:</strong> ₹{asset.purchase_cost || "-"}</p>
        <p>
          <strong>Department:</strong>{" "}
          {asset.departments?.name || "Not Assigned"}
        </p>
      </div>

      <h3 style={{ marginTop: 30 }}>Assignment History</h3>

      {assignments.length === 0 ? (
        <p>No assignments yet.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th>User</th>
              <th>Assigned At</th>
              <th>Returned At</th>
              <th>Status</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.profiles?.full_name || "Unknown"}</td>
                <td>{new Date(a.assigned_at).toLocaleString()}</td>
                <td>
                  {a.returned_at
                    ? new Date(a.returned_at).toLocaleString()
                    : "-"}
                </td>
                <td>{a.status}</td>
                {isAdmin && a.status === "active" && (
                  <td>
                    <button
                      style={returnBtn}
                      onClick={() => handleReturn(a.id)}
                    >
                      Mark Returned
                    </button>
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

/* ---------- Styles ---------- */

const containerStyle = {
  padding: "30px"
};

const cardStyle = {
  background: "#f3f4f6",
  padding: "20px",
  borderRadius: "8px",
  marginTop: "10px"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "15px"
};

const backBtn = {
  marginBottom: "20px",
  cursor: "pointer"
};

const returnBtn = {
  padding: "5px 10px",
  background: "#10b981",
  color: "white",
  border: "none",
  cursor: "pointer",
  borderRadius: "4px"
};