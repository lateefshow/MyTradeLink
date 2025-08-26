import React from "react";
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from "react-icons/ai";

const ProductCard = () => {
  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer pt-15">
      {/* Product Image */}
      <a href="/product/6894f839fe4b89682e9c0293">
        <img
          src="https://cdn.shopify.com/s/files/1/1706/9177/products/NEWAppleMacbookProwithM1ProChip14InchLaptop2021ModelMKGQ3LL_A_16GB_1TBSSD_custommacbd.jpg?v=1659592838"
          alt="Product"
          className="w-full h-[170px] object-contain"
        />
      </a>

      {/* Shop Name */}
      <a href="/shop/preview/6894f839fe4b89682e9c028a">
        <h5 className="pt-3 text-[15px] text-blue-400 pb-3">GlowBeauty</h5>
      </a>

      {/* Product Title + Ratings */}
      <a href="/product/6894f839fe4b89682e9c0293">
        <h4 className="pb-3 font-[500]">Computers and Laptops Product 2</h4>

        {/* Ratings */}
        <div className="flex text-yellow-500 text-lg">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiOutlineStar />
        </div>

        {/* Price + Sold */}
        <div className="py-2 flex items-center justify-between">
          <div className="flex items-center">
            <h5 className="font-bold text-[18px] text-[#333] font-Roboto">
              22506$
            </h5>
            <h4 className="font-[500] text-[16px] text-[#d55b45] pl-3 mt-[-2px] line-through">
              25007$
            </h4>
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">0 sold</span>
        </div>
      </a>

      {/* Side Buttons */}
      <div className="absolute right-2 top-5 flex flex-col space-y-4">
        {/* Wishlist */}
        <button
          className="p-2 rounded-full bg-white shadow hover:bg-red-50 transition mt-25"
          title="Add to wishlist"
        >
          <AiFillHeart className="text-red-500" size={22} />
        </button>

        {/* Quick View */}
        <button
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          title="Quick view"
        >
          <AiOutlineEye className="text-gray-700" size={22} />
        </button>

        {/* Add to Cart */}
        <button
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100 transition"
          title="Add to cart"
        >
          <AiOutlineShoppingCart className="text-gray-800" size={25} />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
