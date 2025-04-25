import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { setDoc, doc } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState("Sign Up");

  const rtdb = getDatabase();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (buttonText === "Login") {
      navigate("/");
      return;
    }

    if (!email || !password) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setButtonText("Registering...");

    setTimeout(async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const user = userCredential.user;

        toast.success("You have successfully registered! Kindly login.", {
            position: "top-center",
            autoClose: 4000,
          });
          setButtonText("Login");

        setButtonText("Login");

        setTimeout(() => {
          navigate("/");
        }, 400);
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error.message, {
          position: "bottom-center",
        });
        setButtonText("Sign Up");
      } finally {
        setLoading(false);
      }
    }, 5000);
  };

  return (
    <div className="register-container">
      <ToastContainer />
      <form className="register-form" onSubmit={handleRegister}>
        <h3>Sign Up</h3>

        <div className="mb-3">
          <label>Email address</label>
          <input
            type="email"
            className="form-control"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary" disabled={loading && buttonText !== "Login"}>
            {buttonText}
          </button>
        </div>

        <p className="forgot-password text-right">
          Already registered? <Link to="/">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
