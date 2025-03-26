import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselImages = [
  {
    src: "/assets/images/carousel/medicinecarousel1.jpg",
    id: "1",
    caption: "Quality Healthcare Products",
    subtitle: "Your Trusted Pharmacy Partner",
  },
  {
    src: "/assets/images/carousel/medicinecarousel2.jpg",
    id: "2",
    caption: "Professional Medical Supplies",
    subtitle: "Complete Range of Medicines",
  },
  {
    src: "/assets/images/carousel/medicinecarousel3.jpg",
    id: "3",
    caption: "24/7 Pharmacy Services",
    subtitle: "Delivering Health to Your Doorstep",
  },
];

const HeroCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          dots: false,
        },
      },
    ],
  };

  return (
    <div className="w-full h-[60vh] overflow-hidden">
      <Slider {...settings} className="h-[60vh]">
        {carouselImages.map((image) => (
          <div key={image.id} className="relative w-full h-[60vh]">
            <Image
              src={image.src}
              alt={image.caption}
              fill
              className="object-cover object-top"
              priority
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-white text-center p-3 lg:p-10 rounded-full bg-[#87c9ff62]">
                <h2 className="text-2xl lg:text-4xl m font-bold ">
                  {image.caption}
                </h2>
                <p className="text-lg lg:text-xl ">{image.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;
