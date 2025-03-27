import Link from "next/link";
import { Button } from "../../../components/ui/button";

const HeroBanner = () => {
  return (
    <section className="bg-gradient-to-r from-cyan-100 via-blue-200 to-blue-600 py-10 lg:py-16">
      <div className="max-w-5xl mx-auto px-4 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
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
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <img
            src="/placeholder.svg"
            alt="MediMart Hero"
            className="w-96 rounded-lg shadow-2xl shadow-blue-950"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
