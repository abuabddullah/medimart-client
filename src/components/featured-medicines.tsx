"use client";

import { MedicineCard } from "@/src/components/medicine-card";
import { useState } from "react";

export function FeaturedMedicines() {
  const [medicines, setMedicines] = useState([
    {
      id: "1",
      name: "Paracetamol",
      price: 5.99,
      category: "Pain Reliever",
      manufacturer: "ABC Pharma",
      imageURL: "",
      requiresPrescription: false,
    },
    {
      id: "2",
      name: "Amoxicillin",
      price: 12.5,
      category: "Antibiotic",
      manufacturer: "XYZ Pharmaceuticals",
      imageURL: "",
      requiresPrescription: false,
    },
    {
      id: "3",
      name: "Vitamin C",
      price: 8.75,
      category: "Vitamin",
      manufacturer: "Health Essentials",
      imageURL: "",
      requiresPrescription: false,
    },
    {
      id: "4",
      name: "Insulin",
      price: 45.99,
      category: "Diabetes",
      manufacturer: "MedLife",
      imageURL: "",
      requiresPrescription: true,
    },
  ]);

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold text-center mb-8">
          Featured Medicines
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {medicines.map((medicine) => (
            <MedicineCard key={medicine.id} {...medicine} />
          ))}
        </div>
      </div>
    </section>
  );
}
