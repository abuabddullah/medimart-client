import { MedicineCard } from "@/src/components/shop/medicine-card";
import { getMedicines } from "@/src/lib/actions/medicines";
import { IMedicine } from "@/src/types/medicine";
import { useEffect, useState } from "react";
import Headline from "../../../components/shared/Heading";
import SkeletonMedicineCard from "../../../components/shared/SkeletonMedicineCard";

const FeaturedMedicines = () => {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getMedicines(1, 5);

        if (response.success) {
          setMedicines(response.data);
        }
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Headline heading="Featured Medicines" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading &&
          [...Array(4)].map((_, index) => <SkeletonMedicineCard key={index} />)}
        {medicines?.slice(0, 5).map((medicine) => (
          <MedicineCard key={medicine._id} {...medicine} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedMedicines;
