export const OneRepMaxEstimator = ({ weight, reps, variant = "box" }) => {
    const w = Number(weight);
    const r = Number(reps);

    // Render nothing if inputs are empty or invalid
    if (!w || !r || w <= 0 || r <= 0) return null;

    // Epley formula for 1RM
    const estimate = Math.round(w * (1 + r / 30));

    // Pill styling for the All Sessions list
    if (variant === "pill") {
        return (
            <span className="workout-item__stat-pill" style={{ borderColor: "var(--accent-dim)" }}>
                <span style={{ color: "var(--text-3)" }}>1RM:</span>{" "}
                <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
                    {estimate.toLocaleString()}
                </span>
            </span>
        );
    }

    // Box styling for the Add Workout form
    return (
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
            Est. 1RM:{" "}
            <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
                {estimate.toLocaleString()}
            </span>
        </div>
    );
};
