"use client";

import React, { useState } from "react";
import { IReview } from "@/src/types/review";
import moment from "moment";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MAX_VISIBILITY = 3;

const ReviewCard = ({ review }: { review: IReview }) => {
  const initials = review.userId.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const formattedDate = moment(review.createdAt).format("DD MMM YYYY");

  return (
    <div className="card-container">
      <Card className="w-full h-full p-6 bg-white shadow-xl rounded-xl">
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-4">
              {initials}
            </div>
            <div>
              <div className="font-medium text-black">{review.userId.name}</div>
              <div className="text-sm text-gray-500">{formattedDate}</div>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const ReviewCarousel = ({ reviews }: { reviews: IReview[] }) => {
  const [active, setActive] = useState(2);
  const count = reviews.length;

  return (
    <div className="carousel relative flex items-center justify-center h-96 w-full overflow-hidden">
      {active > 0 && (
        <button
          className="nav left absolute left-0 z-10 p-2 text-white bg-black/50 rounded-full"
          onClick={() => setActive((i) => i - 1)}
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {reviews.map((review, i) => (
        <div
          key={review._id}
          className="absolute w-80 h-96 transition-all ease-out duration-300"
          style={{
            transform: `rotateY(${(active - i) * 50}deg) scaleY(${
              1 + Math.abs(active - i) * -0.2
            }) translateZ(${Math.abs(active - i) * -20}rem) translateX(${
              Math.sign(active - i) * -5
            }rem)`,
            filter: `blur(${Math.abs(active - i) * 0.5}rem)`,
            opacity: Math.abs(active - i) >= MAX_VISIBILITY ? 0 : 1,
            display: Math.abs(active - i) > MAX_VISIBILITY ? "none" : "block",
          }}
        >
          <ReviewCard review={review} />
        </div>
      ))}

      {active < count - 1 && (
        <button
          className="nav right absolute right-0 z-10 p-2 text-white bg-black/50 rounded-full"
          onClick={() => setActive((i) => i + 1)}
        >
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  );
};

export default ReviewCarousel;
