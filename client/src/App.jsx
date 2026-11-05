import { useEffect, useState } from "react";
import api from "./services/api";
import "./index.css";

function App() {
    const [message, setMessage] = useState("Connecting...");
    const [error, setError] = useState("");

    useEffect(() => {
        const checkBackend = async () => {
            try {
                const response = await api.get("/health");

                setMessage(response.data.message);
            } catch (err) {
                setError("Backend connection failed!");
                console.error(err);
            }
        };

        checkBackend();
    }, []);

    return (
        <div className="app">
            <nav className="navbar">
                <h2>Civic<span>Pulse</span></h2>
                <p>Making communities better.</p>
            </nav>

            <main className="hero">
                <div className="status">COMMUNITY FIRST. CHANGE TOGETHER.</div>

                <h1>
                    Report issues.
                    <br />
                    <span>Create change.</span>
                </h1>

                <p>
                    A smarter way to report civic problems,
                    track progress and build better communities.
                </p>

                <div className="connection">
                    <div className="dot"></div>
                    {error || message}
                </div>

                <button>Explore CivicPulse</button>
            </main>
        </div>
    );
}

export default App;