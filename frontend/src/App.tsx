// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./static/Header";
//import Header from "./layouts/Header";
import Footer from "./static/Footer";
import Home from "./pages/Homepage/Home";
// import Categories from "./pages/Categories/Categories";
import SellWithUs from "./pages/SellWIthUs/SellWithUs";
// import Faq from "./pages/Faq/Faq";
import Contact from "./pages/Contact/ContactMain";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Product from "./pages/Categories/Product";
import Services from "./pages/Categories/Services";
import { SearchProvider } from "./context/SearchContext";

import DashboardLayout from "./pages/sellersDashboard/DashboardLayout";
import Overview from "./pages/sellersDashboard/Overview";
import MyListings from "./pages/sellersDashboard/MyListings";
import Messages from "./pages/sellersDashboard/Messages";
import UploadProduct from "./pages/sellersDashboard/UploadProduct";
import Settings from "./pages/sellersDashboard/Settings";
import EditProduct from "./pages/sellersDashboard/EditProduct";

import ProductCardTest from "./components/ProductCardTest";
import CartPage from "./static/CartPage";
import WishlistPage from "./static/WishlistPage";

const App = () => {
  return (
    <SearchProvider>
      <BrowserRouter>
        <Header />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          {/* <Route path="/Categories" element={<Categories />} /> */}
          <Route path="/Categories/Products" element={<Product />} />
          <Route path="/Categories/Services" element={<Services />} />
          <Route path="/SellWithUs" element={<SellWithUs />} />
          {/* <Route path="/Faq" element={<Faq />} /> */}
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />

          <Route path="/ProductCardTest" element={<ProductCardTest />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Seller Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="Upload" element={<UploadProduct />} />
            <Route path="listings" element={<MyListings />} />
            <Route path="messages" element={<Messages />} />
            <Route path="settings" element={<Settings />} />
            <Route path="edit-product/:productId" element={<EditProduct />} />
          </Route>

          {/* Catch-all for unmatched routes (optional) */}
          <Route
            path="*"
            element={<p className="text-center mt-10">404 - Page Not Found</p>}
          />
        </Routes>

        <Footer />
      </BrowserRouter>
    </SearchProvider>
  );
};

export default App;
