"use client";

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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ProfileCard from "@/src/components/profile/ProfileCard";
import { changePassword, updateUserProfile } from "@/src/lib/actions/auth";
import { getMyOrders, initiatePayment } from "@/src/lib/actions/orders";
import { getMyPrescriptions } from "@/src/lib/actions/prescriptions";
import { getMyReviews } from "@/src/lib/actions/reviews";
import { setUser } from "@/src/lib/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import { IMyReview } from "@/src/types/review";
import {
  FileText,
  Loader2,
  MessageSquare,
  Package,
  ShieldCheck,
  Star,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [reviews, setReviews] = useState<IMyReview[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAvatar(user.avatar || "");
      setStreet(user.address?.street || "");
      setCity(user.address?.city || "");
      setPostalCode(user.address?.postalCode || "");
      setCountry(user.address?.country || "");
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);

        // Fetch user orders
        const ordersResponse = await getMyOrders();
        if (ordersResponse.success) {
          setOrders(ordersResponse.data);
        }

        // Fetch user prescriptions
        const prescriptionsResponse = await getMyPrescriptions();
        if (prescriptionsResponse.success) {
          setPrescriptions(prescriptionsResponse.data);
        }

        // Fetch user reviews
        const reviewsResponse = await getMyReviews();
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router, user, toast]);

  const handlePayment = async (orderId: string) => {
    const paymentResponse = await initiatePayment(orderId);

    if (paymentResponse.success) {
      // redirect GatewayPageURL URL or order page
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
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);

      const userData = {
        name,
        phone,
        avatar,
        address: {
          street,
          city,
          postalCode,
          country,
        },
      };

      const response = await updateUserProfile(userData);

      if (response.success) {
        dispatch(setUser({ ...user, ...userData }));

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        });
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    setPasswordError("");

    try {
      setLoading(true);

      const response = await changePassword(currentPassword, newPassword);

      if (response.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        toast({
          title: "Password changed",
          description: "Your password has been changed successfully",
        });
      } else {
        toast({
          title: "Password change failed",
          description: response.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Password change failed",
        description: "An error occurred while changing your password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-grid">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="prescriptions">
            <FileText className="h-4 w-4 mr-2" />
            Prescriptions
          </TabsTrigger>
          <TabsTrigger value="reviews">
            <MessageSquare className="h-4 w-4 mr-2" />
            Reviews
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileCard />
          <Card>
            <CardHeader>
              <CardTitle>Update Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user.email} disabled />
                <p className="text-sm text-muted-foreground">
                  Email cannot be changed
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  id="avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="Enter avatar url"
                />
              </div>
              <div className="space-y-2">
                <Label>Account Type</Label>
                <div className="flex items-center">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary" />
                  <span className="capitalize">{user.role}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
              <CardDescription>Update your address details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Enter your street address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter your city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter your postal code"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Enter your country"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile} disabled={loading}>
                {loading ? "Updating..." : "Update Address"}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>Update your account password</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {passwordError && (
                  <p className="text-sm text-destructive">{passwordError}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Updating..." : "Change Password"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
              <CardDescription>View your past orders</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't placed any orders yet
                  </p>
                  <Button onClick={() => router.push("/shop")}>
                    Browse Medicines
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-muted p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            Order #{order._id.slice(-6)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Placed on {formatDate(order.createdAt)}
                          </div>
                        </div>
                        <div>
                          <div className="my-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "processing"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              Shipment :{" "}
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}{" "}
                            </span>
                          </div>
                          <div className="my-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.paymentStatus === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "failed"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "cancelled"
                                  ? "bg-blue-100 text-red-800"
                                  : order.status === "pending"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              Payment :{" "}
                              {order.paymentStatus.charAt(0).toUpperCase() +
                                order.paymentStatus.slice(1)}{" "}
                            </span>
                          </div>
                          <div className="my-2">
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.prescriptionStatus === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : order.status === "not_required"
                                  ? "bg-blue-100 text-blue-800"
                                  : order.status === "pending"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              Precription Approval :{" "}
                              {order.prescriptionStatus
                                .charAt(0)
                                .toUpperCase() +
                                order.prescriptionStatus.slice(1)}{" "}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {order.items.map((item: any) => (
                            <div
                              key={item._id}
                              className="flex justify-between items-center"
                            >
                              <div className="flex items-center gap-2">
                                <div className="font-medium">
                                  {item?.medicine?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  x{item.quantity}
                                </div>
                              </div>
                              <div className="font-medium">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                          ))}
                        </div>
                        <Separator className="my-4" />
                        <div className="flex justify-between">
                          <span className="font-medium">Total</span>
                          <span className="font-medium">
                            {formatPrice(order.totalPrice)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-muted p-4 flex justify-end">
                        {(order?.paymentStatus === "pending" ||
                          order?.paymentStatus === "failed") && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePayment(order?._id)}
                          >
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Prescriptions Tab */}
        <TabsContent value="prescriptions">
          <Card>
            <CardHeader>
              <CardTitle>My Prescriptions</CardTitle>
              <CardDescription>
                View and manage your prescriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No prescriptions yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't uploaded any prescriptions yet
                  </p>
                  <Button onClick={() => router.push("/prescriptions/upload")}>
                    Upload Prescription
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription: any) => (
                    <div
                      key={prescription._id}
                      className="border rounded-lg overflow-hidden"
                    >
                      <div className="bg-muted p-4 flex justify-between items-center">
                        <div>
                          <div className="font-medium">
                            Prescription #{prescription._id.slice(-6)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Uploaded on {formatDate(prescription.createdAt)}
                          </div>
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              prescription.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : prescription.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {prescription.status.charAt(0).toUpperCase() +
                              prescription.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <img
                            src={
                              prescription.imageURL ||
                              "/placeholder.svg?height=200&width=400" ||
                              "/placeholder.svg"
                            }
                            alt="Prescription"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {prescription.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium mb-1">Notes:</h4>
                            <p className="text-sm text-muted-foreground">
                              {prescription.notes}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="bg-muted p-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(`/prescriptions/${prescription._id}`)
                          }
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>My Reviews</CardTitle>
              <CardDescription>View and manage your reviews</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : reviews?.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any reviews yet
                  </p>
                  <Button onClick={() => router.push("/profile/reviews")}>
                    Write a Review
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              review.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : review.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {review.status.charAt(0).toUpperCase() +
                              review.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="my-2">{review.comment}</p>
                      <div className="text-sm text-muted-foreground">
                        Submitted on {formatDate(review.createdAt)}
                      </div>
                    </div>
                  ))}

                  {reviews?.length > 3 && (
                    <div className="text-center mt-4">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/profile/reviews")}
                      >
                        View All Reviews
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={() => router.push("/profile/reviews")}>
                Manage Reviews
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
