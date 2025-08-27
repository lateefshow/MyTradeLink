// src/components/Wishlist.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { removeFromWishlistAction } from "../redux/actions/wishlist"; // ✅ fixed import
import { addToCart } from "../redux/actions/cart";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

interface WishlistProps {
  setOpenWishlist: React.Dispatch<React.SetStateAction<boolean>>;
}

const Wishlist: React.FC<WishlistProps> = ({ setOpenWishlist }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  return (
    <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Wishlist</h2>
        <button onClick={() => setOpenWishlist(false)} onMouseOver={(e) => (e.currentTarget.style.color = "red")} onMouseOut={(e) => (e.currentTarget.style.color = "black")}>
          <FiX size={24} />
        </button>
      </div>

      {/* Wishlist Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {wishlistItems.length === 0 ? (
          <p className="text-gray-500">Your wishlist is empty</p>
        ) : (
          wishlistItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-3"
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${
                  item.image
                }`}
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />

              <div className="flex-1 px-3">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">₦{item.price}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-1">
                <button
                  className="text-green-600 text-sm"
                  onClick={() => dispatch(addToCart({ ...item, quantity: 1 }))}
                >
                  Add to Cart
                </button>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => dispatch(removeFromWishlistAction(item._id))} // ✅ fixed
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Link onClick={() => setOpenWishlist(false)}
        to="/wishlist"
        className="px-4 py-2 bg-blue-900 text-white rounded-md text-center text-2xl"
      >
        Go to Wishlist Page
      </Link>
    </div>
  );
};

export default Wishlist;
