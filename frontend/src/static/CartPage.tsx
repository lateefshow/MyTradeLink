// src/pages/CartPage.tsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  addToCart,
  removeFromCart,
  decreaseQuantity,
} from "../redux/actions/cart";
import { Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state: RootState) => state.cart);

  const handleIncrease = (item: any) => {
    dispatch(addToCart({ ...item, quantity: 1 })); // ✅ matches reducer
  };

  const handleDecrease = (item: any) => {
    dispatch(decreaseQuantity(item._id)); // ✅ decrease qty by 1
  };

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (acc: number, item: any) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 pt-30">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item: any) => (
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
                  <p className="text-sm text-gray-500">
                    ₦{item.price} x {item.quantity}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDecrease(item)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleIncrease(item)}
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>

                <button
                  onClick={() => handleRemove(item._id)}
                  className="ml-4 text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between items-center border-t pt-4">
            <p className="text-lg font-semibold">
              Total:{" "}
              <span className="text-green-600">₦{totalPrice.toFixed(2)}</span>
            </p>
            <Link
              to="/checkout"
              className="px-4 py-2 bg-green-500 text-white rounded-md"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
