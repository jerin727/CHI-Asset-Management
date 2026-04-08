export default function ConfirmModal({
  isOpen,
  title = "Are you sure?",
  message,
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h3>{title}</h3>
        <p>{message}</p>

        <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
          <button onClick={onCancel} disabled={loading}>
            Cancel
          </button>

          <button onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000
};

const modalStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px"
};