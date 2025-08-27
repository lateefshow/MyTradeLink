// pages/Login.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { GoLock } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { loginUser } from "../../redux/actions/authAction";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error, user } = useSelector(
    (state: RootState) => state.auth
  );

  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRoleChange = (selected: "buyer" | "seller") => setRole(selected);

  // Redirect on successful login
  useEffect(() => {
    if (user) {
      if (user.role === "seller") navigate("/dashboard");
      else navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(loginUser(email, password, role));
  };

  return (
    <div className="max-w-[1200px] flex items-center justify-center min-h-screen px-4">
      <div className="mt-[100px] w-full max-w-md">
        {/* Go Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm hover:text-white hover:bg-[#F89216] px-4 py-2 rounded-md mb-6"
        >
          <FaArrowLeft />
          Back to Home
        </button>

        <form
          onSubmit={handleSubmit}
          className="h-[480px] w-[400px] bg-white rounded-lg shadow-md p-6 mb-[50px]"
        >
          <h2 className="text-2xl font-bold text-center text-[#33333]">
            Welcome Back
          </h2>
          <p className="text-[14px] text-center text-[#33333]">
            Sign in to your TradeLink account
          </p>

          {/* Role Tabs */}
          <div className="flex justify-between bg-[#FEF6E1] border border-[#FEF6E1] rounded-[10px] mb-6 p-1">
            <button
              type="button"
              onClick={() => handleRoleChange("buyer")}
              className={`px-9 py-2 rounded-[10px] text-sm ${
                role === "buyer"
                  ? "bg-[#F89216] text-white"
                  : "hover:bg-[#F89216]/30"
              }`}
            >
              I’m a buyer
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange("seller")}
              className={`px-9 py-2 rounded-[10px] text-sm ${
                role === "seller"
                  ? "bg-[#F89216] text-white"
                  : "hover:bg-[#F89216]/30"
              }`}
            >
              I’m a seller
            </button>
          </div>

          {/* Email */}
          <div className="mb-4 text-left">
            <label className="block text-sm mb-1 text-[#333333]">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3 top-3 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 pl-10 focus:ring-[#F89216] placeholder:text-sm"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4 text-left">
            <label className="block text-sm mb-1 text-[#333333]">
              Password
            </label>
            <div className="relative">
              <GoLock className="absolute left-3 top-3 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pl-10 placeholder:text-sm border rounded-md pr-10 outline-none focus:ring-2 focus:ring-[#F89216]"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="accent-[#F89216]" />
              Remember me
            </label>
            <button type="button" className="text-[#F89216] hover:underline">
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F89216] hover:bg-[#e07c0f] text-white py-2 rounded-md text-sm font-medium"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Conditional Bottom Text */}
          <div className="text-center mt-4 text-sm">
            {role === "buyer" ? (
              <p>
                Don’t have an account?{" "}
                <Link
                  to="/Signup"
                  className="text-[#F89216] font-medium hover:underline"
                >
                  Signup
                </Link>
              </p>
            ) : (
              <p>
                New to selling?{" "}
                <Link
                  to="/SellerForm"
                  className="text-[#F89216] font-medium hover:underline"
                >
                  Join as a seller
                </Link>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
