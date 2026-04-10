import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ConfirmModal from "../../components/ConfirmModal";

export default function Departments() {
    const [loading, setLoading] = useState(false);
const [actionLoading, setActionLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
//   const [confirmId, setConfirmId] = useState(null);
const [confirmId, setConfirmId] = useState(null);

  //   async function fetchDepartments() {
  //     const { data, error } = await supabase
  //       .from("departments")
  //       .select("*")
  //       .order("created_at", { ascending: false });

  //     if (error) {
  //       console.error(error);
  //     } else {
  //       setDepartments(data);
  //     }
  //   }

  async function fetchDepartments() {
    setLoading(true);

    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setDepartments(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchDepartments();
  }, []);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // async function addDepartment(e) {
  //   e.preventDefault();

  //   const { error } = await supabase
  //     .from("departments")
  //     .insert([{ name, description }]);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     setName("");
  //     setDescription("");
  //     fetchDepartments(); // refresh list
  //   }
  // }
  async function addDepartment(e) {
    e.preventDefault();
    setActionLoading(true);

    const { error } = await supabase
      .from("departments")
      .insert([{ name, description }]);

    if (error) {
      alert(error.message);
    } else {
      setName("");
      setDescription("");
      fetchDepartments();
    }

    setActionLoading(false);
  }

  // async function deleteDepartment(id) {
  //   const { error } = await supabase
  //     .from("departments")
  //     .delete()
  //     .eq("id", id);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     fetchDepartments();
  //   }
  // }
  async function deleteDepartment(id) {
    setActionLoading(true);

    const { error } = await supabase.from("departments").delete().eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      fetchDepartments();
    }

    setActionLoading(false);
  }
  // async function updateDepartment(id) {
  //   const { error } = await supabase
  //     .from("departments")
  //     .update({
  //       name: editName,
  //       description: editDescription
  //     })
  //     .eq("id", id);

  //   if (error) {
  //     alert(error.message);
  //   } else {
  //     setEditingId(null);
  //     fetchDepartments();
  //   }
  // }
  async function updateDepartment(id) {
    setActionLoading(true);

    const { error } = await supabase
      .from("departments")
      .update({
        name: editName,
        description: editDescription,
      })
      .eq("id", id);

    if (error) {
      alert(error.message);
    } else {
      setEditingId(null);
      fetchDepartments();
    }

    setActionLoading(false);
  }
  return (
    <div>
      <h2>Departments</h2>
      <form onSubmit={addDepartment}>
        <input
          placeholder="Department name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {/* <button type="submit">Add</button> */}
        <button type="submit" disabled={actionLoading}>
          {actionLoading ? "Adding..." : "Add"}
        </button>
      </form>
      {loading ? (
        <p>Loading departments...</p>
      ) : (
        <ul>
            
<ConfirmModal
  isOpen={!!confirmId}
  title="Delete Department"
  message={`Are you sure you want to delete ${
    departments.find(d => d.id === confirmId)?.name || ""
  }?`}
  loading={actionLoading}
  onCancel={() => setConfirmId(null)}
  onConfirm={async () => {
    await deleteDepartment(confirmId);
    setConfirmId(null);
  }}
/>
          {departments.map((dept) => (
            <li key={dept.id}>
              {editingId === dept.id ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                  <input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  {/* <button onClick={() => updateDepartment(dept.id)}>
            Save
          </button> */}
                  <button
                    disabled={actionLoading}
                    onClick={() => updateDepartment(dept.id)}
                  >
                    {actionLoading ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {dept.name} - {dept.description}
                  {/* <button onClick={() => deleteDepartment(dept.id)}>
            Delete
          </button> */}
                  <button
                    disabled={actionLoading}
                    // onClick={() => deleteDepartment(dept.id)}
                    onClick={() => setConfirmId(dept.id)}
                  >
                    {actionLoading ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(dept.id);
                      setEditName(dept.name);
                      setEditDescription(dept.description);
                    }}
                  >
                    Edit
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
