"use client";
import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthDropdown({ user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ position: "absolute", top: 10, right: 10 }}>
      <button onClick={() => setShowMenu(!showMenu)} style={{ fontSize: "24px" }}>☰</button>

      {showMenu && (
        <div style={{ position: "absolute", right: 0, background: "#222", color: "#fff", padding: "10px", borderRadius: "8px" }}>
          {user ? (
            <>
              <p>{user.email}</p>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => { setShowLogin(true); setShowMenu(false); }}>Login</button>
              <button onClick={() => { setShowRegister(true); setShowMenu(false); }}>Register</button>
            </>
          )}
        </div>
      )}

      {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}
