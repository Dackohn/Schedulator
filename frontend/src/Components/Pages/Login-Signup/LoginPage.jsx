import React, { useState } from "react";
import httpClient from "../../../httpClient";
import Cookies from 'js-cookie';

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = async () => {
    console.log(email, password);

    try {
      const resp = await httpClient.post("//localhost:5000/login", {
        email,
        password,
      });

      // Assuming the response contains the user_id and session_id
      Cookies.set('user_id', resp.data.id);
      Cookies.set('session_id', resp.data.session_id);

      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Invalid credentials");
      } else {
        console.error("Login failed:", error);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Log Into Your Account</h1>
        <form>
          <div>
            <div className="info-box">
                <div className="var-name">
                  <label>Email: </label>
                </div>
                <input
                  className="info"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <div className="info-box">
                <div className="var-name">
                  <label>Password: </label>
                </div>
                <input
                  className="info"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className="submit-button" onClick={logInUser}>
              Submit
            </button>
        </form>
      </div>
    </div>
  );
};
