// src/components/QuickViewModal.tsx
import React from "react";
import { FaTimes, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import type { ProductType } from "./ProductCard";

interface QuickViewModalProps {
  product: ProductType | null;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
}) => {
  if (!product) return null;

  const renderStars = (rating: number = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (rating >= i - 0.5) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-11/12 md:w-2/3 lg:w-1/2 rounded-xl shadow-lg p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          <FaTimes />
        </button>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Image */}
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${
              product.image
            }`}
            alt={product.name}
            className="w-full md:w-1/2 object-contain rounded-lg"
          />

          {/* Product Details */}
          <div className="flex-1">
            <p className="text-blue-500">{product.shopName || "Shop"}</p>
            <h2 className="text-xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="text-gray-500">{product.category}</p>

            <div className="flex items-center text-yellow-400 my-2">
              {renderStars(product.rating || 0)}
            </div>

            <div className="flex items-center space-x-2 my-2">
              <span className="text-gray-900 font-bold text-xl">
                ₦{product.price}
              </span>
              {product.oldPrice && (
                <span className="text-red-400 line-through">
                  ₦{product.oldPrice}
                </span>
              )}
            </div>

            <p className="text-green-500">{product.sold || 0} sold</p>

            <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
