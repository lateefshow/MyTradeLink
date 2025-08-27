// src/pages/WishlistPage.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/actions/cart";
import { removeFromWishlistAction } from "../redux/actions/wishlist"; // ✅ fixed
import { selectWishlistItems } from "../redux/reducers/wishlist"; // ✅ keep selector

const WishlistPage: React.FC = () => {
  const dispatch = useDispatch();

  // ✅ use memoized selector instead of raw state access
  const wishlist = useSelector(selectWishlistItems);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart({ ...item, quantity: 1 })); // ✅ matches cart reducer
    dispatch(removeFromWishlistAction(item._id)); // ✅ use thunk wrapper
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromWishlistAction(id)); // ✅ use thunk wrapper
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pt-30">
      <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p className="text-gray-600">Your wishlist is empty.</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {wishlist.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow rounded-lg p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${
                    item.image
                  }`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-500">₦{item.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-3 py-1 bg-green-500 text-white rounded"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
