import { useState } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddWorkout({ userId }) {
  const [form, setForm] = useState({
    date: "",
    exercise: "",
    sets: "",
    reps: "",
  });

  const [loading, setLoading] = useState(false);

  const handleAddWorkout = async () => {
    const { date, exercise, sets, reps } = form;

    if (!date || !exercise || !sets || !reps) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      console.log("START ADD");

      await addDoc(collection(db, "workouts"), {
        userId,
        date,
        exercises: [
          {
            name: exercise,
            sets: Number(sets),
            reps: Number(reps),
          },
        ],
        createdAt: serverTimestamp(),
      });

      console.log("FINISHED ADD");

      // reset form
      setForm({
        date: "",
        exercise: "",
        sets: "",
        reps: "",
      });

    } catch (err) {
      console.error("ERROR:", err);
      alert("Failed to add workout");
    }

    setLoading(false); // ALWAYS reset
  };

  return (
    <div>
      <h3>Add Workout</h3>

      <input
        type="date"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <input
        placeholder="Exercise"
        value={form.exercise}
        onChange={(e) => setForm({ ...form, exercise: e.target.value })}
      />

      <input
        type="number"
        placeholder="Sets"
        value={form.sets}
        onChange={(e) => setForm({ ...form, sets: e.target.value })}
      />

      <input
        type="number"
        placeholder="Reps"
        value={form.reps}
        onChange={(e) => setForm({ ...form, reps: e.target.value })}
      />

      <button onClick={handleAddWorkout} disabled={loading}>
        {loading ? "Adding..." : "Add Workout"}
      </button>
    </div>
  );
}