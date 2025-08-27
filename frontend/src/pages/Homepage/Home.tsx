import HeroSection from "../../components/block/home/HeroSection";
import Category from "../../components/block/home/Category";
import HowTLworks from "../../components/block/home/HowTLworks";
import WhyChooseUs from "../../components/block/home/WhyChooseUs";
import Readytosell from "../../components/block/home/Readytosell";
import Testimonials from "../../components/block/home/Testimonials";
import ProductCategories from "../../components/block/home/Categories";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <Category />
      <HowTLworks />
      <WhyChooseUs />
      <Readytosell />
      <Testimonials />
      <ProductCategories />
      
    </div>
  );
};

export default Home;
