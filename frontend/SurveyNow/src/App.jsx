import {BrowserRouter as Router, Routes, Route } from "react-router-dom";

import React from 'react'
import LoginForm from "./pages/Auth/LoginForm"
import SignUpForm from "./pages/Auth/SignUpForm";
import Home from "./pages/Dashboard/Home";
import CreatePoll from "./pages/Dashboard/CreatePoll";
import MyPolls from "./pages/Dashboard/MyPolls";
import VotedPolls from "./pages/Dashboard/VotedPolls";
import Bookmarks from "./pages/Dashboard/Bookmarks";
import UserProvider from './context/UserContext';
import { Toaster } from "react-hot-toast";
import OauthSuccess from "./pages/Auth/OauthSuccess";
import PrivateRoute from "./components/input/PrivateRoute";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/oauth-success" element={<OauthSuccess />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signUp" element={<SignUpForm />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={
            <PrivateRoute><Home /></PrivateRoute>
          } />
          <Route path="/create-polls" element={
            <PrivateRoute><CreatePoll /></PrivateRoute>
          } />
          <Route path="/my-polls" element={
            <PrivateRoute><MyPolls /></PrivateRoute>
          } />
          <Route path="/voted-polls" element={
            <PrivateRoute><VotedPolls /></PrivateRoute>
          } />
          <Route path="/bookmarked-polls" element={
            <PrivateRoute><Bookmarks /></PrivateRoute>
          } />

          {/* Default: if someone visits root `/`, redirect based on token */}
          <Route path="/" element={<RedirectOnRoot />} />
        </Routes>
      </Router>
      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  )
}
const RedirectOnRoot = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};


export default App;
