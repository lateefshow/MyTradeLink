import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  IoArrowBackSharp,
  IoLockClosed,
  IoEyeOutline,
  IoEyeOffOutline,
} from "react-icons/io5";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
  buyerImage?: FileList; // Updated to FileList
}

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserData>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const password = watch("password", "");

  const onSubmit = async (data: UserData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      formData.append("password", data.password);

      // ✅ Append file if exists
      if (data.buyerImage && data.buyerImage.length > 0) {
        formData.append("buyerImage", data.buyerImage[0]);
      }

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/buyer-register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("REGISTER SUCCESS:", res.data);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="bg-[#FEF6E1] min-h-screen flex items-center justify-center py-18 font-sans">
      <div className="max-w-[500px] w-full mx-auto p-4">
        <Link to="/">
          <div className="flex items-center max-w-fit text-gray-700 hover:bg-[#F89216] hover:text-white p-2 rounded-md transition-colors mb-4">
            <IoArrowBackSharp className="mr-2" />
            <span className="font-semibold">Back to Home</span>
          </div>
        </Link>

        <div className="bg-[#FFFFFF] w-full p-5 rounded-lg shadow-md border border-gray-200">
          <h1 className="font-bold text-2xl text-center text-[#F89216]">
            Join TradeLink
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Create your buyer account to start shopping locally
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className={`mt-1 block w-full pl-3 pr-3 py-2 border ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none`}
                  {...register("firstName", {
                    required: "First name is required",
                  })}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Doe"
                  className={`mt-1 block w-full pl-3 pr-3 py-2 border ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none`}
                  {...register("lastName", {
                    required: "Last name is required",
                  })}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="john.doe@example.com"
                  className={`block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                <IoLockClosed
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:outline-none`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Must be at least 8 characters",
                    },
                  })}
                />
                <IoLockClosed
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? (
                    <IoEyeOffOutline size={16} />
                  ) : (
                    <IoEyeOutline size={16} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className={`block w-full pl-10 pr-10 py-2 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md focus:outline-none`}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <IoLockClosed
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <IoEyeOffOutline size={16} />
                  ) : (
                    <IoEyeOutline size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Buyer Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                className="block w-full border border-gray-300 rounded-md p-2"
                {...register("buyerImage")}
              />
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 text-[#F89216] border-gray-300 rounded"
                {...register("terms", {
                  required: "You must agree to the terms and privacy policy",
                })}
              />
              <label className="ml-2 text-sm text-gray-900">
                I agree to the{" "}
                <a
                  href="/terms-of-service"
                  className="text-[#F89216] hover:underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  className="text-[#F89216] hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">
                {errors.terms.message}
              </p>
            )}

            {/* Submit */}
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="w-full bg-[#F89216] text-white font-bold py-2 rounded-xl hover:bg-[#30AC57] transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F89216] hover:underline">
                Sign in
              </Link>
            </p>
            <p className="text-gray-600 mt-2">
              Want to sell instead?{" "}
              <Link to="/sellwithus" className="text-[#F89216] hover:underline">
                Join as Seller
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
