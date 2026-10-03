// import { useState } from 'react'
// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import Register from "./components/Register";
import Login from "./components/Login";
import StudentIssue from "./components/StudentIssue";
import TeacherPge from "./components/TeacherPge";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/issue" element={<StudentIssue />} />
          <Route path="/tpge" element={<TeacherPge />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
