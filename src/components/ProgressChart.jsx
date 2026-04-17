import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/firebase";

export default function ProgressChart({ userId }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const q = query(
            collection(db, "workouts"),
            where("userId", "==", userId),
        );
        const unsub = onSnapshot(q, (snap) => {
            const map = {};
            snap.docs.forEach((d) => {
                (d.data().exercises || []).forEach((e) => {
                    const key = e.name?.trim() || "Unknown";
                    map[key] = (map[key] || 0) + (e.sets || 0) * (e.reps || 0);
                });
            });

            /* sort descending, take top 6 */
            const sorted = Object.entries(map)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6);

            setData(sorted);
        });
        return unsub;
    }, [userId]);

    if (data.length === 0) {
        return (
            <div className="empty-state" style={{ padding: "24px 0" }}>
                <div
                    className="empty-state__icon"
                    style={{ fontSize: "1.8rem" }}
                >
                    📊
                </div>
                <p className="empty-state__text">
                    Log workouts to see progress.
                </p>
            </div>
        );
    }

    const max = data[0]?.[1] || 1;

    return (
        <div className="progress-list">
            {data.map(([name, volume], i) => {
                const pct = Math.max(4, Math.round((volume / max) * 100));
                return (
                    <div
                        key={name}
                        className="progress-item"
                        style={{ animationDelay: `${i * 0.07}s` }}
                    >
                        <div className="progress-item__header">
                            <span className="progress-item__name">{name}</span>
                            <span className="progress-item__volume">
                                {volume.toLocaleString()} reps
                            </span>
                        </div>
                        <div className="progress-bar-track">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${pct}%` }}
                            />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
