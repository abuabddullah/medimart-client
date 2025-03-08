"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, HeartPulse, Pill, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCategories } from "../lib/actions/medicines";
import ReviewList from "../components/review-card";
import { getAllReviews, getApprovedReviews } from "../lib/actions/reviews";

export default function HomePage() {
  const [categories, setCategories] = useState([
    "Pain Relief",
    "Cold & Flu",
    "Vitamins",
    "Skin Care",
  ]);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // Fetch medicine categories
        const categoriesResponse = await getCategories();
        if (categoriesResponse.success) {
          setCategories((prevCtg) => [...prevCtg, ...categoriesResponse.data]);
        }

        // Fetch reviews
        const reviewsResponse = await getApprovedReviews();
        if (reviewsResponse.success) {
          setReviews(reviewsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      title: "Genuine Medicines",
      description: "All products are sourced directly from manufacturers",
      icon: <Pill className="h-10 w-10 text-primary" />,
    },
    {
      title: "Fast Delivery",
      description: "Get your medicines delivered within 24-48 hours",
      icon: <Truck className="h-10 w-10 text-primary" />,
    },
    {
      title: "Secure Payments",
      description: "Multiple secure payment options available",
      icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    },
    {
      title: "Expert Support",
      description: "Pharmacists available to answer your queries",
      icon: <HeartPulse className="h-10 w-10 text-primary" />,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Health, Delivered
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Get your medicines delivered to your doorstep with just a few
              clicks. Fast, reliable, and secure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/shop">Shop Medicines</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/prescriptions/upload">Order By Prescription</Link>
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="/placeholder.svg?height=400&width=500"
              alt="MediMart Hero"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find the right medicines for your needs from our extensive
              collection of healthcare products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category, index) => (
              <Link key={index} href={`/shop?category=${category}`}>
                <Card className="h-full transition-all hover:shadow-md">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="text-4xl mb-4">{"🩹"}</div>
                    <h3 className="font-bold text-xl mb-2">{category}</h3>
                    <div className="text-primary font-medium flex items-center mt-auto">
                      Browse Products
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose MediMart?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're committed to providing you with the best healthcare
              experience online
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary text-primary-foreground rounded-xl p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Need a Prescription Medicine?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-6">
                Upload your prescription and get your medicines delivered to
                your doorstep. Our pharmacists will verify your prescription and
                process your order quickly.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/prescriptions/upload">Upload Prescription</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our customers have to
              say about their experience with MediMart.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </section>
    </div>
  );
}
