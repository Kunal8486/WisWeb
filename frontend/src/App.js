import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Error404 from './components/Errors/Error404';


import Home from './pages/Home/Home';
import Profile from './components/Profile/Profile';
import Dashboard from './pages/Dashboard/dashboard';

import CreateCommunity from './pages/Community/CreateCommunity';
import Community from './pages/Community/Community';

import Login from './pages/Login/Login';
import About from './pages/About/About';
import Help from './pages/HelpCenter/Help';

import Search from './components/Search/Search';

import AddPost from './pages/Feed/AddPost';
import PostFeed from './pages/Feed/PostFeed';

import TermsOfUses from './pages/Legal/terms-of-uses';
import PrivacyPolicy from './pages/Legal/privacy-policy';
import CookiePolicy from './pages/Legal/cookie-policy';
import UserAgreement from './pages/Legal/user-agreement';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/helpcenter" element={<Help />} />
                <Route path='/search' element={<Search />} />

                {/* Legal Routes */}
                <Route path="/terms-of-uses" element={<TermsOfUses />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="/user-agreement" element={<UserAgreement />} />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <Profile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/community"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <Community />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/new-community"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <CreateCommunity />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/feed"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <PostFeed />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/new-feed"
                    element={
                        <ProtectedRoute allowedRoles={['authenticated']}>
                            <AddPost />
                        </ProtectedRoute>
                    }
                />

                {/* Fallback Route */}
                <Route path="*" element={< Error404 />} />
            </Routes>


            <Footer />
        </Router>



    );

};

export default App;
