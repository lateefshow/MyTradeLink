// src/components/Cart.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { removeFromCart } from "../redux/actions/cart";
import { updateCartQuantity } from "../redux/actions/cart";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";

interface CartProps {
  setOpenCart: React.Dispatch<React.SetStateAction<boolean>>;
}

const Cart: React.FC<CartProps> = ({ setOpenCart }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const handleIncrease = (id: string) => {
    const item = cartItems.find((p) => p._id === id);
    if (item) {
      dispatch(updateCartQuantity({ _id: id, quantity: item.quantity + 1 }));
    }
  };

  const handleDecrease = (id: string) => {
    const item = cartItems.find((p) => p._id === id);
    if (item && item.quantity > 1) {
      dispatch(updateCartQuantity({ _id: id, quantity: item.quantity - 1 }));
    }
  };

  return (
    <div className="fixed top-0 right-0 w-[400px] h-full bg-white shadow-lg z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Shopping Cart</h2>
        <button onClick={() => setOpenCart(false)}>
          <FiX size={24} />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Your cart is empty</p>
        ) : (
          cartItems.map((item) => (
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

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-1">
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleDecrease(item._id)}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded"
                    onClick={() => handleIncrease(item._id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove */}
              <button
                className="text-red-500 text-sm"
                onClick={() => dispatch(removeFromCart(item._id))}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        <h3 className="font-semibold text-lg">
          Total: ₦
          {cartItems.reduce(
            (sum, item) => sum + item.price * (item.quantity || 1),
            0
          )}
        </h3>
        <button className="w-full bg-[#30ac57] text-white py-2 mt-3 rounded hover:bg-[#278c47]">
          Checkout
        </button>
        <Link onClick={() => setOpenCart(false)}
          to="/cart"
          className="px-4 py-2 bg-blue-900 text-white rounded-md text-center text-2xl float-right mt-2"
        >
          Go to Cart Page
        </Link>
      </div>
    </div>
  );
};

export default Cart;
