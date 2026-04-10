import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ConfirmModal from "../../components/ConfirmModal";
import { Link } from "react-router-dom";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [confirmId, setConfirmId] = useState(null);

  const [form, setForm] = useState({
    asset_tag: "",
    name: "",
    category: "",
    purchase_date: "",
    purchase_cost: "",
    status: "available",
    department_id: ""
  });

  const [editingId, setEditingId] = useState(null);

  // FETCH ASSETS
  async function fetchAssets() {
    setLoading(true);

    const { data, error } = await supabase
      .from("assets")
      .select("*, departments(name)")
      .order("created_at", { ascending: false });

    if (!error) setAssets(data);

    setLoading(false);
  }

  // FETCH DEPARTMENTS
  async function fetchDepartments() {
    const { data } = await supabase
      .from("departments")
      .select("*")
      .order("name");

    setDepartments(data || []);
  }

  useEffect(() => {
    fetchAssets();
    fetchDepartments();
  }, []);

  // HANDLE INPUT CHANGE
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // ADD ASSET
//   async function addAsset(e) {
//     e.preventDefault();
//     setActionLoading(true);

//     const { error } = await supabase
//       .from("assets")
//       .insert([{ ...form }]);

//     if (!error) {
//       setForm({
//         asset_tag: "",
//         name: "",
//         category: "",
//         purchase_date: "",
//         purchase_cost: "",
//         status: "available",
//         department_id: ""
//       });
//       fetchAssets();
//     }

//     setActionLoading(false);
//   }
// async function addAsset(e) {
//   e.preventDefault();
//   setActionLoading(true);

//   const { data, error } = await supabase
//     .from("assets")
//     .insert([{ ...form }])
//     .select();

//   console.log("Insert result:", data);
//   console.log("Insert error:", error);

//   if (error) {
//     alert(error.message);
//   } else {
//     fetchAssets();
//   }

//   setActionLoading(false);
// }
async function addAsset(e) {
  e.preventDefault();
  setActionLoading(true);

  const cleanedData = {
    ...form,
    department_id: form.department_id || null,
    purchase_cost: form.purchase_cost || null,
    purchase_date: form.purchase_date || null,
  };

  const { data, error } = await supabase
    .from("assets")
    .insert([cleanedData])
    .select();

  console.log("Insert result:", data);
  console.log("Insert error:", error);

  if (error) {
    alert(error.message);
  } else {
    fetchAssets();
  }

  setActionLoading(false);
}

  // DELETE ASSET
  async function deleteAsset(id) {
    setActionLoading(true);

    await supabase.from("assets").delete().eq("id", id);

    setActionLoading(false);
    fetchAssets();
  }

  // UPDATE ASSET
  async function updateAsset(id) {
    setActionLoading(true);

    await supabase
      .from("assets")
      .update(form)
      .eq("id", id);

    setEditingId(null);
    setActionLoading(false);
    fetchAssets();
  }

  // START EDIT
  function startEdit(asset) {
    setEditingId(asset.id);
    setForm({
      asset_tag: asset.asset_tag,
      name: asset.name,
      category: asset.category || "",
      purchase_date: asset.purchase_date || "",
      purchase_cost: asset.purchase_cost || "",
      status: asset.status,
      department_id: asset.department_id || ""
    });
  }

  return (
    <div>
      <h2>Assets</h2>

      {/* ADD FORM */}
      <form onSubmit={addAsset}>
        <input
          name="asset_tag"
          placeholder="Asset Tag"
          value={form.asset_tag}
          onChange={handleChange}
          required
        />
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
        />
        <input
          type="date"
          name="purchase_date"
          value={form.purchase_date}
          onChange={handleChange}
        />
        <input
          type="number"
          name="purchase_cost"
          placeholder="Cost"
          value={form.purchase_cost}
          onChange={handleChange}
        />

        {/* STATUS DROPDOWN */}
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="available">Available</option>
          <option value="assigned">Assigned</option>
          <option value="maintenance">Maintenance</option>
          <option value="retired">Retired</option>
        </select>

        {/* DEPARTMENT DROPDOWN */}
        <select
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <button disabled={actionLoading}>
          {actionLoading ? "Adding..." : "Add Asset"}
        </button>
      </form>

      {/* ASSET LIST */}
      {loading ? (
        <p>Loading assets...</p>
      ) : (
        <ul>
          {assets.map((asset) => (
            <li key={asset.id}>

              {editingId === asset.id ? (
                <>
                  <input
                    name="asset_tag"
                    value={form.asset_tag}
                    onChange={handleChange}
                  />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />

                  <button onClick={() => updateAsset(asset.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <strong>{asset.asset_tag}</strong> - {asset.name}
                  <Link to={`/assets/${asset.id}`}>
  {asset.name}
</Link>
                  ({asset.status})
                  {" | Dept: "}
                  {asset.departments?.name || "None"}

                  <button onClick={() => startEdit(asset)}>
                    Edit
                  </button>
                  <button onClick={() => setConfirmId(asset.id)}>
                    Delete
                  </button>
                </>
              )}

            </li>
          ))}
        </ul>
      )}

      {/* CONFIRM MODAL */}
      <ConfirmModal
        isOpen={!!confirmId}
        title="Delete Asset"
        message="Are you sure you want to delete this asset?"
        loading={actionLoading}
        onCancel={() => setConfirmId(null)}
        onConfirm={async () => {
          await deleteAsset(confirmId);
          setConfirmId(null);
        }}
      />
    </div>
  );
}