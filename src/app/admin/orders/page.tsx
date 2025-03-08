"use client";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  getAllOrders,
  updateOrderPrescriptionStatus,
  updateOrderStatus,
} from "@/src/lib/actions/orders";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import {
  AlertCircle,
  Calendar,
  Eye,
  Loader2,
  MapPin,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalOrders, setTotalOrders] = useState(0);

  // Status update dialog
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);

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

    fetchOrders();
  }, [isAuthenticated, router, user, toast]);

  const fetchOrders = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await getAllOrders(pageNum, 10);

      if (response.success) {
        if (pageNum === 1) {
          setOrders(response.data.orders);
        } else {
          setOrders((prev) => [...prev, ...response.data.orders]);
        }
        setHasMore(response.data.orders.length === 10);
        setPage(pageNum);
        setTotalOrders(response.data.meta.total || 0);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load orders",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // need to improve this handlesearch
  const handleSearch = () => {
    fetchOrders(1);
  };

  const handleLoadMore = () => {
    fetchOrders(page + 1);
  };

  const openStatusDialog = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      setStatusLoading(true);
      const response = await updateOrderStatus(selectedOrder._id, newStatus);

      if (response.success) {
        toast({
          title: "Status updated",
          description: `Order status has been updated to ${newStatus}`,
        });

        // Update the order in the local state যাতে promptly ui এ দেখা যায়
        setOrders(
          orders.map((order: any) =>
            order._id === selectedOrder._id
              ? { ...order, status: newStatus }
              : order
          )
        );

        setIsStatusDialogOpen(false);
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update order status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the order status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const handleOrderPrescriptionStatus = async (
    orderId: string,
    orderPrescriptionStatus: string
  ) => {
    try {
      const response = await updateOrderPrescriptionStatus(
        orderId,
        orderPrescriptionStatus
      );
      console.log("🚀 ~ AdminOrdersPage ~ response:", response);

      if (response.success) {
        toast({
          title: "Prescription status updated",
          description: `Order prescription status has been updated to ${orderPrescriptionStatus}`,
        });

        // Update the order in the local state যাতে promptly ui এ দেখা যায়
        setOrders(
          orders.map((order: any) =>
            order._id === orderId
              ? { ...order, prescriptionStatus: orderPrescriptionStatus }
              : order
          )
        );
      } else {
        toast({
          title: "Update failed",
          description:
            response.error.message ||
            "Failed to update prescription status 222",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order prescription status:", error);
      toast({
        title: "Error",
        description:
          "An error occurred while updating the order prescription status",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  const getOrderPrescriptionStatusBadgeClass = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "not_required":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-purple-100 text-purple-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-amber-100 text-amber-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search orders by ID or customer name..."
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
          <CardTitle>Orders</CardTitle>
          <CardDescription>
            Total: {totalOrders} order{totalOrders !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && orders.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                There are no orders in the system yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Prescription Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order: any) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order._id.slice(-6)}
                      </TableCell>
                      <TableCell>{order.user?.name || "Unknown"}</TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>{formatPrice(order.totalPrice)}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full ${getOrderPrescriptionStatusBadgeClass(
                            order.prescriptionStatus
                          )}`}
                        >
                          {order.prescriptionStatus.charAt(0).toUpperCase() +
                            order.prescriptionStatus.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            className="bg-green-100 text-gray-900 cursor-pointer"
                            onClick={() =>
                              handleOrderPrescriptionStatus(
                                order?._id,
                                "approved"
                              )
                            }
                          >
                            Approve Prescription
                          </Button>
                          <Button
                            className="bg-red-100 text-gray-900 cursor-pointer"
                            onClick={() =>
                              handleOrderPrescriptionStatus(
                                order?._id,
                                "rejected"
                              )
                            }
                          >
                            Reject Prescription
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusDialog(order)}
                          >
                            Update Status
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(`/admin/orders/${order._id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
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

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order #{selectedOrder?._id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Order Date</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    {selectedOrder && formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Customer</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-2" />
                    {selectedOrder?.user?.name || "Unknown"}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Shipping Address</h4>
                <div className="flex items-start text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                  <div>
                    {selectedOrder?.shippingAddress?.address},
                    {selectedOrder?.shippingAddress?.city},
                    {selectedOrder?.shippingAddress?.postalCode},
                    {selectedOrder?.shippingAddress?.country}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Total Amount</h4>
                <div className="text-sm font-bold">
                  {selectedOrder && formatPrice(selectedOrder.totalPrice)}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={statusLoading}>
              {statusLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
