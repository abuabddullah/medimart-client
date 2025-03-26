"use client";
import Headline from "@/components/shared/Heading";
import { useToast } from "@/hooks/use-toast";
import {
  createMedicineReview,
  getAllMedicineReviews,
} from "@/src/lib/actions/medicineReview";
import { useAppSelector } from "@/src/lib/redux/hooks";
import { MessageCircle, Star, StarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { IMedicineReview } from "../../types";
import StarRatingComponent from "../shared/StarRatingComponent";

const ReviewManagement = ({ medicineId }: { medicineId: string }) => {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);

  // Combine all state values into one object state
  const [state, setState] = useState({
    review: "",
    rating: 5,
    isLoading: false,
    isSuccess: false,
    error: null as string | null,
    reviews: [] as IMedicineReview[],
    averageRating: 0,
    totalReviews: 0,
    isReviewsLoading: true,
    userReview: null as IMedicineReview | null,
  });

  // Fetch reviews and check if the current user has already reviewed
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch reviews
        const reviewsResponse = await getAllMedicineReviews(medicineId);
        if (!reviewsResponse.error) {
          setState((prevState) => ({
            ...prevState,
            reviews: reviewsResponse.reviews,
            averageRating: reviewsResponse.averageRating,
            totalReviews: reviewsResponse.totalReviews,
            isReviewsLoading: false, // Set loading to false when reviews are fetched
          }));
        } else {
          setState((prevState) => ({
            ...prevState,
            isReviewsLoading: false, // In case of failure, stop loading
          }));
        }

        // Check if the current user has already reviewed
        const userReview = reviewsResponse.reviews.find(
          (review: IMedicineReview) => review.userId?._id === user?._id
        );
        if (userReview) {
          setState((prevState) => ({
            ...prevState,
            userReview,
            review: userReview.review,
            rating: userReview.rating,
          }));
        }
      } catch (err) {
        console.error(err);
        setState((prevState) => ({
          ...prevState,
          isReviewsLoading: false, // Ensure this is also triggered on error
        }));
        toast({
          title: "Error",
          description: "Failed to fetch reviews.",
          variant: "destructive",
        });
      }
    };

    fetchReviews();
  }, [medicineId, user?._id]);

  const handleAddReview = async () => {
    if (!user?._id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a review.",
        variant: "destructive",
      });
      return;
    }

    setState((prevState) => ({
      ...prevState,
      isLoading: true,
      error: null,
    }));

    try {
      const reviewData = { medicineId, rating, review };

      const response = await createMedicineReview(reviewData);
      if (response.message == "You can only review purchased medicines.") {
        setState((prevState) => ({
          ...prevState,
          isSuccess: false,
        }));
      }
      setState((prevState) => ({
        ...prevState,
        isSuccess: true,
        isLoading: false,
        userReview: response.review,
      }));

      toast({
        title: "Success",
        description:
          response.message || "Prescription status updated successfully",
      });
    } catch (err) {
      setState((prevState) => ({
        ...prevState,
        error: "Error adding/updating review",
        isLoading: false,
      }));
      console.error(err);
    }
  };

  // Destructure state
  const {
    review,
    rating,
    isLoading,
    isSuccess,
    error,
    reviews,
    averageRating,
    totalReviews,
    isReviewsLoading,
    userReview,
  } = state;

  return (
    <div className="p-4 border rounded-lg shadow-lg mt-12">
      <h2 className="text-xl font-bold text-blue-500">Product Reviews</h2>

      {isReviewsLoading ? (
        <p>Loading reviews...</p>
      ) : (
        <>
          <div className="mb-4 p-4 ">
            <div className="flex items-center mb-3">
              <Star className="text-blue-400 mr-2" size={20} />
              <span className="mr-2 font-semibold text-gray-800">
                Average Rating:
              </span>

              <div className="text-blue-500 flex items-center  mt-2">
                {[...Array(5)].map((_, index) => (
                  <StarIcon
                    key={index}
                    className={
                      index < Math.floor(averageRating || 0)
                        ? "text-blue-500 fill-blue-300"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <MessageCircle className="text-blue-400 mr-2" size={20} />
              <span className="mr-2 font-semibold text-gray-800">
                Total Reviews:
              </span>
              <span className="text-gray-600">{totalReviews}</span>
            </div>
          </div>

          <div className="mt-6">
            <div>
              <textarea
                value={review}
                onChange={(e) =>
                  setState((prevState) => ({
                    ...prevState,
                    review: e.target.value,
                  }))
                }
                placeholder="Write your review here..."
                className="w-full p-2 border rounded"
                rows={4}
              ></textarea>
            </div>
            <div className="flex items-center justify-between my-4">
              <div className="border border-blue-200 rounded-lg p-4 bg-blue-100">
                <StarRatingComponent
                  rating={averageRating}
                  handleRatingChange={setState}
                />
              </div>

              <button
                onClick={handleAddReview}
                disabled={isLoading}
                className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
              >
                {isLoading
                  ? "Submitting..."
                  : userReview
                  ? "Update Review"
                  : "Submit Review"}
              </button>
            </div>

            {isSuccess && (
              <p className="text-green-500 mt-2">
                Review {userReview ? "updated" : "added"} successfully!
              </p>
            )}
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="my-10">
            <div className="text-center">
              <Headline heading="Customer's Feedback" />
            </div>
            <div className="space-y-2 grid grid-cols-1 lg:grid-cols-4 gap-4">
              {reviews?.length > 0 ? (
                reviews.map((review: IMedicineReview) => (
                  <div
                    key={review._id}
                    className="border-b py-4 px-6 bg-gradient-to-r from-cyan-100 via-blue-200 to-blue-600 shadow-lg rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-xl"
                  >
                    <div className="font-semibold text-lg text-white">
                      {review.userId?.name}
                    </div>
                    <div className="flex items-center mt-2">
                      <span className="text-white text-sm font-medium">
                        <div className="text-blue-500 flex items-center  mt-2">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              className={
                                index < Math.floor(review.rating || 0)
                                  ? "text-blue-500 fill-blue-300"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                      </span>
                    </div>
                    <p className="mt-3 text-white text-base">{review.review}</p>
                  </div>
                ))
              ) : (
                <p>No reviews available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewManagement;
