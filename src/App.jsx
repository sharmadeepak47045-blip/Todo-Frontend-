import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomeApp from "./pages/HomeApp";
import Home from "./pages/TodoPage/Home";
import Todo from "./pages/TodoPage/Todo";
import { Toaster } from "react-hot-toast"; // ✅ Toaster import karein

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <>
      {/* ✅ Global Toaster Component - Sab pages ke liye */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2000,
          style: {
            background: '#363636',
            color: '#fff',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
              border: '2px solid #059669',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
              border: '2px solid #dc2626',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />
      
      <Routes>
        {/* 1️⃣ PUBLIC HOMEAPP PAGE */}
        <Route path="/" element={<HomeApp />} />

        {/* 2️⃣ LOGIN/SIGNUP PAGE */}
        <Route
          path="/login"
          element={!token ? <Login setToken={setToken} /> : <Navigate to="/home" />}
        />

        {/* 3️⃣ PRIVATE ROUTES */}
        <Route
          path="/home"
          element={token ? <Home setToken={setToken} /> : <Navigate to="/login" />}
        />
        <Route
          path="/todo"
          element={token ? <Todo setToken={setToken} /> : <Navigate to="/login" />}
        />

        {/* 4️⃣ CATCH ALL → HOMEAPP */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}