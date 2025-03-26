"use client";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SkeletonMedicineCard() {
  return (
    <Card className="h-full overflow-hidden">
      <div className="relative w-full h-48">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4">
        <Skeleton width={100} height={10} className="mb-2" />
        <Skeleton height={20} className="mb-2" />
        <Skeleton width={150} height={10} className="mb-2" />
        <Skeleton width={80} height={20} className="mt-2" />
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button disabled className="w-full h-8">
          <Skeleton width={100} height={20} />
        </Button>
        <Button disabled variant="outline" size="icon" className="h-8 w-8">
          <Skeleton circle width={20} height={20} />
        </Button>
      </CardFooter>
    </Card>
  );
}
