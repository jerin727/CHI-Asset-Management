// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//   const [user, setUser] = useState(undefined);

//   useEffect(() => {
//     supabase.auth.getUser().then(({ data }) => {
//       setUser(data.user);
//     });
//   }, []);

//   if (user === undefined) return <p>Loading...</p>;
//   if (!user) return <Navigate to="/login" />;

//   return children;
// }

import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}