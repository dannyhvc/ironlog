import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.link}>Login</Link>
      <Link to="/register" style={styles.link}>Register</Link>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
    </nav>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    padding: "15px",
    background: "#222",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};