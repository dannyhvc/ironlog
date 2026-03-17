import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";

export default function ProgressChart({ userId }) {
  const [data, setData] = useState({});

  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "workouts"), where("userId", "==", userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const grouped = {};

      snapshot.docs.forEach((doc) => {
        const d = doc.data();
        d.exercises.forEach((e) => {
          if (!grouped[e.name]) grouped[e.name] = 0;
          grouped[e.name] += e.sets * e.reps;
        });
      });

      setData(grouped);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div style={{ marginTop: 40 }}>
      <h3>Progress (Total Volume)</h3>

      {Object.keys(data).length === 0 ? (
        <p>No data yet</p>
      ) : (
        Object.entries(data).map(([exercise, volume]) => (
          <div key={exercise} style={{ marginBottom: 10 }}>
            <strong>{exercise}</strong>
            <div
              style={{
                height: "20px",
                background: "#ddd",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(volume / 10, 100)}%`,
                  background: "#4caf50",
                  height: "100%",
                }}
              />
            </div>
            <small>{volume} total reps</small>
          </div>
        ))
      )}
    </div>
  );
}