// src/pages/Categories/Product.tsx
import { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/get-by-type/product`
        );
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    
    <div className="p-6 pt-30">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition"
          >
            <img
              src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${
                product.image
              }`}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h2 className="mt-2 font-semibold text-lg">{product.name}</h2>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-green-600 font-bold">₦{product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Product;
