import { HashRouter, Route, Routes } from "react-router-dom"; // converted to HashRouter for gh-pages
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
    return (
        <HashRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
