import { Card, CardContent } from "@/components/ui/card";
import { IReview } from "@/src/types/review";
import moment from "moment";

const ReviewList = ({ reviews }: { reviews: IReview[] }) => {
  console.log("🚀 ~ ReviewList ~ reviews:", reviews);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {reviews.map((review: IReview) => {
        // Extract initials from name
        const initials = review.userId.name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        // Format date using Moment.js
        const formattedDate = moment(review.createdAt).format("DD MMM YYYY");

        return (
          <Card key={review._id}>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
                  {initials}
                </div>
                <div>
                  <div className="font-medium">{review.userId.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formattedDate}
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ReviewList;
