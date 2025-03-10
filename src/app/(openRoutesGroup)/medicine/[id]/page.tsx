"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getMedicineById } from "@/src/lib/actions/medicines";
import { addToCart } from "@/src/lib/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import {
  AlertCircle,
  ArrowLeft,
  Heart,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import moment from "moment";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MedicineDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        setLoading(true);
        const response = await getMedicineById(id as string);

        if (response.success) {
          setMedicine(response.data);
        } else {
          setError(response.message || "Failed to load medicine details");
        }
      } catch (error) {
        console.error("Error fetching medicine:", error);
        setError("An error occurred while loading medicine details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicine();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return router.push("/login");
    }
    if (!medicine) return;

    dispatch(
      addToCart({
        _id: medicine._id,
        name: medicine.name,
        price: medicine.price,
        quantity,
        imageURL: medicine.imageURL,
        requiresPrescription: medicine.requiresPrescription,
      })
    );

    toast({
      title: "Added to cart",
      description: `${medicine.name} has been added to your cart.`,
    });
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !medicine) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Error Loading Medicine</h1>
          <p className="text-muted-foreground mb-6">
            {error || "Medicine not found"}
          </p>
          <Button onClick={() => router.push("/shop")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Medicines
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => router.push("/shop")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Medicines
      </Button>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white rounded-lg overflow-hidden border">
          <img
            src={medicine.imageURL || "/placeholder.svg?height=400&width=600"}
            alt={medicine.name}
            className="w-full h-[400px] object-cover"
          />
        </div>

        <div>
          <div className="mb-2 text-sm text-muted-foreground">
            {medicine.category}
          </div>
          <h1 className="text-3xl font-bold mb-2">{medicine.name}</h1>
          <div className="text-sm text-muted-foreground mb-4">
            By {medicine.manufacturer}
          </div>

          <div className="text-2xl font-bold mb-6">
            {formatPrice(medicine.price)}
          </div>

          {medicine.requiresPrescription && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">
                  Prescription Required
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  You'll need to upload a valid prescription during checkout to
                  purchase this medicine.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-none"
                onClick={incrementQuantity}
              >
                +
              </Button>
            </div>

            <Button className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>

            <Button variant="outline" size="icon" className="h-10 w-10">
              <Heart className="h-4 w-4" />
            </Button>
          </div>

          <Separator className="my-6" />

          <div className="space-y-4">
            <div>
              <span className="font-medium">Expiry Date:</span>{" "}
              {moment(medicine.expiryDate).format("DD-MM-YYYY")}
            </div>
            <div>
              <span className="font-medium">Availability:</span>{" "}
              {medicine.stock ? "In Stock" : "Out of Stock"}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="description" className="max-w-3xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="usage">Usage & Side Effects</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="p-6">
          <h3 className="text-lg font-medium mb-4">Product Description</h3>
          <p className="text-muted-foreground">{medicine.description}</p>
        </TabsContent>
        <TabsContent value="details" className="p-6">
          <h3 className="text-lg font-medium mb-4">Product Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Category</h4>
              <p className="text-muted-foreground">{medicine.category}</p>
            </div>
            <div>
              <h4 className="font-medium">Manufacturer</h4>
              <p className="text-muted-foreground">{medicine.manufacturer}</p>
            </div>
            <div>
              <h4 className="font-medium">Dosage Form</h4>
              <p className="text-muted-foreground">
                {medicine.dosageForm || "Tablet"}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Strength</h4>
              <p className="text-muted-foreground">
                {medicine.strength || "500mg"}
              </p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="usage" className="p-6">
          <h3 className="text-lg font-medium mb-4">Usage Information</h3>
          <p className="text-muted-foreground mb-4">
            {medicine.usageInstructions ||
              "Take as directed by your healthcare provider."}
          </p>

          <h3 className="text-lg font-medium mb-4 mt-6">Side Effects</h3>
          <p className="text-muted-foreground">
            {medicine.sideEffects ||
              "Common side effects may include headache, nausea, and dizziness. Consult your doctor if you experience severe side effects."}
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
