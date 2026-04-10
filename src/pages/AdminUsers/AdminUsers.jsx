import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";

export default function AdminUsers() {
  const { isAdmin } = useAuth();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load when admin
  useEffect(() => {
    if (isAdmin) {
      fetchDepartments();
      fetchUsers();
    }
  }, [isAdmin]);

  // Refetch on filter change
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [search, roleFilter, departmentFilter]);

  async function fetchDepartments() {
    const { data } = await supabase
      .from("departments")
      .select("id, name");

    setDepartments(data || []);
  }

  async function fetchUsers() {
    setLoading(true);

    let query = supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        role,
        department_id,
        created_at,
        departments(name)
      `)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.ilike("full_name", `%${search}%`);
    }

    if (roleFilter) {
      query = query.eq("role", roleFilter);
    }

    if (departmentFilter) {
      query = query.eq("department_id", departmentFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
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

    await supabase.from("profiles").delete().eq("id", id);

    await fetchUsers();
    setLoading(false);
  }

  if (!isAdmin) return <p>Access denied</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin User Management</h2>

      {/* 🔎 FILTERS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
        </select>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 TABLE */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
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
      )}
    </div>
  );
}