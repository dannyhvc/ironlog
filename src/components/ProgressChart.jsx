/** biome-ignore-all lint/suspicious/noArrayIndexKey: ... */
import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

const COLORS = [
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
];

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

            const formattedData = Object.entries(map)
                .map(([name, volume]) => ({ name, volume }))
                .sort((a, b) => b.volume - a.volume)
                .slice(0, 6);

            setData(formattedData);
        });
        return unsub;
    }, [userId]);

    if (data.length === 0) {
        return (
            <div className="empty-state">
                <p className="empty-state__text">
                    Log workouts to see progress charts.
                </p>
            </div>
        );
    }

    return (
        <div style={{ width: "100%", height: 300, marginTop: "20px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    layout="vertical"
                    margin={{ left: 20, right: 20 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                        stroke="#334155"
                    />
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#94a3b8"
                        fontSize={12}
                        width={80}
                    />
                    <Tooltip
                        cursor={{ fill: "transparent" }}
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            border: "none",
                            borderRadius: "8px",
                            color: "#f8fafc",
                        }}
                    />
                    <Bar dataKey="volume" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((_entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
