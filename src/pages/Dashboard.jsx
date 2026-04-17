import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddWorkout from "../components/AddWorkout";
import ProgressChart from "../components/ProgressChart";
import TodayWorkout from "../components/TodayWorkout";
import { auth, db } from "../services/firebase";

const DashboardHeader = ({ emailShort, userEmail, callback }) => (
    <div className="dashboard__header fade-up">
        <div>
            <h1 className="dashboard__greeting">WELCOME, {emailShort}</h1>
            <p className="dashboard__greeting-sub">
                {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                })}
            </p>
        </div>
        <div className="dashboard__header-right">
            <span className="dashboard__user-email">{userEmail}</span>
            <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={callback}
            >
                Sign Out
            </button>
        </div>
    </div>
);

const DashboardLeftPanel = ({ today, user }) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
        }}
    >
        <div className="card">
            <div className="card__header">
                <h3 className="card__title">LOG WORKOUT</h3>
                <span className="card__badge">{today}</span>
            </div>
            <div className="card__body">
                <AddWorkout userId={user.uid} />
            </div>
        </div>

        <div className="card">
            <div className="card__header">
                <h3 className="card__title">PROGRESS</h3>
                <span className="card__badge card__badge--accent">Volume</span>
            </div>
            <div className="card__body">
                <ProgressChart userId={user.uid} />
            </div>
        </div>
    </div>
);

const DashboardRightPanel = ({ workoutCount, user }) => (
    <div className="card fade-up fade-up--3">
        <div className="card__header">
            <h3 className="card__title">ALL SESSIONS</h3>
            <span className="card__badge">{workoutCount} total</span>
        </div>
        <div className="card__body">
            <TodayWorkout userId={user.uid} />
        </div>
    </div>
);

const DashboardStatsRow = (workoutCount, totalVolume, uniqueExer) => (
    <div className="stats-row fade-up fade-up--1">
        <div className="stat-card">
            <span className="stat-card__label">Sessions Logged</span>
            {/* <span className="stat-card__value">{workoutCount}</span> */}
            <span className="stat-card__unit">total workouts</span>
        </div>
        <div className="stat-card">
            <span className="stat-card__label">Total Volume</span>
            <span className="stat-card__value">
                {/*{totalVolume.toLocaleString()}*/}
            </span>
            <span className="stat-card__unit">reps lifted</span>
        </div>
        <div className="stat-card">
            <span className="stat-card__label">Exercises</span>
            <span className="stat-card__value">{uniqueExer}</span>
            <span className="stat-card__unit">unique movements</span>
        </div>
    </div>
);

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [workoutCount, setWCount] = useState(0);
    const [totalVolume, setTVolume] = useState(0);
    const [uniqueExer, setUniqueExer] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (u) => {
            if (u) setUser(u);
            else navigate("/");
        });
        return unsub;
    }, [navigate]);

    /* aggregate stats */
    useEffect(() => {
        if (!user) return;
        const q = query(
            collection(db, "workouts"),
            where("userId", "==", user.uid),
        );
        const unsub = onSnapshot(q, (snap) => {
            let vol = 0;
            const exerciseNames = new Set();
            snap.docs.forEach((d) => {
                const data = d.data();
                (data.exercises || []).forEach((e) => {
                    vol += (e.sets || 0) * (e.reps || 0);
                    exerciseNames.add(e.name?.toLowerCase());
                });
            });
            setWCount(snap.size);
            setTVolume(vol);
            setUniqueExer(exerciseNames.size);
        });
        return unsub;
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        navigate("/");
    };

    const today = new Date().toLocaleDateString("en-CA");

    if (!user) {
        return (
            <div className="loading-screen">
                <div className="loading-spinner" />
            </div>
        );
    }

    const emailShort = user.email.split("@")[0].toUpperCase();

    return (
        <div className="dashboard">
            {/* Header */}
            <DashboardHeader
                emailShort={emailShort}
                userEmail={user.email}
                callback={handleLogout}
            />

            {/* Stats row */}
            <DashboardStatsRow
                workoutCount={workoutCount}
                totalVolume={totalVolume}
                uniqueExer={uniqueExer}
            />

            {/* Main grid */}
            <div className="dashboard__grid fade-up fade-up--2">
                {/* Left column */}
                <DashboardLeftPanel today={today} user={user} />

                {/* Right column */}
                <DashboardRightPanel workoutCount={workoutCount} user={user} />
            </div>
        </div>
    );
}
