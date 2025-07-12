import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../App";
import SignIn from "../pages/SignIn";
import Home from "../pages/Home";
import Upload from "../pages/Upload";
import MyMaterials from "../pages/MyMaterials";
import ProtectedRoute from "../context/ProtectedRoute";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tempostudy" element={<Upload />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/mymaterials" element={<MyMaterials />} />
        </Route>

        <Route path="/signin" element={<SignIn />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
