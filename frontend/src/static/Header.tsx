// src/components/Header.tsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxHamburgerMenu } from "react-icons/rx";
import { FiX } from "react-icons/fi";
import { TbChevronDown } from "react-icons/tb";
import { HiOutlineShoppingCart, HiOutlineHeart } from "react-icons/hi";
import { MdMiscellaneousServices, MdOutlineSell } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { logout } from "../redux/slices/authSlice";
import Sidebar from "./Sidebar";
import Button from "../components/reusable/Button";

// ✅ Import popups
import Cart from "./Cart";
import Wishlist from "./Wishlist";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showDropdown, setShowDropdown] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [visible, setVisible] = useState(true);

  // ✅ Popups
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);

  // ✅ Redux state
  const user = useSelector((state: RootState) => state.auth?.user ?? null);
  const cartItems = useSelector(
    (state: RootState) => state.cart?.cartItems ?? []
  );
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items ?? []
  );

  // ✅ Counts
  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0),
    [cartItems]
  );
  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const handleToggle = () => setToggle(!toggle);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  // Close sidebar on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setToggle(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide/show header on scroll
  useEffect(() => {
    let scrollTimeout: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
      setVisible(false);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setVisible(true), 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Display name
  const displayName = user
    ? user.role === "buyer"
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : `${user.businessName ?? ""} - ${user.ownerName ?? ""}`.trim()
    : null;

  // ✅ Avatar logic
  const avatarSrc = user?.buyerImage
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/buyers/${user.buyerImage}`
    : user?.sellerImage
    ? `${import.meta.env.VITE_BACKEND_URL}/uploads/sellers/${user.sellerImage}`
    : "/buyer-avatar.jpeg";

  return (
    <>
      <div
        className={`bg-white w-full backdrop-blur-md fixed z-50 top-0 left-0 right-0 border-b border-[#d6d6d6] transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "saturate(180%) blur(7px)",
          WebkitBackdropFilter: "saturate(180%) blur(8px)",
        }}
      >
        <div className="px-20 py-5 flex justify-between items-center max-w-[1280px] mx-auto text-[15px] max-tablet:px-10 max-mobile:px-5">
          {/* Logo + Desktop Menu */}
          <div className="flex gap-18 items-center">
            <Link to="/">
              <img
                className="w-[150px] max-mobile:w-[130px]"
                src="/header.png"
                alt="logo"
              />
            </Link>

            {/* Desktop Nav */}
            <div className="flex gap-8 text-[#333333] font-medium max-tablet:hidden">
              <div
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
                className="relative"
              >
                <nav className="flex items-center gap-1.5 hover:text-[#f89216] cursor-pointer">
                  Categories <TbChevronDown size={20} />
                </nav>
                {showDropdown && (
                  <div className="absolute top-full left-0 bg-[#30ac57] shadow-lg w-34 flex flex-col p-3 justify-center items-center z-50 rounded-md text-white font-semibold gap-2">
                    <Link
                      className="hover:text-[#f89216] flex items-center gap-1"
                      to="/Categories/Products"
                    >
                      <HiOutlineShoppingCart /> Products
                    </Link>
                    <Link
                      className="hover:text-[#f89216] flex items-center gap-1"
                      to="/Categories/Services"
                    >
                      <MdMiscellaneousServices /> Services
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/SellWithUs">
                <nav className="hover:text-[#f89216] flex items-center gap-1">
                  <MdOutlineSell /> Sell with Us
                </nav>
              </Link>
              <Link to="/Faq">
                <nav className="hover:text-[#f89216]">FAQs</nav>
              </Link>
              <Link to="/Contact">
                <nav className="hover:text-[#f89216]">Contact Us</nav>
              </Link>
              {user?.role === "seller" && (
                <Link to="/dashboard">
                  <nav className="hover:text-[#f89216]">Seller Dashboard</nav>
                </Link>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex gap-4 items-center text-[#333333] font-medium text-[15px] max-tablet:hidden">
            {!user ? (
              <>
                <Link to="/Login">
                  <Button
                    name="Login"
                    border="2px solid"
                    borderColor="#f89216"
                    hoverBgColor="#30ac57"
                    hoverTextColor="white"
                  />
                </Link>
                <Link to="/Register">
                  <Button
                    name="Register"
                    bgColor="#f89216"
                    hoverBgColor="#333333"
                    hoverTextColor="white"
                  />
                </Link>
              </>
            ) : (
              <>
                {/* Cart Popup Trigger */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => setOpenCart(true)}
                >
                  <HiOutlineShoppingCart size={24} className="text-[#333]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* Wishlist Popup Trigger */}
                <div
                  className="relative cursor-pointer"
                  onClick={() => setOpenWishlist(true)}
                >
                  <HiOutlineHeart size={24} className="text-[#333]" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {wishlistCount}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={avatarSrc}
                  alt="profile"
                  className="w-8 h-8 rounded-full object-cover"
                />

                <span className="font-medium text-[#333333]">
                  {displayName}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-[#F89216] hover:bg-[#e07c0f] text-white py-1 px-3 rounded-md text-sm"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden cursor-pointer max-[1020px]:hidden max-[800px]:flex">
            {toggle ? (
              <FiX size={30} color="#f89316" onClick={handleToggle} />
            ) : (
              <RxHamburgerMenu
                size={30}
                color="#333333"
                onClick={handleToggle}
              />
            )}
          </div>
        </div>

        {toggle && <Sidebar handleToggle={handleToggle} />}
      </div>

      {/* ✅ Popups */}
      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </>
  );
};

export default Header;
