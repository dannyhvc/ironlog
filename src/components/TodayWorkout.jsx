/*today workout component*/
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function TodayWorkout({ userId }) {
  const [workouts, setWorkouts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    exercise: "",
    sets: "",
    reps: "",
  });

  useEffect(() => {
    if (!userId) return;

    const q = query(
      collection(db, "workouts"),
      where("userId", "==", userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ sort by date (newest first)
      data.sort((a, b) => b.date.localeCompare(a.date));

      setWorkouts(data);
    });

    return () => unsubscribe();
  }, [userId]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this workout?")) return;
    await deleteDoc(doc(db, "workouts", id));
  };

  const startEdit = (w) => {
    setEditingId(w.id);
    const e = w.exercises[0];

    setEditData({
      exercise: e.name,
      sets: e.sets,
      reps: e.reps,
    });
  };

  const handleUpdate = async (id) => {
    await updateDoc(doc(db, "workouts", id), {
      exercises: [
        {
          name: editData.exercise,
          sets: Number(editData.sets),
          reps: Number(editData.reps),
        },
      ],
    });

    setEditingId(null);
  };

  return (
    <div style={{ width: "100%" }}>
      <h3>All Workouts</h3>

      {workouts.length === 0 ? (
        <p>No workouts yet.</p>
      ) : (
        workouts.map((w) => (
          <div key={w.id} style={styles.card}>
            <p style={styles.date}>📅 {w.date}</p>

            {editingId === w.id ? (
              <>
                <input
                  value={editData.exercise}
                  onChange={(e) =>
                    setEditData({ ...editData, exercise: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editData.sets}
                  onChange={(e) =>
                    setEditData({ ...editData, sets: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editData.reps}
                  onChange={(e) =>
                    setEditData({ ...editData, reps: e.target.value })
                  }
                />

                <button onClick={() => handleUpdate(w.id)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                {w.exercises.map((e, i) => (
                  <p key={i}>
                    🏋️ {e.name}: {e.sets} x {e.reps}
                  </p>
                ))}

                <button onClick={() => startEdit(w)}>Edit</button>
                <button onClick={() => handleDelete(w.id)}>Delete</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    textAlign: "left",
  },
  date: {
    fontWeight: "bold",
  },
};