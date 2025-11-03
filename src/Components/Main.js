import React from "react";
import "./Main.css";
import NavBar from "./NavBar";
import Home from "./Home";
import RecipeInstruction from "./RecipeInstruction";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Favourite from "./Favourite";
import Community from "./Community";
import { ToastContainer } from "react-toastify";
import Login from "./login";
import Register from "./register";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "./AuthContext";

const Main = () => {
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const hideNavRoutes = ["/login", "/register"];

  return (
    <>
      {/* Only show NavBar if user is authenticated and not on auth routes */}
      {isAuthenticated && !hideNavRoutes.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/home" replace />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/home" replace />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
        <Route path="/home" element={
          <ProtectedRoute user={currentUser}>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/RecipeInstruction/:id" element={
          <ProtectedRoute user={currentUser}>
            <RecipeInstruction />
          </ProtectedRoute>
        } />
        <Route path="/Favourite" element={
          <ProtectedRoute user={currentUser}>
            <Favourite />
          </ProtectedRoute>
        } />
        <Route path="/Community" element={
          <ProtectedRoute user={currentUser}>
            <Community />
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default Main;
