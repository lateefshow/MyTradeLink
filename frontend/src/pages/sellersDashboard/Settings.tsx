// src/pages/sellersDashboard/Settings.tsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../redux/store";
import { updateSellerProfile } from "../../redux/actions/authAction";
import axios from "axios";

const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    sellerImage: null as File | null,
    description: "",
    category: "",
    notifications: true,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    currentImage: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Fetch seller profile on mount
  useEffect(() => {
    const fetchSellerProfile = async () => {
      try {
        if (!token) return;
        const { data } = await axios.get(
          "http://localhost:8000/api/sellers/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setFormData((prev) => ({
          ...prev,
          businessName: data.businessName || "",
          ownerName: data.ownerName || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          description: data.description || "",
          category: data.category || "",
          currentImage: data.sellerImage
            ? `http://localhost:8000/uploads/sellers/${data.sellerImage}`
            : "",
        }));
      } catch (err) {
        console.error("Error fetching seller profile:", err);
      }
    };

    fetchSellerProfile();
  }, [token]);

  const handleChange = (e: any) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : files ? files[0] : value,
    });
  };

  // ✅ Save settings (dispatch Redux action)
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "currentImage") return;
          formDataToSend.append(key, value as any);
        }
      });

      // Dispatch Redux action instead of raw axios
      await dispatch(updateSellerProfile(formDataToSend));

      alert("Settings updated successfully ✅");
    } catch (err: any) {
      console.error(err);
      alert("Failed to update settings ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Deactivate account
  const handleDeactivate = async () => {
    if (!window.confirm("Are you sure you want to deactivate your account?"))
      return;
    try {
      if (!token) return;
      await axios.patch(
        "http://localhost:8000/api/sellers/deactivate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Your account has been deactivated ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate ❌");
    }
  };

  // ✅ Delete account
  const handleDelete = async () => {
    if (!window.confirm("This action is permanent. Delete account?")) return;
    try {
      if (!token) return;
      await axios.delete("http://localhost:8000/api/sellers/delete", {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Account deleted permanently ❌");
      localStorage.removeItem("token");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Failed to delete ❌");
    }
  };

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: "#fbf2e7" }}>
      <h2 className="text-2xl font-bold mb-6 text-[#f89216]">Settings</h2>

      {/* Preview Section */}
      <div className="bg-white p-6 shadow-md rounded mb-6">
        <h3 className="text-lg font-semibold mb-4 text-[#30ac57]">
          Store Preview
        </h3>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 border rounded flex items-center justify-center overflow-hidden">
            {formData.sellerImage ? (
              <img
                src={URL.createObjectURL(formData.sellerImage)}
                alt="Logo Preview"
                className="w-full h-full object-cover"
              />
            ) : formData.currentImage ? (
              <img
                src={formData.currentImage}
                alt="Current Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">No Logo</span>
            )}
          </div>

          <div>
            <p className="font-bold text-lg text-[#f89216]">
              {formData.businessName || "Business Name"}
            </p>
            <p className="text-sm text-gray-500">
              {formData.description || "Store description will appear here..."}
            </p>
            <p className="text-xs text-[#30ac57] mt-1">
              {formData.category
                ? formData.category.toUpperCase()
                : "No Category"}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded space-y-6"
      >
        {/* Profile Info */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-[#30ac57]">
            Profile Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium">Business Name</label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Owner Name</label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="border p-2 w-full rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        {/* Store Settings */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-[#30ac57]">
            Store Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Store Logo</label>
              <input
                type="file"
                name="sellerImage"
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Description</label>
              <textarea
                name="description"
                value={formData.description}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="block font-medium">Business Category</label>
              <select
                name="category"
                value={formData.category}
                className="border p-2 w-full rounded"
                onChange={handleChange}
              >
                <option value="">-- Select --</option>
                <option value="products">Products</option>
                <option value="services">Services</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>
        </section>

        {/* Account Settings */}
        <section>
          <h3 className="text-lg font-semibold mb-4 text-[#30ac57]">
            Account Settings
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block font-medium">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block font-medium">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="border p-2 w-full rounded"
                onChange={handleChange}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="notifications"
                checked={formData.notifications}
                onChange={handleChange}
              />
              <label className="font-medium">Enable Notifications</label>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#30ac57] hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </form>

      {/* Danger Zone */}
      <div className="bg-white p-6 shadow-md rounded mt-6 border border-[#f89216]">
        <h3 className="text-lg font-semibold text-[#30ac57] mb-4">
          Danger Zone
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Be careful! These actions cannot be undone.
        </p>
        <div className="flex gap-4">
          <button
            onClick={handleDeactivate}
            className="bg-[#f89216] hover:bg-[#333333] text-white px-4 py-2 rounded cursor-pointer"
          >
            Deactivate Account
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
