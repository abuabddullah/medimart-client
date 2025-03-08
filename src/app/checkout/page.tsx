"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createOrder, initiatePayment } from "@/src/lib/actions/orders";
import { uploadPrescription } from "@/src/lib/actions/prescriptions";
import { clearCart } from "@/src/lib/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import { AlertCircle, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { items } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [deliveryOption, setDeliveryOption] = useState("standard");
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [prescriptionError, setPrescriptionError] = useState("");

  useEffect(() => {
    // Redirect if not authenticated or cart is empty এটা middleware দিয়ে handle করব পরে
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to proceed to checkout",
        variant: "destructive",
      });
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      router.push("/cart");
    }
  }, [isAuthenticated, items, router, toast]);

  const requiresPrescription = items.some((item) => item.requiresPrescription);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFees = {
    standard: 5.0,
    express: 10.0,
    sameday: 15.0,
  };
  const deliveryFee = deliveryFees[deliveryOption as keyof typeof deliveryFees];
  const total = subtotal + deliveryFee;

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.includes("image/") && file.type !== "application/pdf") {
        setPrescriptionError("Please upload an image or PDF file");
        return;
      }

      // Check file size (max 5MB এর বেশি হলে error দেখাবে)
      if (file.size > 5 * 1024 * 1024) {
        setPrescriptionError("File size should be less than 5MB");
        return;
      }

      setPrescriptionFile(file);
      setPrescriptionError("");
    }
  };

  const handleUploadPrescription = async () => {
    if (!prescriptionFile) {
      setPrescriptionError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("prescription", prescriptionFile);

      const response = await uploadPrescription(formData);

      if (response.success) {
        setPrescriptionUploaded(true);
        toast({
          title: "Prescription uploaded",
          description: "Your prescription has been uploaded successfully",
        });
      } else {
        setPrescriptionError(
          response.message || "Failed to upload prescription"
        );
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      setPrescriptionError("An error occurred while uploading prescription");
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!address || !city || !postalCode || !country || !phoneNumber) {
      toast({
        title: "Missing information",
        description: "Please fill in all shipping details",
        variant: "destructive",
      });
      return;
    }

    if (requiresPrescription && !prescriptionUploaded) {
      toast({
        title: "Prescription required",
        description: "Please upload a prescription for the required medicines",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        items: items.map((item) => ({
          medicineId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
          phoneNumber,
        },
        deliveryOption,
      };

      const response = await createOrder(orderData);

      if (response.success) {
        dispatch(clearCart());

        toast({
          title: "Order placed successfully",
          description: "Your order has been placed and is being processed",
        });
        // Initiate payment with SSLCommerz
        const paymentResponse = await initiatePayment(response.data._id);

        if (paymentResponse.success) {
          // redirect to GatewayPageURL if available, else redirect to order page
          if (paymentResponse.data?.GatewayPageURL) {
            window.location.href = paymentResponse.data.GatewayPageURL;
          } else {
            router.push(`/orders`);
          }
        } else {
          toast({
            title: "Payment failed",
            description:
              paymentResponse.error.message || "Failed to process payment",
            variant: "destructive",
          });

          router.push(`/orders`);
        }
      } else {
        toast({
          title: "Order failed",
          description: response.message || "Failed to place order",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order failed",
        description: "An error occurred while placing your order",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Shipping Information */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
              <CardDescription>
                Enter your shipping details for delivery
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    placeholder="Postal code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Delivery Options */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
              <CardDescription>
                Choose your preferred delivery method
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={deliveryOption}
                onValueChange={setDeliveryOption}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="font-medium">Standard Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Delivery within 3-5 business days
                    </div>
                  </Label>
                  <div className="font-medium">
                    {formatPrice(deliveryFees.standard)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="font-medium">Express Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Delivery within 1-2 business days
                    </div>
                  </Label>
                  <div className="font-medium">
                    {formatPrice(deliveryFees.express)}
                  </div>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                  <RadioGroupItem value="sameday" id="sameday" />
                  <Label htmlFor="sameday" className="flex-1 cursor-pointer">
                    <div className="font-medium">Same Day Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      Delivery within 24 hours (order before 12 PM)
                    </div>
                  </Label>
                  <div className="font-medium">
                    {formatPrice(deliveryFees.sameday)}
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Prescription Upload (if required) */}
          {requiresPrescription && (
            <Card>
              <CardHeader>
                <CardTitle>Prescription Upload</CardTitle>
                <CardDescription>
                  Upload a valid prescription for prescription-only medicines
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-amber-500 mr-2 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">
                      Prescription Required
                    </p>
                    <p className="text-sm text-amber-700 mt-1">
                      Some items in your cart require a valid prescription.
                      Please upload a clear image or PDF of your prescription.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prescription">Upload Prescription</Label>
                  <div className="flex gap-4">
                    <Input
                      id="prescription"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handlePrescriptionChange}
                      disabled={prescriptionUploaded || loading}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleUploadPrescription}
                      disabled={
                        !prescriptionFile || prescriptionUploaded || loading
                      }
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      Upload
                    </Button>
                  </div>
                  {prescriptionError && (
                    <p className="text-sm text-destructive mt-1">
                      {prescriptionError}
                    </p>
                  )}
                  {prescriptionUploaded && (
                    <p className="text-sm text-green-600 mt-1">
                      Prescription uploaded successfully
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
                      <img
                        src={
                          item.imageURL || "/placeholder.svg?height=64&width=64"
                        }
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </div>
                      {item.requiresPrescription && (
                        <div className="text-xs text-amber-600 mt-1">
                          Prescription required
                        </div>
                      )}
                    </div>
                    <div className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handlePlaceOrder}
                disabled={
                  loading || (requiresPrescription && !prescriptionUploaded)
                }
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
