import { MedicineCard } from "@/src/components/shop/medicine-card";
import { getMedicines } from "@/src/lib/actions/medicines";
import { getLeastStockProducts } from "@/src/lib/utils";
import { IMedicine } from "@/src/types/medicine";
import moment from "moment";
import { useEffect, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import Headline from "../../../components/shared/Heading";
import SkeletonMedicineCard from "../../../components/shared/SkeletonMedicineCard";
import { OfferedMedicineCard } from "./OfferedMedicineCard";

const OfferedMedicines = () => {
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [offeredMedicines, setOfferedMedicines] = useState<any[]>([]);
  const [key, setKey] = useState(0);

  const getSecondsUntilMidnight = () => {
    const now = moment();
    const midnight = moment().endOf("day");
    return midnight.diff(now, "seconds");
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getMedicines();
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

  const updateOfferedMedicines = () => {
    if (medicines) {
      const leastStockMedicines = getLeastStockProducts(medicines, 3);
      setOfferedMedicines(leastStockMedicines);
    }
  };

  useEffect(() => {
    updateOfferedMedicines();

    const interval = setInterval(() => {
      updateOfferedMedicines();
      setKey((prev) => prev + 1);
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [medicines]);

  return (
    <div className="w-full max-w-5xl mx-auto py-12">
      <Headline heading="Offered Medicines" />
      <div className="flex justify-center gap-4 my-8">
        {["hours", "minutes", "seconds"].map((unit, index) => (
          <div key={unit} className="flex flex-col items-center">
            <CountdownCircleTimer
              key={`${key}-${unit}`}
              isPlaying
              duration={getSecondsUntilMidnight()}
              colors="#198CFF"
              size={60}
              onComplete={() => {
                console.log("24-hour countdown completed");
                setKey((prev) => prev + 1);
                return { shouldRepeat: true, delay: 1 };
              }}
            >
              {({ remainingTime }) => {
                const hours = Math.floor(remainingTime / 3600);
                const minutes = Math.floor((remainingTime % 3600) / 60);
                const seconds = remainingTime % 60;
                const value =
                  unit === "hours"
                    ? hours
                    : unit === "minutes"
                    ? minutes
                    : seconds;

                return (
                  <div className="text-sm font-semibold text-[#0984ff]">
                    {remainingTime > 0 ? (
                      <span>{String(value).padStart(2, "0")}</span>
                    ) : (
                      <span>00</span>
                    )}
                  </div>
                );
              }}
            </CountdownCircleTimer>
            <span className="mt-1 text-xs text-gray-600 capitalize">
              {unit}
            </span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading
          ? [...Array(3)].map((_, index) => (
              <SkeletonMedicineCard key={index} />
            ))
          : offeredMedicines.map((medicine) => (
              <OfferedMedicineCard {...medicine} key={medicine?._id} />
            ))}
      </div>
    </div>
  );
};

export default OfferedMedicines;
