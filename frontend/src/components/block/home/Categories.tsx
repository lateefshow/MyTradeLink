// Categories.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../static/styles";

// Types
interface BrandingItem {
  icon: React.ReactNode;
  title: string;
  Description: string;
}

interface CategoryItem {
  id: number | string;
  title: string;
  image_Url: string;
}

const ProductCategories: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (category: CategoryItem) => {
    navigate(`/products?category=${category.title}`);
  };

  return (
    <>
      {/* Branding Section */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-white p-5 rounded-md">
          {brandingData &&
            (brandingData as BrandingItem[]).map((item, index) => (
              <div className="flex items-start" key={index}>
                {item.icon}
                <div className="px-3">
                  <h3 className="font-bold text-sm md:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm">{item.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <h1 className="text-[22px] font-bold text-center mb-8">Product Categories</h1>
      <div
        className={`${styles.section} bg-amber-200 p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            (categoriesData as CategoryItem[]).map((category) => (
              <div
                className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                key={category.id}
                onClick={() => handleSubmit(category)}
              >
                <h5 className="text-[18px] leading-[1.3]">{category.title}</h5>
                <img
                  src={category.image_Url}
                  className="w-[120px] object-cover"
                  alt={category.title}
                />
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default ProductCategories;
