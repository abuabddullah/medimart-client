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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import {
  deleteReview,
  getAllReviews,
  updateReviewStatus,
} from "@/src/lib/actions/reviews";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { formatDate } from "@/src/lib/utils";
import type { IReview } from "@/src/types/review";
import {
  AlertCircle,
  Check,
  Loader2,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminReviewsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [router, user, toast]);

  const fetchReviews = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await getAllReviews(pageNum, 10);

      if (response.success) {
        if (pageNum === 1) {
          setReviews(response.data);
        } else {
          setReviews((prev) => [...prev, ...response.data]);
        }
        setHasMore(response.data.length === 10);
        setPage(pageNum);
        setTotalReviews(response.meta?.total || 0);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load reviews",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while loading reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // পরে আরো improve করতে হবে
  const handleSearch = () => {
    fetchReviews(1);
  };

  const handleLoadMore = () => {
    fetchReviews(page + 1);
  };

  const openDeleteDialog = (review: IReview) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(true);
      const response = await deleteReview(selectedReview._id);

      if (response.success) {
        toast({
          title: "Review deleted",
          description: "The review has been deleted successfully",
        });

        // Update local state যাতে promptly ui এ দেখা যায়
        setReviews(
          reviews.filter((review) => review._id !== selectedReview._id)
        );
        setTotalReviews((prev) => prev - 1);
        setIsDeleteDialogOpen(false);
      } else {
        toast({
          title: "Failed to delete review",
          description: response.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting the review",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setActionLoading(true);
      const response = await updateReviewStatus(id, status);

      if (response.success) {
        toast({
          title: "Status updated",
          description: `Review has been ${status}`,
        });

        // Update the review in the local state যাতে promptly ui এ দেখা যায়
        setReviews(
          reviews.map((review) =>
            review._id === id ? { ...review, status } : review
          )
        );
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update review status",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating the review status",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Reviews</h1>
      </div>

      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search reviews..."
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
          <CardTitle>Reviews</CardTitle>
          <CardDescription>
            Total: {totalReviews} review{totalReviews !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && reviews.length === 0 ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                There are no reviews in the system yet
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviews.map((review) => (
                    <TableRow key={review._id}>
                      <TableCell className="font-medium">
                        {review.userId.name}
                      </TableCell>
                      <TableCell>{renderRating(review.rating)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {review.comment}
                      </TableCell>
                      <TableCell>{formatDate(review.createdAt)}</TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {review.status !== "approved" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(review._id, "approved")
                              }
                              disabled={actionLoading}
                              className="bg-green-50 hover:bg-green-100 text-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          )}
                          {review.status !== "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleUpdateStatus(review._id, "rejected")
                              }
                              disabled={actionLoading}
                              className="bg-red-50 hover:bg-red-100 text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => openDeleteDialog(review)}
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

      {/* Delete Review Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedReview && (
              <div className="border rounded-md p-4">
                <div className="flex items-center mb-2">
                  <h4 className="font-medium">{selectedReview.userId.name}</h4>
                  <div className="ml-auto">
                    {renderRating(selectedReview.rating)}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedReview.comment}
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
              onClick={handleDeleteReview}
              disabled={actionLoading}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
