"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Signed in!");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>FocalTrack Admin Dashboard</h1>
      <p>Sign in with your Supabase email + password.</p>

      <div style={{ marginTop: 20 }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 5 }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", marginBottom: 10, padding: 5 }}
        />
        <button onClick={signIn} style={{ padding: "5px 15px" }}>
          Sign In
        </button>
      </div>
    </main>
  );
}
