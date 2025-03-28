const Headline = ({ heading }: { heading: string }) => {
  return (
    <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8">
      {heading}
    </h2>
  );
};

export default Headline;
