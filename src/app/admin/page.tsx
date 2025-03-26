"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getAllUsers } from "@/src/lib/actions/auth";
import { getMedicines } from "@/src/lib/actions/medicines";
import { getAllOrders } from "@/src/lib/actions/orders";
import {
  getAllPrescriptions,
  updatePrescriptionStatus,
} from "@/src/lib/actions/prescriptions";
import { getAllReviews, updateReviewStatus } from "@/src/lib/actions/reviews";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import { IReview } from "@/src/types/review";
import {
  DollarSign,
  FileText,
  Loader2,
  MessageSquare,
  Package,
  Pill,
  ShoppingBag,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingPrescriptions: 0,
    pendingReviews: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch orders
        const ordersResponse = await getAllOrders(1, 5);
        if (ordersResponse.success) {
          setOrders(ordersResponse.data.orders);
        }

        // Fetch users
        const usersResponse = await getAllUsers();
        if (usersResponse.success) {
          setUsers(usersResponse.data);
        }

        // Fetch prescriptions
        const prescriptionsResponse = await getAllPrescriptions(1, 5);
        if (prescriptionsResponse.success) {
          setPrescriptions(prescriptionsResponse.data.prescriptions);
        }

        // Fetch reviews
        const reviewsResponse = await getAllReviews(1, 5);
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
        }

        const response = await getMedicines(1, 5);

        if (response.success) {
          setMedicines(response.data);
        }

        // Calculate stats
        setStats({
          totalOrders: ordersResponse.success
            ? ordersResponse.data.meta.total
            : 0,
          totalUsers: usersResponse.success ? usersResponse.data.length : 0,
          totalRevenue: ordersResponse.success
            ? ordersResponse.data.orders.reduce(
                (sum: number, order: any) => sum + order.totalPrice,
                0
              )
            : 0,
          pendingPrescriptions: prescriptionsResponse.success
            ? prescriptionsResponse.data.prescriptions.filter(
                (p: any) => p.status === "pending"
              ).length
            : 0,
          pendingReviews: reviewsResponse.success
            ? reviewsResponse.data.filter(
                (r: IReview) => r.status === "pending"
              ).length
            : 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router, user, toast]);
  const handleupdatePrescriptionStatus = async (
    prescriptionId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await updatePrescriptionStatus(prescriptionId, status);
      if (response.success) {
        toast({
          title: "Success",
          description: "Prescription status updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: response?.error?.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating prescription status:", error);
      toast({
        title: "Error",
        description: "Failed to update prescription status",
        variant: "destructive",
      });
    }
  };

  const handleUpdateReviewStatus = async (
    reviewId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      const response = await updateReviewStatus(reviewId, status);
      if (response.success) {
        toast({
          title: "Success",
          description: "Review status updated successfully",
        });

        // Update local state
        setReviews(
          reviews.map((review) =>
            review._id === reviewId ? { ...review, status } : review
          )
        );
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update review status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update review status",
        variant: "destructive",
      });
    }
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render stars for rating
  const renderRating = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Orders
                </p>
                <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <h3 className="text-2xl font-bold">{stats.totalUsers}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </p>
                <h3 className="text-2xl font-bold">
                  {formatPrice(stats.totalRevenue || 100)}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Prescriptions
                </p>
                <h3 className="text-2xl font-bold">
                  {stats.pendingPrescriptions}
                </h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending Reviews
                </p>
                <h3 className="text-2xl font-bold">{stats.pendingReviews}</h3>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="orders" className="space-y-20 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 md:w-auto md:inline-grid">
          <TabsTrigger value="orders">
            <Package className="h-4 w-4 mr-2" />
            Recent Orders
          </TabsTrigger>
          <TabsTrigger value="medicines">
            <Pill className="h-4 w-4 mr-2" />
            Medicines
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Users
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

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Orders</CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/orders">Manage Orders</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground">
                    There are no orders in the system yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">
                          Order #{order._id.slice(-6)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(order.createdAt)} • {order.items.length}{" "}
                          items
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(order.totalPrice)}
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                order.status === "delivered"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/orders/${order._id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="medicines">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Medicines</CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/medicines">Manage Medicines</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {medicines.length === 0 ? (
                <div className="text-center py-6">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No medicines yet</h3>
                  <p className="text-muted-foreground">
                    There are no medicines in the system yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {medicines.map((medicine: any) => (
                    <div
                      key={medicine._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{medicine.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {medicine.category} • {medicine.manufacturer}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">
                            {formatPrice(medicine.price)}
                          </div>
                          <div>
                            <span
                              className={`inline-block px-2 py-1 text-xs rounded-full ${
                                medicine.stock > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/medicines/${medicine._id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Users</CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {users.length === 0 ? (
                <div className="text-center py-6">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No users yet</h3>
                  <p className="text-muted-foreground">
                    There are no users in the system yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {users.slice(0, 5).map((user: any) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.status.charAt(0).toUpperCase() +
                              user.status.slice(1)}
                          </span>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/users/${user._id}`}>View</Link>
                        </Button>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Prescriptions</CardTitle>
              <Button size="sm" disabled asChild>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No prescriptions yet
                  </h3>
                  <p className="text-muted-foreground">
                    There are no prescriptions in the system yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription: any) => (
                    <div
                      key={prescription._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">
                          Prescription #{prescription._id.slice(-6)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(prescription.createdAt)} •{" "}
                          {prescription?.user?.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
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

                        <Button
                          onClick={() =>
                            handleupdatePrescriptionStatus(
                              prescription?._id,
                              "approved"
                            )
                          }
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-green-100 cursor-pointer"
                        >
                          <span>Approve</span>
                        </Button>
                        <Button
                          onClick={() =>
                            handleupdatePrescriptionStatus(
                              prescription?._id,
                              "rejected"
                            )
                          }
                          variant="outline"
                          size="sm"
                          asChild
                          className="bg-red-100 cursor-pointer"
                        >
                          <span>Reject</span>
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Reviews</CardTitle>
              <Button size="sm" asChild>
                <Link href="/admin/reviews">Manage Reviews</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {reviews?.length === 0 ? (
                <div className="text-center py-6">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
                  <p className="text-muted-foreground">
                    There are no reviews in the system yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="font-medium">{review.userId.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(review.createdAt)}
                        </div>
                        <div className="mt-1">
                          {renderRating(review.rating)}
                        </div>
                        <div className="mt-2 text-sm">
                          {review.comment.length > 100
                            ? `${review.comment.substring(0, 100)}...`
                            : review.comment}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
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

                        {review.status !== "approved" && (
                          <Button
                            onClick={() =>
                              handleUpdateReviewStatus(review._id, "approved")
                            }
                            variant="outline"
                            size="sm"
                            className="bg-green-100 cursor-pointer"
                          >
                            Approve
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            onClick={() =>
                              handleUpdateReviewStatus(review._id, "rejected")
                            }
                            variant="outline"
                            size="sm"
                            className="bg-red-100 cursor-pointer"
                          >
                            Reject
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
      </Tabs>
    </div>
  );
}
