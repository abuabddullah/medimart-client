"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addToCart } from "@/src/lib/redux/features/cartSlice";
import { useAppDispatch, useAppSelector } from "@/src/lib/redux/hooks";
import { formatPrice } from "@/src/lib/utils";
import { Heart, ShoppingCart, StarIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MedicineCardProps } from "../../types/medicine";

export function MedicineCard({
  _id,
  name,
  price,
  category,
  manufacturer,
  imageURL,
  requiresPrescription,
  isOffered,
  averageRating,
  totalReviews,
}: MedicineCardProps) {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return router.push("/login");
    }
    dispatch(
      addToCart({
        _id,
        name,
        price,
        quantity: 1,
        imageURL,
        requiresPrescription,
      })
    );

    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="h-full overflow-hidden">
      <div className="relative">
        <img
          src={imageURL || "/placeholder.svg?height=200&width=300"}
          alt={name}
          className="w-full h-48 object-cover"
        />
        {requiresPrescription && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full">
            Prescription Required
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{category}</div>
            <Link href={`/medicine/${_id}`}>
              <h3 className="font-semibold line-clamp-1 hover:text-primary transition-colors">
                {name}
              </h3>
            </Link>
            <div className="text-xs text-muted-foreground mt-1">
              {manufacturer}
            </div>
          </div>

          <div className="text-orange-500 flex items-center  mt-2">
            {[...Array(5)].map((_, index) => (
              <StarIcon
                key={index}
                className={`h-4 w-4 ${
                  index < Math.floor(averageRating || 0)
                    ? "text-blue-500 fill-blue-300"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 font-bold">
          {isOffered && (
            <span className="mt-2 font-bold line-through text-blue-400">
              {formatPrice((price as number) * 1.5)}
            </span>
          )}{" "}
          {formatPrice(price as number)}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="w-full" size="sm" onClick={handleAddToCart}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
        {/* <Button variant="outline" size="icon" className="h-8 w-8">
          <Heart className="h-4 w-4" />
        </Button> */}
      </CardFooter>
    </Card>
  );
}
