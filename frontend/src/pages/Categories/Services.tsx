// src/pages/Categories/Service.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "./ServiceCard";
import type { ServiceType } from "./ServiceCard";

import QuickViewModal from "./QuickViewModal";

const Service = () => {
  const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/get-by-type/service`
        );
        setServices(res.data.products);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="p-6 pt-30">
      <h1 className="text-2xl font-bold mb-4">All Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service._id} className="group">
            <ServiceCard {...service} onQuickView={setSelectedService} />
          </div>
        ))}
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedService}
        onClose={() => setSelectedService(null)}
      />
    </div>
  );
};

export default Service;
