import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Your Health, Our Priority
            </h1>
            <p className="text-muted-foreground md:text-xl">
              MediMart provides a convenient and secure way to order your
              medicines online. With prescription verification and fast
              delivery, we ensure you get the care you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/shop">
                <Button size="lg">Shop Medicines</Button>
              </Link>
              <Link href="/prescriptions/upload">
                <Button variant="outline" size="lg">
                  Upload Prescription
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
            <img
              src="/placeholder.svg?height=500&width=800"
              alt="Pharmacy illustration"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
