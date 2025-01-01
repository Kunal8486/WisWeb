import React from "react";
import { useNavigate } from "react-router-dom";
import "./Error404.css";

const Error404 = () => {
    const navigate = useNavigate();

    const handleBackHome = () => {
        navigate("/");
    };

    return (
        <div className="error-page">
            <div className="error-content">
                <h1 className="error-title">404</h1>
                <p className="error-message">Oops! The page you're looking for doesn't exist.</p>
                <div className="error-animation">
                    <img
                        src="/assets/astran.png"
                        alt="Astronaut Floating"
                        className="floating-astronaut"
                    />
                </div>
                <button className="error-button" onClick={handleBackHome}>
                    Take Me Home
                </button>
            </div>
        </div>
    );
};

export default Error404;
