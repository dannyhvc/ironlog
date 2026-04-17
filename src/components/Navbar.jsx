/* navbar component */
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const { pathname } = useLocation();

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__logo">
                <div className="navbar__logo-icon">IL</div>
                IRON<span>LOG</span>
            </Link>

            <div className="navbar__links">
                <Link
                    to="/"
                    className={`navbar__link ${pathname === "/" ? "active" : ""}`}
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className={`navbar__link ${pathname === "/register" ? "active" : ""}`}
                >
                    Register
                </Link>
                <Link
                    to="/dashboard"
                    className={`navbar__link ${pathname === "/dashboard" ? "active" : ""}`}
                >
                    Dashboard
                </Link>
            </div>
        </nav>
    );
}
