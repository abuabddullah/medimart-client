"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FAQ from "@/src/components/homePage/FAQ";
import HeroBanner from "@/src/components/homePage/HeroBanner";
import HeroCarousel from "@/src/components/homePage/HeroCarousel";
import OfferedMedicines from "@/src/components/homePage/OfferedMedicines";
import OurPartners from "@/src/components/homePage/OurPartners";
import { ArrowRight, HeartPulse, Pill, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewsLetter from "../components/homePage/NewsLetter";
import ReviewList from "../components/review/review-card";
import { getCategories } from "../lib/actions/medicines";
import { getApprovedReviews } from "../lib/actions/reviews";
import Headline from "@/components/shared/Heading";

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
          setCategories((prevCtg) => [...categoriesResponse.data]);
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
      <HeroCarousel />

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 4).map((category, index) => (
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

      {/* Hero Section */}
      <HeroBanner />

      <OfferedMedicines />

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Headline heading="Why Choose MediMart?" />
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
          <div className="bg-gradient-to-r from-cyan-100 via-blue-200 to-blue-600 text-primary-foreground rounded-xl p-8 md:p-12">
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
            <Headline heading="What Our Customers Say" />
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

      <NewsLetter />
      <OurPartners />

      <FAQ />
    </div>
  );
}
