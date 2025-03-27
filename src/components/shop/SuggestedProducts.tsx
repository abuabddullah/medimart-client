import Headline from "@/components/shared/Heading";
import SkeletonMedicineCard from "@/components/shared/SkeletonMedicineCard";
import { getMedicines } from "@/src/lib/actions/medicines";
import { IMedicine } from "@/src/types/medicine";
import { useEffect, useState } from "react";
import { MedicineCard } from "./medicine-card";

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
  }, []); // This useEffect runs only once on component mount

  const [suggestedMedicines, setSuggestedMedicines] = useState<IMedicine[]>([
    medicine,
  ]);

  useEffect(() => {
    if (medicines.length > 0) {
      // Make sure medicines have been loaded

      const filtered = medicines.filter(
        (m) => m.category === medicine.category && m._id !== medicine._id
      );

      setSuggestedMedicines(filtered);
    }
  }, [medicines, medicine]); // This will trigger when `medicines` or `medicine` changes

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-lg mt-12">
      <div className="text-center">
        <Headline heading="Suggested Medicines" />
      </div>
      <div className="max-w-5xl min-h-24 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          [...Array(3)].map((_, index) => <SkeletonMedicineCard key={index} />)}
        {suggestedMedicines.length > 0
          ? suggestedMedicines.map((product: IMedicine) => (
              <MedicineCard key={product._id} {...product} /> // Pass the product, not medicine
            ))
          : "No Suggestion for this medicine"}
      </div>
    </div>
  );
};

export default SuggestedProducts;
