import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useAuth } from "../../hooks/useAuth";
import QRCode from "qrcode";

export default function StaffQrView() {
  const { token } = useParams();
  const { user, profile } = useAuth();
  const [qrImage, setQrImage] = useState("");
  const [staff, setStaff] = useState(null);
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchStaff();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const url = `${window.location.origin}/staff-qr/${token}`;

    QRCode.toDataURL(url).then((data) => {
      setQrImage(data);
    });
  }, [token]);

  async function fetchStaff() {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("qr_token", token)
      .single();

    if (error || !data) return;

    setStaff(data);

    // Fetch assigned assets
    const { data: assignedAssets } = await supabase
      .from("asset_assignments")
      .select("*, assets(name, asset_tag)")
      .eq("staff_id", data.id);

    setAssets(assignedAssets || []);
  }

  if (!staff) return <p>Loading...</p>;
  if (!user) return <p>Please login</p>;

  const isAdmin = profile?.role === "admin";
  const isSelf = user.id === staff.id;

  if (!isAdmin && !isSelf) {
    return <p>Access Denied</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{staff.full_name}</h2>
      <p>Role: {staff.role}</p>

      <h3>Assigned Assets</h3>
      <ul>
        {assets.map((a) => (
          <li key={a.id}>
            {a.assets?.name} ({a.assets?.asset_tag})
          </li>
        ))}
      </ul>

      {isSelf && (
        <button onClick={() => alert("Open maintenance form")}>
          Report Issue
        </button>
      )}

      {isAdmin && (
        <div>
          <button>Edit Staff</button>
          <button>View Audit Logs</button>
        </div>
      )}
      <div>
        <img src={qrImage} alt="QR Code" />
        <a href={qrImage} download="staff-qr.png">
          Download QR
        </a>
      </div>
    </div>
  );
}
