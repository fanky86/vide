import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function RegisterForm({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setErrorMsg(error.message);
    else onClose();
  };

  return (
    <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", padding: "20px", borderRadius: "8px" }}>
      <h3>Register</h3>
      <form onSubmit={handleRegister}>
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="submit">Register</button>
        <button type="button" onClick={onClose}>Tutup</button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
    </div>
  );
}
