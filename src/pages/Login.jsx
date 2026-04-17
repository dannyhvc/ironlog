import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";

function friendlyError(code) {
    const map = {
        "auth/invalid-credential": "Invalid email or password.",
        "auth/user-not-found": "No account found with that email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/network-request-failed": "Network error. Check your connection.",
    };
    return map[code] ?? "Something went wrong. Please try again.";
}

const FormPanelLogin = ({
    error,
    email,
    setEmail,
    handleKeyDown,
    password,
    setPassword,
    handleLogin,
    loading,
}) => (
    <div className="auth-form-panel">
        <div className="auth-form fade-up">
            <div className="auth-form__header">
                <h2 className="auth-form__title">WELCOME BACK</h2>
                <p className="auth-form__subtitle">
                    No account? <Link to="/register">Create one free</Link>
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

            <div className="form-group" style={{ marginBottom: "28px" }}>
                <label for="password" className="form-label">
                    Password
                </label>
                <input
                    name="password"
                    className="form-input"
                    type="password"
                    placeholder="Enter your password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoComplete="current-password"
                />
            </div>

            <button
                type="button"
                className="btn btn--primary"
                onClick={handleLogin}
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
                        Signing in…
                    </>
                ) : (
                    "Sign In →"
                )}
            </button>
        </div>
    </div>
);

const BrandPanel = () => {
    return (
        <div className="auth-brand">
            <div className="auth-brand__tagline">
                TRACK.
                <span>LIFT.</span>
                EVOLVE.
            </div>
            <p className="auth-brand__desc">
                Every rep logged is progress made. Build the discipline to show
                up, and let the data show how far you've come.
            </p>
            <div className="auth-brand__stats">
                <div className="auth-brand__stat">
                    <span className="auth-brand__stat-num">100%</span>
                    <span className="auth-brand__stat-label">Commitment</span>
                </div>
                <div className="auth-brand__stat">
                    <span className="auth-brand__stat-num">0</span>
                    <span className="auth-brand__stat-label">Excuses</span>
                </div>
                <div className="auth-brand__stat">
                    <span className="auth-brand__stat-num">∞</span>
                    <span className="auth-brand__stat-label">Potential</span>
                </div>
            </div>
        </div>
    );
};

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(friendlyError(err.code));
        }
        setLoading(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleLogin();
    };

    return (
        <div className="auth-page">
            <BrandPanel />
            <FormPanelLogin
                error={error}
                email={email}
                setEmail={setEmail}
                handleKeyDown={handleKeyDown}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                loading={loading}
            />
        </div>
    );
}
