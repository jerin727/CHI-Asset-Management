import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function AdminUsers() {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchDepartments();
    }
  }, [isAdmin]);

  async function fetchUsers() {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        departments ( name )
      `)
      .order("created_at", { ascending: false });

    setUsers(data || []);
  }

  async function fetchDepartments() {
    const { data } = await supabase
      .from("departments")
      .select("*");

    setDepartments(data || []);
  }

  async function updateUser(id, field, value) {
    setLoading(true);

    await supabase
      .from("profiles")
      .update({ [field]: value })
      .eq("id", id);

    await fetchUsers();
    setLoading(false);
  }

  async function deleteUser(id) {
    if (!window.confirm("Delete this user?")) return;

    setLoading(true);

    await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    await fetchUsers();
    setLoading(false);
  }

  if (!isAdmin) {
    return <p>Access denied</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin User Management</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>

              {/* ROLE SELECT */}
              <td>
                <select
                  value={user.role}
                  onChange={(e) =>
                    updateUser(user.id, "role", e.target.value)
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </td>

              {/* DEPARTMENT SELECT */}
              <td>
                <select
                  value={user.department_id || ""}
                  onChange={(e) =>
                    updateUser(user.id, "department_id", e.target.value)
                  }
                >
                  <option value="">None</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                {new Date(user.created_at).toLocaleDateString()}
              </td>

              <td>
                <button
                  onClick={() => deleteUser(user.id)}
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}