"use client";

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
import { InputLabel } from "@/src/components/shared/Label";
import { getAllUsers, updateUserStatus } from "@/src/lib/actions/auth";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { UserType } from "@/src/types/auth";
import {
  AlertCircle,
  Eye,
  Loader2,
  Mail,
  Search,
  Shield,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);

  // Status update dialog
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<"active" | "inactive" | undefined>(
    undefined
  );
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [router, user, toast]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();

      if (response.success) {
        setUsers(response.data);
        setTotalUsers(response.data.length);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "An error occurred while loading users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Filter users based on search term
    if (!searchTerm.trim()) {
      fetchUsers();
      return;
    }

    const filteredUsers = users.filter(
      (user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setUsers(filteredUsers);
    setTotalUsers(filteredUsers.length);
  };

  const openStatusDialog = (user: any) => {
    setSelectedUser(user);
    setNewStatus(user.status);
    setIsStatusDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedUser || !newStatus) return;

    try {
      setStatusLoading(true);
      const response = await updateUserStatus(selectedUser._id, newStatus);

      if (response.success) {
        toast({
          title: "Status updated",
          description: `User status has been updated to ${newStatus}`,
        });

        // Update the user in the local state যাতে promptly ui এ দেখা যায়
        setUsers(
          users.map((u: UserType) =>
            u._id === selectedUser._id ? { ...u, status: newStatus } : u
          )
        );

        setIsStatusDialogOpen(false);
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update user status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Error",
        description: "An error occurred while updating the user status",
        variant: "destructive",
      });
    } finally {
      setStatusLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users by name or email..."
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
          <CardTitle>Users</CardTitle>
          <CardDescription>
            Total: {totalUsers} user{totalUsers !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No users found</h3>
              <p className="text-muted-foreground">
                There are no users matching your search criteria
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user: UserType) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openStatusDialog(user)}
                          >
                            Update Status
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              router.push(`/admin/users/${user._id}`)
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
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Status</DialogTitle>
            <DialogDescription>
              Change the status of user {selectedUser?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Name</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-2" />
                    {selectedUser?.name}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Email</h4>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 mr-2" />
                    {selectedUser?.email}
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Role</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="capitalize">{selectedUser?.role}</span>
                </div>
              </div>
              <div className="space-y-2">
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                  value={newStatus}
                  onValueChange={(value) => {
                    if (
                      value === "active" ||
                      value === "inactive" ||
                      value === undefined
                    ) {
                      setNewStatus(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
