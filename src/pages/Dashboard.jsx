/*dashboard page*/
import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import AddWorkout from "../components/AddWorkout";
import TodayWorkout from "../components/TodayWorkout";
import ProgressChart from "../components/ProgressChart";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) setUser(currentUser);
      else navigate("/");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (!user) return null;

  return (
    <div style={styles.container}>
      <h1>Welcome back, {user.email}!</h1>

      <button onClick={handleLogout} style={styles.logout}>
        Logout
      </button>

      <div style={styles.box}>
        <AddWorkout userId={user.uid} />
        <TodayWorkout userId={user.uid} />
        <ProgressChart userId={user.uid} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "40px",
  },
  logout: {
    marginTop: "10px",
    padding: "10px 20px",
  },
  box: {
    marginTop: "30px",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
};