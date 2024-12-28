import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

import Navbar from './components/Navbar/Navbar';

import Home from './pages/Home';
import Profile from './components/Profile/Profile';

import CreateCommunity from './pages/Community/CreateCommunity';
import Community from './pages/Community/Community';
import Login from './pages/Login';
import About from './pages/About';
import Help from './pages/Help';
import Search from './components/Search/Search';
import AddPost from './pages/Feed/AddPost';
import PostFeed from './pages/Feed/PostFeed';
import TermsOfUses from './pages/Legal/terms-of-uses';
import PrivacyPolicy from './pages/Legal/privacy-policy';
const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/post" element={<PostFeed />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/helpcenter" element={<Help />} />
                <Route path='/search' element={<Search />} />
                <Route path="/terms-of-uses" element={<TermsOfUses />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Protected Routes */}
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
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
        </Router>
    );
};

export default App;
