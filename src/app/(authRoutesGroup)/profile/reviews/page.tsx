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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "@/src/components/review/review-form";
import {
  deleteReview,
  getMyReviews,
  updateReview,
} from "@/src/lib/actions/reviews";
import { formatDate } from "@/src/lib/utils";
import type { IMyReview } from "@/src/types/review";
import { AlertCircle, Edit, Loader2, Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileReviewsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<IMyReview[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IMyReview | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);

  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchMyReviews();
  }, [router]);

  const fetchMyReviews = async () => {
    try {
      setLoading(true);
      const response = await getMyReviews();

      if (response.success) {
        setReviews(response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load your reviews",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while loading your reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (review: IMyReview) => {
    setSelectedReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (review: IMyReview) => {
    setSelectedReview(review);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateReview = async () => {
    if (!selectedReview) return;

    if (editRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating",
        variant: "destructive",
      });
      return;
    }

    if (!editComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please provide a comment",
        variant: "destructive",
      });
      return;
    }

    try {
      setActionLoading(true);
      const response = await updateReview(selectedReview._id, {
        rating: editRating,
        comment: editComment,
      });

      if (response.success) {
        toast({
          title: "Review updated",
          description: "Your review has been updated and is pending approval",
        });

        // Update the review in the local state যাতে promptly ui এ দেখা যায়
        setReviews(
          reviews.map((review) =>
            review._id === selectedReview._id
              ? {
                  ...review,
                  rating: editRating,
                  comment: editComment,
                  status: "pending",
                }
              : review
          )
        );

        setIsEditDialogOpen(false);
      } else {
        toast({
          title: "Update failed",
          description: response.message || "Failed to update review",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your review",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!selectedReview) return;

    try {
      setActionLoading(true);
      const response = await deleteReview(selectedReview._id);

      if (response.success) {
        toast({
          title: "Review deleted",
          description: "Your review has been deleted successfully",
        });

        // Remove the review from the local state যাতে promptly ui এ দেখা যায়
        setReviews(
          reviews.filter((review) => review._id !== selectedReview._id)
        );
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
        description: "An error occurred while deleting your review",
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
      <h1 className="text-3xl font-bold mb-8">My Reviews</h1>

      <div className="mb-8">
        <Button onClick={() => setShowReviewForm(!showReviewForm)}>
          {showReviewForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showReviewForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>
              Share your experience with our service
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewForm
              onSuccess={() => {
                setShowReviewForm(false);
                fetchMyReviews();
              }}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Reviews</CardTitle>
          <CardDescription>Manage your submitted reviews</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-4">
                You haven't submitted any reviews yet
              </p>
              <Button onClick={() => setShowReviewForm(true)}>
                Write Your First Review
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="mb-2">{renderRating(review.rating)}</div>
                      <div className="text-sm text-muted-foreground">
                        Submitted on {formatDate(review.createdAt)}
                      </div>
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
                  <p className="my-3">{review.comment}</p>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(review)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive"
                      onClick={() => openDeleteDialog(review)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Review Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>Update your review</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Your Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= (hoveredRating || editRating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="edit-comment"
                className="block text-sm font-medium"
              >
                Your Review
              </label>
              <Textarea
                id="edit-comment"
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={4}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateReview} disabled={actionLoading}>
              {actionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Review"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
