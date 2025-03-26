import Headline from "@/components/shared/Heading";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function CategorySection() {
  const categories = [
    { name: "Antibiotics", icon: "🧪", href: "/shop?category=Antibiotic" },
    {
      name: "Pain Relievers",
      icon: "💊",
      href: "/shop?category=Pain Reliever",
    },
    { name: "Vitamins", icon: "🍊", href: "/shop?category=Vitamin" },
    { name: "Diabetes", icon: "🩸", href: "/shop?category=Diabetes" },
    { name: "Heart Health", icon: "❤️", href: "/shop?category=Heart" },
    { name: "Skin Care", icon: "🧴", href: "/shop?category=Skin" },
  ];

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <Headline heading="Browse by Category" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category.name} href={category.href}>
              <Card className="h-full transition-all hover:shadow-md">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className="text-4xl mb-2">{category.icon}</div>
                  <h3 className="font-medium">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
