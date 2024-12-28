import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tokenCount, setTokenCount] = useState(0); // Initial token count
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Toggle side menu visibility
    const toggleSideMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Handle search functionality
    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header id="header">
            <nav>
                <div className="logo">
                    <NavLink to="/">
                        <img src="../assets/Wiz Web.png" alt="logo" />
                    </NavLink>
                </div>
                <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : '')}>Feeds</NavLink>
                    </li>
                    <li>
                        <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>Communities</NavLink>
                    </li>
                    <li>
                        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
                    </li>
                    <li>
                        <NavLink to="/helpcenter" className={({ isActive }) => (isActive ? 'active' : '')}>Help Center</NavLink>
                    </li>
                </ul>
                <div className="srch">
                    <input
                        type="text"
                        className="search"
                        placeholder="Search here..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // Trigger search on Enter
                    />
                    <img
                        src="../assets/search.png"
                        alt="search"
                        onClick={handleSearch}
                    />
                </div>
                <a className="get-started" href="/profile">
                    Tokens: <span id="tokenCount">{tokenCount}</span>
                </a>
                {/* Hamburger Menu Icon */}
                <img
                    src="../assets/menu.png"
                    className="menu"
                    onClick={toggleSideMenu}
                    alt="menu"
                />
            </nav>

            {/* Side Menu */}
            <div className={`side-menu ${isMenuOpen ? 'active' : ''}`} id="side-menu">
                <div className="close" onClick={toggleSideMenu}>
                    <img src="../assets/close.png" alt="Close Menu" />
                </div>
                <ul>
                    <li><NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : '')}>Feeds</NavLink></li>
                    <li><NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>Communities</NavLink></li>
                    <li><NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink></li>
                    <li><NavLink to="/helpcenter" className={({ isActive }) => (isActive ? 'active' : '')}>Help Center</NavLink></li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
