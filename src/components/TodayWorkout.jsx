import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";

export default function TodayWorkout({ userId }) {
    const [workouts, setWorkouts] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({
        exercise: "",
        sets: "",
        reps: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) return;
        const q = query(
            collection(db, "workouts"),
            where("userId", "==", userId),
        );
        const unsub = onSnapshot(q, (snap) => {
            const data = snap.docs
                .map((d) => ({ id: d.id, ...d.data() }))
                .sort((a, b) => b.date.localeCompare(a.date));
            setWorkouts(data);
        });
        return unsub;
    }, [userId]);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this workout?")) return;
        await deleteDoc(doc(db, "workouts", id));
    };

    const startEdit = (w) => {
        setEditingId(w.id);
        const e = w.exercises[0];
        setEditData({
            exercise: e.name,
            sets: String(e.sets),
            reps: String(e.reps),
        });
    };

    const handleUpdate = async (id) => {
        setSaving(true);
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
        setSaving(false);
    };

    const setEdit = (field) => (e) =>
        setEditData((prev) => ({ ...prev, [field]: e.target.value }));

    if (workouts.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state__icon">🏋</div>
                <p className="empty-state__text">
                    No sessions logged yet.
                    <br />
                    Add your first workout!
                </p>
            </div>
        );
    }

    /* group by date for display */
    const grouped = workouts.reduce((acc, w) => {
        if (!acc[w.date]) acc[w.date] = [];
        acc[w.date].push(w);
        return acc;
    }, {});

    return (
        <div className="workout-list">
            {Object.entries(grouped).map(([date, items]) => (
                <div key={date}>
                    {/* Date separator */}
                    <div
                        style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "0.7rem",
                            color: "var(--text-3)",
                            textTransform: "uppercase",
                            letterSpacing: "0.1em",
                            padding: "4px 0 8px",
                            borderBottom: "1px solid var(--border)",
                            marginBottom: "8px",
                        }}
                    >
                        {formatDate(date)}
                    </div>

                    {items.map((w) =>
                        editingId === w.id ? (
                            /* Edit mode */
                            <div
                                key={w.id}
                                className="workout-item workout-item--editing"
                            >
                                <div className="workout-item__edit-grid">
                                    <input
                                        className="form-input form-input--sm"
                                        value={editData.exercise}
                                        onChange={setEdit("exercise")}
                                        placeholder="Exercise"
                                    />
                                    <input
                                        className="form-input form-input--sm"
                                        type="number"
                                        min="1"
                                        value={editData.sets}
                                        onChange={setEdit("sets")}
                                        placeholder="Sets"
                                    />
                                    <input
                                        className="form-input form-input--sm"
                                        type="number"
                                        min="1"
                                        value={editData.reps}
                                        onChange={setEdit("reps")}
                                        placeholder="Reps"
                                    />
                                </div>
                                <div className="workout-item__edit-actions">
                                    <button
                                        type="button"
                                        className="btn btn--primary btn--sm"
                                        onClick={() => handleUpdate(w.id)}
                                        disabled={saving}
                                    >
                                        {saving ? "Saving…" : "Save"}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn--ghost btn--sm"
                                        onClick={() => setEditingId(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* View mode */
                            <div key={w.id} className="workout-item">
                                <div className="workout-item__header">
                                    <div className="workout-item__date">
                                        <span className="workout-item__date-dot" />
                                        {formatDate(w.date)}
                                    </div>
                                    <div className="workout-item__actions">
                                        <button
                                            type="button"
                                            className="btn btn--ghost btn--icon"
                                            title="Edit"
                                            onClick={() => startEdit(w)}
                                        >
                                            ✎
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn--danger btn--icon"
                                            title="Delete"
                                            onClick={() => handleDelete(w.id)}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>

                                {w.exercises.map((e, i) => (
                                    <div
                                        key={i}
                                        className="workout-item__exercise"
                                    >
                                        <span className="workout-item__name">
                                            {e.name}
                                        </span>
                                        <div className="workout-item__stats">
                                            <span className="workout-item__stat-pill workout-item__stat-pill--sets">
                                                {e.sets}s
                                            </span>
                                            <span className="workout-item__stat-pill workout-item__stat-pill--reps">
                                                {e.reps}r
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ),
                    )}
                </div>
            ))}
        </div>
    );
}

function formatDate(iso) {
    const d = new Date(`${iso}T00:00:00`);
    const today = new Date();
    const DAY_IN_MS = 86400000;

    today.setHours(0, 0, 0, 0);
    const diff = Math.round((today - d) / DAY_IN_MS);

    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
