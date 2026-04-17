/** biome-ignore-all lint/a11y/noLabelWithoutControl: ... */
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { db } from "../services/firebase";

const EXERCISE_SUGGESTIONS = [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull-Up",
    "Overhead Press",
    "Row",
    "Curl",
    "Tricep Dip",
    "Leg Press",
    "Lunge",
];

const LogExerciseSubmit = ({ handleAdd, loading, isValid, success }) => (
    <button
        type="button"
        className="btn btn--primary"
        onClick={handleAdd}
        disabled={loading || !isValid}
        style={
            success ? { background: "var(--success)", boxShadow: "none" } : {}
        }
    >
        {loading ? (
            <>
                <span
                    className="loading-spinner"
                    style={{ width: 14, height: 14, borderWidth: 2 }}
                />
                Saving...
            </>
        ) : success ? (
            "Logged! :)"
        ) : (
            "Log Workout +"
        )}
    </button>
);

const RepsSetsSetterForm = ({ form, set }) => (
    <div className="add-workout__grid">
        <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Sets</label>
            <input
                name="sets"
                className="form-input"
                type="number"
                min="1"
                max="99"
                placeholder="3"
                value={form.sets}
                onChange={set("sets")}
            />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Reps</label>
            <input
                name="reps"
                className="form-input"
                type="number"
                min="1"
                max="999"
                placeholder="10"
                value={form.reps}
                onChange={set("reps")}
            />
        </div>
    </div>
);

const ExercisePickerForm = ({ form, set }) => (
    <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Exercise</label>
        <input
            name="exercise"
            className="form-input"
            list="exercise-suggestions"
            placeholder="e.g. Bench Press"
            value={form.exercise}
            onChange={set("exercise")}
        />
        <datalist id="exercise-suggestions">
            {EXERCISE_SUGGESTIONS.map((s) => (
                <option key={s} value={s} />
            ))}
        </datalist>
    </div>
);

const DatePickerForm = ({ form, todayISO, set }) => (
    <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Date</label>
        <input
            className="form-input"
            type="date"
            value={form.date}
            max={todayISO}
            onChange={set("date")}
        />
    </div>
);

export default function AddWorkout({ userId }) {
    const [form, setForm] = useState({
        date: "",
        exercise: "",
        sets: "",
        reps: "",
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (field) => (e) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const handleAdd = async () => {
        const { date, exercise, sets, reps } = form;
        if (!date || !exercise || !sets || !reps) return;

        setLoading(true);
        try {
            await addDoc(collection(db, "workouts"), {
                userId,
                date,
                exercises: [
                    { name: exercise, sets: Number(sets), reps: Number(reps) },
                ],
                createdAt: serverTimestamp(),
            });
            setForm({ date: "", exercise: "", sets: "", reps: "" });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2500);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const todayISO = new Date().toLocaleDateString("en-CA");
    const isValid = form.date && form.exercise && form.sets && form.reps;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Date */}
            <DatePickerForm form={form} todayISO={todayISO} set={set} />

            {/* Exercise */}
            <ExercisePickerForm form={form} set={set} />

            {/* Sets & Reps */}
            <RepsSetsSetterForm form={form} set={set} />

            {/* Volume preview */}
            {form.sets && form.reps && (
                <div
                    style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.78rem",
                        color: "var(--text-3)",
                        padding: "8px 12px",
                        background: "var(--surface-3)",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                    }}
                >
                    Volume:{" "}
                    <span style={{ color: "var(--accent)" }}>
                        {(
                            Number(form.sets) * Number(form.reps)
                        ).toLocaleString()}{" "}
                        reps
                    </span>
                </div>
            )}

            <LogExerciseSubmit
                handleAdd={handleAdd}
                loading={loading}
                isValid={isValid}
                success={success}
            />
        </div>
    );
}
