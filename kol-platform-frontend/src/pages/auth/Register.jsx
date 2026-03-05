import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("kol");
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register({ ...form, role });

      //  redirect after register
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Create Account 
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join the KOL collaboration platform
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Role selector */}
        <select
          className="input mb-4"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="kol">KOL (Influencer)</option>
          <option value="company">Company (Brand)</option>
        </select>

        {/* COMMON */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            name="email"
            placeholder="Email"
            className="input"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            className="input"
            onChange={handleChange}
            required
          />
        </div>

        {/*  KOL fields */}
        {role === "kol" && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              name="fullName"
              placeholder="Full Name"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="country"
              placeholder="Country"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="niche"
              placeholder="Category / Niche"
              className="input"
              onChange={handleChange}
              required
            />

            <select
              name="platform"
              className="input"
              onChange={handleChange}
              required
            >
              <option value="">Primary Platform</option>
              <option>Instagram</option>
              <option>YouTube</option>
              <option>TikTok</option>
              <option>X</option>
            </select>
          </div>
        )}

        {/*  COMPANY fields */}
        {role === "company" && (
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              name="companyName"
              placeholder="Company Name"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="website"
              placeholder="Website"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="industry"
              placeholder="Industry"
              className="input"
              onChange={handleChange}
              required
            />

            <input
              name="country"
              placeholder="Country"
              className="input"
              onChange={handleChange}
              required
            />
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
        >
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-500">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;