import { useEffect, useState } from "react";
import { IMedicine } from "@/src/types/medicine";
import Headline from "@/components/shared/Heading";
import SkeletonMedicineCard from "@/components/shared/SkeletonMedicineCard";
import { MedicineCard } from "./medicine-card";
import { getMedicines } from "@/src/lib/actions/medicines";

const SuggestedProducts = ({ medicine }: { medicine: IMedicine }) => {
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
  const [suggestedMedicines, setSuggestedMedicines] = useState<IMedicine[]>([]);
  useEffect(() => {
    if (medicines) {
      const filtered = medicines.filter(
        (m) => m.category === medicine.category && m._id !== medicine._id
      );
      setSuggestedMedicines(filtered);
    }
  }, [medicines, medicine]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-lg mt-12">
      <div className="text-center">
        <Headline heading="Suggested Medicines" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          [...Array(3)].map((_, index) => <SkeletonMedicineCard key={index} />)}
        {suggestedMedicines.map((product: IMedicine) => (
          <MedicineCard key={product._id} {...medicine} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedProducts;
