import Headline from "../../../components/shared/Heading";

const OurPartners = () => {
  return (
    <section
      className="py-8 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
      id="partners"
    >
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8 md:mb-12">
          <Headline heading="Our Trusted Partners" />
          <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
            We collaborate with leading healthcare providers, pharmaceutical
            companies, and medical suppliers to ensure quality healthcare
            services and products.
          </p>
        </div>

        <div className="relative h-[200px] sm:h-[250px] md:h-[300px] w-full flex justify-center">
          <img
            src="https://res.cloudinary.com/dglsw3gml/image/upload/v1742615040/bicycle-shop/our_partners_bem30k.png"
            alt="Our Partners"
            className="object-contain w-full max-w-[90%] md:max-w-[80%] lg:max-w-[70%]"
          />
        </div>

        {/* Decorative elements */}
        <div className="hidden md:block absolute -top-4 -left-4 w-16 md:w-24 h-16 md:h-24 bg-blue-50 rounded-full opacity-50 blur-xl" />
        <div className="hidden md:block absolute -bottom-4 -right-4 w-20 md:w-32 h-20 md:h-32 bg-indigo-50 rounded-full opacity-50 blur-xl" />

        <div className="text-center mt-8 md:mt-12">
          <p className="text-gray-500 italic text-sm md:text-base">
            Together, we deliver excellence in Health service
          </p>
        </div>
      </div>
    </section>
  );
};

export default OurPartners;
