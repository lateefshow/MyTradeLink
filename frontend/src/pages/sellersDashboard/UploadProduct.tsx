// src/pages/sellersDashboard/UploadProduct.tsx

import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../redux/store";
import {
  uploadProduct,
  clearProductState,
} from "../../redux/product/productSlice";
import { Loader2, Upload } from "lucide-react";

interface ProductFormData {
  name: string;
  categoryType: "product" | "service";
  category: string;
  price: string;
  stock: string;
  description: string;
  image: File | null;
}

const UploadProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.product
  );

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    categoryType: "product",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // reset form after successful upload
  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        categoryType: "product",
        category: "",
        price: "",
        stock: "",
        description: "",
        image: null,
      });
      setPreviewImage(null);

      const timer = setTimeout(() => {
        dispatch(clearProductState());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim())
      newErrors.name = "Product/Service name is required";
    if (!formData.categoryType)
      newErrors.categoryType = "Category type is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || isNaN(Number(formData.price)))
      newErrors.price = "Price must be a valid number";

    // ✅ Only require stock if it's a product
    if (
      formData.categoryType === "product" &&
      (!formData.stock || isNaN(Number(formData.stock)))
    ) {
      newErrors.stock = "Stock must be a valid number";
    }

    if (!formData.image) newErrors.image = "Please upload an image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("categoryType", formData.categoryType);
    data.append("category", formData.category);
    data.append("price", formData.price);

    // ✅ Only append stock if product
    if (formData.categoryType === "product") {
      data.append("stock", formData.stock);
    }

    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    dispatch(uploadProduct(data));
  };

  return (
    <div className="p-6 bg-[#fbf2e7] min-h-screen max-w-[1200px] mx-auto">
      <h2 className="text-2xl font-bold text-[#f89216] mb-6 text-center">
        Upload Product / Service
      </h2>

      {error && <p className="text-red-500 text-center mb-4">Error: {error}</p>}
      {success && (
        <p className="text-green-600 text-center mb-4">
          Product/Service uploaded successfully!
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-md rounded space-y-4"
      >
        {/* Name + Price */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#333333] text-center">
              Product/Service Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border-2 border-gray-400 p-2 w-full rounded mt-2 outline-0"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="block font-semibold text-[#333333] text-center">
              Product / Service Price
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="border-2 border-gray-400 mt-2 p-2 w-full rounded outline-0"
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
        </div>

        {/* CategoryType + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-[#333333] text-center">
              Category Type
            </label>
            <select
              name="categoryType"
              value={formData.categoryType}
              onChange={handleChange}
              className="border-2 border-gray-400 mt-2 p-2 w-full rounded text-[#333333] font-semibold text-lg outline-0"
            >
              <option value="product">Product</option>
              <option value="service">Service</option>
            </select>
            {errors.categoryType && (
              <p className="text-red-500">{errors.categoryType}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold text-[#333333] text-center">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="border-2 border-gray-400 mt-2 p-2 w-full rounded text-[#333333] font-semibold text-lg outline-0"
            >
              <option value="">-- Select Category --</option>
              {formData.categoryType === "product" ? (
                <>
                  <option value="grocery">Groceries & Essential Items</option>
                  <option value="local">Local Perishable Items</option>
                  <option value="fashion">Fashion & Clothings</option>
                  <option value="home">Home & Kitchen Items</option>
                  <option value="building">Building & Hardwares</option>
                  <option value="electronics">Electronic & Gadgets</option>
                  <option value="autoparts">Auto Parts</option>
                </>
              ) : (
                <>
                  <option value="hair">Hair Stylist</option>
                  <option value="fashion">Fashion Designer</option>
                  <option value="caterer">Caterer</option>
                  <option value="plumbing">Plumber</option>
                  <option value="mechanic">Mechanic</option>
                  <option value="photographer">Photographer</option>
                  <option value="electrician">Electrician</option>
                </>
              )}
            </select>
            {errors.category && (
              <p className="text-red-500">{errors.category}</p>
            )}
          </div>
        </div>

        {/* Stock (only if Product) + Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.categoryType === "product" && (
            <div>
              <label className="block font-semibold text-[#333333] text-center">
                Stock Quantity
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className="border-2 border-gray-400 mt-2 p-2 w-full rounded outline-0"
              />
              {errors.stock && <p className="text-red-500">{errors.stock}</p>}
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#333333] text-center">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="border-2 mt-2 p-2 border-gray-400 w-full rounded outline-0"
            />
            {errors.image && <p className="text-red-500">{errors.image}</p>}
            {previewImage && (
              <img
                src={previewImage}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded-lg border"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold text-[#333333] text-center">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border-2 mt-2 p-2 w-full border-gray-400 rounded outline-0"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-center items-center pt-10">
          <button
            type="submit"
            disabled={loading}
            className="hover:bg-[#30ac57] py-2 text-[18px] text-[#333333] px-10 rounded-4xl border-2 border-[#f89216] hover:text-white flex items-center"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" /> Uploading...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" /> Upload
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadProduct;
