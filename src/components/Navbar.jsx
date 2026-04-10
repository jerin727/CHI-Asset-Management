// import { useEffect, useState } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabase";

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     getUser();
//   }, []);

//   async function getUser() {
//     const { data } = await supabase.auth.getUser();
//     setUser(data.user);

//     if (data.user) {
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("*")
//         .eq("id", data.user.id)
//         .single();

//       setProfile(profileData);
//     }
//   }

//   async function handleLogout() {
//     await supabase.auth.signOut();
//     navigate("/login");
//   }

//   return (
//     <nav style={navStyle}>
//       <div style={logoStyle}>
//         Asset Manager
//       </div>

//       <div style={linksStyle}>
//         <NavLink to="/" style={linkStyle}>Dashboard</NavLink>
//         <NavLink to="/assets" style={linkStyle}>Assets</NavLink>
//         <NavLink to="/departments" style={linkStyle}>Departments</NavLink>
//         {/* <NavLink to="/reports" style={linkStyle}>Reports</NavLink> */}
//       </div>

//       <div style={userSectionStyle}>
//         {profile && (
//           <span>
//             {profile.full_name} ({profile.role})
//           </span>
//         )}
//         {/* <button onClick={handleLogout} style={logoutStyle}>
//           Logout
//         </button> */}
//         <button
//   onClick={async () => {
//     await supabase.auth.signOut();
//     window.location.href = "/login";
//   }}
// >
//   Logout
// </button>
//       </div>
//     </nav>
//   );
// }

// /* ---------- SIMPLE STYLES ---------- */

// const navStyle = {
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   padding: "10px 20px",
//   background: "#1f2937",
//   color: "white"
// };

// const logoStyle = {
//   fontWeight: "bold",
//   fontSize: "18px"
// };

// const linksStyle = {
//   display: "flex",
//   gap: "20px"
// };

// const linkStyle = ({ isActive }) => ({
//   color: isActive ? "#3b82f6" : "white",
//   textDecoration: "none",
//   fontWeight: isActive ? "bold" : "normal"
// });

// const userSectionStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "10px"
// };

// const logoutStyle = {
//   padding: "5px 10px",
//   cursor: "pointer"
// };

// // import { useEffect, useState } from "react";
// // import { NavLink, useNavigate } from "react-router-dom";
// // import { supabase } from "../lib/supabase";

// // export default function Navbar() {
// //   const [user, setUser] = useState(null);
// //   const [profile, setProfile] = useState(null);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     getSession();

// //     // Listen for login/logout changes
// //     const { data: listener } = supabase.auth.onAuthStateChange(
// //       (_event, session) => {
// //         setUser(session?.user ?? null);
// //         if (session?.user) {
// //           fetchProfile(session.user.id);
// //         } else {
// //           setProfile(null);
// //         }
// //       }
// //     );

// //     return () => {
// //       listener.subscription.unsubscribe();
// //     };
// //   }, []);

// //   async function getSession() {
// //     const { data } = await supabase.auth.getSession();
// //     const currentUser = data.session?.user ?? null;
// //     setUser(currentUser);

// //     if (currentUser) {
// //       fetchProfile(currentUser.id);
// //     }
// //   }

// //   async function fetchProfile(userId) {
// //     const { data } = await supabase
// //       .from("profiles")
// //       .select("*")
// //       .eq("id", userId)
// //       .single();

// //     setProfile(data);
// //   }

// //   async function handleLogout() {
// //     await supabase.auth.signOut();
// //     navigate("/login");
// //   }

// //   return (
// //     <nav style={navStyle}>
// //       <div style={logoStyle}>Asset Manager</div>

// //       {user && (
// //         <div style={linksStyle}>
// //           <NavLink to="/" style={linkStyle}>
// //             Dashboard
// //           </NavLink>
// //           <NavLink to="/assets" style={linkStyle}>
// //             Assets
// //           </NavLink>
// //           <NavLink to="/departments" style={linkStyle}>
// //             Departments
// //           </NavLink>
// //         </div>
// //       )}

// //       <div style={userSectionStyle}>
// //         {profile && (
// //           <span>
// //             {profile.full_name} ({profile.role})
// //           </span>
// //         )}

// //         {!user ? (
// //           <>
// //             <NavLink to="/login" style={linkStyle}>
// //               Login
// //             </NavLink>
// //             <NavLink to="/signup" style={linkStyle}>
// //               Signup
// //             </NavLink>
// //           </>
// //         ) : (
// //           <button onClick={handleLogout} style={logoutStyle}>
// //             Logout
// //           </button>
// //         )}
// //       </div>
// //     </nav>
// //   );
// // }

// // /* ---------- STYLES ---------- */

// // const navStyle = {
// //   display: "flex",
// //   justifyContent: "space-between",
// //   alignItems: "center",
// //   padding: "10px 20px",
// //   background: "#1f2937",
// //   color: "white"
// // };

// // const logoStyle = {
// //   fontWeight: "bold",
// //   fontSize: "18px"
// // };

// // const linksStyle = {
// //   display: "flex",
// //   gap: "20px"
// // };

// // const linkStyle = ({ isActive }) => ({
// //   color: isActive ? "#3b82f6" : "white",
// //   textDecoration: "none",
// //   fontWeight: isActive ? "bold" : "normal"
// // });

// // const userSectionStyle = {
// //   display: "flex",
// //   alignItems: "center",
// //   gap: "10px"
// // };

// // const logoutStyle = {
// //   padding: "5px 10px",
// //   cursor: "pointer"
// // };
// import { NavLink, useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// export default function Navbar() {
//   const { user, profile, logout } = useAuth();
//   const navigate = useNavigate();

//   async function handleLogout() {
//     await logout();
//     navigate("/login");
//   }

//   return (
//     <nav style={navStyle}>
//       <div style={logoStyle}>Asset Manager</div>

//       {user && (
//         <div style={linksStyle}>
//           <NavLink to="/" style={linkStyle}>Dashboard</NavLink>
//           <NavLink to="/assets" style={linkStyle}>Assets</NavLink>
//           <NavLink to="/departments" style={linkStyle}>Departments</NavLink>
//         </div>
//       )}

//       <div style={userSectionStyle}>
//         {profile && (
//           <span>
//             {profile.full_name} ({profile.role})
//           </span>
//         )}

//         {!user ? (
//           <>
//             <NavLink to="/login" style={linkStyle}>Login</NavLink>
//             <NavLink to="/signup" style={linkStyle}>Signup</NavLink>
//           </>
//         ) : (
//           <button onClick={handleLogout} style={logoutStyle}>
//             Logout
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

import { NavLink, useNavigate , Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useNotifications } from "../context/NotificationContext";

export default function Navbar() {
  const { user, profile, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <nav style={navStyle}>
      {/* Logo */}
      <div style={logoStyle}>
        <span style={{ color: "#3b82f6" }}>CHI</span> Asset Management
      </div>

      {/* Navigation Links */}
      {user && (
        <div style={linksStyle}>
          <NavLink to="/" style={linkStyle}>
            Dashboard
          </NavLink>
          <NavLink to="/assets" style={linkStyle}>
            Assets
          </NavLink>
          <NavLink to="/departments" style={linkStyle}>
            Departments
          </NavLink>
          {isAdmin && (
            <NavLink to="/assignments" style={linkStyle}>
              Assignments
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/users" style={linkStyle}>
              Users
            </NavLink>
          )}
          <NavLink to="/maintenance" style={linkStyle}>
            Maintenance
          </NavLink>
          {isAdmin && (
            <NavLink to="/audit-logs" style={linkStyle}>
              Audit Logs
            </NavLink>
          )}
          {/* {isAdmin && (
            <NavLink to="/admin" style={linkStyle}>
              Admin Panel
            </NavLink>
          )} */}
          <Link to="/notifications">
            🔔 {unreadCount > 0 && <span>({unreadCount})</span>}
          </Link>
        </div>
      )}

      {/* Right Section */}
      <div style={rightSectionStyle}>
        {!user ? (
          <>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/signup" style={signupButtonStyle}>
              Signup
            </NavLink>
          </>
        ) : (
          <>
            <div style={userInfoStyle}>
              <div style={avatarStyle}>
                {profile?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600 }}>{profile?.full_name}</div>
                <div style={roleBadgeStyle(profile?.role)}>{profile?.role}</div>
              </div>
            </div>

            <button onClick={handleLogout} style={logoutButtonStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 30px",
  backgroundColor: "#111827",
  color: "white",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
};

const logoStyle = {
  fontSize: "20px",
  fontWeight: "bold",
  cursor: "pointer",
};

const linksStyle = {
  display: "flex",
  gap: "25px",
};

const linkStyle = ({ isActive }) => ({
  textDecoration: "none",
  color: isActive ? "#3b82f6" : "#d1d5db",
  fontWeight: isActive ? "600" : "500",
  transition: "0.3s",
});

const rightSectionStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

const userInfoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const avatarStyle = {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  backgroundColor: "#3b82f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  color: "white",
};

const roleBadgeStyle = (role) => ({
  fontSize: "12px",
  padding: "2px 8px",
  borderRadius: "12px",
  backgroundColor: role === "admin" ? "#ef4444" : "#10b981",
  color: "white",
  marginTop: "3px",
  textTransform: "capitalize",
});

const logoutButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "500",
};

const signupButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#3b82f6",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
  fontWeight: "500",
};
