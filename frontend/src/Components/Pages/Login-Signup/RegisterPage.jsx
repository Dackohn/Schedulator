import React, { useState } from "react";
import httpClient from "../../../httpClient";
import Cookies from 'js-cookie';

export const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = async () => {
    try {
      const response = await httpClient.post("http://localhost:5000/register", {
        email,
        password,
      });

      // Assuming the response contains the user_id and session_id
      Cookies.set('user_id', response.data.id);
      Cookies.set('session_id', response.data.session_id);

      window.location.href = "/dashboard"; // Redirect to dashboard
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("User already exists with this email.");
      } else {
        console.error("Registration failed:", error);
        alert("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div>
      <h1>Create an account</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>Email: </label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="button" onClick={registerUser}>
          Register
        </button>
      </form>
    </div>
  );
};
