"use client";

import { useContext } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function Navbar() {
  //const { role, token, logout } = useContext(AuthProvider);

  return (
    <nav>
      <h1>App Name</h1>
      {token ? (
        <>
          <p>Welcome, {role}!</p>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </nav>
  );
}
