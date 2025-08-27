// src/components/ServiceCard.tsx
import React from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../redux/store"; // ✅ same as ProductCard
import {
  addToWishlistAction,
  removeFromWishlistAction,
} from "../../redux/actions/wishlist"; // ✅ fixed
import { addToCart, removeFromCart } from "../../redux/actions/cart";

// Service type
export interface ServiceType {
  _id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  oldPrice?: number;
  rating?: number;
  sold?: number; // "booked"
  providerName?: string;

  provider: string;
  categoryType: string;
  slots: number;
  description: string;
}

interface ServiceCardProps extends ServiceType {
  onQuickView: (service: ServiceType) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  _id,
  name,
  category,
  image,
  price,
  oldPrice,
  rating = 4,
  sold = 0,
  providerName = "Provider",
  provider,
  categoryType,
  slots,
  description,
  onQuickView,
}) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.cartItems);

  const inWishlist = wishlist.some((s) => s._id === _id);
  const inCart = cart.some((s) => s._id === _id);

  // Render rating stars dynamically
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) =>
      rating >= i + 1 ? (
        <AiFillStar key={i} className="text-yellow-500" />
      ) : (
        <AiOutlineStar key={i} className="text-yellow-500" />
      )
    );
  };

  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      {/* Service Image */}
      <a href={`/service/${_id}`}>
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${image}`}
          alt={name}
          className="w-full h-[170px] object-contain"
        />
      </a>

      {/* Provider Name */}
      <a href={`/provider/preview/${_id}`}>
        <h5 className="pt-3 text-[15px] text-blue-400 pb-3">{providerName}</h5>
      </a>

      {/* Service Title + Ratings */}
      <a href={`/service/${_id}`}>
        <h4 className="pb-3 font-[500]">{name}</h4>
        <div className="flex text-lg">{renderStars(rating)}</div>

        {/* Price + Booked */}
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center">
            <h5 className="font-bold text-[18px] text-[#333] font-Roboto">
              ₦{price}
            </h5>
            {oldPrice && (
              <h4 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-2px] line-through">
                ₦{oldPrice}
              </h4>
            )}
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">
            {sold} booked
          </span>
        </div>
      </a>

      {/* Side Buttons */}
      <div className="absolute right-2 top-5 flex flex-col space-y-4">
        {/* Wishlist Toggle */}
        <button
          onClick={() =>
            inWishlist
              ? dispatch(removeFromWishlistAction(_id)) // ✅ fixed
              : dispatch(
                  addToWishlistAction({
                    _id,
                    name,
                    category,
                    image,
                    price,
                  })
                )
          }
          className="p-2 rounded-full bg-white shadow hover:bg-red-50 transition"
          title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          {inWishlist ? (
            <AiFillHeart className="text-red-500" size={22} />
          ) : (
            <AiOutlineHeart className="text-gray-700" size={22} />
          )}
        </button>

        {/* Quick View */}
        <button
          onClick={() =>
            onQuickView({
              _id,
              name,
              category,
              image,
              price,
              oldPrice,
              rating,
              sold,
              providerName,
              provider,
              categoryType,
              slots,
              description,
            })
          }
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          title="Quick view"
        >
          <AiOutlineEye className="text-gray-700" size={22} />
        </button>

        {/* Add/Remove from Cart */}
        <button
          onClick={() =>
            inCart
              ? dispatch(removeFromCart(_id))
              : dispatch(
                  addToCart({
                    _id,
                    name,
                    category,
                    image,
                    price,
                    quantity: 1,
                  })
                )
          }
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          title={inCart ? "Remove from cart" : "Add to cart"}
        >
          <AiOutlineShoppingCart
            className={inCart ? "text-green-600" : "text-red-800"}
            size={25}
          />
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
