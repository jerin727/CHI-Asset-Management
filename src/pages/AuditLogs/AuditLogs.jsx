import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);

    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        id,
        action,
        table_name,
        record_id,
        created_at,
        profiles (
          full_name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setLogs(data || []);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Audit Logs</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>User</th>
              <th>Action</th>
              <th>Table</th>
              <th>Record ID</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.profiles?.full_name || "System"}</td>
                <td>{log.action}</td>
                <td>{log.table_name}</td>
                <td>{log.record_id || "-"}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}