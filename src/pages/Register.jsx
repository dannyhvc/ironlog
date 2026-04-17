import { useState } from "react";
import { auth } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const friendlyError = (code) => {
    const map = {
        "auth/email-already-in-use":
            "An account with that email already exists.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/network-request-failed": "Network error. Check your connection.",
    };
    return map[code] ?? "Something went wrong. Please try again.";
};

const FormPanel = ({
    error,
    email,
    setEmail,
    handleKeyDown,
    password,
    setPassword,
    confirm,
    setConfirm,
    handleRegister,
    loading,
}) => (
    <div className="auth-form-panel">
        <div className="auth-form fade-up">
            <div className="auth-form__header">
                <h2 className="auth-form__title">CREATE ACCOUNT</h2>
                <p className="auth-form__subtitle">
                    Already training? <Link to="/">Sign in instead</Link>
                </p>
            </div>

            {error && <div className="inline-error">{error}</div>}

            <div className="form-group">
                <label for="email" className="form-label">
                    Email
                </label>
                <input
                    name="email"
                    className="form-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                />
            </div>

            <div className="form-group">
                <label for="password" className="form-label">
                    Password
                </label>
                <input
                    name="password"
                    className="form-input"
                    type="password"
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                />
            </div>

            <div className="form-group" style={{ marginBottom: "28px" }}>
                <label for="new-password" className="form-label">
                    Confirm Password
                </label>
                <input
                    name="new-password"
                    className="form-input"
                    type="password"
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="new-password"
                />
            </div>

            <button
                type="button"
                className="btn btn--primary"
                onClick={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span
                            className="loading-spinner"
                            style={{
                                width: 16,
                                height: 16,
                                borderWidth: 2,
                            }}
                        />
                        Creating account…
                    </>
                ) : (
                    "Create Account →"
                )}
            </button>
        </div>
    </div>
);

const BrandPanel = () => (
    <div className="auth-brand">
        <div className="auth-brand__tagline">
            YOUR
            <span>JOURNEY</span>
            STARTS.
        </div>
        <p className="auth-brand__desc">
            Build your training history from day one. Log every session, track
            your volume, and watch the progress compound over time.
        </p>
        <div className="auth-brand__stats">
            <div className="auth-brand__stat">
                <span className="auth-brand__stat-num">FREE</span>
                <span className="auth-brand__stat-label">Forever</span>
            </div>
            <div className="auth-brand__stat">
                <span className="auth-brand__stat-num">∞</span>
                <span className="auth-brand__stat-label">Workouts</span>
            </div>
            <div className="auth-brand__stat">
                <span className="auth-brand__stat-num">1</span>
                <span className="auth-brand__stat-label">Step to start</span>
            </div>
        </div>
    </div>
);

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        if (!email || !password || !confirm) {
            setError("Please fill in all fields.");
            return;
        }
        if (password !== confirm) {
            setError("Passwords do not match.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(friendlyError(err.code));
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleRegister();
    };

    return (
        <div className="auth-page">
            {/* Brand panel */}
            <BrandPanel />

            {/* Form panel */}
            <FormPanel
                error={error}
                email={email}
                setEmail={setEmail}
                handleKeyDown={handleKeyDown}
                password={password}
                setPassword={setPassword}
                confirm={confirm}
                setConfirm={setConfirm}
                handleRegister={handleRegister}
                loading={loading}
            />
        </div>
    );
}
