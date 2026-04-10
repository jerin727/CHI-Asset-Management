// import { createContext, useContext, useEffect, useState } from "react";
// import { supabase } from "../lib/supabase";
// // const AuthContext = createContext();
// export const AuthContext = createContext();
// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getSession();

//     const { data: listener } = supabase.auth.onAuthStateChange(
//       async (_event, session) => {
//         const currentUser = session?.user ?? null;
//         setUser(currentUser);

//         if (currentUser) {
//           await fetchProfile(currentUser.id);
//         } else {
//           setProfile(null);
//         }

//         setLoading(false);
//       }
//     );

//     return () => {
//       listener.subscription.unsubscribe();
//     };
//   }, []);

//   async function getSession() {
//     const { data } = await supabase.auth.getSession();
//     const currentUser = data.session?.user ?? null;
//     setUser(currentUser);

//     if (currentUser) {
//       await fetchProfile(currentUser.id);
//     }

//     setLoading(false);
//   }

//   async function fetchProfile(userId) {
//     const { data } = await supabase
//       .from("profiles")
//       .select("*")
//       .eq("id", userId)
//       .single();

//     setProfile(data);
//   }

//   async function logout() {
//     await supabase.auth.signOut();
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         profile,
//         loading,
//         logout,
//         isAdmin: profile?.role === "admin",
//         isStaff: profile?.role === "staff"
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", currentUser.id)
          .maybeSingle();

        setProfile(data);
      }

      setLoading(false); // 🔥 always runs
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .maybeSingle();

          setProfile(data);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }
console.log("Loading:", loading);
console.log("User:", user);
console.log("Profile:", profile);
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
        isAdmin: profile?.role === "admin",
        isStaff: profile?.role === "staff"
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


