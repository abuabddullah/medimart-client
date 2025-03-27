import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const NewsLetter: React.FC = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast({
        title: "Not Applicable",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Make the API call to subscribe the email
      const response = await fetch(
        "https://medimert-server.vercel.app/api/newsletter/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Pass the email in the request body
        }
      );

      const data = await response.json();
      if (data.message) {
        toast({
          title: "Not Applicable",
          description:
            data.message || "Something went wrong! Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data.success) {
        toast({
          title: "Subscribed",
          description: "Successfully subscribed!",
        });
        setEmail(""); // Reset email input after successful subscription
      } else {
        toast({
          title: "Not Applicable",
          description: "Something went wrong! Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Not Applicable",
        description: "Something went wrong! Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-cyan-100 via-blue-200 to-blue-600 p-8 shadow-2xl lg:rounded-full text-center relative"
      id="subscribe"
    >
      <h2 className="text-3xl font-bold text-white mb-4">
        Subscribe to Our Newsletter
      </h2>
      <p className="text-white/80 mb-6">
        Stay updated with our latest news and offers!
      </p>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col lg:flex-row gap-4 justify-center"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="px-4 py-2 rounded-lg flex-1 max-w-md focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded-lg bg-white text-blue-600 font-semibold ${
            isSubmitting ? "animate-pulse opacity-70" : ""
          }`}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe Now"}
        </button>
      </form>
    </div>
  );
};

export default NewsLetter;
