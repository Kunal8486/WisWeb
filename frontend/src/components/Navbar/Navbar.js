import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [tokenCount, setTokenCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const navigate = useNavigate();

    const toggleSideMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const closeSideMenu = () => {
        setIsMenuOpen(false);
    };

    // Close side menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e) => {
            const sideMenu = document.getElementById('side-menu');
            if (isMenuOpen && sideMenu && !sideMenu.contains(e.target)) {
                closeSideMenu();
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isMenuOpen]);

    // Handle touch start for swipe detection
    const handleTouchStart = (e) => {
        setTouchStartX(e.changedTouches[0].clientX);
    };

    // Handle touch end for swipe detection
    const handleTouchEnd = (e) => {
        setTouchEndX(e.changedTouches[0].clientX);
        if (touchStartX - touchEndX > 50) {
            // Swiped left to close the menu
            closeSideMenu();
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
                    <li onClick={closeSideMenu}>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : '')}>Feeds</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>Communities</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
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
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
                <img
                    src="../assets/menu.png"
                    className="menu"
                    onClick={toggleSideMenu}
                    alt="menu"
                />
            </nav>

            <div
                className={`side-menu ${isMenuOpen ? 'active' : ''}`}
                id="side-menu"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div className="close" onClick={closeSideMenu}>
                    <img src="../assets/close.png" alt="Close Menu" />
                </div>
                <ul>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/feed" className={({ isActive }) => (isActive ? 'active' : '')}>Feeds</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/community" className={({ isActive }) => (isActive ? 'active' : '')}>Communities</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>Profile</NavLink>
                    </li>
                    <li onClick={closeSideMenu}>
                        <NavLink to="/helpcenter" className={({ isActive }) => (isActive ? 'active' : '')}>Help Center</NavLink>
                    </li>
                </ul>
            </div>
        </header>
    );
};

export default Navbar;
