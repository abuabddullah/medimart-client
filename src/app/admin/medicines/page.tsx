"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/src/lib/redux/hooks";
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from "@/src/lib/actions/medicines";
import { formatPrice } from "@/src/lib/utils";
import { Loader2, Plus, Search, Edit, Trash2, AlertCircle } from "lucide-react";
import { IMedicine } from "@/src/types/medicine";

export default function AdminMedicinesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [medicines, setMedicines] = useState<IMedicine[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalMedicines, setTotalMedicines] = useState(0);

  // Form states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [stock, setStock] = useState("");
  const [requiresPrescription, setRequiresPrescription] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [expiryDate, setExpiryDate] = useState<string>("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (user && user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page",
        variant: "destructive",
      });
      router.push("/");
      return;
    }

    fetchMedicines();
  }, [isAuthenticated, router, user, toast]);

  const fetchMedicines = async (pageNum = 1, search = "") => {
    try {
      setLoading(true);
      const searchParams: Record<string, string> = {};

      if (search) {
        searchParams.search = search;
      }

      const response = await getMedicines(pageNum, 10, searchParams);

      if (response.success) {
        if (pageNum === 1) {
          setMedicines(response.data);
        } else {
          setMedicines((prev) => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === 10);
        setPage(pageNum);
        setTotalMedicines(response.meta?.total || 0);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load medicines",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching medicines:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading medicines",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchMedicines(1, searchTerm);
  };

  const handleLoadMore = () => {
    fetchMedicines(page + 1, searchTerm);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("");
    setManufacturer("");
    setStock("");
    setRequiresPrescription(false);
    setImageURL("");
    setExpiryDate("");
    setSelectedMedicine(null);
  };

  const openEditDialog = (medicine: any) => {
    setSelectedMedicine(medicine);
    setName(medicine.name);
    setDescription(medicine.description || "");
    setPrice(medicine.price.toString());
    setCategory(medicine.category);
    setManufacturer(medicine.manufacturer);
    setStock(medicine.stock.toString());
    setRequiresPrescription(medicine.requiresPrescription);
    setImageURL(medicine.imageURL || "");
    setExpiryDate(medicine.expiryDate || "");
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (medicine: any) => {
    setSelectedMedicine(medicine);
    setIsDeleteDialogOpen(true);
  };

  const handleAddMedicine = async () => {
    if (!name || !price || !category || !manufacturer || !stock) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const medicineData = {
        name,
        description,
        price: Number.parseFloat(price),
        category,
        manufacturer,
        stock: Number.parseFloat(stock),
        requiresPrescription,
        imageURL,
        expiryDate,
      };

      console.log("🚀 ~ handleAddMedicine ~ medicineData:", medicineData);
      const response = await createMedicine(medicineData);
      console.log("🚀 ~ handleAddMedicine ~ response:", response);
      if (response.success) {
        toast({
          title: "Medicine added",
          description: "The medicine has been added successfully",
        });
        resetForm();
        setIsAddDialogOpen(false);
        fetchMedicines(1, searchTerm);
      } else {
        toast({
          title: "Failed to add medicine",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the medicine",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateMedicine = async () => {
    if (!name || !price || !category || !manufacturer || !stock) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setFormLoading(true);

      const medicineData = {
        name,
        description,
        price: Number.parseFloat(price),
        category,
        manufacturer,
        stock: Number.parseFloat(stock),
        requiresPrescription,
        imageURL,
      };

      console.log("🚀 ~ handleUpdateMedicine ~ medicineData:", medicineData);
      const response = await updateMedicine(selectedMedicine._id, medicineData);

      if (response.success) {
        toast({
          title: "Medicine updated",
          description: "The medicine has been updated successfully",
        });
        resetForm();
        setIsEditDialogOpen(false);
        fetchMedicines(1, searchTerm);
      } else {
        toast({
          title: "Failed to update medicine",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the medicine",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteMedicine = async () => {
    try {
      setFormLoading(true);

      const response = await deleteMedicine(selectedMedicine._id);

      if (response.success) {
        toast({
          title: "Medicine deleted",
          description: "The medicine has been deleted successfully",
        });
        setIsDeleteDialogOpen(false);
        fetchMedicines(1, searchTerm);
      } else {
        toast({
          title: "Failed to delete medicine",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting medicine:", error);
      toast({
        title: "Error",
        description: "An error occurred while deleting the medicine",
        variant: "destructive",
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Medicines</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medicines..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Medicines</CardTitle>
          <CardDescription>
            Total: {totalMedicines} medicine{totalMedicines !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && medicines.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No medicines found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or add a new medicine
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Prescription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {medicines.map((medicine: IMedicine) => (
                    <TableRow key={medicine._id}>
                      <TableCell className="font-medium">
                        {medicine.name}
                      </TableCell>
                      <TableCell>{medicine.category}</TableCell>
                      <TableCell>{medicine.manufacturer}</TableCell>
                      <TableCell>{formatPrice(medicine.price)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            medicine.stock
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {medicine.stock ? medicine.stock : "Out of Stock"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${
                            medicine.requiresPrescription
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {medicine.requiresPrescription
                            ? "Required"
                            : "Not Required"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => openEditDialog(medicine)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => openDeleteDialog(medicine)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {hasMore && (
            <div className="flex justify-center mt-6">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Medicine Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new medicine to the inventory
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Medicine name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Medicine description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Medicine category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Manufacturer name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stock keeping unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="imageURL">Image URL</Label>
                <Input
                  id="imageURL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  placeholder="URL to medicine image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresPrescription"
                  checked={requiresPrescription}
                  onCheckedChange={(checked) =>
                    setRequiresPrescription(checked as boolean)
                  }
                />
                <Label htmlFor="requiresPrescription">
                  Requires Prescription
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMedicine} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Medicine"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Medicine Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Medicine</DialogTitle>
            <DialogDescription>
              Update the details of the selected medicine
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Medicine name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Price *</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Medicine description"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Input
                  id="edit-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Medicine category"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-manufacturer">Manufacturer *</Label>
                <Input
                  id="edit-manufacturer"
                  value={manufacturer}
                  onChange={(e) => setManufacturer(e.target.value)}
                  placeholder="Manufacturer name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-stock">Stock</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="Stock keeping unit"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-imageURL">Image URL</Label>
                <Input
                  id="edit-imageURL"
                  value={imageURL}
                  onChange={(e) => setImageURL(e.target.value)}
                  placeholder="URL to medicine image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Expiry Date *</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-requiresPrescription"
                  checked={requiresPrescription}
                  onCheckedChange={(checked) =>
                    setRequiresPrescription(checked as boolean)
                  }
                />
                <Label htmlFor="edit-requiresPrescription">
                  Requires Prescription
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMedicine} disabled={formLoading}>
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Medicine"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Medicine Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Medicine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this medicine? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedMedicine && (
              <div className="border rounded-md p-4">
                <h4 className="font-medium">{selectedMedicine.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedMedicine.category} • {selectedMedicine.manufacturer}
                </p>
                <p className="text-sm font-medium mt-2">
                  {formatPrice(selectedMedicine.price)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteMedicine}
              disabled={formLoading}
            >
              {formLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Medicine"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
