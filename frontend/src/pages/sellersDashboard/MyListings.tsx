// src/pages/sellersDashboard/MyListings.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  categoryType: "product" | "service";
  category: string;
  price: number;
  stock: number | null;
  image: string;
}

const MyListings = () => {
  const [activeTab, setActiveTab] = useState<"products" | "services">(
    "products"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  // Fetch products and services
  const fetchListings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${API_BASE}/api/products/my-products`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setProducts(
        data.products.filter((p: Product) => p.categoryType === "product")
      );
      setServices(
        data.products.filter((p: Product) => p.categoryType === "service")
      );
    } catch (error) {
      console.error("Fetch my listings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  // Auto-refresh after coming back from EditProduct
  useEffect(() => {
    if (location.state?.refreshed) {
      fetchListings();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Delete product/service
  const handleDelete = async (item: Product) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete this ${item.categoryType}? "${item.name}"?`
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/products/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      // Refresh after deletion
      fetchListings();
    } catch (error) {
      console.error("Delete product/service error:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const renderItems = (items: Product[]) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item._id} className="bg-white p-4 shadow rounded">
          <img
            src={`${API_BASE}/uploads/products/${item.image}`}
            alt={item.name}
            className="w-full h-60 object-cover rounded"
          />
          <h3 className="mt-2 text-lg font-semibold text-[#f89216]">
            {item.name}
          </h3>
          <p className="text-[#333333]">{item.category}</p>
          {item.price && (
            <p className="text-[#30ac57] font-bold">₦{item.price}</p>
          )}
          {item.stock !== null && (
            <p className="text-sm text-[#333333]">Stock: {item.stock}</p>
          )}

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => navigate(`/dashboard/edit-product/${item._id}`)}
              className="bg-[#f89216] text-white px-3 py-1 rounded cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item)}
              className="bg-[#30ac57] text-white px-3 py-1 rounded cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-6 bg-[#fbf2e7] min-h-screen max-w-[1200px] mx-auto">
      <h2 className="text-2xl text-[#f29816] font-bold mb-6">My Listings</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("products")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "products"
              ? "bg-[#30ac57] text-white"
              : "bg-[#f29816] text-white"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`px-4 py-2 rounded cursor-pointer ${
            activeTab === "services"
              ? "bg-[#30ac57] text-white"
              : "bg-[#f29816] text-white"
          }`}
        >
          Services
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : activeTab === "products" ? (
        renderItems(products)
      ) : (
        renderItems(services)
      )}
    </div>
  );
};

export default MyListings;
