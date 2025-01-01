import React from "react";
import { NavLink } from "react-router-dom";
import "./Footer.css";
import { useLocation } from "react-router-dom";

const Footer = () => {
    const location = useLocation();
    const noFooterPages = ["/login", "/feed", "/community", "/Error404"];
    if (noFooterPages.includes(location.pathname)) {
        return null;
    }

    const handleScrollToTop = () => {
        if (window.scrollY !== 0) {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const footerLinks = [
        {
            title: "Community",
            links: [
                { to: "/community/technology", text: "Technology" },
                { to: "/community/education", text: "Education" },
                { to: "/community/creative_art", text: "Creative Arts" },
                { to: "/community/Health_and_Wellness", text: "Health and Wellness" },
                { to: "/pricing", text: "Gaming" }
            ]
        },
        {
            title: "Explore",
            links: [
                { to: "/feed", text: "Feeds" },
                { to: "/dashboard", text: "Dashboard" },
                { to: "/new-feed", text: "Write a Post" },
                { to: "/new-community", text: "Create A Community" },
                { to: "/profile", text: "Your Profile" }
            ]
        },
        {
            title: "More",
            links: [
                { to: "/about", text: "About Us" },
                { to: "/privacy-policy", text: "Privacy Policy" },
                { to: "/terms-of-uses", text: "Terms of Use" },
                { to: "/cookie-policy", text: "Cookies" },
                { to: "/user-agreement", text: "User Agreement" },
                { to: "/helpcenter", text: "Help Center" }
            ]
        }
    ];

    return (
        <footer className="footer">
            <div className="footer-links-section">
                <div className="footer-column">
                    <div className="footer-logo-section">
                        <img src="/assets/logo.png" alt="WizWeb Logo" className="footer-logo" />
                    </div>
                </div>
                {footerLinks.map((section, idx) => (
                    <div key={idx} className="footer-column">
                        <h4 className="footer-column-title">{section.title}</h4>
                        {section.links.map((link, i) => (
                            <NavLink
                                key={i}
                                to={link.to}
                                className="footer-link"
                                onClick={handleScrollToTop}
                                aria-label={`Go to ${link.text} page`}
                            >
                                {link.text}
                            </NavLink>
                        ))}
                    </div>
                ))}
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} WizWeb || All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
