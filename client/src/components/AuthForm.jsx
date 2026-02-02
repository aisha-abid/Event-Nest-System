import React, { useState } from "react";
import axios from "axios";
import { showCustomToast } from "../utils/toastUtils";

const AuthForm = ({ onLogin }) => {
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); // inline errors

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (state === "register") {
      if (!name.trim()) newErrors.name = "Name is required";
      else if (name.length < 3) newErrors.name = "Name must be at least 3 characters";
    }

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email";

    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()){
      showCustomToast("⚠️ Please fix the highlighted errors before continuing.");
    return; //stop if validation fails
    }
      

    try {
      let url = "";
      let payload = {};

      if (state === "register") {
        url = "https://localhost:5000/api/v1/auth/register";
        payload = { name, email, password };
      } else {
        url = "https://localhost:5000/api/v1/auth/login";
        payload = { email, password };
      }

      const { data } = await axios.post(url, payload);

      showCustomToast(
      data?.message ||
        (state === "register"
          ? "🎉 Account created successfully!"
          : "✅ Login successful!")
    );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if (onLogin) onLogin(data.user);

      setName("");
      setEmail("");
      setPassword("");
      setErrors({});
    } catch (error) {
      console.log("Auth error:", error.response?.data);

      // Show server error inline on password/email fields
      if (state === "login") {
        setErrors({ password: error.response?.data?.message || "Invalid credentials" });
      } else {
        showCustomToast(error.response?.data?.message || "⚠️ Something went wrong");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
    >
      <p className="text-2xl font-medium m-auto">
        <span className="text-[#23a8d8]">User</span>{" "}
        {state === "login" ? "Login" : "Sign Up"}
      </p>

      {state === "register" && (
        <div className="w-full">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your Name"
            className="border rounded w-full p-2 mt-1"
            required
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
      )}

      <div className="w-full">
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Email"
          type="email"
          className="border rounded w-full p-2 mt-1"
          required
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      <div className="w-full">
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          type="password"
          className="border rounded w-full p-2 mt-1"
          required
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      <p
        className="text-sm cursor-pointer text-gray-500"
        onClick={() => {
          setState(state === "login" ? "register" : "login");
          setErrors({});
        }}
      >
        {state === "login" ? (
          <span>
            Create an account? <span className="text-[#23a8d8]">Click here</span>
          </span>
        ) : (
          <span>
            Already have an account?{" "}
            <span className="text-[#23a8d8]">Click here</span>
          </span>
        )}
      </p>

      <button
        type="submit"
        className="bg-[#23a8d8] text-white w-full py-2 rounded-md hover:bg-[#1d90ba]"
      >
        {state === "register" ? "Create Account" : "Login"}
      </button>
    </form>
  );
};

export default AuthForm;



