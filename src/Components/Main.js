import React from "react";
import "./Main.css";
import NavBar from "./NavBar";
import Home from "./Home";
import RecipeInstruction from "./RecipeInstruction";
import { Routes, Route, useLocation } from "react-router-dom";
import Favourite from "./Favourite";
import SearchList from "./SearchList";
import { ToastContainer } from "react-toastify";
import Login from "./login";
import Register from "./register";

const Main = () => {
  const location = useLocation();
  const hideNavRoutes = ["/", "/register"];

  return (
    <>
      {/* Only show NavBar if NOT on login or register routes */}
      {!hideNavRoutes.includes(location.pathname) && <NavBar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/RecipeInstruction/:id" element={<RecipeInstruction />} />
        <Route path="/Favourite" element={<Favourite />} />
        <Route path="/SearchList" element={<SearchList />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default Main;
