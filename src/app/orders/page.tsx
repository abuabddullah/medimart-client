"use client";
import { useEffect, useState } from "react";
import { getMyOrders, initiatePayment } from "@/src/lib/actions/orders";
import { Package, Loader2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      const ordersResponse = await getMyOrders();
      if (ordersResponse.success) {
        setOrders(ordersResponse.data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const handlePayment = async (orderId: string) => {
    await initiatePayment(orderId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-100 p-4 flex justify-between items-center">
                    <div>
                      <div className="font-medium">
                        Order #{order._id.slice(-6)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    {order.items.map((item) => (
                      <div
                        key={item._id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-2">
                          <div className="font-medium">
                            {item?.medicine?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            x{item.quantity}
                          </div>
                        </div>
                        <div className="font-medium">
                          ${item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-medium">${order.totalPrice}</span>
                    </div>
                  </div>
                  <div className="bg-gray-100 p-4 flex justify-end">
                    <Button variant="outline" size="sm">
                      <Link href="/profile">Handle Order</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
