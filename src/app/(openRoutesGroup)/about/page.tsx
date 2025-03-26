import { Award, Headphones, ShieldIcon, TruckIcon } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: TruckIcon,
      title: "Free Delivery",
      description:
        "Get free delivery on all orders over $50, ensuring your medicines reach you on time.",
    },
    {
      icon: ShieldIcon,
      title: "Secure Payments",
      description:
        "100% safe and encrypted transactions for worry-free purchases.",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      description:
        "Our dedicated support team is here to assist you anytime, anywhere.",
    },
    {
      icon: Award,
      title: "Quality Assurance",
      description:
        "We guarantee only genuine and high-quality medicines from trusted suppliers.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Medimart
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Medimart is your trusted online pharmacy, dedicated to providing
            fast, secure, and affordable healthcare solutions. We ensure easy
            access to genuine medicines and health essentials at your
            convenience.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1580281658223-9b93f18ae9ae?w=800"
              alt="Online Pharmacy"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Established in 2020, Medimart was founded with the mission of
              making healthcare accessible and hassle-free. We bridge the gap
              between patients and pharmacies by delivering essential medicines
              to your doorstep.
            </p>
            <p className="text-gray-600 mb-4">
              Our team works closely with licensed pharmacists and healthcare
              professionals to ensure that every product we offer meets the
              highest standards of safety and efficacy.
            </p>
            <p className="text-gray-600">
              Whether you need prescription medications, over-the-counter drugs,
              or health supplements, Medimart is here to provide a seamless and
              trustworthy shopping experience.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 my-16">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 border rounded-lg">
              <feature.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
