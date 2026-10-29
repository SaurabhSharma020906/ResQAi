import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";
import { saveToken, saveUser } from "../utils/token";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const data = await loginUser(formData);

      saveToken(data.token);
      saveUser(data.user);

      setMessage("✅ Login Successful");

      setTimeout(() => {
        if (data.user.role === "Admin") {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
      }, 800);

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-[420px]">

        <h1 className="text-3xl font-bold text-center text-red-600">
          ResQAI Login
        </h1>

        <p className="text-gray-500 text-center mt-2">
          Welcome Back
        </p>

        {message && (
          <div
            className={`mt-5 p-3 rounded-lg text-center ${
              message.includes("Successful")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border p-3 rounded-lg"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border p-3 rounded-lg"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-6">
          Don't have an account?

          <Link
            to="/register"
            className="text-red-600 ml-2"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;