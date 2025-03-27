"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MedicineCard } from "@/src/components/shop/medicine-card";
import {
  getCategories,
  getManufacturers,
  getMedicines,
} from "@/src/lib/actions/medicines";
import { IMedicine } from "@/src/types/medicine";
import { Filter, Loader2, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";

export default function MedicinesPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>(
    []
  );
  const [prescriptionFilter, setPrescriptionFilter] = useState<string | null>(
    null
  );
  const [page, setPage] = useState(0); // ReactPaginate works with 0-based index
  const [hasMore, setHasMore] = useState(true);

  // Fetch categories and manufacturers on initial load
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch medicine categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success) {
          setCategories(categoriesResponse.data);
        }

        // Fetch manufacturers
        const manufacturersResponse = await getManufacturers();
        if (manufacturersResponse.success) {
          setManufacturers(manufacturersResponse.data);
        }

        // Fetch initial medicines
        await fetchMedicines(0, true);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryParam]);

  // Fetch medicines based on the current filter state
  const fetchMedicines = async (pageNum: number, reset = false) => {
    try {
      const searchParams: Record<string, string> = {};

      if (searchTerm) {
        searchParams.search = searchTerm;
      }

      if (selectedCategories.length > 0) {
        searchParams.category = selectedCategories.join(",");
      }

      if (selectedManufacturers.length > 0) {
        searchParams.manufacturer = selectedManufacturers.join(",");
      }

      if (prescriptionFilter) {
        searchParams.requiresPrescription = prescriptionFilter;
      }

      const response = await getMedicines(pageNum + 1, 10, searchParams);

      if (response.success) {
        if (reset) {
          setMedicines(response.data);
        } else {
          setMedicines((prev) => [...prev, ...response.data]);
        }

        setHasMore(response.data.length === 10);
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  // Handle category selection toggle
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Handle manufacturer selection toggle
  const handleManufacturerChange = (manufacturer: string) => {
    if (selectedManufacturers.includes(manufacturer)) {
      setSelectedManufacturers(
        selectedManufacturers.filter((m) => m !== manufacturer)
      );
    } else {
      setSelectedManufacturers([...selectedManufacturers, manufacturer]);
    }
  };

  // Handle search input change and automatically trigger filtering
  useEffect(() => {
    fetchMedicines(0, true); // Reset on search term change
  }, [
    searchTerm,
    selectedCategories,
    selectedManufacturers,
    prescriptionFilter,
  ]);

  // Handle clear filters button
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedManufacturers([]);
    setPrescriptionFilter(null);
  };

  // Handle page change (from ReactPaginate)
  const handlePageClick = (selectedItem: { selected: number }) => {
    const selectedPage = selectedItem.selected;
    setPage(selectedPage);
    fetchMedicines(selectedPage, true); // Reset to the first page when changing the page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Medicines</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-2"
                      onClick={handleClearFilters}
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search medicines..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">
                    Categories <span>(1 at a time)</span>
                  </h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`}>
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">
                    Manufacturers <span>(1 at a time)</span>
                  </h3>
                  <div className="space-y-3">
                    {manufacturers.map((manufacturer) => (
                      <div
                        key={manufacturer}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`manufacturer-${manufacturer}`}
                          checked={selectedManufacturers.includes(manufacturer)}
                          onCheckedChange={() =>
                            handleManufacturerChange(manufacturer)
                          }
                        />
                        <Label htmlFor={`manufacturer-${manufacturer}`}>
                          {manufacturer}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medicines grid */}
        <div className="flex-1">
          {loading && medicines.length === 0 ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">No medicines found</h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {medicines.map((medicine: IMedicine) => (
                  <MedicineCard key={medicine._id} {...medicine} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  breakLabel={"..."}
                  pageCount={Math.ceil(medicines.length / 10)} // Total pages
                  marginPagesDisplayed={2}
                  pageRangeDisplayed={5}
                  onPageChange={handlePageClick}
                  containerClassName="flex gap-2"
                  pageClassName="px-3 py-2 border rounded cursor-pointer"
                  activeClassName="bg-blue-600 text-white"
                  previousClassName="px-3 py-2 border rounded cursor-pointer"
                  nextClassName="px-3 py-2 border rounded cursor-pointer"
                  disabledClassName="opacity-50 cursor-not-allowed"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
